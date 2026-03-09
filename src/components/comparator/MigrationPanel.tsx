'use client';

const _provenance_ts = () => {};
void _provenance_ts();

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import type { PlatformId } from '@/lib/platform/types';
import { analyzeMigration } from '@/lib/platform/migration';
import platformsData from '@/data/platforms.json';

const platforms = platformsData.platforms as unknown as Array<{
  id: PlatformId;
  name: string;
  color: string;
}>;

function DifficultyChip({ difficulty }: { difficulty: string }) {
  const colorMap: Record<string, string> = {
    Low: '#34a853',
    Medium: '#fbbc04',
    High: '#ea4335',
    'Very High': '#b71c1c',
  };
  return (
    <Chip
      label={difficulty}
      size="small"
      sx={{
        bgcolor: `${colorMap[difficulty] ?? '#9e9e9e'}20`,
        color: colorMap[difficulty] ?? '#9e9e9e',
        fontWeight: 600,
        fontSize: '0.7rem',
      }}
    />
  );
}

export default function MigrationPanel() {
  const [source, setSource] = useState<PlatformId>('azure_openai');
  const [target, setTarget] = useState<PlatformId>('vertex_ai');

  const analysis = analyzeMigration(source, target);

  const scorePercent = (analysis.overallScore / 10) * 100;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Migration Complexity Estimator
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Estimate the effort required to migrate between platforms
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Source Platform</InputLabel>
            <Select
              value={source}
              label="Source Platform"
              onChange={(e) => setSource(e.target.value as PlatformId)}
            >
              {platforms.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <SwapHorizIcon sx={{ color: '#5f6368' }} />

          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Target Platform</InputLabel>
            <Select
              value={target}
              label="Target Platform"
              onChange={(e) => setTarget(e.target.value as PlatformId)}
            >
              {platforms.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {source !== target ? (
          <>
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: '#f8f9fa',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="subtitle2">Overall Difficulty</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <DifficultyChip difficulty={analysis.overallDifficulty} />
                  <Typography variant="body2" color="text.secondary">
                    Est. effort: {analysis.estimatedEffortWeeks} weeks
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: 120 }}>
                <LinearProgress
                  variant="determinate"
                  value={scorePercent}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      bgcolor:
                        analysis.overallScore <= 3
                          ? '#34a853'
                          : analysis.overallScore <= 5
                            ? '#fbbc04'
                            : analysis.overallScore <= 7
                              ? '#ea4335'
                              : '#b71c1c',
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                  {analysis.overallScore}/10
                </Typography>
              </Box>
            </Box>

            <Table size="small" sx={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '20%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '65%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Area</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Difficulty</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analysis.challenges.map((c, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {c.area}
                    </TableCell>
                    <TableCell>
                      <DifficultyChip difficulty={c.difficulty} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {c.description}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">Select different source and target platforms to see migration analysis.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
