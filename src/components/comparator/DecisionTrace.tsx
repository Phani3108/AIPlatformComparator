'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import type { DecisionTrace as DecisionTraceType } from '@/lib/platform/types';

interface Props {
  trace: DecisionTraceType;
  platformColor: string;
}

export default function DecisionTrace({ trace, platformColor }: Props) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">Decision Trace</Typography>
          <Chip
            label="Explainability"
            size="small"
            sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: '0.7rem' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          How the scoring engine arrived at the recommendation — base weights, applied modifiers, and final contributions.
        </Typography>

        <Box
          sx={{
            p: 1.5,
            mb: 2,
            borderRadius: 1,
            bgcolor: `${platformColor}08`,
            border: `1px solid ${platformColor}30`,
          }}
        >
          <Typography variant="subtitle2" sx={{ color: platformColor, mb: 0.5 }}>
            Why {trace.platformName} Won
          </Typography>
          {trace.whyBullets.map((bullet, i) => (
            <Typography key={i} variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
              {i + 1}. {bullet}
            </Typography>
          ))}
        </Box>

        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '28%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '16%' }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Dimension</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Base Wt</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Modifier</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Final Wt</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Score</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Contribution</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trace.topContributors.map((c, i) => (
                <TableRow
                  key={c.dimension}
                  sx={{ bgcolor: i === 0 ? `${platformColor}06` : undefined }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={i < 3 ? 600 : 400} sx={{ fontSize: '0.8rem' }}>
                      {c.label}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {c.baseWeight}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.8rem',
                        color: c.modifier > 0 ? '#34a853' : c.modifier < 0 ? '#ea4335' : '#5f6368',
                        fontWeight: c.modifier !== 0 ? 600 : 400,
                      }}
                    >
                      {c.modifier > 0 ? `+${c.modifier}` : c.modifier === 0 ? '—' : c.modifier}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                      {c.finalWeight}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {c.score}/5
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={c.contribution.toFixed(1)}
                      size="small"
                      sx={{
                        bgcolor: `${platformColor}15`,
                        color: platformColor,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: 22,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
          Contribution = Score × Final Weight. Top 5 dimensions shown. Modifiers are applied based on your workload, data gravity, security, deployment, and governance selections.
        </Typography>
      </CardContent>
    </Card>
  );
}
