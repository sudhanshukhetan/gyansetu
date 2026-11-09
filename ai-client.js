// /ai-client.js — GyanSetu AI Client (3-Tier Resilient Architecture)

function sanitizeClientOutput(text) {
  if (!text || typeof text !== 'string') return '';
  let s = text;
  s = s.replace(/\b(?:gpt-4o(?:-mini)?|gpt-3\.5-turbo|gpt-4|gemini-(?:2\.5-flash|1\.5-pro|1\.5-flash|pro|flash)|claude-(?:3|3\.5|opus|sonnet)|openai-large|openai-fast|openai|pollinations(?:\.ai)?|chatgpt)\b/gi, 'GyanSetu AI');
  s = s.replace(/\b(?:localStorage|corsproxy|noembed|ytInitialData|vercel|github|api\s*key)\b/gi, 'GyanSetu Platform');
  s = s.replace(/as an ai developed by openai|as a language model trained by google|i am gemini|i am chatgpt|trained by openai/gi, 'I am the GyanSetu Academic Tutor');
  return s;
}

async function processSSEStream(body, onToken, signal) {
  const rd = body.getReader();
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
          if (token) onToken(sanitizeClientOutput(token));
        } catch {}
      }
    }
  } finally {
    try { rd.releaseLock(); } catch {}
  }
}

async function askAI(messages, mode, onToken, signal, context) {
  const currentCtx = context || (typeof window !== 'undefined' && window.currentSubject) || (typeof S !== 'undefined' && S.q ? (S.q + (S.subTopic ? ' - ' + S.subTopic : '')) : '');
  
  // Tier 1: Optional Custom API Key (if provided by user in modal or environment)
  const customKey = (typeof aiConfig !== 'undefined' && aiConfig.apiKey) || (typeof window !== 'undefined' && (window.GEMINI_API_KEY || window.VITE_GEMINI_API_KEY));
  if (customKey) {
    try {
      const isDeep = (mode === 'deep' || mode === 'genius');
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
        method: 'POST',
        signal,
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customKey}`
        },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          stream: true,
          temperature: isDeep ? 0.35 : 0.45,
          max_tokens: 4096,
          messages
        })
      });
      if (r.ok && r.body) {
        await processSSEStream(r.body, onToken, signal);
        return;
      }
    } catch (e) {
      if (signal && signal.aborted) return;
    }
  }

  // Tier 2: Serverless Edge Proxy (/api/chat) with server-side zero-key fallback
  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      signal,
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        mode: (mode === 'deep' || mode === 'genius') ? 'deep' : 'fast',
        context: currentCtx
      }),
    });

    if (r.ok) {
      const contentType = r.headers.get('content-type') || '';
      if (!contentType.includes('text/event-stream')) {
        const j = await r.json().catch(() => ({}));
        const content = j.choices?.[0]?.message?.content || j.error || '';
        if (content) onToken(sanitizeClientOutput(content));
        return;
      }
      await processSSEStream(r.body, onToken, signal);
      return;
    }
  } catch (err) {
    if (signal && signal.aborted) return;
  }

  // Tier 2 Backup: Direct open SSE streaming endpoint (zero keys needed)
  try {
    const isDeep = (mode === 'deep' || mode === 'genius');
    const directRes = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      signal,
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: isDeep ? 'openai-large' : 'openai',
        stream: true,
        seed: Math.floor(Math.random() * 10000000)
      })
    });
    if (directRes.ok && directRes.body) {
      await processSSEStream(directRes.body, onToken, signal);
      return;
    }
  } catch (e) {
    if (signal && signal.aborted) return;
  }

  // Tier 3: Real-Time Local STEM Academic Tutor Solver
  if (typeof generateLocalAcademicTutorResponse === 'function') {
    const lastUserMsg = [...messages].reverse().find(m => m && m.role === 'user')?.content || '';
    const ragContext = typeof fetchAcademicRAGContext === 'function' ? await fetchAcademicRAGContext(currentCtx || 'Science', 1000).catch(() => '') : '';
    const localAnswer = generateLocalAcademicTutorResponse(lastUserMsg, currentCtx || 'Science', currentCtx || 'Science', '', ragContext);
    onToken(localAnswer);
    return;
  }

  onToken("The GyanSetu Academic Engine is momentarily busy. Please try asking your question again.");
}

if (typeof window !== 'undefined') {
  window.askAI = askAI;
}
