'use client';

import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Button,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import type { UserConfig, WorkloadType, DataGravity, SecurityLevel, DeploymentPreference, GovernanceRequirement } from '@/lib/platform/types';

interface Props {
  config: UserConfig;
  onChange: (config: UserConfig) => void;
  onDemo: () => void;
}

const WORKLOAD_OPTIONS: { value: WorkloadType; label: string; desc: string }[] = [
  { value: 'chatbot', label: 'Chatbot', desc: 'Conversational AI interface' },
  { value: 'rag', label: 'RAG Application', desc: 'Retrieval-Augmented Generation' },
  { value: 'agent', label: 'Agent Workflow', desc: 'Autonomous multi-step agents' },
  { value: 'multimodal', label: 'Multimodal AI', desc: 'Text, image, video, audio' },
  { value: 'fine_tuned', label: 'Fine-Tuned Model', desc: 'Custom model training & serving' },
  { value: 'copilot', label: 'AI Copilot', desc: 'In-app AI assistant' },
];

const DATA_GRAVITY_OPTIONS: { value: DataGravity; label: string }[] = [
  { value: 'bigquery', label: 'Google Cloud (BigQuery)' },
  { value: 'azure_data', label: 'Microsoft Azure' },
  { value: 'aws_data', label: 'Amazon Web Services (S3)' },
  { value: 'neutral', label: 'No strong data gravity' },
];

const SECURITY_OPTIONS: { value: SecurityLevel; label: string; desc: string }[] = [
  { value: 'standard', label: 'Standard', desc: 'Basic security controls' },
  { value: 'enterprise', label: 'Enterprise', desc: 'SOC 2, ISO 27001, private endpoints' },
  { value: 'highly_regulated', label: 'Highly Regulated', desc: 'HIPAA, FedRAMP, PCI DSS, CJIS' },
];

const DEPLOYMENT_OPTIONS: { value: DeploymentPreference; label: string }[] = [
  { value: 'fully_managed', label: 'Fully Managed' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'infrastructure_control', label: 'Infrastructure Control' },
];

const GOVERNANCE_OPTIONS: { value: GovernanceRequirement; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const DEFAULT_CONFIG: UserConfig = {
  workloadType: 'rag',
  dataGravity: 'bigquery',
  securityLevel: 'enterprise',
  deploymentPreference: 'fully_managed',
  governanceRequirement: 'medium',
};

export { DEFAULT_CONFIG };

export default function ConfigurationPanel({ config, onChange, onDemo }: Props) {
  const update = <K extends keyof UserConfig>(key: K, value: UserConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">Platform Configuration</Typography>
            <Typography variant="body2" color="text.secondary">
              Define your workload and enterprise requirements
            </Typography>
          </Box>
          <Chip label="5 Engines" color="primary" size="small" variant="outlined" />
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel>Workload Type</InputLabel>
          <Select
            value={config.workloadType}
            label="Workload Type"
            onChange={(e) => update('workloadType', e.target.value as WorkloadType)}
          >
            {WORKLOAD_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>{opt.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{opt.desc}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Data Gravity</InputLabel>
          <Select
            value={config.dataGravity}
            label="Data Gravity"
            onChange={(e) => update('dataGravity', e.target.value as DataGravity)}
          >
            {DATA_GRAVITY_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Security Level</InputLabel>
          <Select
            value={config.securityLevel}
            label="Security Level"
            onChange={(e) => update('securityLevel', e.target.value as SecurityLevel)}
          >
            {SECURITY_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>{opt.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{opt.desc}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Deployment Preference</InputLabel>
          <Select
            value={config.deploymentPreference}
            label="Deployment Preference"
            onChange={(e) => update('deploymentPreference', e.target.value as DeploymentPreference)}
          >
            {DEPLOYMENT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Governance Requirement</InputLabel>
          <Select
            value={config.governanceRequirement}
            label="Governance Requirement"
            onChange={(e) => update('governanceRequirement', e.target.value as GovernanceRequirement)}
          >
            {GOVERNANCE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={onDemo}
            fullWidth
          >
            Load Demo Scenario
          </Button>
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={() => onChange(DEFAULT_CONFIG)}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            Reset
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
