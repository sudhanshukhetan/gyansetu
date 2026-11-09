// /api/yt.js — Vercel Edge Function for Real YouTube Lecture Data
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') || '').slice(0, 150).trim();
  if (!q) return Response.json({ items: [] });

  const key = process.env.YOUTUBE_API_KEY;

  // 1. Primary: Use official YouTube Data API v3 if API key is configured
  if (key) {
    try {
      const sRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&videoEmbeddable=true&videoDuration=long&safeSearch=strict&q=${encodeURIComponent(q)}&key=${key}`
      );
      if (sRes.ok) {
        const s = await sRes.json();
        const ids = (s.items || []).map(i => i.id?.videoId).filter(Boolean).join(',');
        if (ids) {
          const vRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${key}`
          );
          if (vRes.ok) {
            const v = await vRes.json();
            const dur = Object.fromEntries((v.items || []).map(x => [x.id, x.contentDetails.duration]));

            const fmt = d => {
              const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(d || '');
              const h = +m?.[1] || 0, mi = +m?.[2] || 0, se = +m?.[3] || 0;
              return (h ? h + ':' + String(mi).padStart(2, '0') : mi) + ':' + String(se).padStart(2, '0');
            };

            const items = (s.items || []).map(i => ({
              id: i.id.videoId,
              title: i.snippet.title,
              channel: i.snippet.channelTitle,
              duration: fmt(dur[i.id.videoId])
            }));

            if (items.length > 0) {
              return Response.json({ items }, {
                headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' }
              });
            }
          }
        }
      }
    } catch (e) {}
  }

  // 2. Zero-Config Fallback: Live YouTube Search Extraction via ytInitialData
  try {
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' full lecture')}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (res.ok) {
      const html = await res.text();
      const m = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/);
      if (m && m[1]) {
        const parsed = JSON.parse(m[1]);
        const sections = parsed.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
        const items = [];
        for (const sec of sections) {
          const contents = sec.itemSectionRenderer?.contents || [];
          for (const item of contents) {
            const vr = item.videoRenderer;
            if (vr && vr.videoId && vr.title?.runs?.[0]?.text) {
              const videoId = vr.videoId;
              if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                items.push({
                  id: videoId,
                  title: vr.title.runs.map(r => r.text).join(''),
                  channel: vr.ownerText?.runs?.[0]?.text || vr.shortBylineText?.runs?.[0]?.text || 'Academic Channel',
                  duration: vr.lengthText?.simpleText || 'Lecture'
                });
              }
            }
            if (items.length >= 12) break;
          }
          if (items.length >= 12) break;
        }

        if (items.length > 0) {
          return Response.json({ items }, {
            headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' }
          });
        }
      }
    }
  } catch (e) {}

  return Response.json({ items: [] }, {
    headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' }
  });
}
