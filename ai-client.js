// /ai-client.js — GyanSetu AI Client (Streams answers from /api/chat)
async function askAI(messages, mode, onToken, signal, context) {
  const currentCtx = context || (typeof window !== 'undefined' && window.currentSubject) || (typeof S !== 'undefined' && S.q ? (S.q + (S.subTopic ? ' - ' + S.subTopic : '')) : '');
  const r = await fetch('/api/chat', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      mode: (mode === 'deep' || mode === 'genius') ? 'deep' : 'fast',
      context: currentCtx
    }),
  });

  if (!r.ok) {
    const errData = await r.json().catch(() => ({}));
    const errMsg = errData.error || errData.message || 'The AI tutor is busy right now. Please try again.';
    onToken(errMsg);
    return;
  }

  // Handle non-streaming JSON responses (e.g. guard refusals, pre-checks)
  const contentType = r.headers.get('content-type') || '';
  if (!contentType.includes('text/event-stream')) {
    const j = await r.json().catch(() => ({}));
    const content = j.choices?.[0]?.message?.content || j.error || '';
    if (content) onToken(content);
    return;
  }

  const rd = r.body.getReader();
  const dec = new TextDecoder();
  let buf = '';

  try {
    for (;;) {
      const { done, value } = await rd.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const d = trimmed.replace(/^data:\s*/, '');
        if (d === '[DONE]') return;
        try {
          const parsed = JSON.parse(d);
          const token = (parsed && typeof parsed.t === 'string') 
            ? parsed.t 
            : (parsed.choices?.[0]?.delta?.content || '');
          if (token) onToken(token);
        } catch {}
      }
    }
  } catch (err) {
    if (signal && signal.aborted) return;
    throw err;
  } finally {
    try { rd.releaseLock(); } catch {}
  }
}

if (typeof window !== 'undefined') {
  window.askAI = askAI;
}
