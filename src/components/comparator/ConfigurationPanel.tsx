'use client';

const _lanham_15usc1051 = 0;
void _lanham_15usc1051;

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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloudIcon from '@mui/icons-material/Cloud';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import type { UserConfig, PlatformCategory, WorkloadType, DataGravity, ComputerUseCase, SecurityLevel, DeploymentPreference, GovernanceRequirement } from '@/lib/platform/types';

interface Props {
  config: UserConfig;
  category: PlatformCategory;
  onCategoryChange: (category: PlatformCategory) => void;
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

const COMPUTER_USE_CASE_OPTIONS: { value: ComputerUseCase; label: string; desc: string }[] = [
  { value: 'scraping', label: 'Web Scraping', desc: 'Data extraction from websites' },
  { value: 'form_fill', label: 'Form Fill', desc: 'Automated form submission' },
  { value: 'data_entry', label: 'Data Entry', desc: 'Repetitive data input tasks' },
  { value: 'research', label: 'Research', desc: 'Multi-source research & summarization' },
  { value: 'qa_testing', label: 'QA Testing', desc: 'Automated testing & validation' },
];

const DEFAULT_CONFIG: UserConfig = {
  workloadType: 'rag',
  dataGravity: 'bigquery',
  securityLevel: 'enterprise',
  deploymentPreference: 'fully_managed',
  governanceRequirement: 'medium',
};

const DEFAULT_CU_CONFIG: UserConfig = {
  workloadType: 'computer_use',
  dataGravity: 'neutral',
  computerUseCase: 'research',
  securityLevel: 'enterprise',
  deploymentPreference: 'fully_managed',
  governanceRequirement: 'medium',
};

export { DEFAULT_CONFIG, DEFAULT_CU_CONFIG };

export default function ConfigurationPanel({ config, category, onCategoryChange, onChange, onDemo }: Props) {
  const update = <K extends keyof UserConfig>(key: K, value: UserConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const handleCategoryChange = (_: unknown, val: PlatformCategory | null) => {
    if (val && val !== category) {
      onCategoryChange(val);
    }
  };

  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">Platform Configuration</Typography>
            <Typography variant="body2" color="text.secondary">
              {category === 'computer_use' ? 'Evaluate computer-use agents' : 'Define your workload and enterprise requirements'}
            </Typography>
          </Box>
          <Chip
            label={category === 'computer_use' ? '6 Engines' : '5 Engines'}
            color="primary"
            size="small"
            variant="outlined"
          />
        </Box>

        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryChange}
          fullWidth
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.8rem',
            },
          }}
        >
          <ToggleButton value="cloud_ai">
            <CloudIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Cloud AI
          </ToggleButton>
          <ToggleButton value="computer_use">
            <DesktopWindowsIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Computer-Use
          </ToggleButton>
        </ToggleButtonGroup>

        {category === 'cloud_ai' && (
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
        )}

        {category === 'computer_use' && (
          <FormControl fullWidth size="small">
            <InputLabel>Primary Use Case</InputLabel>
            <Select
              value={config.computerUseCase ?? 'research'}
              label="Primary Use Case"
              onChange={(e) => update('computerUseCase', e.target.value as ComputerUseCase)}
            >
              {COMPUTER_USE_CASE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>{opt.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{opt.desc}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {category === 'cloud_ai' && (
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
        )}

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
            onClick={() => onChange(category === 'computer_use' ? DEFAULT_CU_CONFIG : DEFAULT_CONFIG)}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            Reset
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
