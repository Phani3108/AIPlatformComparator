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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SecurityIcon from '@mui/icons-material/Security';
import ReplayIcon from '@mui/icons-material/Replay';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import type { PilotPlan } from '@/lib/platform/types';

interface Props {
  plan: PilotPlan;
}

export default function PilotPlanPanel({ plan }: Props) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <RocketLaunchIcon sx={{ color: '#d97706' }} />
          <Typography variant="h6">Pilot Plan</Typography>
          <Chip
            label={plan.platformName}
            size="small"
            sx={{ fontWeight: 600, bgcolor: '#d9770615', color: '#d97706' }}
          />
          <Chip
            label="7 Weeks"
            size="small"
            variant="outlined"
            sx={{ ml: 'auto' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Structured pilot plan from security review through go/no-go decision
        </Typography>

        <Stepper orientation="vertical" sx={{ mb: 3 }}>
          {plan.phases.map((phase) => (
            <Step key={phase.phase} active expanded>
              <StepLabel
                StepIconProps={{
                  sx: { color: '#d97706', '&.Mui-active': { color: '#d97706' } },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {phase.title}
                  </Typography>
                  <Chip label={phase.duration} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                </Box>
              </StepLabel>
              <StepContent>
                <List dense disablePadding>
                  {phase.tasks.map((task, i) => (
                    <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <TaskAltIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={task}
                        primaryTypographyProps={{ variant: 'body2', fontSize: '0.8rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#1e8e3e' }} />
              <Typography variant="subtitle2" fontWeight={600}>
                Success Metrics
              </Typography>
            </Box>
            <List dense disablePadding>
              {plan.successMetrics.map((m, i) => (
                <ListItem key={i} disableGutters sx={{ py: 0.15 }}>
                  <ListItemText
                    primary={m}
                    primaryTypographyProps={{ variant: 'body2', fontSize: '0.78rem' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <SecurityIcon sx={{ fontSize: 18, color: '#d93025' }} />
              <Typography variant="subtitle2" fontWeight={600}>
                Security Checklist
              </Typography>
            </Box>
            <List dense disablePadding>
              {plan.securityChecklist.map((c, i) => (
                <ListItem key={i} disableGutters sx={{ py: 0.15 }}>
                  <ListItemText
                    primary={c}
                    primaryTypographyProps={{ variant: 'body2', fontSize: '0.78rem' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <ReplayIcon sx={{ fontSize: 18, color: '#f9ab00' }} />
          <Typography variant="subtitle2" fontWeight={600}>
            Rollback Plan
          </Typography>
        </Box>
        <Alert severity="warning" variant="outlined" sx={{ fontSize: '0.8rem' }}>
          {plan.rollbackPlan}
        </Alert>
      </CardContent>
    </Card>
  );
}
