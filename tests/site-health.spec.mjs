import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const worksContext={window:{}};
const worksPath=path.join(root,'data','works.js');
vm.runInNewContext(fs.readFileSync(worksPath,'utf8'),worksContext,{filename:worksPath});
const works=Array.isArray(worksContext.window.KYOKAI_WORKS)?worksContext.window.KYOKAI_WORKS:[];
if(works.length!==48)throw new Error(`公開作品が48話ではありません（${works.length}話）`);

const fixedTargets=[
  ['トップ',''],
  ['真壁夜話','series/makabe.html'],
  ['黒瀬蒐集録','series/kurose.html'],
  ['榊家異聞','series/sakaki.html'],
  ['境界観測記','series/kansoku.html'],
  ['読書記録','reading-log.html'],
];
const storyTargets=works.map(work=>[`${work.id} ${work.title}`,`stories/${work.file}`]);
const targets=[...fixedTargets,...storyTargets];
if(targets.length!==54)throw new Error(`公開監査対象が54ページではありません（${targets.length}ページ）`);
if(new Set(targets.map(([,url])=>url)).size!==54)throw new Error('公開監査対象URLに重複があります');

const unique=values=>[...new Set(values.filter(Boolean))];
const compactViolation=violation=>({
  id:violation.id,
  impact:violation.impact,
  help:violation.help,
  nodes:violation.nodes.slice(0,8).map(node=>({target:node.target,summary:node.failureSummary})),
});

for(const [label,url] of targets){
  test(`${label}のアクセシビリティと実行時品質`,async({page},testInfo)=>{
    testInfo.annotations.push({type:'page',description:url||'/'});
    const consoleErrors=[];
    const pageErrors=[];
    const requestFailures=[];
    const badResponses=[];

    page.on('console',message=>{
      if(message.type()==='error')consoleErrors.push(message.text());
    });
    page.on('pageerror',error=>pageErrors.push(error.message));
    page.on('requestfailed',request=>{
      const failure=request.failure()?.errorText||'request failed';
      if(!/ERR_ABORTED|NS_BINDING_ABORTED/i.test(failure))requestFailures.push(`${request.method()} ${request.url()} — ${failure}`);
    });
    page.on('response',response=>{
      if(response.status()>=400)badResponses.push(`${response.status()} ${response.url()}`);
    });

    const response=await page.goto(url,{waitUntil:'domcontentloaded'});
    expect(response?.status()||0).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await page.waitForTimeout(500);

    const axe=await new AxeBuilder({page})
      .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa'])
      .analyze();
    const violations=axe.violations.map(compactViolation);
    const problems={
      accessibility:violations,
      consoleErrors:unique(consoleErrors),
      pageErrors:unique(pageErrors),
      requestFailures:unique(requestFailures),
      badResponses:unique(badResponses),
    };
    const count=violations.length+problems.consoleErrors.length+problems.pageErrors.length+problems.requestFailures.length+problems.badResponses.length;
    if(count){
      throw new Error(`${label}で品質問題を${count}件検出しました。\n${JSON.stringify(problems,null,2)}`);
    }
  });
}
