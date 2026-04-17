import type { PlatformId, LockInAnalysis, PortabilityPlan, PortabilityStep } from './types';
import { analyzeLockIn } from './lockin';

const API_ABSTRACTION: Partial<Record<PlatformId, PortabilityStep>> = {
  vertex_ai: {
    step: 1,
    title: 'API Abstraction Layer',
    recommendation:
      'Wrap Gemini calls behind an LLM gateway (e.g. LiteLLM or custom OpenAI-compatible proxy). Vertex already supports OpenAI-format endpoints — enable this to allow model swaps without app changes.',
  },
  azure_openai: {
    step: 1,
    title: 'API Abstraction Layer',
    recommendation:
      'Azure OpenAI already uses the OpenAI SDK format. Add a thin routing layer (LiteLLM or Azure API Management) so you can redirect to alternative providers without code changes.',
  },
  aws_bedrock: {
    step: 1,
    title: 'API Abstraction Layer',
    recommendation:
      'Bedrock uses a proprietary SDK. Introduce an LLM gateway (LiteLLM, Portkey, or custom proxy) that normalises calls to OpenAI format, decoupling your app from the Bedrock API.',
  },
  claude_computer_use: {
    step: 1,
    title: 'Task Interface Abstraction',
    recommendation:
      'Define tasks using a platform-agnostic schema (JSON task specs with action, target, and verification fields). Wrap Claude Computer Use API calls behind an adapter layer so tasks can be re-routed to alternative agents.',
  },
  browserbase: {
    step: 1,
    title: 'Task Interface Abstraction',
    recommendation:
      'Use standard Playwright/Puppeteer scripts as your task definition layer. Browserbase-specific features (anti-detection, proxy) should be injected via config, not hard-coded into task logic.',
  },
  manus: {
    step: 1,
    title: 'Task Interface Abstraction',
    recommendation:
      'Document all task specifications in a structured format (not just natural language). Create a task catalog with inputs, expected outputs, and verification criteria that can be ported to any agent platform.',
  },
  replit_agent: {
    step: 1,
    title: 'Task Interface Abstraction',
    recommendation:
      'Keep all generated code in standard git repositories. Avoid Replit-specific deployment features; use Dockerfiles and standard CI/CD so generated apps are platform-independent.',
  },
  cursor_agent: {
    step: 1,
    title: 'Task Interface Abstraction',
    recommendation:
      'Store .cursorrules and prompt templates in a standard format. Keep codebase conventions documented separately so any AI coding assistant can pick up the same context.',
  },
};

const RETRIEVAL_PORTABILITY: Partial<Record<PlatformId, PortabilityStep>> = {
  vertex_ai: {
    step: 2,
    title: 'Retrieval & Vector Portability',
    recommendation:
      'Export embeddings to Parquet and store in GCS alongside the source documents. Use an open embedding model (e.g. E5, BGE) as a secondary index so re-embedding on migration is optional. Consider Weaviate or Qdrant as a portable vector layer if lock-in risk is critical.',
  },
  azure_openai: {
    step: 2,
    title: 'Retrieval & Vector Portability',
    recommendation:
      'Azure AI Search is deeply proprietary. Maintain a parallel index in an open vector DB (Qdrant, Weaviate) or export Azure AI Search schema regularly. Store raw embeddings in Azure Blob alongside documents to avoid re-embedding on migration.',
  },
  aws_bedrock: {
    step: 2,
    title: 'Retrieval & Vector Portability',
    recommendation:
      'OpenSearch is open-source based, giving partial portability. Store embeddings in S3/Parquet as a backup. If using Bedrock Knowledge Bases, periodically export the processed chunks so you can rebuild indexes on any platform.',
  },
  claude_computer_use: {
    step: 2,
    title: 'Data & State Portability',
    recommendation:
      'Export all task results, session logs, and extracted data to standard formats (CSV, JSON). Store conversation-based task context externally so it is not locked in Anthropic\'s conversation history.',
  },
  browserbase: {
    step: 2,
    title: 'Data & State Portability',
    recommendation:
      'Regularly export session recordings and extracted data. Use Browserbase\'s API to export session metadata. Keep all Playwright scripts in version control — they work with any Playwright-compatible runtime.',
  },
  manus: {
    step: 2,
    title: 'Data & State Portability',
    recommendation:
      'Export all task results immediately after execution. Manus task state is opaque — maintain your own task log with inputs, outputs, and screenshots. This is your portability insurance.',
  },
  replit_agent: {
    step: 2,
    title: 'Data & State Portability',
    recommendation:
      'Use git as the primary source of truth for all code. Export Repl DB data to standard databases. Keep deployment configs in Dockerfiles and docker-compose.yml, not Replit-specific .replit files.',
  },
  cursor_agent: {
    step: 2,
    title: 'Data & State Portability',
    recommendation:
      'All code is already local and portable. Version-control .cursorrules but also maintain an equivalent in a format other AI tools can use (e.g. CLAUDE.md, .github/copilot-instructions.md).',
  },
};

const OBSERVABILITY_PORTABILITY: Partial<Record<PlatformId, PortabilityStep>> = {
  vertex_ai: {
    step: 3,
    title: 'Observability Portability',
    recommendation:
      'Instrument with OpenTelemetry (OTel) as the primary telemetry layer. Export traces to Cloud Trace and a portable backend (Jaeger, Grafana Tempo) simultaneously. This ensures migration does not lose observability coverage.',
  },
  azure_openai: {
    step: 3,
    title: 'Observability Portability',
    recommendation:
      'Application Insights is Azure-native and deeply coupled. Adopt OpenTelemetry SDKs and dual-export to App Insights + a portable backend (Grafana Cloud, Datadog). This preserves observability continuity during any future migration.',
  },
  aws_bedrock: {
    step: 3,
    title: 'Observability Portability',
    recommendation:
      'CloudWatch + X-Ray support OpenTelemetry export. Configure OTel as your primary instrumentation and send to both CloudWatch and a portable backend (Grafana, Datadog). X-Ray traces can be exported via OTel collector.',
  },
  claude_computer_use: {
    step: 3,
    title: 'Monitoring Portability',
    recommendation:
      'Log all API requests, responses, and tool-use actions to your own observability stack (e.g. Datadog, Grafana). Don\'t rely solely on Anthropic\'s usage dashboard — build your own task success/failure metrics.',
  },
  browserbase: {
    step: 3,
    title: 'Monitoring Portability',
    recommendation:
      'Export session metrics via Browserbase API. Implement your own success/failure tracking in parallel using webhooks. Session recordings are exportable — archive them in your own storage.',
  },
  manus: {
    step: 3,
    title: 'Monitoring Portability',
    recommendation:
      'Manus execution logs are limited. Implement your own task monitoring layer that captures start time, completion time, step count, and outcome for every task. This data is your migration safety net.',
  },
  replit_agent: {
    step: 3,
    title: 'Monitoring Portability',
    recommendation:
      'Track deployment history and code generation metrics in your own system. Use standard APM tools for deployed apps rather than relying on Replit\'s built-in deployment dashboard.',
  },
  cursor_agent: {
    step: 3,
    title: 'Monitoring Portability',
    recommendation:
      'Minimal lock-in risk — chat history is local. Track your own metrics for code acceptance rate, edit frequency, and productivity gains to compare if you evaluate alternative AI coding tools.',
  },
};

export function generatePortabilityPlan(platformId: PlatformId): PortabilityPlan {
  const lockIn: LockInAnalysis = analyzeLockIn(platformId);

  const defaultStep = (step: number, title: string): PortabilityStep => ({
    step,
    title,
    recommendation: 'No specific recommendation available for this platform.',
  });

  const steps: PortabilityStep[] = [
    API_ABSTRACTION[platformId] ?? defaultStep(1, 'Task Interface Abstraction'),
    RETRIEVAL_PORTABILITY[platformId] ?? defaultStep(2, 'Data & State Portability'),
    OBSERVABILITY_PORTABILITY[platformId] ?? defaultStep(3, 'Monitoring Portability'),
  ];

  const highDims = lockIn.dimensions
    .filter((d) => d.level === 'High')
    .map((d) => d.dimension.toLowerCase());
  const summaryRisks = highDims.length
    ? `High lock-in areas: ${highDims.join(', ')}.`
    : 'No critical lock-in areas detected.';

  return {
    platformId,
    platformName: lockIn.platformName,
    steps,
    summary: `${summaryRisks} The 3-step portability plan above mitigates the primary vendor dependency risks.`,
  };
}
