import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const worksPath=path.join(root,'data','works.js');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(worksPath,'utf8'),context,{filename:worksPath});
const works=context.window.KYOKAI_WORKS||[];
if(works.length!==48)throw new Error(`公開作品が48話ではありません（${works.length}話）`);

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const minutes=work=>Number(String(work.mins||'').match(/\d+/)?.[0]||0);
const seriesOrder=['真壁夜話','黒瀬蒐集録','榊家異聞','境界観測記'];
const baseTags={
  '真壁夜話':['現代怪談','記録改変'],
  '黒瀬蒐集録':['民俗怪談','土地の記録'],
  '榊家異聞':['家族怪談','記憶'],
  '境界観測記':['調査怪談','境界現象'],
};
const motifRules=[
  ['職場',/勤怠|退勤|社員|会社|会議|経理|業務|アカウント|清掃|レジ|予約|監視|顔認証|宅配/g],
  ['システム',/端末|アカウント|画面|顔認証|レジ|予約|監視|音声案内|電子|システム|機器/g],
  ['施設',/階|部屋|ホテル|センター|観測棟|避難所|待合所|マンション|学校|橋脚|祠|鳥居/g],
  ['土地の記録',/地図|台帳|沿革|番地|集落|講中帳|祭礼|図面|名簿/g],
  ['民俗',/祭|地蔵|祠|鳥居|沢|峠|葬列|水神|境木|講中/g],
  ['水辺',/潮|沢|水神|雨|橋|増水|踏切/g],
  ['交通',/終電|踏切|道路|峠|橋|案内|駅|経路/g],
  ['家族',/家族|祖母|母|父|祖父|叔母|兄弟|きょうだい|実家/g],
  ['遺品',/遺品|仏間|衣装|鍵束|靴|写真|弁当箱|椅子|布団/g],
  ['写真・映像',/写真|映像|監視/g],
  ['音・声',/音声|声|返事|子守歌|警報音|軋む/g],
  ['記憶',/記憶|覚え|忘れ|認識/g],
  ['人数のずれ',/人数|一人|二人|三人|四人|五人|六人|七人|八人|空席|欠席者|外れた/g],
  ['境界',/境界|境目|内側|外側|こちら側|向こう側|区域|標識/g],
  ['時間の異常',/25:14|十三分|時刻|時間|遅れ|未来日付|翌年度/g],
  ['記録改変',/記録|台帳|図面|沿革|名簿|予約|署名|履歴|写真|CSV/g],
  ['調査・検証',/調査|確認|照合|検証|特定|観測|封鎖|復元/g],
];

const deriveTags=work=>{
  const text=`${work.title} ${work.desc}`;
  const scores=motifRules.map(([label,pattern],index)=>{
    const matches=text.match(pattern)||[];
    return {label,score:matches.length,index};
  }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.index-b.index);
  const tags=[...(baseTags[work.series]||['怪談'])];
  for(const item of scores){
    if(!tags.includes(item.label))tags.push(item.label);
    if(tags.length===4)break;
  }
  const fallback=['一話完結','日常の異変','静かな恐怖'];
  for(const tag of fallback){
    if(tags.length===4)break;
    if(!tags.includes(tag))tags.push(tag);
  }
  return tags.slice(0,4);
};

const aftertasteFor=(work,tags)=>{
  if(Number(work.fear)===5)return '対処が終わっても、記録から外れる感覚と強い不安が残る。';
  if(tags.includes('人数のずれ'))return '身近な人の人数や、自分が数に含まれているかを確かめたくなる。';
  if(tags.includes('記憶')||tags.includes('家族'))return '家族と共有している記憶の輪郭が、静かに信用できなくなる。';
  if(tags.includes('システム')||tags.includes('記録改変'))return '日常を支える記録や画面表示を、そのまま信用しにくくなる。';
  if(tags.includes('民俗')||tags.includes('土地の記録'))return '土地に残る古い規則が、現在にも続いている感覚が後を引く。';
  if(tags.includes('境界')||tags.includes('境界現象'))return '解決後も、安全側と危険側の境目が揺らいで感じられる。';
  return '怪異の規則は閉じても、日常の小さな違和感が残り続ける。';
};

const taxonomy=Object.fromEntries(works.map(work=>{
  const tags=deriveTags(work);
  return [work.id,{tags,aftertaste:aftertasteFor(work,tags),related:[]}];
}));
const positions=new Map(works.map((work,index)=>[work.id,index]));
const seriesPosition=new Map();
for(const series of seriesOrder){
  works.filter(work=>work.series===series).forEach((work,index)=>seriesPosition.set(work.id,index));
}
const adjacent=(a,b)=>a.series===b.series&&Math.abs((seriesPosition.get(a.id)??0)-(seriesPosition.get(b.id)??0))===1;
const overlap=(a,b)=>taxonomy[a.id].tags.filter(tag=>taxonomy[b.id].tags.includes(tag)).length;
const pairScore=(a,b)=>{
  let score=overlap(a,b)*8;
  if(a.series===b.series)score+=4;
  else score+=2;
  if(Number(a.fear)===Number(b.fear))score+=2;
  if(Math.abs(minutes(a)-minutes(b))<=2)score+=2;
  if(adjacent(a,b))score-=7;
  return score;
};
const stableTie=(source,target)=>{
  const text=`${source.id}:${target.id}`;
  let hash=0;
  for(const char of text)hash=(hash*31+char.charCodeAt(0))>>>0;
  return hash;
};

for(const work of works){
  const ranked=works.filter(candidate=>candidate.id!==work.id).sort((a,b)=>pairScore(work,b)-pairScore(work,a)||stableTie(work,a)-stableTie(work,b));
  const selected=[];
  const same=ranked.find(candidate=>candidate.series===work.series&&!adjacent(work,candidate));
  if(same)selected.push(same);
  const usedSeries=new Set(selected.map(item=>item.series));
  for(const candidate of ranked){
    if(selected.some(item=>item.id===candidate.id)||candidate.series===work.series||usedSeries.has(candidate.series))continue;
    selected.push(candidate);
    usedSeries.add(candidate.series);
    if(selected.length===3)break;
  }
  for(const candidate of ranked){
    if(selected.length===3)break;
    if(!selected.some(item=>item.id===candidate.id))selected.push(candidate);
  }
  taxonomy[work.id].related=selected.slice(0,3).map(item=>item.id);
}

const inboundCounts=()=>{
  const counts=Object.fromEntries(works.map(work=>[work.id,0]));
  for(const entry of Object.values(taxonomy))for(const id of entry.related)counts[id]=(counts[id]||0)+1;
  return counts;
};
for(const target of works){
  let inbound=inboundCounts();
  if(inbound[target.id]>0)continue;
  let best=null;
  for(const source of works){
    if(source.id===target.id||taxonomy[source.id].related.includes(target.id))continue;
    for(let index=taxonomy[source.id].related.length-1;index>=0;index--){
      const currentId=taxonomy[source.id].related[index];
      if((inbound[currentId]||0)<=1)continue;
      const current=works[positions.get(currentId)];
      const gain=pairScore(source,target)-pairScore(source,current);
      if(!best||gain>best.gain)best={source,index,gain};
    }
  }
  if(best)taxonomy[best.source.id].related[best.index]=target.id;
}

const taxonomyPath=path.join(root,'data','story-taxonomy.json');
fs.writeFileSync(taxonomyPath,`${JSON.stringify(taxonomy,null,2)}\n`);

const styleBlock='<!-- RELATED_STYLES_START -->\n<link rel="stylesheet" href="/kyokai-yawa/data/related-stories.css">\n<!-- RELATED_STYLES_END -->';
let changed=0;
for(const work of works){
  const filePath=path.join(root,'stories',work.file);
  let html=fs.readFileSync(filePath,'utf8');
  const before=html;
  const info=taxonomy[work.id];
  const relatedWorks=info.related.map(id=>works[positions.get(id)]).filter(Boolean);
  if(relatedWorks.length!==3)throw new Error(`${work.id}: 関連作品が3話ではありません`);
  const cards=relatedWorks.map(item=>`<a class="related-story-card" data-related-id="${esc(item.id)}" href="/kyokai-yawa/stories/${esc(item.file)}"><span class="related-story-kicker">${esc(item.id)} · ${esc(item.series)}</span><strong>${esc(item.title)}</strong><p>${esc(item.desc)}</p><span class="related-story-meta">${esc(item.mins)} · 恐怖${esc(item.fear)}</span></a>`).join('');
  const section=`<!-- RELATED_STORIES_START -->\n<section class="story-discovery" aria-labelledby="related-stories-title">\n  <div class="story-taxonomy">\n    <p class="story-taxonomy-label">STORY ELEMENTS</p>\n    <div class="story-tags" aria-label="この作品の題材">${info.tags.map(tag=>`<span class="story-tag">${esc(tag)}</span>`).join('')}</div>\n    <p class="story-aftertaste"><strong>読後感</strong>${esc(info.aftertaste)}</p>\n  </div>\n  <h2 id="related-stories-title">次に読むなら</h2>\n  <p class="story-discovery-lead">題材、恐怖度、読了時間が近い作品から選んでいます。前後話とは別の三話です。</p>\n  <div class="related-story-grid">${cards}</div>\n</section>\n<!-- RELATED_STORIES_END -->`;

  html=html.replace(/\s*<!-- RELATED_STYLES_START -->[\s\S]*?<!-- RELATED_STYLES_END -->/g,'');
  html=html.replace(/\s*<link\s+rel=["']stylesheet["']\s+href=["']\/kyokai-yawa\/data\/related-stories\.css["'][^>]*>/gi,'');
  html=html.replace(/<\/head>/i,`${styleBlock}\n</head>`);
  html=html.replace(/\s*<!-- RELATED_STORIES_START -->[\s\S]*?<!-- RELATED_STORIES_END -->/g,'');
  const notice=html.match(/<p\s+class=["'][^"']*\bnotice\b[^"']*["'][^>]*>[\s\S]*?<\/p>/i)?.[0];
  if(!notice)throw new Error(`${work.id}: notice要素が見つかりません`);
  html=html.replace(notice,`${notice}\n${section}`);

  const ldPattern=/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i;
  const ldMatch=html.match(ldPattern);
  if(!ldMatch)throw new Error(`${work.id}: JSON-LDが見つかりません`);
  const graph=JSON.parse(ldMatch[1]);
  graph.keywords=info.tags.join(', ');
  graph.about=info.tags.map(name=>({'@type':'Thing',name}));
  html=html.replace(ldPattern,`<script type="application/ld+json">${JSON.stringify(graph)}</script>`);

  fs.writeFileSync(filePath,html);
  if(html!==before)changed++;
}

const inbound=inboundCounts();
const inboundValues=Object.values(inbound);
const sameSeries=works.reduce((total,work)=>total+taxonomy[work.id].related.filter(id=>works[positions.get(id)]?.series===work.series).length,0);
console.log(`# 題材タグ・関連作品の正規化\n\n- 公開作品: ${works.length}話\n- 題材タグ: ${works.length*4}件\n- 関連作品リンク: ${works.length*3}件\n- 同シリーズ関連: ${sameSeries}件\n- 別シリーズ関連: ${works.length*3-sameSeries}件\n- 被リンク最小: ${Math.min(...inboundValues)}件\n- 被リンク最大: ${Math.max(...inboundValues)}件\n- 更新ページ: ${changed}ページ\n`);
