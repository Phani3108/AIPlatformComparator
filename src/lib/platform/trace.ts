import type {
  UserConfig,
  ScoredPlatform,
  ScoreDimension,
  DecisionTrace,
  TraceContributor,
} from './types';
import { getWeightsForConfig, DIMENSIONS } from './scoring';
import weightsData from '@/data/scoring_weights.json';
import frameworkData from '@/data/enterprise_framework.json';

const BASE_WEIGHTS = weightsData.base_weights as Record<ScoreDimension, number>;
const DIMENSION_LABELS = frameworkData.dimension_labels as Record<ScoreDimension, string>;

export function generateDecisionTrace(
  config: UserConfig,
  winner: ScoredPlatform,
): DecisionTrace {
  const finalWeights = getWeightsForConfig(config, winner.platform.id);

  const contributors: TraceContributor[] = DIMENSIONS.map((dim) => {
    const baseWeight = BASE_WEIGHTS[dim] ?? 1;
    const finalWeight = finalWeights[dim] ?? 1;
    const modifier = +(finalWeight - baseWeight).toFixed(2);
    const score = winner.dimensionScores[dim]?.score ?? 0;
    const contribution = score * finalWeight;

    return {
      dimension: dim,
      label: DIMENSION_LABELS[dim] ?? dim,
      baseWeight,
      modifier,
      finalWeight: +finalWeight.toFixed(2),
      score,
      contribution: +contribution.toFixed(2),
    };
  });

  contributors.sort((a, b) => b.contribution - a.contribution);
  const top5 = contributors.slice(0, 5);

  const whyBullets = top5.map(
    (c) =>
      `${c.label} (score ${c.score}/5, weight ${c.finalWeight}x) contributed ${c.contribution.toFixed(1)} points`,
  );

  const topDimLabels = top5.slice(0, 3).map((c) => c.label.toLowerCase());
  const oneLineRationale = `${winner.platform.name} leads due to ${topDimLabels.join(', ')}.`;

  return {
    platformId: winner.platform.id,
    platformName: winner.platform.name,
    topContributors: top5,
    whyBullets,
    oneLineRationale,
  };
}

export function getBaseWeights(): Record<ScoreDimension, number> {
  return { ...BASE_WEIGHTS };
}
