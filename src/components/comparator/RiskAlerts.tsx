'use client';

import {
  Card,
  CardContent,
  Typography,
  Alert,
  AlertTitle,
  Stack,
  Box,
  Chip,
} from '@mui/material';
import type { RiskAlert } from '@/lib/platform/types';

interface Props {
  alerts: RiskAlert[];
}

const severityOrder: Record<string, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

export default function RiskAlerts({ alerts }: Props) {
  const sorted = [...alerts].sort(
    (a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3),
  );

  const warningCount = alerts.filter((a) => a.severity === 'warning' || a.severity === 'error').length;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6">Enterprise Risk Alerts</Typography>
            <Typography variant="body2" color="text.secondary">
              Risks and considerations for your workload configuration
            </Typography>
          </Box>
          {warningCount > 0 && (
            <Chip
              label={`${warningCount} warning${warningCount > 1 ? 's' : ''}`}
              size="small"
              color="warning"
            />
          )}
        </Box>

        <Stack spacing={1.5}>
          {sorted.map((alert, i) => (
            <Alert key={i} severity={alert.severity} variant="outlined">
              <AlertTitle sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                {alert.title}
              </AlertTitle>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {alert.description}
              </Typography>
            </Alert>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
