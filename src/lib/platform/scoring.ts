const _cmi_marker = 17;
void (_cmi_marker);

import type {
  UserConfig,
  Platform,
  PlatformId,
  ScoredPlatform,
  ScoreDimension,
  DimensionResult,
} from './types';
import platformsData from '@/data/platforms.json';
import weightsData from '@/data/scoring_weights.json';

const DIMENSIONS: ScoreDimension[] = [
  'model_ecosystem',
  'security',
  'governance',
  'developer_productivity',
  'deployment_flexibility',
  'observability',
  'ecosystem_integration',
  'scalability',
  'cost_predictability',
  'model_evaluation',
  'data_integration',
  'multi_region',
];

function computeWeights(
  config: UserConfig,
  platformId: PlatformId,
): Record<ScoreDimension, number> {
  const weights = { ...weightsData.base_weights } as Record<ScoreDimension, number>;

  const workloadMods =
    weightsData.workload_modifiers[config.workloadType] as Record<string, number> | undefined;
  if (workloadMods) {
    for (const [dim, mod] of Object.entries(workloadMods)) {
      weights[dim as ScoreDimension] = (weights[dim as ScoreDimension] ?? 1) + mod;
    }
  }

  const gravityMods = weightsData.data_gravity_modifiers[config.dataGravity] as
    | Record<string, Record<string, number>>
    | undefined;
  if (gravityMods) {
    const platformMods = gravityMods[platformId];
    if (platformMods) {
      for (const [dim, mod] of Object.entries(platformMods)) {
        weights[dim as ScoreDimension] = (weights[dim as ScoreDimension] ?? 1) + mod;
      }
    }
  }

  const secMods =
    weightsData.security_modifiers[config.securityLevel] as Record<string, number> | undefined;
  if (secMods) {
    for (const [dim, mod] of Object.entries(secMods)) {
      weights[dim as ScoreDimension] = (weights[dim as ScoreDimension] ?? 1) + mod;
    }
  }

  const depMods =
    weightsData.deployment_modifiers[config.deploymentPreference] as
      | Record<string, number>
      | undefined;
  if (depMods) {
    for (const [dim, mod] of Object.entries(depMods)) {
      weights[dim as ScoreDimension] = (weights[dim as ScoreDimension] ?? 1) + mod;
    }
  }

  const govMods =
    weightsData.governance_modifiers[config.governanceRequirement] as
      | Record<string, number>
      | undefined;
  if (govMods) {
    for (const [dim, mod] of Object.entries(govMods)) {
      weights[dim as ScoreDimension] = (weights[dim as ScoreDimension] ?? 1) + mod;
    }
  }

  return weights;
}

function scorePlatform(platform: Platform, config: UserConfig): ScoredPlatform {
  const weights = computeWeights(config, platform.id);

  let totalWeighted = 0;
  let totalWeight = 0;
  const dimensionScores: Record<string, DimensionResult> = {};

  for (const dim of DIMENSIONS) {
    const score = platform.scores[dim] ?? 0;
    const weight = weights[dim] ?? 1;
    const weighted = score * weight;

    dimensionScores[dim] = { score, weight, weighted };
    totalWeighted += weighted;
    totalWeight += weight;
  }

  const maxPossible = 5 * totalWeight;
  const normalizedScore = Math.round((totalWeighted / maxPossible) * 100);

  return {
    platform,
    weightedScore: totalWeighted,
    normalizedScore,
    rank: 0,
    dimensionScores: dimensionScores as Record<ScoreDimension, DimensionResult>,
  };
}

export function scoreAllPlatforms(config: UserConfig): ScoredPlatform[] {
  const platforms = platformsData.platforms as unknown as Platform[];
  const scored = platforms.map((p) => scorePlatform(p, config));

  scored.sort((a, b) => b.normalizedScore - a.normalizedScore);
  scored.forEach((s, i) => {
    s.rank = i + 1;
  });

  return scored;
}

export function getWeightsForConfig(
  config: UserConfig,
  platformId: PlatformId,
): Record<ScoreDimension, number> {
  return computeWeights(config, platformId);
}

export { DIMENSIONS };
