import type { PlatformId, LockInAnalysis, LockInDimension } from './types';

interface LockInProfile {
  llm_api: LockInDimension;
  embeddings: LockInDimension;
  vector_db: LockInDimension;
  workflow_orchestration: LockInDimension;
  data_layer: LockInDimension;
  monitoring: LockInDimension;
  identity: LockInDimension;
}

const LOCKIN_PROFILES: Record<PlatformId, LockInProfile> = {
  vertex_ai: {
    llm_api: {
      dimension: 'LLM API',
      level: 'Low',
      score: 2,
      reason: 'Gemini API is Google-specific but OpenAI-compatible endpoints available',
    },
    embeddings: {
      dimension: 'Embeddings',
      level: 'Medium',
      score: 5,
      reason: 'Vertex AI Embeddings tied to Google ecosystem; migration requires re-embedding',
    },
    vector_db: {
      dimension: 'Vector Database',
      level: 'Medium',
      score: 6,
      reason: 'Vertex AI Vector Search uses proprietary ScaNN; data export possible but indexing not portable',
    },
    workflow_orchestration: {
      dimension: 'Workflow Orchestration',
      level: 'Low',
      score: 3,
      reason: 'Agent Builder is proprietary but LangChain/LlamaIndex alternatives are portable',
    },
    data_layer: {
      dimension: 'Data Layer',
      level: 'High',
      score: 8,
      reason: 'BigQuery integration creates strong data gravity; migration requires full data pipeline rebuild',
    },
    monitoring: {
      dimension: 'Monitoring Stack',
      level: 'Medium',
      score: 5,
      reason: 'Cloud Monitoring is GCP-specific; OpenTelemetry provides partial portability',
    },
    identity: {
      dimension: 'Identity & Auth',
      level: 'Medium',
      score: 5,
      reason: 'Firebase Auth / IAP tied to Google identity; OAuth standards provide some portability',
    },
  },
  azure_openai: {
    llm_api: {
      dimension: 'LLM API',
      level: 'Low',
      score: 2,
      reason: 'OpenAI-compatible API; can switch to direct OpenAI or other providers',
    },
    embeddings: {
      dimension: 'Embeddings',
      level: 'Medium',
      score: 4,
      reason: 'OpenAI embeddings format widely supported; some portability via open models',
    },
    vector_db: {
      dimension: 'Vector Database',
      level: 'High',
      score: 7,
      reason: 'Azure AI Search is deeply proprietary; migration to open alternatives is complex',
    },
    workflow_orchestration: {
      dimension: 'Workflow Orchestration',
      level: 'Medium',
      score: 5,
      reason: 'Semantic Kernel is open-source but Azure-optimized; Copilot Studio is fully proprietary',
    },
    data_layer: {
      dimension: 'Data Layer',
      level: 'High',
      score: 8,
      reason: 'Azure Synapse / Fabric creates strong Microsoft data gravity',
    },
    monitoring: {
      dimension: 'Monitoring Stack',
      level: 'High',
      score: 7,
      reason: 'Application Insights / Azure Monitor deeply integrated; migration is significant effort',
    },
    identity: {
      dimension: 'Identity & Auth',
      level: 'High',
      score: 9,
      reason: 'Azure AD / Entra ID is deeply entrenched in enterprise orgs; very difficult to migrate',
    },
  },
  aws_bedrock: {
    llm_api: {
      dimension: 'LLM API',
      level: 'Low',
      score: 2,
      reason: 'Bedrock provides multiple model providers; underlying models available elsewhere',
    },
    embeddings: {
      dimension: 'Embeddings',
      level: 'Low',
      score: 3,
      reason: 'Titan embeddings are AWS-specific but open alternatives easily substituted',
    },
    vector_db: {
      dimension: 'Vector Database',
      level: 'Medium',
      score: 5,
      reason: 'OpenSearch is open-source based; data migration is feasible but requires effort',
    },
    workflow_orchestration: {
      dimension: 'Workflow Orchestration',
      level: 'Medium',
      score: 6,
      reason: 'Bedrock Agents + Step Functions are AWS-specific; LangChain alternatives exist',
    },
    data_layer: {
      dimension: 'Data Layer',
      level: 'High',
      score: 8,
      reason: 'S3 + Redshift + Glue pipeline creates strong AWS data gravity',
    },
    monitoring: {
      dimension: 'Monitoring Stack',
      level: 'Medium',
      score: 5,
      reason: 'CloudWatch is AWS-specific; X-Ray supports OpenTelemetry export',
    },
    identity: {
      dimension: 'Identity & Auth',
      level: 'Medium',
      score: 6,
      reason: 'IAM + Cognito are AWS-specific but standard OAuth/SAML helps portability',
    },
  },
};

function computeOverallLevel(score: number): 'Low' | 'Medium' | 'High' {
  if (score <= 3) return 'Low';
  if (score <= 6) return 'Medium';
  return 'High';
}

export function analyzeLockIn(platformId: PlatformId): LockInAnalysis {
  const profile = LOCKIN_PROFILES[platformId];
  const dimensions = Object.values(profile);
  const avgScore = dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length;

  const platformNames: Record<PlatformId, string> = {
    vertex_ai: 'Google Vertex AI',
    azure_openai: 'Azure OpenAI',
    aws_bedrock: 'AWS Bedrock',
  };

  return {
    platformId,
    platformName: platformNames[platformId],
    overallLevel: computeOverallLevel(avgScore),
    overallScore: Math.round(avgScore * 10),
    dimensions,
  };
}

export function compareAllLockIn(): LockInAnalysis[] {
  return (['vertex_ai', 'azure_openai', 'aws_bedrock'] as PlatformId[]).map(analyzeLockIn);
}
