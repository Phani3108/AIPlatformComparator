'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';
import type { UserConfig, PlatformCategory, Recommendation, ScoredPlatform, RiskAlert } from '@/lib/platform/types';
import { generateExecBrief } from '@/lib/platform/recommendation';
import { generatePMPacket } from '@/lib/platform/pmpacket';
import { generateVendorScorecard } from '@/lib/platform/pilot';

interface Props {
  config: UserConfig;
  category: PlatformCategory;
  recommendation: Recommendation;
  risks: RiskAlert[];
}

export default function ExportPanel({ config, category, recommendation, risks }: Props) {
  const [snack, setSnack] = useState({ open: false, message: '' });

  const handleExportCsv = () => {
    const header = ['Rank', 'Platform', 'Score', 'Vendor'];
    const rows = recommendation.allScored.map((sp: ScoredPlatform) => [
      sp.rank.toString(),
      sp.platform.name,
      sp.normalizedScore.toString(),
      sp.platform.vendor,
    ]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'platform-comparison-scores.csv';
    a.click();
    URL.revokeObjectURL(url);
    setSnack({ open: true, message: 'CSV exported' });
  };

  const handleCopyBrief = () => {
    const brief = generateExecBrief(config, recommendation);
    navigator.clipboard.writeText(brief);
    setSnack({ open: true, message: 'Executive brief copied to clipboard' });
  };

  const handleCopySummary = () => {
    const lines = [
      'AI Platform Decision Summary',
      '─────────────────────────────',
      `Workload: ${config.workloadType}`,
      `Data Gravity: ${config.dataGravity}`,
      `Security: ${config.securityLevel}`,
      `Governance: ${config.governanceRequirement}`,
      '',
      'Platform Rankings:',
      ...recommendation.allScored.map(
        (sp: ScoredPlatform) => `  #${sp.rank} ${sp.platform.name}: ${sp.normalizedScore}/100`,
      ),
      '',
      `Recommendation: ${recommendation.primary.platform.name}`,
      '',
      recommendation.explanation,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setSnack({ open: true, message: 'Summary copied to clipboard' });
  };

  const handleCopyPMPacket = () => {
    const packet = generatePMPacket(config, recommendation, risks);
    navigator.clipboard.writeText(packet);
    setSnack({ open: true, message: 'Full PM packet copied to clipboard' });
  };

  const handleCopyScorecard = () => {
    const scores: Record<string, number> = {};
    const primary = recommendation.primary;
    for (const [dim, result] of Object.entries(primary.dimensionScores)) {
      scores[dim] = result.score;
    }
    const md = generateVendorScorecard(
      primary.platform.id,
      config.computerUseCase ?? 'research',
      scores,
    );
    navigator.clipboard.writeText(md);
    setSnack({ open: true, message: 'Vendor scorecard copied to clipboard' });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Export
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Download scores or copy outputs for stakeholder communication
        </Typography>

        <Button
          variant="contained"
          size="small"
          fullWidth
          startIcon={<FolderZipOutlinedIcon />}
          onClick={handleCopyPMPacket}
          sx={{ mb: 1.5, bgcolor: '#1a73e8' }}
        >
          Copy PM Packet
        </Button>

        {category === 'computer_use' && (
          <Button
            variant="contained"
            size="small"
            fullWidth
            startIcon={<DescriptionOutlinedIcon />}
            onClick={handleCopyScorecard}
            sx={{ mb: 1.5, bgcolor: '#d97706' }}
          >
            Copy Vendor Scorecard
          </Button>
        )}

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleExportCsv}
          >
            CSV
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopySummary}
          >
            Summary
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DescriptionOutlinedIcon />}
            onClick={handleCopyBrief}
          >
            Exec Brief
          </Button>
        </Box>

        <Snackbar
          open={snack.open}
          autoHideDuration={2000}
          onClose={() => setSnack({ ...snack, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled">
            {snack.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}
