'use client';

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { ScoredPlatform, ScoreDimension } from '@/lib/platform/types';
import frameworkData from '@/data/enterprise_framework.json';

const DIMENSION_LABELS = frameworkData.dimension_labels as Record<ScoreDimension, string>;

interface Props {
  scored: ScoredPlatform[];
}

export default function RadarChart({ scored }: Props) {
  const dimensions = Object.keys(DIMENSION_LABELS) as ScoreDimension[];

  const data = dimensions.map((dim) => {
    const entry: Record<string, string | number> = {
      dimension: DIMENSION_LABELS[dim] ?? dim,
    };
    for (const sp of scored) {
      entry[sp.platform.name] = sp.dimensionScores[dim]?.score ?? 0;
    }
    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={380}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e0e0e0" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fontSize: 10, fill: '#5f6368' }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 5]}
          tick={{ fontSize: 9 }}
          tickCount={6}
        />
        {scored.map((sp) => (
          <Radar
            key={sp.platform.id}
            name={sp.platform.name}
            dataKey={sp.platform.name}
            stroke={sp.platform.color}
            fill={sp.platform.color}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        ))}
        <Legend
          wrapperStyle={{ fontSize: 12 }}
        />
        <Tooltip />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
