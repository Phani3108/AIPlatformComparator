import type { PlatformId, MigrationAnalysis, MigrationChallenge } from './types';

type MigrationPath = `${PlatformId}_to_${PlatformId}`;

interface MigrationProfile {
  overallScore: number;
  estimatedEffortWeeks: string;
  challenges: MigrationChallenge[];
}

const MIGRATION_PATHS: Record<string, MigrationProfile> = {
  vertex_ai_to_azure_openai: {
    overallScore: 6,
    estimatedEffortWeeks: '8–14',
    challenges: [
      { area: 'LLM Layer', difficulty: 'Medium', description: 'Migrate from Gemini to GPT-4o API; prompt re-engineering required for optimisation' },
      { area: 'Embeddings', difficulty: 'High', description: 'Re-embed all documents with Azure OpenAI embeddings; index rebuild needed' },
      { area: 'Vector Database', difficulty: 'High', description: 'Migrate from Vertex AI Vector Search to Azure AI Search; schema and query rewrite' },
      { area: 'Data Pipeline', difficulty: 'High', description: 'Replace BigQuery + Dataflow with Synapse + Data Factory' },
      { area: 'Identity', difficulty: 'Medium', description: 'Migrate from Google IAP/Firebase Auth to Azure AD' },
      { area: 'Monitoring', difficulty: 'Medium', description: 'Replace Cloud Monitoring with Azure Monitor + App Insights' },
    ],
  },
  vertex_ai_to_aws_bedrock: {
    overallScore: 6,
    estimatedEffortWeeks: '8–12',
    challenges: [
      { area: 'LLM Layer', difficulty: 'Low', description: 'Bedrock supports multiple models; switch to Claude or Titan with moderate prompt changes' },
      { area: 'Embeddings', difficulty: 'Medium', description: 'Re-embed with Titan embeddings; format differences are manageable' },
      { area: 'Vector Database', difficulty: 'Medium', description: 'Migrate to OpenSearch Serverless; open-source based, easing transition' },
      { area: 'Data Pipeline', difficulty: 'High', description: 'Replace BigQuery + Dataflow with Redshift + Glue' },
      { area: 'Identity', difficulty: 'Medium', description: 'Migrate from Google IAP to Cognito/IAM' },
      { area: 'Monitoring', difficulty: 'Medium', description: 'Replace Cloud Monitoring with CloudWatch + X-Ray' },
    ],
  },
  azure_openai_to_vertex_ai: {
    overallScore: 7,
    estimatedEffortWeeks: '10–16',
    challenges: [
      { area: 'LLM Layer', difficulty: 'Medium', description: 'Migrate from GPT-4o to Gemini; different prompt patterns and capabilities' },
      { area: 'Embeddings', difficulty: 'High', description: 'Re-embed all documents with Vertex AI embeddings; full index rebuild' },
      { area: 'Vector Database', difficulty: 'High', description: 'Migrate from Azure AI Search to Vertex AI Vector Search; significant schema changes' },
      { area: 'Data Pipeline', difficulty: 'High', description: 'Replace Synapse + Data Factory with BigQuery + Dataflow' },
      { area: 'Identity', difficulty: 'Very High', description: 'Migrate from Azure AD/Entra ID; deeply embedded in enterprise identity' },
      { area: 'Monitoring', difficulty: 'Medium', description: 'Replace Azure Monitor with Cloud Monitoring' },
    ],
  },
  azure_openai_to_aws_bedrock: {
    overallScore: 7,
    estimatedEffortWeeks: '10–14',
    challenges: [
      { area: 'LLM Layer', difficulty: 'Low', description: 'Bedrock supports similar models; API abstraction makes switching easier' },
      { area: 'Embeddings', difficulty: 'Medium', description: 'Re-embed with Titan embeddings; moderate effort' },
      { area: 'Vector Database', difficulty: 'High', description: 'Migrate from Azure AI Search to OpenSearch; significant query rewrite' },
      { area: 'Data Pipeline', difficulty: 'High', description: 'Replace Synapse + Data Factory with Redshift + Glue' },
      { area: 'Identity', difficulty: 'Very High', description: 'Migrate from Azure AD to Cognito; major identity infrastructure change' },
      { area: 'Monitoring', difficulty: 'Medium', description: 'Replace Azure Monitor with CloudWatch' },
    ],
  },
  aws_bedrock_to_vertex_ai: {
    overallScore: 5,
    estimatedEffortWeeks: '6–10',
    challenges: [
      { area: 'LLM Layer', difficulty: 'Medium', description: 'Migrate to Gemini API; prompt restructuring for optimal performance' },
      { area: 'Embeddings', difficulty: 'Medium', description: 'Re-embed with Vertex AI embeddings; moderate effort' },
      { area: 'Vector Database', difficulty: 'Medium', description: 'Migrate from OpenSearch to Vertex AI Vector Search; OpenSearch data export is straightforward' },
      { area: 'Data Pipeline', difficulty: 'High', description: 'Replace S3 + Glue + Redshift with GCS + Dataflow + BigQuery' },
      { area: 'Identity', difficulty: 'Medium', description: 'Migrate from Cognito/IAM to Google IAP/Firebase Auth' },
      { area: 'Monitoring', difficulty: 'Low', description: 'Replace CloudWatch with Cloud Monitoring; OpenTelemetry eases transition' },
    ],
  },
  aws_bedrock_to_azure_openai: {
    overallScore: 6,
    estimatedEffortWeeks: '8–12',
    challenges: [
      { area: 'LLM Layer', difficulty: 'Low', description: 'Switch to Azure OpenAI GPT-4o; well-documented migration path' },
      { area: 'Embeddings', difficulty: 'Medium', description: 'Re-embed with Azure OpenAI embeddings; moderate effort' },
      { area: 'Vector Database', difficulty: 'High', description: 'Migrate from OpenSearch to Azure AI Search; significant query and schema changes' },
      { area: 'Data Pipeline', difficulty: 'High', description: 'Replace S3 + Glue + Redshift with Azure Blob + Data Factory + Synapse' },
      { area: 'Identity', difficulty: 'Medium', description: 'Migrate from Cognito/IAM to Azure AD; standard enterprise migration' },
      { area: 'Monitoring', difficulty: 'Medium', description: 'Replace CloudWatch with Azure Monitor + App Insights' },
    ],
  },
  // Computer-Use Agent migration paths
  claude_computer_use_to_browserbase: {
    overallScore: 6,
    estimatedEffortWeeks: '4–6',
    challenges: [
      { area: 'Agent Runtime', difficulty: 'High', description: 'Replace Anthropic Computer Use with external LLM + Browserbase; fundamentally different architecture' },
      { area: 'Task Logic', difficulty: 'Medium', description: 'Rewrite from prompt-based to Playwright/Puppeteer scripted automation' },
      { area: 'Visual Understanding', difficulty: 'High', description: 'Claude\'s native screenshot reasoning has no direct equivalent; requires DOM selectors instead' },
      { area: 'Auth & Access', difficulty: 'Low', description: 'API key migration is straightforward' },
      { area: 'Monitoring', difficulty: 'Low', description: 'Browserbase provides session recording; comparable observability' },
    ],
  },
  claude_computer_use_to_manus: {
    overallScore: 5,
    estimatedEffortWeeks: '3–5',
    challenges: [
      { area: 'Agent Runtime', difficulty: 'Medium', description: 'Both are autonomous agents; Manus uses its own planning engine vs Claude\'s reasoning' },
      { area: 'Task Specification', difficulty: 'Low', description: 'Both accept natural language task descriptions' },
      { area: 'Security Controls', difficulty: 'High', description: 'Claude has more granular safety controls; Manus is more permissive' },
      { area: 'Enterprise Integration', difficulty: 'Medium', description: 'Claude has better enterprise API controls; Manus lacks SSO' },
      { area: 'Output Format', difficulty: 'Low', description: 'Both produce standard outputs; task results are similar' },
    ],
  },
  browserbase_to_claude_computer_use: {
    overallScore: 7,
    estimatedEffortWeeks: '5–8',
    challenges: [
      { area: 'Agent Runtime', difficulty: 'High', description: 'Replace scripted Playwright automation with prompt-based Computer Use; paradigm shift' },
      { area: 'Task Logic', difficulty: 'High', description: 'Convert deterministic scripts to prompt engineering; reliability characteristics change' },
      { area: 'Cost Model', difficulty: 'Medium', description: 'Move from per-session to per-token pricing; cost structure changes significantly' },
      { area: 'Scalability', difficulty: 'Medium', description: 'Claude is sequential; Browserbase can parallelize; architecture change needed' },
      { area: 'Browser Features', difficulty: 'Medium', description: 'Lose anti-detection, proxy, and stealth features' },
    ],
  },
  browserbase_to_manus: {
    overallScore: 5,
    estimatedEffortWeeks: '3–5',
    challenges: [
      { area: 'Agent Runtime', difficulty: 'Medium', description: 'Replace BYO-LLM + Playwright with Manus planning engine' },
      { area: 'Task Logic', difficulty: 'Medium', description: 'Convert scripts to natural language task descriptions' },
      { area: 'Browser Control', difficulty: 'Low', description: 'Manus has built-in browser; less fine-grained but more autonomous' },
      { area: 'Enterprise Features', difficulty: 'High', description: 'Lose team RBAC and session management capabilities' },
      { area: 'Monitoring', difficulty: 'Medium', description: 'Lose session recording/replay; Manus has basic execution logs' },
    ],
  },
  manus_to_claude_computer_use: {
    overallScore: 6,
    estimatedEffortWeeks: '4–6',
    challenges: [
      { area: 'Agent Runtime', difficulty: 'Medium', description: 'Replace Manus planning engine with Claude prompt engineering' },
      { area: 'Desktop Automation', difficulty: 'Medium', description: 'Claude Computer Use supports desktop but excels at browser; some desktop tasks may need adjustment' },
      { area: 'Security Controls', difficulty: 'Low', description: 'Claude has stronger safety features; upgrade in security posture' },
      { area: 'Cost Model', difficulty: 'Medium', description: 'Move from per-task to per-token pricing' },
      { area: 'Enterprise Integration', difficulty: 'Low', description: 'Claude API has better enterprise controls; improvement' },
    ],
  },
  manus_to_browserbase: {
    overallScore: 6,
    estimatedEffortWeeks: '5–7',
    challenges: [
      { area: 'Agent Runtime', difficulty: 'High', description: 'Replace autonomous planner with scripted Playwright automation + external LLM' },
      { area: 'Desktop Features', difficulty: 'High', description: 'Lose all desktop automation capability; browser-only' },
      { area: 'Task Specification', difficulty: 'High', description: 'Move from natural language to scripted automation; more precise but less flexible' },
      { area: 'Monitoring', difficulty: 'Low', description: 'Gain session recording and replay capabilities' },
      { area: 'Enterprise Features', difficulty: 'Low', description: 'Gain team RBAC and API management' },
    ],
  },
};

function computeDifficulty(score: number): 'Low' | 'Medium' | 'High' | 'Very High' {
  if (score <= 3) return 'Low';
  if (score <= 5) return 'Medium';
  if (score <= 7) return 'High';
  return 'Very High';
}

export function analyzeMigration(
  source: PlatformId,
  target: PlatformId,
): MigrationAnalysis {
  if (source === target) {
    return {
      source,
      target,
      overallDifficulty: 'Low',
      overallScore: 0,
      challenges: [],
      estimatedEffortWeeks: '0',
    };
  }

  const key: MigrationPath = `${source}_to_${target}`;
  const profile = MIGRATION_PATHS[key];

  if (!profile) {
    return {
      source,
      target,
      overallDifficulty: 'Medium',
      overallScore: 5,
      challenges: [{ area: 'General', difficulty: 'Medium', description: 'Migration path not yet profiled' }],
      estimatedEffortWeeks: '8–12',
    };
  }

  return {
    source,
    target,
    overallDifficulty: computeDifficulty(profile.overallScore),
    overallScore: profile.overallScore,
    challenges: profile.challenges,
    estimatedEffortWeeks: profile.estimatedEffortWeeks,
  };
}
