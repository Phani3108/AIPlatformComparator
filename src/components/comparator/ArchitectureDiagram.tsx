'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { PlatformId, WorkloadType } from '@/lib/platform/types';
import { generateArchitectureDiagram, getServiceStack } from '@/lib/platform/architecture';
import MermaidDiagram from '@/components/charts/MermaidDiagram';
import { formatLabel } from '@/lib/format';

interface Props {
  platformId: PlatformId;
  workloadType: WorkloadType;
  platformName: string;
  platformColor: string;
}

export default function ArchitectureDiagram({
  platformId,
  workloadType,
  platformName,
  platformColor,
}: Props) {
  const [copied, setCopied] = useState(false);
  const diagram = generateArchitectureDiagram(platformId, workloadType);
  const stack = getServiceStack(platformId, workloadType);

  const handleCopy = () => {
    navigator.clipboard.writeText(diagram);
    setCopied(true);
  };

  if (!diagram) return null;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6">Reference Architecture</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
              <Chip label={platformName} size="small" sx={{ bgcolor: `${platformColor}15`, color: platformColor, fontWeight: 500 }} />
              <Chip label={formatLabel(workloadType)} size="small" variant="outlined" />
            </Box>
          </Box>
          <Tooltip title="Copy Mermaid code">
            <IconButton onClick={handleCopy} size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 2,
            bgcolor: '#fafafa',
            mb: 2,
          }}
        >
          <MermaidDiagram chart={diagram} />
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Service Stack
        </Typography>
        <Table size="small">
          <TableBody>
            {Object.entries(stack).map(([key, service]) => (
              <TableRow key={key} hover>
                <TableCell sx={{ fontWeight: 500, color: 'text.secondary', width: '40%' }}>
                  {formatLabel(key)}
                </TableCell>
                <TableCell>{service}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled">
            Mermaid diagram copied to clipboard
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}
