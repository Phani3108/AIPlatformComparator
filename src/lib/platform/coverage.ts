import type { PlatformId, PlatformCategory, Capability, CapabilityEntry } from './types';
import capabilityData from '@/data/capability_matrix.json';

const CLOUD_AI_CATEGORIES = ['Core AI', 'MLOps', 'Enterprise', 'Integration', 'Developer'];
const COMPUTER_USE_CATEGORIES = ['Computer-Use'];

export function getCapabilities(category?: PlatformCategory): Capability[] {
  const caps = capabilityData.capabilities as unknown as Capability[];
  if (!category) return caps;
  const catSet = category === 'computer_use' ? COMPUTER_USE_CATEGORIES : CLOUD_AI_CATEGORIES;
  return caps.filter((c) => catSet.includes(c.category));
}

export function getCapabilitiesByCategory(category?: PlatformCategory): Record<string, Capability[]> {
  const caps = getCapabilities(category);
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
  const entry = capability[platformId];
  if (entry && typeof entry === 'object' && 'supported' in entry) {
    return entry as CapabilityEntry;
  }
  return { supported: false, maturity: 'N/A', notes: 'Not available' };
}

export function computeCoverageScore(platformId: PlatformId, category?: PlatformCategory): {
  supported: number;
  total: number;
  percentage: number;
} {
  const caps = getCapabilities(category);
  let supported = 0;

  for (const cap of caps) {
    const entry = getPlatformCapabilityEntry(cap, platformId);
    if (entry.supported) supported++;
  }

  return {
    supported,
    total: caps.length,
    percentage: caps.length > 0 ? Math.round((supported / caps.length) * 100) : 0,
  };
}
