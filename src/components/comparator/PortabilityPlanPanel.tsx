'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import type { PortabilityPlan } from '@/lib/platform/types';

interface Props {
  plan: PortabilityPlan;
}

export default function PortabilityPlanPanel({ plan }: Props) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ShieldOutlinedIcon sx={{ color: '#1a73e8' }} />
          <Typography variant="h6">Portability Plan</Typography>
          <Chip
            label={plan.platformName}
            size="small"
            variant="outlined"
            sx={{ ml: 'auto' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Actionable steps to reduce vendor lock-in and ensure migration readiness.
        </Typography>

        <Stepper orientation="vertical" activeStep={-1}>
          {plan.steps.map((step) => (
            <Step key={step.step} active expanded>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': { fontWeight: 600, fontSize: '0.9rem' },
                }}
              >
                {step.title}
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                  {step.recommendation}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2, p: 1.5, borderRadius: 1, bgcolor: '#f8f9fa' }}>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {plan.summary}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
