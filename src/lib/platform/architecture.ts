import type { PlatformId, WorkloadType } from './types';
import servicesData from '@/data/services.json';

type ServiceMap = Record<string, Record<string, Record<string, string>>>;

export function getServiceStack(
  platformId: PlatformId,
  workloadType: WorkloadType,
): Record<string, string> {
  const data = servicesData as unknown as ServiceMap;
  return data[workloadType]?.[platformId] ?? {};
}

export function generateArchitectureDiagram(
  platformId: PlatformId,
  workloadType: WorkloadType,
): string {
  const stack = getServiceStack(platformId, workloadType);
  if (!Object.keys(stack).length) return '';

  const entries = Object.entries(stack);
  const nodes: string[] = [];

  entries.forEach(([key, service], i) => {
    const nodeId = `n${i}`;
    const label = `${formatLabel(key)}\\n${service}`;
    nodes.push(`  ${nodeId}["${label}"]`);
  });

  const links: string[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    links.push(`  n${i} --> n${i + 1}`);
  }

  const platformNames: Record<PlatformId, string> = {
    vertex_ai: 'Google Vertex AI',
    azure_openai: 'Azure OpenAI',
    aws_bedrock: 'AWS Bedrock',
  };

  const workloadNames: Record<WorkloadType, string> = {
    chatbot: 'Chatbot',
    rag: 'RAG Application',
    agent: 'Agent Workflow',
    multimodal: 'Multimodal AI',
    fine_tuned: 'Fine-Tuned Model',
    copilot: 'AI Copilot',
  };

  return [
    '%%{init: {"theme":"neutral"}}%%',
    `graph TD`,
    `  subgraph "${platformNames[platformId]} — ${workloadNames[workloadType]}"`,
    `  user(["User"])`,
    `  user --> n0`,
    ...nodes,
    ...links,
    `  end`,
    `  style user fill:#e8f0fe,stroke:#1a73e8`,
  ].join('\n');
}

function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
