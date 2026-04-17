import type { PlatformId, PlatformCategory, WorkloadType } from './types';
import servicesData from '@/data/services.json';

type ServiceMap = Record<string, Record<string, Record<string, string>>>;

export function getServiceMapping(
  platformId: PlatformId,
  workloadType: WorkloadType,
): Record<string, string> {
  const data = servicesData as unknown as ServiceMap;
  return data[workloadType]?.[platformId] ?? {};
}

const CLOUD_AI_IDS: PlatformId[] = ['vertex_ai', 'azure_openai', 'aws_bedrock'];
const COMPUTER_USE_IDS: PlatformId[] = ['claude_computer_use', 'browserbase', 'manus', 'replit_agent', 'cursor_agent'];

export function getPlatformIdsForCategory(category: PlatformCategory): PlatformId[] {
  return category === 'computer_use' ? COMPUTER_USE_IDS : CLOUD_AI_IDS;
}

export function getAllServiceMappings(
  workloadType: WorkloadType,
  category: PlatformCategory = 'cloud_ai',
): Record<PlatformId, Record<string, string>> {
  const platforms = getPlatformIdsForCategory(category);
  const result: Record<string, Record<string, string>> = {};

  for (const pid of platforms) {
    result[pid] = getServiceMapping(pid, workloadType);
  }

  return result as Record<PlatformId, Record<string, string>>;
}
