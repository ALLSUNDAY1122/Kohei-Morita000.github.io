import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const context={window:{}};
const worksPath=path.join(root,'data','works.js');
vm.runInNewContext(fs.readFileSync(worksPath,'utf8'),context,{filename:worksPath});
const works=context.window.KYOKAI_WORKS||[];
const taxonomyPath=path.join(root,'data','story-taxonomy.json');
const taxonomy=fs.existsSync(taxonomyPath)?JSON.parse(fs.readFileSync(taxonomyPath,'utf8')):{};
const indexHtml=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'data','work-cards.css'),'utf8');
const archiveJs=fs.readFileSync(path.join(root,'data','archive-tools.js'),'utf8');
const errors=[];
const warnings=[];

if(works.length!==48)errors.push(`公開作品が48話ではありません（${works.length}話）`);
if(Object.keys(taxonomy).length!==works.length)errors.push(`分類データが${works.length}件ではありません（${Object.keys(taxonomy).length}件）`);
const cssRefs=(indexHtml.match(/\/kyokai-yawa\/data\/work-cards\.css/g)||[]).length;
if(cssRefs!==1)errors.push(`作品カードCSS参照が1件ではありません（${cssRefs}件）`);
if(!indexHtml.includes('<!-- WORK_CARD_STYLES_START -->')||!indexHtml.includes('<!-- WORK_CARD_STYLES_END -->'))errors.push('作品カードCSSマーカーがありません');
const block=indexHtml.match(/<!-- STATIC_WORKS_START -->([\s\S]*?)<!-- STATIC_WORKS_END -->/)?.[1]||'';
if(!block)errors.push('静的作品カードブロックがありません');
const cards=[...block.matchAll(/<a class="work-card"[\s\S]*?<\/a>/g)].map(match=>match[0]);
if(cards.length!==works.length)errors.push(`作品カードが${works.length}件ではありません（${cards.length}件）`);

let topicCount=0;
let standaloneCount=0;
let serialCount=0;
for(let index=0;index<works.length;index++){
  const work=works[index];
  const info=taxonomy[work.id];
  const card=cards[index]||'';
  if(!info){errors.push(`${work.id}: 分類データがありません`);continue;}
  if(!card.includes(`data-work-id="${work.id}"`))errors.push(`${work.id}: カード順またはdata-work-idが作品データと一致しません`);
  if(!card.includes(`href="/kyokai-yawa/stories/${work.file}"`))errors.push(`${work.id}: 作品リンクが一致しません`);
  if(!card.includes(`<h3>${work.title}</h3>`))errors.push(`${work.id}: 作品名が一致しません`);
  if(!card.includes(work.desc))errors.push(`${work.id}: あらすじが一致しません`);
  if(!card.includes(`<strong>${work.mins}</strong>`))errors.push(`${work.id}: 読了目安が一致しません`);
  if(!card.includes(`<span class="work-length">${work.length}</span>`))errors.push(`${work.id}: 分量表示が一致しません`);
  const isSerial=work.series==='境界観測記';
  const expectedFormat=isSerial?'serial':'standalone';
  const expectedLabel=isSerial?'連作・順番推奨':'一話完結';
  if(!card.includes(`data-format="${expectedFormat}"`)||!card.includes(`<span class="work-format">${expectedLabel}</span>`))errors.push(`${work.id}: 形式表示が一致しません`);
  if(isSerial)serialCount++;else standaloneCount++;
  const tags=Array.isArray(info.tags)?info.tags.slice(0,4):[];
  const visibleTags=[...card.matchAll(/class="work-topic-tag">([^<]+)<\/span>/g)].map(match=>match[1]);
  topicCount+=visibleTags.length;
  if(JSON.stringify(visibleTags)!==JSON.stringify(tags))errors.push(`${work.id}: 題材タグの表示順が分類データと一致しません`);
  if(!card.includes(`data-tags="${tags.join(' ')}"`))errors.push(`${work.id}: 検索用題材タグが一致しません`);
  const totalDots=(card.match(/<i(?: class="is-filled")?><\/i>/g)||[]).length;
  const filledDots=(card.match(/<i class="is-filled"><\/i>/g)||[]).length;
  if(totalDots!==5)errors.push(`${work.id}: 恐怖度の点が5個ではありません（${totalDots}個）`);
  if(filledDots!==Number(work.fear))errors.push(`${work.id}: 恐怖度の点が作品データと一致しません（${filledDots}/${work.fear}）`);
  if(!card.includes(`<strong>${Number(work.fear)} / 5</strong>`))errors.push(`${work.id}: 恐怖度数値が一致しません`);
}

if(topicCount!==works.length*4)errors.push(`題材タグ表示が${works.length*4}件ではありません（${topicCount}件）`);
if(standaloneCount!==36)errors.push(`一話完結カードが36件ではありません（${standaloneCount}件）`);
if(serialCount!==12)errors.push(`連作カードが12件ではありません（${serialCount}件）`);
if(!archiveJs.includes('作品名・題材・あらすじ・IDで検索'))errors.push('検索欄が題材検索を案内していません');
if(!archiveJs.includes("card.dataset.search||''")||!archiveJs.includes("card.dataset.tags||''"))errors.push('題材タグと形式が検索対象に含まれていません');
if(!archiveJs.includes('workById.get(card.dataset.workId)'))errors.push('カードと作品データをIDで対応付けていません');
if(!css.includes('@media(max-width:430px)'))warnings.push('狭いスマートフォン向けカード調整がありません');
if(!css.includes('@media(prefers-reduced-motion:reduce)'))warnings.push('動きを減らす設定への対応がありません');

const report=[
  '# 境界夜話 トップ作品カード比較表示監査','',
  `- 公開作品: ${works.length}話`,
  `- 作品カード: ${cards.length}件`,
  `- 題材タグ表示: ${topicCount}件`,
  `- 一話完結表示: ${standaloneCount}件`,
  `- 連作・順番推奨表示: ${serialCount}件`,
  '- 表示項目: ID・シリーズ・形式・作品名・あらすじ・題材4件・読了目安・恐怖度・分量',
  '- 題材タグ検索: 対応',
  '- JavaScriptなしの作品リンク: はい',
  `- エラー: ${errors.length}`,
  `- 警告: ${warnings.length}`,'',
  '## エラー','',...(errors.length?errors.map(error=>`- ${error}`):['- なし']),'',
  '## 警告','',...(warnings.length?warnings.map(warning=>`- ${warning}`):['- なし']),'',
].join('\n');
fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports','work-cards-audit.md'),report);
console.log(report);
if(errors.length)process.exitCode=1;
