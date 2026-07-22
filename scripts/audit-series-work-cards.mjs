import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=process.cwd();
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data','works.js'),'utf8'),context);
const works=context.window.KYOKAI_WORKS||[];
const taxonomy=JSON.parse(fs.readFileSync(path.join(root,'data','story-taxonomy.json'),'utf8'));
const configs={'真壁夜話':'makabe.html','黒瀬蒐集録':'kurose.html','榊家異聞':'sakaki.html','境界観測記':'kansoku.html'};
const errors=[];const warnings=[];const rows=[];
let cardTotal=0,tagTotal=0,standalone=0,serial=0;
for(const [name,file] of Object.entries(configs)){
  const html=fs.readFileSync(path.join(root,'series',file),'utf8');
  const group=works.filter(work=>work.series===name);
  const cards=[...html.matchAll(/<a class="story-card"[\s\S]*?<\/a>/g)].map(match=>match[0]);
  if(cards.length!==12)errors.push(`${name}: 比較カードが12件ではありません（${cards.length}件）`);
  if(!html.includes('/kyokai-yawa/data/series-work-cards.css'))errors.push(`${name}: 比較カードCSS参照がありません`);
  if(!html.includes('/kyokai-yawa/data/series-archive-tools.js'))errors.push(`${name}: シリーズ内検索JavaScript参照がありません`);
  if(!html.includes('data-series-tools hidden'))errors.push(`${name}: JavaScript有効時だけ表示する検索欄がありません`);
  if(!html.includes('data-role="query"')||!html.includes('data-role="filter"')||!html.includes('data-role="sort"')||!html.includes('data-role="reset"'))errors.push(`${name}: 検索・絞り込み・並べ替え・リセットのいずれかがありません`);
  for(let index=0;index<group.length;index++){
    const work=group[index];const card=cards[index]||'';const info=taxonomy[work.id];
    if(!info){errors.push(`${work.id}: 分類データがありません`);continue;}
    const tags=info.tags.slice(0,4);const isSerial=name==='境界観測記';const format=isSerial?'serial':'standalone';const label=isSerial?'連作・順番推奨':'一話完結';
    if(!card.includes(`data-story-id="${work.id}"`))errors.push(`${work.id}: カード順またはIDが一致しません`);
    if(!card.includes(`data-index="${index}"`))errors.push(`${work.id}: 公開順番号が一致しません`);
    if(!card.includes(`data-format="${format}"`)||!card.includes(`class="story-format">${label}`))errors.push(`${work.id}: 形式表示が一致しません`);
    if(!card.includes(`href="/kyokai-yawa/stories/${work.file}"`))errors.push(`${work.id}: 作品リンクが一致しません`);
    if(!card.includes(`<strong>${work.mins}</strong>`))errors.push(`${work.id}: 読了目安が一致しません`);
    if(!card.includes(`<strong>${work.fear} / 5</strong>`))errors.push(`${work.id}: 恐怖度が一致しません`);
    if(!card.includes(`<strong>${work.length}</strong>`))errors.push(`${work.id}: 分量が一致しません`);
    const visible=[...card.matchAll(/class="story-topic-tag">([^<]+)<\/span>/g)].map(match=>match[1]);
    if(JSON.stringify(visible)!==JSON.stringify(tags))errors.push(`${work.id}: 題材タグが一致しません`);
    const dots=(card.match(/<i(?: class="is-filled")?><\/i>/g)||[]).length;const filled=(card.match(/<i class="is-filled"><\/i>/g)||[]).length;
    if(dots!==5||filled!==Number(work.fear))errors.push(`${work.id}: 恐怖度ドットが一致しません`);
    tagTotal+=visible.length;if(isSerial)serial++;else standalone++;
  }
  cardTotal+=cards.length;rows.push({name,cards:cards.length});
}
const js=fs.readFileSync(path.join(root,'data','series-archive-tools.js'),'utf8');
const css=fs.readFileSync(path.join(root,'data','series-work-cards.css'),'utf8');
for(const token of ["filter.value==='quick'","filter.value==='fear5'","filter.value==='long'","sort.value==='short'","sort.value==='fear'","history.replaceState"])if(!js.includes(token))errors.push(`検索JavaScriptに必要処理がありません: ${token}`);
if(!css.includes('@media(max-width:520px)'))warnings.push('狭いスマートフォン向け調整がありません');
if(cardTotal!==48)errors.push(`比較カード合計が48件ではありません（${cardTotal}件）`);
if(tagTotal!==192)errors.push(`題材タグ合計が192件ではありません（${tagTotal}件）`);
if(standalone!==36||serial!==12)errors.push(`形式内訳が36/12ではありません（${standalone}/${serial}）`);
const report=['# 境界夜話 シリーズページ比較カード・検索監査','',`- シリーズページ: ${rows.length}/4`,`- 比較カード: ${cardTotal}/48`,`- 題材タグ: ${tagTotal}/192`,`- 一話完結: ${standalone}/36`,`- 連作・順番推奨: ${serial}/12`,'- シリーズ内検索: 作品名・題材・あらすじ・ID','- 絞り込み: 6分以内・恐怖度5・10分以上','- 並べ替え: 公開順・短い順・長い順・恐怖度順','- JavaScriptなしの作品リンク: はい',`- エラー: ${errors.length}`,`- 警告: ${warnings.length}`,'','## エラー','',...(errors.length?errors.map(x=>`- ${x}`):['- なし']),'','## 警告','',...(warnings.length?warnings.map(x=>`- ${x}`):['- なし']),'','## ページ別','',...rows.map(row=>`- ${row.name}: ${row.cards}カード`),''].join('\n');
fs.mkdirSync(path.join(root,'reports'),{recursive:true});fs.writeFileSync(path.join(root,'reports','series-work-cards-audit.md'),report);console.log(report);if(errors.length)process.exitCode=1;