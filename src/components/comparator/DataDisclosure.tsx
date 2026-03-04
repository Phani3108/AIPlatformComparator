'use client';

import { useState } from 'react';
import {
  Drawer,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TuneIcon from '@mui/icons-material/Tune';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import platformsMeta from '@/data/platforms.json';
import weightsMeta from '@/data/scoring_weights.json';

const pMeta = (platformsMeta as Record<string, unknown>).meta as {
  version: string;
  updatedAt: string;
  methodology: string;
  disclaimer: string;
};
const wMeta = (weightsMeta as Record<string, unknown>).meta as {
  version: string;
  updatedAt: string;
  methodology: string;
  disclaimer: string;
};

export default function DataDisclosure() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="small"
        startIcon={<InfoOutlinedIcon />}
        onClick={() => setOpen(true)}
        sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem' }}
      >
        Data Sources
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 3 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Data Source Disclosure
          </Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List disablePadding>
          <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
              <TuneIcon sx={{ color: '#1a73e8' }} />
            </ListItemIcon>
            <ListItemText
              primary="Scoring is Heuristic"
              secondary="Platform scores are based on generalised capability assessments, not benchmarks. They reflect relative strengths across dimensions and are designed to be directionally correct, not definitive."
              primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
              secondaryTypographyProps={{ fontSize: '0.8rem', lineHeight: 1.6 }}
            />
          </ListItem>

          <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
              <VerifiedOutlinedIcon sx={{ color: '#34a853' }} />
            </ListItemIcon>
            <ListItemText
              primary="Certifications are Indicative"
              secondary="Compliance certifications listed are non-exhaustive and may vary by region, service, and deployment configuration. Always verify with the cloud provider's compliance documentation for your specific use case."
              primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
              secondaryTypographyProps={{ fontSize: '0.8rem', lineHeight: 1.6 }}
            />
          </ListItem>

          <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
              <EditNoteIcon sx={{ color: '#fbbc04' }} />
            </ListItemIcon>
            <ListItemText
              primary="Datasets are Editable"
              secondary="All scoring data, weights, and capability matrices are stored in JSON files (src/data/) and are fully configurable. Update them to match your organisation's specific procurement facts, internal evaluations, or vendor negotiations."
              primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
              secondaryTypographyProps={{ fontSize: '0.8rem', lineHeight: 1.6 }}
            />
          </ListItem>

          <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
              <DataObjectIcon sx={{ color: '#9334e6' }} />
            </ListItemIcon>
            <ListItemText
              primary="Weight Modifiers are Transparent"
              secondary='The scoring engine applies modifiers based on your inputs (workload type, data gravity, security level, etc.). Use the "Decision Trace" tab to see exactly how weights were adjusted for your configuration.'
              primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
              secondaryTypographyProps={{ fontSize: '0.8rem', lineHeight: 1.6 }}
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Dataset Versions
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            label={`platforms.json v${pMeta.version}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
          <Chip
            label={`scoring_weights.json v${wMeta.version}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: '#f8f9fa' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              <strong>platforms.json</strong> — Updated {pMeta.updatedAt}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {pMeta.methodology}
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: '#f8f9fa' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              <strong>scoring_weights.json</strong> — Updated {wMeta.updatedAt}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {wMeta.methodology}
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
