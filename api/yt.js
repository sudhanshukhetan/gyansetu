// /api/yt.js — Vercel Edge Function for Real YouTube Lecture Data
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') || '').slice(0, 150);
  if (!q) return Response.json({ items: [] });

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return Response.json({ items: [] });

  try {
    const sRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&videoEmbeddable=true&videoDuration=long&safeSearch=strict&q=${encodeURIComponent(q)}&key=${key}`
    );
    if (!sRes.ok) return Response.json({ items: [] });
    const s = await sRes.json();
    const ids = (s.items || []).map(i => i.id?.videoId).filter(Boolean).join(',');
    if (!ids) return Response.json({ items: [] });

    const vRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${key}`
    );
    if (!vRes.ok) return Response.json({ items: [] });
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

    return Response.json({ items }, {
      headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' }
    });
  } catch (e) {
    return Response.json({ items: [] });
  }
}

