import fs from 'node:fs';
import path from 'node:path';

const url=`https://allsunday1122.github.io/kyokai-yawa/?static-audit=${Date.now()}`;
const started=Date.now();
const response=await fetch(url,{cache:'no-store',headers:{'user-agent':'kyokai-yawa-static-render-audit'}});
const html=await response.text();
const elapsed=Date.now()-started;
const errors=[];
const hasLegacyWork=html.includes("document.getElementById('work-grid').innerHTML=works.map");
const hasLegacySeries=html.includes("document.getElementById('series-grid').innerHTML=Object.entries");
const cards=(html.match(/data-work-id="[^"]+"/g)||[]).length;
if(!response.ok)errors.push(`トップページ: HTTP ${response.status}`);
if(cards!==48)errors.push(`本番静的作品カードが48件ではありません（${cards}件）`);
if(hasLegacyWork)errors.push('本番HTMLに旧作品カード再描画が残っています');
if(hasLegacySeries)errors.push('本番HTMLに旧シリーズ再描画が残っています');
const report=[
  '# 境界夜話 本番トップページ静的描画監査','',
  `- 実行日時: ${new Date().toISOString()}`,
  `- HTTP: ${response.status}`,
  `- 静的作品カード: ${cards}件`,
  `- 旧作品カード再描画: ${hasLegacyWork?'残存':'なし'}`,
  `- 旧シリーズ再描画: ${hasLegacySeries?'残存':'なし'}`,
  `- JavaScript実行後も比較カードを維持: ${hasLegacyWork||hasLegacySeries?'いいえ':'はい'}`,
  `- 応答時間: ${elapsed}ms`,
  `- エラー: ${errors.length}`,'',
  '## エラー','',...(errors.length?errors.map(error=>`- ${error}`):['- なし']),'',
].join('\n');
fs.mkdirSync(path.join(process.cwd(),'reports'),{recursive:true});
fs.writeFileSync(path.join(process.cwd(),'reports','live-static-home-rendering-audit.md'),report);
console.log(report);
if(errors.length)process.exitCode=1;
