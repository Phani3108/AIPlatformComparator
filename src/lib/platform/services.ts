import type { PlatformId, WorkloadType } from './types';
import servicesData from '@/data/services.json';

type ServiceMap = Record<string, Record<string, Record<string, string>>>;

export function getServiceMapping(
  platformId: PlatformId,
  workloadType: WorkloadType,
): Record<string, string> {
  const data = servicesData as unknown as ServiceMap;
  return data[workloadType]?.[platformId] ?? {};
}

export function getAllServiceMappings(
  workloadType: WorkloadType,
): Record<PlatformId, Record<string, string>> {
  const platforms: PlatformId[] = ['vertex_ai', 'azure_openai', 'aws_bedrock'];
  const result: Record<string, Record<string, string>> = {};

  for (const pid of platforms) {
    result[pid] = getServiceMapping(pid, workloadType);
  }

  return result as Record<PlatformId, Record<string, string>>;
}
