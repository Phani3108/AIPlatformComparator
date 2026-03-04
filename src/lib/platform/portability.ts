import type { PlatformId, LockInAnalysis, PortabilityPlan, PortabilityStep } from './types';
import { analyzeLockIn } from './lockin';

const API_ABSTRACTION: Record<PlatformId, PortabilityStep> = {
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
};

const RETRIEVAL_PORTABILITY: Record<PlatformId, PortabilityStep> = {
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
};

const OBSERVABILITY_PORTABILITY: Record<PlatformId, PortabilityStep> = {
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
};

export function generatePortabilityPlan(platformId: PlatformId): PortabilityPlan {
  const lockIn: LockInAnalysis = analyzeLockIn(platformId);
  const steps: PortabilityStep[] = [
    API_ABSTRACTION[platformId],
    RETRIEVAL_PORTABILITY[platformId],
    OBSERVABILITY_PORTABILITY[platformId],
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
