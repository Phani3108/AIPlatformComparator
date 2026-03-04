'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Stack,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import type { Recommendation } from '@/lib/platform/types';

interface Props {
  recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation }: Props) {
  const { primary, secondary, explanation, guardrails } = recommendation;

  return (
    <Card
      sx={{
        border: `2px solid ${primary.platform.color}`,
        background: `linear-gradient(135deg, ${primary.platform.color}08 0%, #ffffff 100%)`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <EmojiEventsIcon sx={{ color: '#fbbc04', fontSize: 32 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              RECOMMENDED PLATFORM
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color: primary.platform.color }}>
              {primary.platform.name}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: primary.platform.color }}>
              {primary.normalizedScore}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              /100
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.7 }}>
          {explanation}
        </Typography>

        <Stack spacing={1.5}>
          {recommendation.allScored.map((sp) => (
            <Box key={sp.platform.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" fontWeight={500}>
                  #{sp.rank} {sp.platform.name}
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: sp.platform.color }}>
                  {sp.normalizedScore}/100
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={sp.normalizedScore}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    bgcolor: sp.platform.color,
                  },
                }}
              />
            </Box>
          ))}
        </Stack>

        {guardrails.length > 0 && (
          <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {guardrails.map((g, i) => (
              <Chip
                key={i}
                label={g}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 } }}
              />
            ))}
          </Box>
        )}

        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`Secondary: ${secondary.platform.name} (${secondary.normalizedScore})`}
            size="small"
            sx={{ bgcolor: `${secondary.platform.color}15`, color: secondary.platform.color, fontWeight: 500 }}
          />
          <Chip
            label={primary.platform.vendor}
            size="small"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
