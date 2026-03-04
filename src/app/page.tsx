'use client';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SecurityIcon from '@mui/icons-material/Security';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HubIcon from '@mui/icons-material/Hub';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ACCENT_TEAL = '#00bfa5';
const ACCENT_CORAL = '#ff6d00';
const DARK_BG = '#1a1a2e';
const DARK_SURFACE = '#16213e';

export default function Home() {
  const router = useRouter();

  const engines = [
    {
      icon: <AssessmentIcon />,
      color: '#4285f4',
      title: 'Platform Scoring',
      desc: '12-dimension weighted evaluation with dynamic modifiers for workload, security, governance, and data gravity.',
    },
    {
      icon: <AccountTreeOutlinedIcon />,
      color: '#1e8e3e',
      title: 'Architecture Generator',
      desc: 'Auto-generated reference architectures with Mermaid diagrams for 6 workload types across all 3 platforms.',
    },
    {
      icon: <SecurityIcon />,
      color: '#d93025',
      title: 'Vendor Lock-in Analyzer',
      desc: '7-dimension portability radar with actionable 3-step portability plans to mitigate vendor dependency.',
    },
    {
      icon: <SwapHorizIcon />,
      color: '#9334e6',
      title: 'Migration Estimator',
      desc: 'Difficulty scoring across all 6 cross-platform migration paths with per-layer challenge breakdowns.',
    },
    {
      icon: <CompareArrowsIcon />,
      color: ACCENT_TEAL,
      title: 'Capability Matrix',
      desc: '14-capability coverage comparison across RAG tooling, agent frameworks, evaluation, and governance.',
    },
  ];

  const capabilities = [
    {
      icon: <HubIcon />,
      color: '#4285f4',
      title: 'Decision Trace',
      desc: 'Full explainability — see base weights, applied modifiers, and the top contributors that drove the recommendation.',
    },
    {
      icon: <WarningAmberIcon />,
      color: ACCENT_CORAL,
      title: 'Enterprise Risk Alerts',
      desc: 'Automated detection of compliance gaps, data gravity mismatches, and deployment risks.',
    },
    {
      icon: <FileDownloadOutlinedIcon />,
      color: '#1a73e8',
      title: 'PM Output Pack',
      desc: 'One-click export of scores, architecture, risks, portability plan, and executive brief as a single markdown packet.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: DARK_BG }}>
      {/* Nav */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4285f4, #00bfa5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AssessmentIcon sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em' }}>
            AI Platform Decision Engine
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={() => router.push('/platform-comparator')}
          sx={{
            bgcolor: '#4285f4',
            borderRadius: 24,
            px: 3,
            '&:hover': { bgcolor: '#3367d6' },
          }}
        >
          Open Tool
        </Button>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          px: { xs: 3, md: 8 },
          pt: { xs: 8, md: 14 },
          pb: { xs: 8, md: 12 },
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          {['Vertex AI', 'Azure OpenAI', 'AWS Bedrock'].map((label, i) => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.7)',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </Box>
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontSize: { xs: '2.2rem', md: '3.5rem' },
            maxWidth: 800,
            mb: 3,
            lineHeight: 1.12,
          }}
        >
          Enterprise-grade platform evaluation for{' '}
          <Box component="span" sx={{ color: ACCENT_TEAL }}>
            GenAI workloads
          </Box>
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: { xs: '1rem', md: '1.2rem' },
            maxWidth: 640,
            mb: 5,
            lineHeight: 1.7,
          }}
        >
          5 evaluation engines analyse workload alignment, security posture,
          vendor lock-in, migration complexity, and capability coverage.
          Make confident, traceable platform decisions.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => router.push('/platform-comparator')}
            sx={{
              bgcolor: '#4285f4',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 28,
              '&:hover': { bgcolor: '#3367d6' },
            }}
          >
            Start Evaluation
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              document.getElementById('engines')?.scrollIntoView({ behavior: 'smooth' });
            }}
            sx={{
              color: 'rgba(255,255,255,0.8)',
              borderColor: 'rgba(255,255,255,0.2)',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              borderRadius: 28,
              '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)' },
            }}
          >
            See How It Works
          </Button>
        </Box>
      </Box>

      {/* Engines Section */}
      <Box id="engines" sx={{ bgcolor: '#f8f9fa', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            sx={{
              color: '#1a73e8',
              fontWeight: 700,
              letterSpacing: 1.5,
              mb: 1,
              display: 'block',
            }}
          >
            EVALUATION ENGINES
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, color: '#202124', letterSpacing: '-0.01em' }}
          >
            Five engines, one decision
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368', mb: 5, maxWidth: 560 }}>
            Each engine evaluates a different dimension of the platform decision.
            Together they produce a traceable, defensible recommendation.
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(5, 1fr)' },
              gap: 2.5,
            }}
          >
            {engines.map((e) => (
              <Card
                key={e.title}
                sx={{
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    bgcolor: e.color,
                    borderRadius: '12px 12px 0 0',
                  },
                }}
              >
                <CardContent sx={{ pt: 3 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      bgcolor: `${e.color}12`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      '& .MuiSvgIcon-root': { fontSize: 22, color: e.color },
                    }}
                  >
                    {e.icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.95rem' }}>
                    {e.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                    {e.desc}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Capabilities Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            sx={{
              color: ACCENT_CORAL,
              fontWeight: 700,
              letterSpacing: 1.5,
              mb: 1,
              display: 'block',
            }}
          >
            ADDITIONAL CAPABILITIES
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 5, color: '#202124' }}>
            Built for platform PM workflows
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
              gap: 3,
            }}
          >
            {capabilities.map((c) => (
              <Box
                key={c.title}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #e8eaed',
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: c.color },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    bgcolor: `${c.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    '& .MuiSvgIcon-root': { fontSize: 24, color: c.color },
                  }}
                >
                  {c.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {c.title}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                  {c.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Demo Strip */}
      <Box
        sx={{
          bgcolor: DARK_SURFACE,
          py: 6,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{ color: 'white', fontWeight: 700, mb: 1 }}
          >
            Try the demo scenario
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', mb: 3, fontSize: '0.95rem' }}>
            RAG workload + BigQuery data gravity + Enterprise security + Fully managed
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
            <Chip
              label="Vertex AI — 91"
              sx={{
                bgcolor: 'rgba(66,133,244,0.15)',
                color: '#8ab4f8',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid rgba(66,133,244,0.3)',
              }}
            />
            <Chip
              label="Azure OpenAI — 81"
              sx={{
                bgcolor: 'rgba(244,180,0,0.15)',
                color: '#fdd663',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid rgba(244,180,0,0.3)',
              }}
            />
            <Chip
              label="AWS Bedrock — 79"
              sx={{
                bgcolor: 'rgba(255,153,0,0.15)',
                color: '#ffc966',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid rgba(255,153,0,0.3)',
              }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => router.push('/platform-comparator')}
            sx={{
              bgcolor: ACCENT_TEAL,
              px: 4,
              py: 1.2,
              borderRadius: 28,
              fontWeight: 600,
              '&:hover': { bgcolor: '#00a68a' },
            }}
          >
            Launch with Demo Data
          </Button>
        </Container>
      </Box>

      {/* Suite Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: '#5f6368', letterSpacing: 1.5, fontWeight: 600 }}>
            AI INFRASTRUCTURE DECISION SUITE
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
            <Chip
              label="Tool 1: GenAI Cost Simulator"
              variant="outlined"
              sx={{ borderColor: '#dadce0' }}
            />
            <Chip
              label="Tool 2: Platform Decision Engine"
              sx={{
                bgcolor: '#e8f0fe',
                color: '#1a73e8',
                fontWeight: 600,
                border: '1px solid #4285f4',
              }}
            />
            <Chip
              label="Tool 3: Architecture Generator"
              variant="outlined"
              sx={{ borderColor: '#dadce0' }}
            />
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: DARK_BG, py: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
            Scores are heuristic. Certifications are non-exhaustive. Datasets are editable JSON for org-specific realities.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
