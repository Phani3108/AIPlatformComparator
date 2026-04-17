import type { PlatformId, PlatformCategory, LockInAnalysis, LockInDimension } from './types';

interface LockInProfile {
  llm_api: LockInDimension;
  embeddings: LockInDimension;
  vector_db: LockInDimension;
  workflow_orchestration: LockInDimension;
  data_layer: LockInDimension;
  monitoring: LockInDimension;
  identity: LockInDimension;
}

const LOCKIN_PROFILES: Partial<Record<PlatformId, LockInProfile>> = {
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

const COMPUTER_USE_PROFILES: Partial<Record<PlatformId, LockInProfile>> = {
  claude_computer_use: {
    llm_api: {
      dimension: 'Agent SDK',
      level: 'Medium',
      score: 5,
      reason: 'Tied to Anthropic API; no self-hosted option but standard REST interface',
    },
    embeddings: {
      dimension: 'Browser Runtime',
      level: 'Low',
      score: 2,
      reason: 'Uses user-controlled environment; no proprietary browser runtime',
    },
    vector_db: {
      dimension: 'Auth Layer',
      level: 'Low',
      score: 3,
      reason: 'Standard API key auth; org-level controls available',
    },
    workflow_orchestration: {
      dimension: 'Data Access Scope',
      level: 'Medium',
      score: 4,
      reason: 'Can access anything visible on screen; scope controlled by environment setup',
    },
    data_layer: {
      dimension: 'Task State',
      level: 'Medium',
      score: 5,
      reason: 'Task context tied to conversation; no portable state format',
    },
    monitoring: {
      dimension: 'Output Format',
      level: 'Low',
      score: 2,
      reason: 'Standard text/JSON outputs; screenshots are standard image formats',
    },
    identity: {
      dimension: 'Vendor Dependency',
      level: 'Medium',
      score: 5,
      reason: 'Relies solely on Anthropic infrastructure; no alternative providers for Computer Use',
    },
  },
  browserbase: {
    llm_api: {
      dimension: 'Agent SDK',
      level: 'Low',
      score: 2,
      reason: 'BYO-LLM architecture; uses standard Playwright/Puppeteer APIs',
    },
    embeddings: {
      dimension: 'Browser Runtime',
      level: 'High',
      score: 7,
      reason: 'Proprietary cloud browser infrastructure; session management is platform-specific',
    },
    vector_db: {
      dimension: 'Auth Layer',
      level: 'Low',
      score: 3,
      reason: 'API key auth with standard patterns',
    },
    workflow_orchestration: {
      dimension: 'Data Access Scope',
      level: 'Low',
      score: 2,
      reason: 'Browser-only scope; well-contained to web sessions',
    },
    data_layer: {
      dimension: 'Task State',
      level: 'Medium',
      score: 5,
      reason: 'Session data stored on Browserbase; export possible but not seamless',
    },
    monitoring: {
      dimension: 'Output Format',
      level: 'Low',
      score: 2,
      reason: 'Standard page content and screenshots; recordings exportable',
    },
    identity: {
      dimension: 'Vendor Dependency',
      level: 'Medium',
      score: 5,
      reason: 'Cloud browser infra is core value; alternatives exist but require re-architecture',
    },
  },
  manus: {
    llm_api: {
      dimension: 'Agent SDK',
      level: 'High',
      score: 8,
      reason: 'Fully proprietary planning engine; no open alternative with equivalent capabilities',
    },
    embeddings: {
      dimension: 'Browser Runtime',
      level: 'High',
      score: 7,
      reason: 'Built-in browser and desktop runtime; deeply integrated with planning engine',
    },
    vector_db: {
      dimension: 'Auth Layer',
      level: 'Medium',
      score: 4,
      reason: 'Account-based access; no enterprise SSO integration',
    },
    workflow_orchestration: {
      dimension: 'Data Access Scope',
      level: 'High',
      score: 7,
      reason: 'Broad access to browser + desktop + files; scope harder to restrict',
    },
    data_layer: {
      dimension: 'Task State',
      level: 'High',
      score: 7,
      reason: 'Task state fully managed by Manus; no export or portability',
    },
    monitoring: {
      dimension: 'Output Format',
      level: 'Medium',
      score: 5,
      reason: 'Outputs are task-specific; intermediate steps are opaque',
    },
    identity: {
      dimension: 'Vendor Dependency',
      level: 'High',
      score: 8,
      reason: 'Entire agent runtime is proprietary; high switching cost',
    },
  },
  replit_agent: {
    llm_api: {
      dimension: 'Agent SDK',
      level: 'Medium',
      score: 6,
      reason: 'Proprietary agent with Replit-specific integrations; code output is portable',
    },
    embeddings: {
      dimension: 'Browser Runtime',
      level: 'Low',
      score: 1,
      reason: 'No browser runtime — code execution focused',
    },
    vector_db: {
      dimension: 'Auth Layer',
      level: 'Medium',
      score: 4,
      reason: 'Replit Teams SSO; code itself is portable',
    },
    workflow_orchestration: {
      dimension: 'Data Access Scope',
      level: 'Low',
      score: 3,
      reason: 'Contained to workspace; file and DB access within Repl',
    },
    data_layer: {
      dimension: 'Task State',
      level: 'Medium',
      score: 5,
      reason: 'Data stored in Replit environment; git export available',
    },
    monitoring: {
      dimension: 'Output Format',
      level: 'Low',
      score: 2,
      reason: 'Code output is standard (git-exportable); deployments may need migration',
    },
    identity: {
      dimension: 'Vendor Dependency',
      level: 'Medium',
      score: 5,
      reason: 'Code is portable but Replit deployment infra creates mild lock-in',
    },
  },
  cursor_agent: {
    llm_api: {
      dimension: 'Agent SDK',
      level: 'Low',
      score: 3,
      reason: 'Supports multiple LLM backends; agent logic is IDE-specific but outputs are code',
    },
    embeddings: {
      dimension: 'Browser Runtime',
      level: 'Low',
      score: 1,
      reason: 'No browser runtime — purely IDE-based',
    },
    vector_db: {
      dimension: 'Auth Layer',
      level: 'Low',
      score: 2,
      reason: 'Standard account auth; code stays local',
    },
    workflow_orchestration: {
      dimension: 'Data Access Scope',
      level: 'Low',
      score: 2,
      reason: 'Restricted to project workspace; privacy-maximizing by default',
    },
    data_layer: {
      dimension: 'Task State',
      level: 'Low',
      score: 3,
      reason: 'Minimal state; .cursorrules is plain text; all code is local git',
    },
    monitoring: {
      dimension: 'Output Format',
      level: 'Low',
      score: 1,
      reason: 'Output is standard code files; fully portable',
    },
    identity: {
      dimension: 'Vendor Dependency',
      level: 'Low',
      score: 3,
      reason: 'Lowest lock-in — code is always local; switching IDEs loses agent features only',
    },
  },
};

function computeOverallLevel(score: number): 'Low' | 'Medium' | 'High' {
  if (score <= 3) return 'Low';
  if (score <= 6) return 'Medium';
  return 'High';
}

const PLATFORM_NAMES: Record<PlatformId, string> = {
  vertex_ai: 'Google Vertex AI',
  azure_openai: 'Azure OpenAI',
  aws_bedrock: 'AWS Bedrock',
  claude_computer_use: 'Claude Computer Use',
  browserbase: 'Browserbase',
  manus: 'Manus AI',
  replit_agent: 'Replit Agent',
  cursor_agent: 'Cursor AI',
};

export function analyzeLockIn(platformId: PlatformId): LockInAnalysis {
  const profile = LOCKIN_PROFILES[platformId] ?? COMPUTER_USE_PROFILES[platformId];
  if (!profile) {
    return {
      platformId,
      platformName: PLATFORM_NAMES[platformId] ?? platformId,
      overallLevel: 'Medium',
      overallScore: 50,
      dimensions: [],
    };
  }
  const dimensions = Object.values(profile);
  const avgScore = dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length;

  return {
    platformId,
    platformName: PLATFORM_NAMES[platformId] ?? platformId,
    overallLevel: computeOverallLevel(avgScore),
    overallScore: Math.round(avgScore * 10),
    dimensions,
  };
}

const CLOUD_AI_IDS: PlatformId[] = ['vertex_ai', 'azure_openai', 'aws_bedrock'];
const COMPUTER_USE_IDS: PlatformId[] = ['claude_computer_use', 'browserbase', 'manus', 'replit_agent', 'cursor_agent'];

export function compareAllLockIn(category: PlatformCategory = 'cloud_ai'): LockInAnalysis[] {
  const ids = category === 'computer_use' ? COMPUTER_USE_IDS : CLOUD_AI_IDS;
  return ids.map(analyzeLockIn);
}
