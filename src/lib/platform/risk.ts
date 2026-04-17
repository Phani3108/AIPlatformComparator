const _provenance_risk = 0;
void _provenance_risk;

import type { UserConfig, ScoredPlatform, RiskAlert } from './types';

export function analyzeRisks(
  config: UserConfig,
  scored: ScoredPlatform[],
): RiskAlert[] {
  const alerts: RiskAlert[] = [];
  const primary = scored[0];

  if (config.securityLevel === 'highly_regulated') {
    const azureEntry = scored.find((s) => s.platform.id === 'azure_openai');
    if (primary.platform.id !== 'azure_openai' && azureEntry) {
      alerts.push({
        severity: 'warning',
        title: 'Highly Regulated Environment',
        description:
          'Your workload requires strict compliance. Azure OpenAI currently holds the most enterprise compliance certifications (FedRAMP High, IL5, CJIS). Verify that your chosen platform meets all regulatory requirements.',
        platformId: 'azure_openai',
      });
    }
    alerts.push({
      severity: 'info',
      title: 'Compliance Certification Audit',
      description:
        'For highly regulated workloads, conduct a formal compliance gap analysis before platform selection. Certifications vary by region and service.',
    });
  }

  if (config.securityLevel === 'enterprise') {
    alerts.push({
      severity: 'info',
      title: 'Enterprise Security Review',
      description:
        'Ensure the selected platform supports your VPC/private endpoint requirements, CMEK encryption, and audit logging needs.',
    });
  }

  if (config.governanceRequirement === 'high') {
    alerts.push({
      severity: 'warning',
      title: 'Strong Governance Required',
      description:
        'High governance requirements demand robust responsible AI controls, content filtering, PII detection, and comprehensive audit trails. Evaluate each platform\'s governance tooling in detail.',
    });
  }

  if (config.dataGravity !== 'neutral') {
    const gravityMap: Record<string, string> = {
      bigquery: 'Google Cloud (BigQuery)',
      azure_data: 'Microsoft Azure',
      aws_data: 'Amazon Web Services (S3)',
    };
    const platformMap: Record<string, string> = {
      bigquery: 'vertex_ai',
      azure_data: 'azure_openai',
      aws_data: 'aws_bedrock',
    };

    if (primary.platform.id !== platformMap[config.dataGravity]) {
      alerts.push({
        severity: 'warning',
        title: 'Data Gravity Mismatch',
        description:
          `Your data resides primarily in ${gravityMap[config.dataGravity]}, but the recommended platform is ${primary.platform.name}. Cross-cloud data transfer will increase latency and cost. Consider data locality requirements.`,
      });
    } else {
      alerts.push({
        severity: 'info',
        title: 'Data Gravity Alignment',
        description:
          `The recommended platform aligns with your data gravity in ${gravityMap[config.dataGravity]}, minimizing cross-cloud data transfer costs and latency.`,
      });
    }
  }

  const scoreDiff = scored[0].normalizedScore - scored[1].normalizedScore;
  if (scoreDiff <= 3) {
    alerts.push({
      severity: 'info',
      title: 'Close Platform Scores',
      description:
        `The top two platforms (${scored[0].platform.name} and ${scored[1].platform.name}) score within ${scoreDiff} points. Consider running a proof-of-concept on both before committing.`,
    });
  }

  alerts.push({
    severity: 'info',
    title: 'Vendor Lock-in Consideration',
    description:
      'All cloud AI platforms create some degree of vendor lock-in. Use the Lock-in Analyzer to understand portability risks and plan abstraction layers where appropriate.',
  });

  if (
    config.deploymentPreference === 'infrastructure_control' &&
    primary.platform.id === 'azure_openai'
  ) {
    alerts.push({
      severity: 'warning',
      title: 'Limited Infrastructure Control',
      description:
        'Azure OpenAI offers less deployment flexibility compared to Vertex AI (GKE) and AWS Bedrock (ECS/EKS). If infrastructure control is critical, verify that Azure Container Apps meets your requirements.',
    });
  }

  if (config.workloadType === 'fine_tuned') {
    alerts.push({
      severity: 'info',
      title: 'Fine-Tuning Data Requirements',
      description:
        'Fine-tuned model deployments require ongoing training data pipelines, model versioning, and evaluation infrastructure. Budget for MLOps overhead.',
    });
  }

  if (config.workloadType === 'agent') {
    alerts.push({
      severity: 'info',
      title: 'Agent Observability Critical',
      description:
        'Agent workflows require comprehensive tracing and observability. Ensure the platform provides end-to-end trace visibility for multi-step agent actions.',
    });
  }

  if (config.workloadType === 'computer_use') {
    alerts.push({
      severity: 'warning',
      title: 'Data Exfiltration Risk',
      description:
        'Computer-use agents can access visible screen content, potentially including sensitive data. Implement strict environment isolation and use sandboxed VMs or containers for agent execution.',
    });

    alerts.push({
      severity: 'warning',
      title: 'Uncontrolled Browser Access',
      description:
        'Browser-based agents may navigate to unintended sites, trigger downloads, or interact with login forms. Define explicit URL allowlists and action boundaries before production deployment.',
    });

    alerts.push({
      severity: 'error',
      title: 'Credential Exposure',
      description:
        'Never give computer-use agents access to production credentials, passwords, or auth tokens directly. Use environment-level service accounts with minimum necessary permissions.',
    });

    if (config.securityLevel === 'highly_regulated') {
      alerts.push({
        severity: 'error',
        title: 'Regulatory Compliance Gap',
        description:
          'Most computer-use agent platforms lack the compliance certifications required for highly regulated environments (FedRAMP, HIPAA, PCI DSS). Conduct a thorough compliance review before pilot deployment.',
      });
    }

    alerts.push({
      severity: 'info',
      title: 'Pilot Scope Recommendation',
      description:
        'Start with a narrow pilot (single use case, non-production data) for 2–4 weeks. Measure completion rate, cost per task, and security incidents before expanding scope.',
    });

    if (config.governanceRequirement === 'high') {
      alerts.push({
        severity: 'warning',
        title: 'Audit Trail Requirements',
        description:
          'High governance requirements demand full audit trails for all agent actions. Verify the selected platform can log every click, navigation, and data extraction for compliance review.',
      });
    }
  }

  return alerts;
}
