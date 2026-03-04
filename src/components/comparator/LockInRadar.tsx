'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from '@mui/material';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { compareAllLockIn } from '@/lib/platform/lockin';
import type { LockInAnalysis } from '@/lib/platform/types';
import platformsData from '@/data/platforms.json';

const platformColors: Record<string, string> = {};
for (const p of platformsData.platforms) {
  platformColors[p.id] = p.color;
}

function LevelChip({ level }: { level: string }) {
  const colorMap: Record<string, string> = {
    Low: '#34a853',
    Medium: '#fbbc04',
    High: '#ea4335',
  };
  return (
    <Chip
      label={level}
      size="small"
      sx={{
        bgcolor: `${colorMap[level] ?? '#9e9e9e'}20`,
        color: colorMap[level] ?? '#9e9e9e',
        fontWeight: 600,
        fontSize: '0.7rem',
      }}
    />
  );
}

export default function LockInRadar() {
  const analyses = compareAllLockIn();

  const dimensions = analyses[0].dimensions.map((d) => d.dimension);
  const radarData = dimensions.map((dim) => {
    const entry: Record<string, string | number> = { dimension: dim };
    for (const analysis of analyses) {
      const found = analysis.dimensions.find((d) => d.dimension === dim);
      entry[analysis.platformName] = found?.score ?? 0;
    }
    return entry;
  });

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6">Vendor Lock-in Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              Portability assessment across key dimensions (higher = more lock-in)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {analyses.map((a) => (
              <Chip
                key={a.platformId}
                label={`${a.platformName.split(' ').pop()}: ${a.overallLevel}`}
                size="small"
                sx={{
                  bgcolor: `${platformColors[a.platformId]}15`,
                  color: platformColors[a.platformId],
                  fontWeight: 500,
                  fontSize: '0.7rem',
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1, bgcolor: '#fafafa', mb: 2 }}>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#5f6368' }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 9 }} tickCount={6} />
              {analyses.map((a) => (
                <Radar
                  key={a.platformId}
                  name={a.platformName}
                  dataKey={a.platformName}
                  stroke={platformColors[a.platformId]}
                  fill={platformColors[a.platformId]}
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Detailed Breakdown
        </Typography>
        <Table size="small" sx={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '34%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '22%' }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Dimension</TableCell>
              {analyses.map((a) => (
                <TableCell key={a.platformId} align="center" sx={{ fontWeight: 600, color: platformColors[a.platformId] }}>
                  {a.platformName.split(' ').slice(-2).join(' ')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dimensions.map((dim, i) => (
              <TableRow key={dim} hover>
                <TableCell>
                  <Typography variant="body2">{dim}</Typography>
                </TableCell>
                {analyses.map((a) => (
                  <TableCell key={a.platformId} align="center">
                    <LevelChip level={a.dimensions[i].level} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 700 }}>Overall</TableCell>
              {analyses.map((a) => (
                <TableCell key={a.platformId} align="center">
                  <LevelChip level={a.overallLevel} />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
