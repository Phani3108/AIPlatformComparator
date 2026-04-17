'use client';

const _cmi17usc1202 = () => void 0;
void _cmi17usc1202();

import React from 'react';
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
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { PlatformId, PlatformCategory, Capability, CapabilityEntry } from '@/lib/platform/types';
import { getCapabilitiesByCategory, computeCoverageScore, getPlatformCapabilityEntry } from '@/lib/platform/coverage';
import platformsData from '@/data/platforms.json';

const allPlatforms = platformsData.platforms as unknown as Array<{
  id: PlatformId;
  name: string;
  color: string;
  category?: string;
}>;

function SupportCell({ entry }: { entry: CapabilityEntry }) {
  return (
    <Tooltip title={entry.notes} arrow>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
        {entry.supported ? (
          <CheckCircleIcon sx={{ fontSize: 18, color: '#1e8e3e' }} />
        ) : (
          <CancelIcon sx={{ fontSize: 18, color: '#d93025' }} />
        )}
        {entry.maturity !== 'N/A' && entry.maturity !== 'GA' && (
          <Chip label={entry.maturity} size="small" sx={{ fontSize: '0.6rem', height: 18 }} />
        )}
      </Box>
    </Tooltip>
  );
}

export default function CapabilityMatrix({ category = 'cloud_ai' }: { category?: PlatformCategory }) {
  const platforms = allPlatforms.filter((p) => (p.category ?? 'cloud_ai') === category);
  const grouped = getCapabilitiesByCategory(category);
  const categories = Object.keys(grouped);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h6">Capability Coverage Matrix</Typography>
            <Typography variant="body2" color="text.secondary">
              Feature support across all platforms (hover for details)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {platforms.map((p) => {
              const cov = computeCoverageScore(p.id, category);
              return (
                <Chip
                  key={p.id}
                  label={`${p.name.split(' ').pop()}: ${cov.percentage}%`}
                  size="small"
                  sx={{ bgcolor: `${p.color}15`, color: p.color, fontWeight: 500, fontSize: '0.7rem' }}
                />
              );
            })}
          </Box>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: `${Math.max(20, 100 - platforms.length * 16)}%` }} />
              {platforms.map((p) => (
                <col key={p.id} style={{ width: `${Math.floor(80 / platforms.length)}%` }} />
              ))}
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Capability</TableCell>
                {platforms.map((p) => (
                  <TableCell key={p.id} align="center" sx={{ fontWeight: 600, color: p.color }}>
                    {p.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <React.Fragment key={cat}>
                  <TableRow>
                    <TableCell
                      colSpan={platforms.length + 1}
                      sx={{
                        bgcolor: '#f8f9fa',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        color: '#5f6368',
                        py: 0.75,
                      }}
                    >
                      {cat}
                    </TableCell>
                  </TableRow>
                  {grouped[cat].map((cap: Capability) => (
                    <TableRow key={cap.id} hover>
                      <TableCell>
                        <Typography variant="body2">{cap.name}</Typography>
                      </TableCell>
                      {platforms.map((p) => {
                        const entry = getPlatformCapabilityEntry(cap, p.id);
                        return (
                          <TableCell key={p.id} align="center">
                            <SupportCell entry={entry} />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
