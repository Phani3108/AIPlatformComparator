'use client';

import { useState, useCallback, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Fade,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import type { UserConfig } from '@/lib/platform/types';
import { generateRecommendation } from '@/lib/platform/recommendation';
import { analyzeRisks } from '@/lib/platform/risk';
import { generateDecisionTrace } from '@/lib/platform/trace';
import { generatePortabilityPlan } from '@/lib/platform/portability';
import ConfigurationPanel, { DEFAULT_CONFIG } from './ConfigurationPanel';
import RecommendationCard from './RecommendationCard';
import ScoreTable from './ScoreTable';
import ArchitectureDiagram from './ArchitectureDiagram';
import CapabilityMatrix from './CapabilityMatrix';
import LockInRadar from './LockInRadar';
import MigrationPanel from './MigrationPanel';
import RiskAlerts from './RiskAlerts';
import ScenarioComparison from './ScenarioComparison';
import ExportPanel from './ExportPanel';
import DecisionTrace from './DecisionTrace';
import PortabilityPlanPanel from './PortabilityPlanPanel';
import DataDisclosure from './DataDisclosure';
import RadarChart from '@/components/charts/RadarChart';

const DEMO_CONFIG: UserConfig = {
  workloadType: 'rag',
  dataGravity: 'bigquery',
  securityLevel: 'enterprise',
  deploymentPreference: 'fully_managed',
  governanceRequirement: 'medium',
};

export default function ComparatorPage() {
  const [config, setConfig] = useState<UserConfig>(DEFAULT_CONFIG);
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [demoHighlight, setDemoHighlight] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);

  const recommendation = generateRecommendation(config);
  const risks = analyzeRisks(config, recommendation.allScored);
  const trace = generateDecisionTrace(config, recommendation.primary);
  const portabilityPlan = generatePortabilityPlan(recommendation.primary.platform.id);

  const handleDemo = useCallback(() => {
    setConfig(DEMO_CONFIG);
    setTab(0);
    setDemoHighlight(true);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    setTimeout(() => {
      setDemoHighlight(false);
    }, 2500);

    setSnackbar({ open: true, message: 'Demo loaded — Enterprise RAG on Google Cloud' });
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#1a73e8', zIndex: 1201 }}>
        <Toolbar variant="dense">
          <Tooltip title="Home">
            <IconButton color="inherit" href="/" sx={{ mr: 1 }} size="small">
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2 }}>
              AI Platform Decision Engine
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85, display: { xs: 'none', sm: 'block' } }}>
              Enterprise-grade platform evaluation — Vertex AI vs Azure OpenAI vs AWS Bedrock
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <DataDisclosure />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ width: { xs: '100%', lg: '320px' }, flexShrink: 0 }}>
          <ConfigurationPanel config={config} onChange={setConfig} onDemo={handleDemo} />
          <Box sx={{ mt: 2 }}>
            <ExportPanel config={config} recommendation={recommendation} risks={risks} />
          </Box>
        </Box>

        <Box
          ref={resultsRef}
          sx={{
            flex: 1,
            width: { xs: '100%', lg: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <RecommendationCard recommendation={recommendation} />

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minHeight: 42 } }}
            >
              <Tab label="Score Breakdown" />
              <Tab label="Decision Trace" />
              <Tab label="Architecture" />
              <Tab label="Capabilities" />
              <Tab label="Lock-in & Portability" />
              <Tab label="Migration" />
              <Tab label="Comparison" />
              <Tab label="Risk Alerts" />
            </Tabs>
          </Box>

          {tab === 0 && (
            <Fade in timeout={demoHighlight ? 800 : 0}>
              <Box
                ref={scoreRef}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  ...(demoHighlight && {
                    outline: '2px solid #4285f4',
                    outlineOffset: 4,
                    borderRadius: 2,
                    transition: 'outline-color 2s ease',
                  }),
                }}
              >
                <ScoreTable scored={recommendation.allScored} />
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: 'white', p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Platform Radar
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Visual comparison across all evaluation dimensions
                  </Typography>
                  <RadarChart scored={recommendation.allScored} />
                </Box>
              </Box>
            </Fade>
          )}

          {tab === 1 && (
            <DecisionTrace
              trace={trace}
              platformColor={recommendation.primary.platform.color}
            />
          )}

          {tab === 2 && (
            <Fade in timeout={demoHighlight ? 800 : 0}>
              <Box
                ref={archRef}
                sx={{
                  ...(demoHighlight && {
                    outline: '2px solid #34a853',
                    outlineOffset: 4,
                    borderRadius: 2,
                    transition: 'outline-color 2s ease',
                  }),
                }}
              >
                <ArchitectureDiagram
                  platformId={recommendation.primary.platform.id}
                  workloadType={config.workloadType}
                  platformName={recommendation.primary.platform.name}
                  platformColor={recommendation.primary.platform.color}
                />
              </Box>
            </Fade>
          )}

          {tab === 3 && <CapabilityMatrix />}

          {tab === 4 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <LockInRadar />
              <PortabilityPlanPanel plan={portabilityPlan} />
            </Box>
          )}

          {tab === 5 && <MigrationPanel />}

          {tab === 6 && <ScenarioComparison scored={recommendation.allScored} />}

          {tab === 7 && (
            <Fade in timeout={demoHighlight ? 800 : 0}>
              <Box
                sx={{
                  ...(demoHighlight && {
                    outline: '2px solid #ea4335',
                    outlineOffset: 4,
                    borderRadius: 2,
                    transition: 'outline-color 2s ease',
                  }),
                }}
              >
                <RiskAlerts alerts={risks} />
              </Box>
            </Fade>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
