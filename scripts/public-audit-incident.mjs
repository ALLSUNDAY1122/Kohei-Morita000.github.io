export const INCIDENT_TITLE='[監査障害] 境界夜話 公開サイト';
export const INCIDENT_LABEL='public-site-incident';
export const INCIDENT_MARKER='<!-- public-site-audit-incident -->';

const runUrl=context=>`${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
const shaText=context=>String(context.sha||'').slice(0,12)||'不明';
const detectedAt=()=>new Date().toISOString();

async function ensureLabel(github,context){
  const {owner,repo}=context.repo;
  try{
    await github.rest.issues.getLabel({owner,repo,name:INCIDENT_LABEL});
  }catch(error){
    if(error?.status!==404)throw error;
    await github.rest.issues.createLabel({
      owner,
      repo,
      name:INCIDENT_LABEL,
      color:'B60205',
      description:'公開サイト自動監査で検出した未復旧障害',
    });
  }
}

async function findOpenIncident(github,context){
  const {owner,repo}=context.repo;
  const {data}=await github.rest.issues.listForRepo({
    owner,
    repo,
    state:'open',
    labels:INCIDENT_LABEL,
    per_page:100,
  });
  return data.find(issue=>issue.title===INCIDENT_TITLE&&String(issue.body||'').includes(INCIDENT_MARKER))||null;
}

const failureBody=({context,readingOutcome,healthOutcome})=>[
  INCIDENT_MARKER,
  'GitHub Pages公開サイトの自動ブラウザー監査が失敗しました。',
  '',
  `- 検出日時: ${detectedAt()}`,
  `- 読書機能監査: ${readingOutcome}`,
  `- 54ページ品質監査: ${healthOutcome}`,
  `- 対象コミット: \`${shaText(context)}\``,
  `- 実行結果: ${runUrl(context)}`,
  '',
  'GitHub ActionsのartifactにHTMLレポート、trace、screenshot、videoが14日間保存されます。',
].join('\n');

const recoveryBody=context=>[
  '公開サイトの再監査が成功したため、自動的に復旧扱いとします。',
  '',
  `- 復旧確認日時: ${detectedAt()}`,
  `- 対象コミット: \`${shaText(context)}\``,
  `- 実行結果: ${runUrl(context)}`,
].join('\n');

export async function managePublicAuditIncident({github,context,failed,readingOutcome='unknown',healthOutcome='unknown'}){
  await ensureLabel(github,context);
  const {owner,repo}=context.repo;
  const incident=await findOpenIncident(github,context);

  if(failed){
    const body=failureBody({context,readingOutcome,healthOutcome});
    if(incident){
      await github.rest.issues.createComment({owner,repo,issue_number:incident.number,body});
      return {action:'commented',issueNumber:incident.number};
    }
    const {data}=await github.rest.issues.create({
      owner,
      repo,
      title:INCIDENT_TITLE,
      body,
      labels:[INCIDENT_LABEL],
    });
    return {action:'created',issueNumber:data.number};
  }

  if(!incident)return {action:'none',issueNumber:null};
  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number:incident.number,
    body:recoveryBody(context),
  });
  await github.rest.issues.update({
    owner,
    repo,
    issue_number:incident.number,
    state:'closed',
    state_reason:'completed',
  });
  return {action:'closed',issueNumber:incident.number};
}
