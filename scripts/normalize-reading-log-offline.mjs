import fs from 'node:fs';
import path from 'node:path';

const file=path.join(process.cwd(),'service-worker.js');
const original=fs.readFileSync(file,'utf8');
let source=original.replace(/const VERSION = 'kyokai-yawa-v\d+';/,"const VERSION = 'kyokai-yawa-v10';");
const assets=['reading-log.html','data/reading-log.css','data/reading-log.js','data/reading-backup.js'];
for(const asset of assets){
  if(source.includes(asset))continue;
  const anchor='  `${SCOPE}data/saved-stories.css`,\n';
  if(!source.includes(anchor))throw new Error('Service Workerの保存管理資産位置が見つかりません');
  source=source.replace(anchor,`${anchor}  \`${'${SCOPE}'}${asset}\`,\n`);
}
fs.writeFileSync(file,source);
console.log(`# 読書記録オフライン資産\n\n- キャッシュ世代: kyokai-yawa-v10\n- 追加資産: reading-log.html / reading-log.css / reading-log.js / reading-backup.js\n- 更新: ${source===original?'なし':'あり'}\n`);