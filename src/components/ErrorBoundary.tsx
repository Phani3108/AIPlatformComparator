'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ label?: string }>,
  State
> {
  constructor(props: React.PropsWithChildren<{ label?: string }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            bgcolor: '#fef7f7',
            borderRadius: 1,
            border: '1px dashed #d93025',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="error">
            {this.props.label ?? 'Something went wrong rendering this panel.'}
          </Typography>
          <Button
            size="small"
            startIcon={<ReplayIcon />}
            onClick={() => this.setState({ hasError: false })}
          >
            Retry
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
