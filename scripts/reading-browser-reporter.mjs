import fs from 'node:fs';
import path from 'node:path';

class ReadingBrowserReporter{
  constructor(){this.started=Date.now();this.results=new Map();}
  printsToStdio(){return false;}
  onTestEnd(test,result){
    const titlePath=test.titlePath();
    const project=titlePath[0]||'unknown';
    const title=titlePath.slice(1).join(' › ')||test.title;
    const key=`${project}:${test.id}`;
    this.results.set(key,{
      project,
      title,
      status:result.status,
      duration:result.duration,
      retry:result.retry,
      error:result.error?.message?.split('\n')[0]||'',
    });
  }
  onEnd(fullResult){
    const rows=[...this.results.values()].sort((a,b)=>a.project.localeCompare(b.project)||a.title.localeCompare(b.title));
    const passed=rows.filter(row=>row.status==='passed').length;
    const failed=rows.filter(row=>row.status==='failed'||row.status==='timedOut'||row.status==='interrupted').length;
    const skipped=rows.filter(row=>row.status==='skipped').length;
    const projects=[...new Set(rows.map(row=>row.project))];
    const report=[
      '# 境界夜話 読書記録バックアップ 実ブラウザー監査',
      '',
      `- 実行日時: ${new Date().toISOString()}`,
      `- 実行環境: ${projects.join(' / ')||'なし'}`,
      '- 対象操作: JSON書き出し・追加復元・置換復元・破損JSON拒否・未知作品ID拒否・復元後画面反映',
      '- Service Worker: 試験中は無効化し、現在の公開資産を直接検証',
      `- テスト結果: ${fullResult.status}`,
      `- 成功: ${passed}`,
      `- 失敗: ${failed}`,
      `- スキップ: ${skipped}`,
      `- 所要時間: ${((Date.now()-this.started)/1000).toFixed(1)}秒`,
      '',
      '## ケース別結果',
      '',
      '| ブラウザー | テスト | 結果 | 時間 |',
      '|---|---|---:|---:|',
      ...rows.map(row=>`| ${row.project} | ${row.title.replaceAll('|','\\|')} | ${row.status}${row.retry?`（再試行${row.retry}）`:''} | ${row.duration}ms |`),
      '',
      '## エラー',
      '',
      ...(failed?rows.filter(row=>row.error).map(row=>`- ${row.project} / ${row.title}: ${row.error}`):['- なし']),
      '',
    ].join('\n');
    fs.mkdirSync(path.join(process.cwd(),'reports'),{recursive:true});
    fs.writeFileSync(path.join(process.cwd(),'reports','reading-backup-browser-audit.md'),report);
  }
}

export default ReadingBrowserReporter;
