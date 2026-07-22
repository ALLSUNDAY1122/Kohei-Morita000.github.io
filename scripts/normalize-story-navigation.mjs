import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const worksPath=path.join(root,'data','works.js');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(worksPath,'utf8'),context,{filename:worksPath});
const works=context.window.KYOKAI_WORKS||[];
const worksTag='<script src="/kyokai-yawa/data/works.js"></script>';
const navTag='<script src="/kyokai-yawa/data/story-nav.js"></script>';
const changed=[];

for(const work of works){
  const filePath=path.join(root,'stories',work.file);
  let html=fs.readFileSync(filePath,'utf8');
  const before=html;

  html=html.replace(/\s*<script src="\/kyokai-yawa\/data\/story-nav\.js"><\/script>/g,'');

  if(!html.includes(worksTag)){
    html=html.replace(/<\/body>/i,`${worksTag}${navTag}</body>`);
  }else{
    html=html.replace(/<\/body>/i,`${navTag}</body>`);
  }

  if(html!==before){
    fs.writeFileSync(filePath,html);
    changed.push(work.id);
  }
}

console.log(`# 作品ページ導線ローダー正規化\n\n- 対象: ${works.length}話\n- 更新: ${changed.length}話\n${changed.length?changed.map(id=>`- ${id}`).join('\n'):'- 変更なし'}`);
