import type { PlatformId, PilotPlan, PilotPlanStep, ComputerUseCase } from './types';
import platformsData from '@/data/platforms.json';

const platformNames: Record<string, string> = {};
for (const p of platformsData.platforms) {
  platformNames[p.id] = p.name;
}

const CASE_LABELS: Record<ComputerUseCase, string> = {
  scraping: 'Web Scraping',
  form_fill: 'Form Fill',
  data_entry: 'Data Entry',
  research: 'Research & Summarization',
  qa_testing: 'QA Testing',
};

const CASE_TASKS: Record<ComputerUseCase, string[]> = {
  scraping: [
    'Define target URLs and data schema',
    'Set up sandbox browser with network restrictions',
    'Build extraction pipeline with retry logic',
    'Validate output quality against manual baseline',
  ],
  form_fill: [
    'Map form fields and expected input types',
    'Create test forms with known-good data',
    'Implement input validation and error recovery',
    'Measure accuracy across 100+ form submissions',
  ],
  data_entry: [
    'Define source-to-destination field mapping',
    'Set up staging environment with sample datasets',
    'Implement idempotent entry with duplicate detection',
    'Run parallel human/agent entry for accuracy comparison',
  ],
  research: [
    'Define research questions and source constraints',
    'Configure multi-tab browsing with source verification',
    'Build summarization pipeline with citation tracking',
    'Evaluate summary quality with domain expert review',
  ],
  qa_testing: [
    'Define test scenarios and expected outcomes',
    'Set up reproducible test environments',
    'Implement visual regression detection',
    'Track test flakiness rate over 50+ runs',
  ],
};

export function generatePilotPlan(
  platformId: PlatformId,
  useCase: ComputerUseCase = 'research',
): PilotPlan {
  const platformName = platformNames[platformId] ?? platformId;
  const caseLabel = CASE_LABELS[useCase];
  const caseTasks = CASE_TASKS[useCase];

  const phases: PilotPlanStep[] = [
    {
      phase: '0',
      title: 'Security & Compliance Review',
      duration: 'Week 1',
      tasks: [
        `Complete IT security review for ${platformName}`,
        'Define data access boundaries — what the agent can and cannot see',
        'Set up sandboxed environment with network egress controls',
        'Configure audit logging for all agent actions',
        'Obtain sign-off from InfoSec and Compliance teams',
      ],
    },
    {
      phase: '1',
      title: `${caseLabel} — Proof of Concept`,
      duration: 'Weeks 2–3',
      tasks: [
        `Deploy ${platformName} in sandbox for ${caseLabel.toLowerCase()} use case`,
        ...caseTasks,
        'Document failure modes and edge cases',
      ],
    },
    {
      phase: '2',
      title: 'Reliability & Cost Benchmarking',
      duration: 'Weeks 4–5',
      tasks: [
        'Run 200+ task executions across varying complexity levels',
        'Measure completion rate, average step count, and failure rate',
        'Calculate cost per completed task (compute + API + tokens)',
        'Compare per-task cost against current manual process cost',
        'Establish reliability SLA targets (e.g. >95% success rate)',
      ],
    },
    {
      phase: '3',
      title: 'Human-in-Loop & Guardrails',
      duration: 'Week 6',
      tasks: [
        'Define human approval checkpoints for sensitive actions',
        'Implement kill-switch and session timeout controls',
        'Test escalation flow when agent encounters unknown state',
        'Validate that agent respects data boundary constraints',
        'Conduct red-team exercise — intentional adversarial inputs',
      ],
    },
    {
      phase: '4',
      title: 'Stakeholder Review & Go/No-Go',
      duration: 'Week 7',
      tasks: [
        'Compile vendor scorecard with all collected metrics',
        'Present cost-benefit analysis to leadership',
        'Document operational runbook for production deployment',
        'Define scale-up criteria and next use cases',
        'Make go/no-go decision with documented rationale',
      ],
    },
  ];

  const successMetrics = [
    'Task completion rate ≥ 95% on target use case',
    'Cost per completed task ≤ 80% of manual process cost',
    'Zero security incidents during pilot period',
    'Mean steps-to-completion within 2× of optimal path',
    `Agent handles ≥ 90% of ${caseLabel.toLowerCase()} scenarios without human intervention`,
    'Audit log coverage: 100% of agent actions recorded',
    'Stakeholder satisfaction survey ≥ 4/5',
  ];

  const securityChecklist = [
    'Agent runs in network-isolated sandbox',
    'No access to production credentials or secrets',
    'All browser sessions recorded and auditable',
    'Data exfiltration prevention controls active',
    'Session auto-terminates after configurable timeout',
    'Role-based access control for agent management',
    'Incident response plan documented and tested',
  ];

  const rollbackPlan =
    `If the pilot fails to meet success metrics by Week 7: ` +
    `(1) Disable ${platformName} agent access immediately, ` +
    `(2) Export all collected data and audit logs, ` +
    `(3) Revert affected workflows to manual process, ` +
    `(4) Conduct post-mortem with engineering and security teams, ` +
    `(5) Evaluate alternative platforms or revised use case scope.`;

  return {
    platformId,
    platformName,
    phases,
    successMetrics,
    securityChecklist,
    rollbackPlan,
  };
}

export function generateVendorScorecard(
  platformId: PlatformId,
  useCase: ComputerUseCase = 'research',
  scores: Record<string, number>,
): string {
  const platformName = platformNames[platformId] ?? platformId;
  const caseLabel = CASE_LABELS[useCase];
  const dims = [
    'task_coverage',
    'reliability_at_n_steps',
    'cost_per_task',
    'security_posture',
    'human_in_loop',
    'it_approvability',
  ];
  const dimLabels: Record<string, string> = {
    task_coverage: 'Task Coverage',
    reliability_at_n_steps: 'Reliability at N Steps',
    cost_per_task: 'Cost per Task',
    security_posture: 'Security Posture',
    human_in_loop: 'Human-in-Loop Gates',
    it_approvability: 'IT Approvability',
  };

  const lines = [
    '# Vendor Scorecard',
    '',
    `**Platform:** ${platformName}`,
    `**Use Case:** ${caseLabel}`,
    `**Generated:** ${new Date().toISOString().split('T')[0]}`,
    '',
    '## Dimension Scores',
    '',
    '| Dimension | Score | Rating |',
    '|-----------|-------|--------|',
  ];

  for (const dim of dims) {
    const s = scores[dim] ?? 0;
    const rating = s >= 4 ? '🟢 Strong' : s >= 3 ? '🟡 Adequate' : '🔴 Weak';
    lines.push(`| ${dimLabels[dim] ?? dim} | ${s.toFixed(1)}/5 | ${rating} |`);
  }

  const avg = dims.reduce((sum, d) => sum + (scores[d] ?? 0), 0) / dims.length;
  lines.push('', `**Overall Score: ${avg.toFixed(1)}/5**`);

  const verdict =
    avg >= 4
      ? 'RECOMMEND — Proceed to production pilot'
      : avg >= 3
        ? 'CONDITIONAL — Address weak dimensions before scaling'
        : 'NOT RECOMMENDED — Significant gaps require resolution';

  lines.push('', `**Verdict:** ${verdict}`);

  lines.push(
    '',
    '## Recommended Next Steps',
    '',
    avg >= 4
      ? '1. Proceed with 4-week production pilot on primary use case\n2. Establish monitoring dashboards for cost and reliability\n3. Define scale-up criteria for additional use cases'
      : avg >= 3
        ? '1. Address weak-scoring dimensions (score < 3.0)\n2. Extend sandbox pilot by 2 weeks with targeted improvements\n3. Re-evaluate scorecard before production decision'
        : '1. Evaluate alternative platforms for this use case\n2. Consider narrower scope or different use case\n3. Document gaps for vendor feedback',
  );

  return lines.join('\n');
}
