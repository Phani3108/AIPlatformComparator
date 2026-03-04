'use client';

import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
} from '@mui/material';
import type { ScoredPlatform, ScoreDimension } from '@/lib/platform/types';
import frameworkData from '@/data/enterprise_framework.json';

const DIMENSION_LABELS = frameworkData.dimension_labels as Record<ScoreDimension, string>;

interface Props {
  scored: ScoredPlatform[];
}

function ScoreDot({ score }: { score: number }) {
  const color =
    score >= 5 ? '#1e8e3e' : score >= 4 ? '#4285f4' : score >= 3 ? '#f9ab00' : '#d93025';

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: color,
          flexShrink: 0,
        }}
      />
      <Typography variant="body2" fontWeight={500} component="span">
        {score}/5
      </Typography>
    </Box>
  );
}

export default function ScoreTable({ scored }: Props) {
  const dimensions = Object.keys(DIMENSION_LABELS) as ScoreDimension[];
  const colCount = scored.length + 1;
  const platformColWidth = `${Math.floor(66 / scored.length)}%`;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Detailed Score Breakdown
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Base scores (out of 5) across {dimensions.length} evaluation dimensions.
          The final weighted score is normalised to 0–100 using the formula:
          <Box component="span" sx={{ fontStyle: 'italic', ml: 0.5 }}>
            Σ(score × weight) / Σ(5 × weight) × 100
          </Box>
        </Typography>
        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '34%' }} />
              {scored.map((sp) => (
                <col key={sp.platform.id} style={{ width: platformColWidth }} />
              ))}
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Dimension</TableCell>
                {scored.map((sp) => (
                  <TableCell key={sp.platform.id} align="center" sx={{ fontWeight: 600 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: sp.platform.color }}>
                        {sp.platform.name}
                      </Typography>
                      <Chip
                        label={`#${sp.rank}`}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: sp.rank === 1 ? `${sp.platform.color}20` : undefined,
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dimensions.map((dim) => {
                const maxScore = Math.max(
                  ...scored.map((sp) => sp.dimensionScores[dim]?.score ?? 0),
                );
                return (
                  <TableRow key={dim} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {DIMENSION_LABELS[dim]}
                      </Typography>
                    </TableCell>
                    {scored.map((sp) => {
                      const ds = sp.dimensionScores[dim];
                      const isMax = ds?.score === maxScore && maxScore > 0;
                      return (
                        <TableCell
                          key={sp.platform.id}
                          align="center"
                          sx={{
                            bgcolor: isMax ? `${sp.platform.color}08` : undefined,
                          }}
                        >
                          <ScoreDot score={ds?.score ?? 0} />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}

              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell>
                  <Typography variant="body2" fontWeight={700}>
                    Normalised Weighted Score
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Σ(score × weight) / max possible × 100
                  </Typography>
                </TableCell>
                {scored.map((sp) => (
                  <TableCell key={sp.platform.id} align="center">
                    <Typography variant="h6" fontWeight={700} sx={{ color: sp.platform.color }}>
                      {sp.normalizedScore}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      out of 100
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
