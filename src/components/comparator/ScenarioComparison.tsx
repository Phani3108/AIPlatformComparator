'use client';

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
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Chip,
  LinearProgress,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import type { ScoredPlatform, PlatformId, ScoreDimension } from '@/lib/platform/types';
import frameworkData from '@/data/enterprise_framework.json';
import { analyzeLockIn } from '@/lib/platform/lockin';

const DIMENSION_LABELS = frameworkData.dimension_labels as Record<ScoreDimension, string>;

interface Props {
  scored: ScoredPlatform[];
}

export default function ScenarioComparison({ scored }: Props) {
  const [leftId, setLeftId] = useState<PlatformId>(scored[0]?.platform.id ?? 'vertex_ai');
  const [rightId, setRightId] = useState<PlatformId>(scored[1]?.platform.id ?? 'azure_openai');

  const left = scored.find((s) => s.platform.id === leftId);
  const right = scored.find((s) => s.platform.id === rightId);

  if (!left || !right) return null;

  const dimensions = Object.keys(DIMENSION_LABELS) as ScoreDimension[];
  const leftLock = analyzeLockIn(leftId);
  const rightLock = analyzeLockIn(rightId);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CompareArrowsIcon sx={{ color: '#5f6368' }} />
          <Typography variant="h6">Platform Comparison</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Platform A</InputLabel>
            <Select
              value={leftId}
              label="Platform A"
              onChange={(e) => setLeftId(e.target.value as PlatformId)}
            >
              {scored.map((s) => (
                <MenuItem key={s.platform.id} value={s.platform.id}>
                  {s.platform.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#5f6368', fontWeight: 700 }}>
            vs
          </Box>
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Platform B</InputLabel>
            <Select
              value={rightId}
              label="Platform B"
              onChange={(e) => setRightId(e.target.value as PlatformId)}
            >
              {scored.map((s) => (
                <MenuItem key={s.platform.id} value={s.platform.id}>
                  {s.platform.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {[left, right].map((sp) => (
            <Box
              key={sp.platform.id}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 1,
                border: `1px solid ${sp.platform.color}40`,
                bgcolor: `${sp.platform.color}05`,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" fontWeight={700} sx={{ color: sp.platform.color }}>
                {sp.normalizedScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sp.platform.name}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={sp.normalizedScore}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  mt: 1,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: sp.platform.color },
                }}
              />
            </Box>
          ))}
        </Box>

        <Table size="small" sx={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '31%' }} />
            <col style={{ width: '23%' }} />
            <col style={{ width: '23%' }} />
            <col style={{ width: '23%' }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Dimension</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: left.platform.color }}>
                {left.platform.name}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: right.platform.color }}>
                {right.platform.name}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Difference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dimensions.map((dim) => {
              const lScore = left.dimensionScores[dim]?.score ?? 0;
              const rScore = right.dimensionScores[dim]?.score ?? 0;
              const diff = lScore - rScore;

              return (
                <TableRow key={dim} hover>
                  <TableCell>
                    <Typography variant="body2">{DIMENSION_LABELS[dim]}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={lScore > rScore ? 700 : 400}>
                      {lScore}/5
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={rScore > lScore ? 700 : 400}>
                      {rScore}/5
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {diff !== 0 ? (
                      <Chip
                        label={diff > 0 ? `+${diff}` : `${diff}`}
                        size="small"
                        sx={{
                          bgcolor: diff > 0 ? `${left.platform.color}15` : `${right.platform.color}15`,
                          color: diff > 0 ? left.platform.color : right.platform.color,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: left.platform.color }}>
              {left.platform.name} Strengths
            </Typography>
            {left.platform.strengths.slice(0, 3).map((s, i) => (
              <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                • {s}
              </Typography>
            ))}
            <Chip label={`Lock-in: ${leftLock.overallLevel}`} size="small" variant="outlined" sx={{ mt: 1 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: right.platform.color }}>
              {right.platform.name} Strengths
            </Typography>
            {right.platform.strengths.slice(0, 3).map((s, i) => (
              <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                • {s}
              </Typography>
            ))}
            <Chip label={`Lock-in: ${rightLock.overallLevel}`} size="small" variant="outlined" sx={{ mt: 1 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
