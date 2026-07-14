(async()=>{
  const encoded=(window.__nomikaiPayload||[]).join('');
  if(!encoded) throw new Error('Payload is empty');
  const raw=atob(encoded);
  const bytes=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  const html=await new Response(stream).text();
  document.open();
  document.write(html);
  document.close();
})().catch(err=>{
  document.body.innerHTML='<main style="max-width:720px;margin:48px auto;padding:24px;font-family:sans-serif"><h1>読み込みに失敗しました</h1><p>SafariまたはChromeの最新版で開いてください。</p><pre style="white-space:pre-wrap">'+String(err)+'</pre></main>';
});
