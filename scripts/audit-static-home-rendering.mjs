import fs from 'node:fs';
import path from 'node:path';

const html=fs.readFileSync(path.join(process.cwd(),'index.html'),'utf8');
const errors=[];
const hasLegacyWork=html.includes("document.getElementById('work-grid').innerHTML=works.map");
const hasLegacySeries=html.includes("document.getElementById('series-grid').innerHTML=Object.entries");
if(hasLegacyWork)errors.push('旧作品カード再描画が残っています');
if(hasLegacySeries)errors.push('旧シリーズ再描画が残っています');
const staticCards=(html.match(/data-work-id="[^"]+"/g)||[]).length;
if(staticCards!==48)errors.push(`静的作品カードが48件ではありません（${staticCards}件）`);
const report=[
  '# 境界夜話 トップページ静的描画監査','',
  `- 静的作品カード: ${staticCards}件`,
  `- 旧作品カード再描画: ${hasLegacyWork?'残存':'なし'}`,
  `- 旧シリーズ再描画: ${hasLegacySeries?'残存':'なし'}`,
  `- JavaScript実行後も静的HTMLを維持: ${hasLegacyWork||hasLegacySeries?'いいえ':'はい'}`,
  `- エラー: ${errors.length}`,'',
  '## エラー','',...(errors.length?errors.map(error=>`- ${error}`):['- なし']),'',
].join('\n');
fs.mkdirSync(path.join(process.cwd(),'reports'),{recursive:true});
fs.writeFileSync(path.join(process.cwd(),'reports','static-home-rendering-audit.md'),report);
console.log(report);
if(errors.length)process.exitCode=1;
