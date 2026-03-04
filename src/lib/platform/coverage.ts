import type { PlatformId, Capability, CapabilityEntry } from './types';
import capabilityData from '@/data/capability_matrix.json';

export function getCapabilities(): Capability[] {
  return capabilityData.capabilities as Capability[];
}

export function getCapabilitiesByCategory(): Record<string, Capability[]> {
  const caps = getCapabilities();
  const grouped: Record<string, Capability[]> = {};

  for (const cap of caps) {
    if (!grouped[cap.category]) {
      grouped[cap.category] = [];
    }
    grouped[cap.category].push(cap);
  }

  return grouped;
}

export function getPlatformCapabilityEntry(
  capability: Capability,
  platformId: PlatformId,
): CapabilityEntry {
  return capability[platformId];
}

export function computeCoverageScore(platformId: PlatformId): {
  supported: number;
  total: number;
  percentage: number;
} {
  const caps = getCapabilities();
  let supported = 0;

  for (const cap of caps) {
    if (cap[platformId].supported) supported++;
  }

  return {
    supported,
    total: caps.length,
    percentage: Math.round((supported / caps.length) * 100),
  };
}
