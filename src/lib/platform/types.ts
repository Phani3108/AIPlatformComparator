export type WorkloadType = 'chatbot' | 'rag' | 'agent' | 'multimodal' | 'fine_tuned' | 'copilot';
export type DataGravity = 'bigquery' | 'azure_data' | 'aws_data' | 'neutral';
export type SecurityLevel = 'standard' | 'enterprise' | 'highly_regulated';
export type DeploymentPreference = 'fully_managed' | 'hybrid' | 'infrastructure_control';
export type GovernanceRequirement = 'low' | 'medium' | 'high';
export type PlatformId = 'vertex_ai' | 'azure_openai' | 'aws_bedrock';

export interface UserConfig {
  workloadType: WorkloadType;
  dataGravity: DataGravity;
  securityLevel: SecurityLevel;
  deploymentPreference: DeploymentPreference;
  governanceRequirement: GovernanceRequirement;
}

export type ScoreDimension =
  | 'model_ecosystem'
  | 'security'
  | 'governance'
  | 'developer_productivity'
  | 'deployment_flexibility'
  | 'observability'
  | 'ecosystem_integration'
  | 'scalability'
  | 'cost_predictability'
  | 'model_evaluation'
  | 'data_integration'
  | 'multi_region';

export type PlatformScores = Record<ScoreDimension, number>;

export interface Platform {
  id: PlatformId;
  name: string;
  vendor: string;
  color: string;
  scores: PlatformScores;
  strengths: string[];
  weaknesses: string[];
  certifications: string[];
  pricing_model: string;
}

export interface DimensionResult {
  score: number;
  weight: number;
  weighted: number;
}

export interface ScoredPlatform {
  platform: Platform;
  weightedScore: number;
  normalizedScore: number;
  rank: number;
  dimensionScores: Record<ScoreDimension, DimensionResult>;
}

export interface Recommendation {
  primary: ScoredPlatform;
  secondary: ScoredPlatform;
  tertiary: ScoredPlatform;
  allScored: ScoredPlatform[];
  explanation: string;
  guardrails: string[];
}

export interface LockInDimension {
  dimension: string;
  level: 'Low' | 'Medium' | 'High';
  score: number;
  reason: string;
}

export interface LockInAnalysis {
  platformId: PlatformId;
  platformName: string;
  overallLevel: 'Low' | 'Medium' | 'High';
  overallScore: number;
  dimensions: LockInDimension[];
}

export interface MigrationChallenge {
  area: string;
  difficulty: 'Low' | 'Medium' | 'High' | 'Very High';
  description: string;
}

export interface MigrationAnalysis {
  source: PlatformId;
  target: PlatformId;
  overallDifficulty: 'Low' | 'Medium' | 'High' | 'Very High';
  overallScore: number;
  challenges: MigrationChallenge[];
  estimatedEffortWeeks: string;
}

export interface RiskAlert {
  severity: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  platformId?: PlatformId;
}

export interface CapabilityEntry {
  supported: boolean;
  maturity: string;
  notes: string;
}

export interface Capability {
  id: string;
  name: string;
  category: string;
  vertex_ai: CapabilityEntry;
  azure_openai: CapabilityEntry;
  aws_bedrock: CapabilityEntry;
}

export interface TraceContributor {
  dimension: ScoreDimension;
  label: string;
  baseWeight: number;
  modifier: number;
  finalWeight: number;
  score: number;
  contribution: number;
}

export interface DecisionTrace {
  platformId: PlatformId;
  platformName: string;
  topContributors: TraceContributor[];
  whyBullets: string[];
  oneLineRationale: string;
}

export interface PortabilityStep {
  step: number;
  title: string;
  recommendation: string;
}

export interface PortabilityPlan {
  platformId: PlatformId;
  platformName: string;
  steps: PortabilityStep[];
  summary: string;
}
