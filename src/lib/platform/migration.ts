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
