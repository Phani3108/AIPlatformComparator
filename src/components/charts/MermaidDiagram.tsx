'use client';

import { useEffect, useState, useCallback } from 'react';
import { Box, Skeleton, Typography, Button } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

let counter = 0;

export default function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState('');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const retry = useCallback(() => {
    setSvg('');
    setReady(false);
    setError(false);
    setRetryKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const id = `mermaid-${++counter}-${Date.now()}`;
    let cancelled = false;

    import('mermaid').then(async (mod) => {
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        flowchart: { curve: 'basis', padding: 16 },
      });
      try {
        const result = await mermaid.render(id, chart);
        if (!cancelled) setSvg(result.svg);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setReady(true);
      }
    }).catch(() => {
      if (!cancelled) {
        setError(true);
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [chart, retryKey]);

  if (!ready) return <Skeleton variant="rounded" height={300} />;

  if (error || !svg) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 200,
          bgcolor: '#f8f9fa',
          borderRadius: 1,
          border: '1px dashed #dadce0',
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Diagram could not be rendered
        </Typography>
        <Button size="small" startIcon={<ReplayIcon />} onClick={retry}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        textAlign: 'center',
        overflow: 'auto',
        '& svg': { maxWidth: '100%', height: 'auto' },
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
