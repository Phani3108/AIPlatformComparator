import type { UserConfig, ScoredPlatform, Recommendation, ScoreDimension } from './types';
import { scoreAllPlatforms, DIMENSIONS } from './scoring';
import { generateDecisionTrace } from './trace';
import { generatePortabilityPlan } from './portability';
import frameworkData from '@/data/enterprise_framework.json';

const DIMENSION_LABELS = frameworkData.dimension_labels as Record<ScoreDimension, string>;

function generateExplanation(
  config: UserConfig,
  scored: ScoredPlatform[],
): string {
  const primary = scored[0];
  const secondary = scored[1];

  const topDimensions = [...DIMENSIONS]
    .sort(
      (a, b) =>
        primary.dimensionScores[b].weighted - primary.dimensionScores[a].weighted,
    )
    .slice(0, 3);

  const topReasons = topDimensions
    .map((dim) => DIMENSION_LABELS[dim]?.toLowerCase() ?? dim)
    .join(', ');

  const workloadLabels: Record<string, string> = {
    chatbot: 'chatbot',
    rag: 'RAG application',
    agent: 'agent workflow',
    multimodal: 'multimodal AI',
    fine_tuned: 'fine-tuned model deployment',
    copilot: 'AI copilot',
  };

  const gravityLabels: Record<string, string> = {
    bigquery: 'BigQuery',
    azure_data: 'Azure',
    aws_data: 'AWS',
    neutral: 'no specific',
  };

  const lines: string[] = [
    `Based on your ${workloadLabels[config.workloadType]} workload`,
  ];

  if (config.dataGravity !== 'neutral') {
    lines[0] += ` with ${gravityLabels[config.dataGravity]} data gravity`;
  }

  lines[0] += `, ${primary.platform.name} is the recommended platform with a score of ${primary.normalizedScore}/100.`;

  lines.push(
    `Key strengths include ${topReasons}. ${primary.platform.strengths[0]}.`,
  );

  if (secondary) {
    lines.push(
      `${secondary.platform.name} (score: ${secondary.normalizedScore}/100) is a strong secondary option` +
        (secondary.normalizedScore >= primary.normalizedScore - 5
          ? ' and worth evaluating in parallel.'
          : '.'),
    );
  }

  return lines.join(' ');
}

function generateGuardrails(
  config: UserConfig,
  scored: ScoredPlatform[],
): string[] {
  const guardrails: string[] = [];

  if (config.securityLevel === 'highly_regulated') {
    guardrails.push(
      'Verify that all required compliance certifications are available in your deployment region.',
    );
  }

  if (config.governanceRequirement === 'high') {
    guardrails.push(
      'Implement comprehensive AI governance framework including model cards, bias testing, and content safety policies.',
    );
  }

  const diff = scored[0].normalizedScore - scored[1].normalizedScore;
  if (diff < 5) {
    guardrails.push(
      'Scores are close — run proof-of-concept evaluations on both top platforms before making a final decision.',
    );
  }

  guardrails.push(
    'This assessment uses generalised platform capabilities. Validate specific feature availability and SLAs for your region and workload.',
  );

  return guardrails;
}

export function generateRecommendation(config: UserConfig): Recommendation {
  const scored = scoreAllPlatforms(config);
  const explanation = generateExplanation(config, scored);
  const guardrails = generateGuardrails(config, scored);

  return {
    primary: scored[0],
    secondary: scored[1],
    tertiary: scored[2],
    allScored: scored,
    explanation,
    guardrails,
  };
}

export function generateExecBrief(
  config: UserConfig,
  recommendation: Recommendation,
): string {
  const { primary, secondary, allScored } = recommendation;
  const trace = generateDecisionTrace(config, primary);
  const plan = generatePortabilityPlan(primary.platform.id);

  const workloadLabels: Record<string, string> = {
    chatbot: 'conversational AI chatbot',
    rag: 'RAG (Retrieval-Augmented Generation) application',
    agent: 'autonomous agent workflow',
    multimodal: 'multimodal AI system',
    fine_tuned: 'fine-tuned model deployment',
    copilot: 'enterprise AI copilot',
  };

  const lines = [
    '═══════════════════════════════════════════════════',
    '  AI Platform Decision — Executive Summary',
    '═══════════════════════════════════════════════════',
    '',
    `  Workload Type:         ${workloadLabels[config.workloadType]}`,
    `  Data Gravity:          ${config.dataGravity.replace(/_/g, ' ')}`,
    `  Security Level:        ${config.securityLevel.replace(/_/g, ' ')}`,
    `  Deployment Preference: ${config.deploymentPreference.replace(/_/g, ' ')}`,
    `  Governance:            ${config.governanceRequirement}`,
    '',
    '  ─────────────────────────────────────────────────',
    '',
    '  PLATFORM SCORES',
    '',
    ...allScored.map(
      (s) =>
        `    #${s.rank} ${s.platform.name.padEnd(20)} ${String(s.normalizedScore).padStart(3)}/100`,
    ),
    '',
    '  ─────────────────────────────────────────────────',
    '',
    '  RECOMMENDATION',
    '',
    `  ${primary.platform.name} is the recommended platform.`,
    '',
    `  ${recommendation.explanation}`,
    '',
    '  ─────────────────────────────────────────────────',
    '',
    '  KEY STRENGTHS',
    '',
    ...primary.platform.strengths.slice(0, 4).map((s) => `    • ${s}`),
    '',
    '  CONSIDERATIONS',
    '',
    ...primary.platform.weaknesses.map((w) => `    • ${w}`),
    '',
    '  SECONDARY OPTION',
    '',
    `    ${secondary.platform.name} (${secondary.normalizedScore}/100)`,
    ...secondary.platform.strengths.slice(0, 2).map((s) => `    • ${s}`),
    '',
    '  ─────────────────────────────────────────────────',
    '',
    '  DECISION RATIONALE',
    '',
    `    ${trace.oneLineRationale}`,
    '',
    '  Top contributors:',
    ...trace.topContributors.slice(0, 3).map(
      (c) => `    • ${c.label}: score ${c.score}/5 × weight ${c.finalWeight} = ${c.contribution.toFixed(1)} pts`,
    ),
    '',
    '  ─────────────────────────────────────────────────',
    '',
    '  PORTABILITY PLAN',
    '',
    ...plan.steps.map((s) => `    ${s.step}. ${s.title}: ${s.recommendation.split('.')[0]}.`),
    '',
    '═══════════════════════════════════════════════════',
  ];

  return lines.join('\n');
}
