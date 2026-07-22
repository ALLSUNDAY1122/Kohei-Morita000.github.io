(()=>{
  const pages={
    'series-makabe':'/kyokai-yawa/series/makabe.html',
    'series-kurose':'/kyokai-yawa/series/kurose.html',
    'series-sakaki':'/kyokai-yawa/series/sakaki.html',
    'series-kansoku':'/kyokai-yawa/series/kansoku.html',
  };
  const apply=()=>{
    for(const [id,href] of Object.entries(pages)){
      const card=document.getElementById(id);
      const head=card?.querySelector('.series-card-head');
      if(!head||head.querySelector('.series-detail-link'))continue;
      const link=document.createElement('a');
      link.className='series-detail-link';
      link.href=href;
      link.textContent='シリーズの案内と全話一覧';
      head.appendChild(link);
    }
    if(document.getElementById('series-detail-link-style'))return;
    const style=document.createElement('style');
    style.id='series-detail-link-style';
    style.textContent='.series-detail-link{display:inline-flex;min-height:44px;align-items:center;margin-top:14px;padding:0 13px;border:1px solid var(--line);background:#21150f;color:#f0dfc0;text-decoration:none}.series-detail-link:hover{border-color:var(--gold)}';
    document.head.appendChild(style);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
