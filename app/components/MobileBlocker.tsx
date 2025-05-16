'use client';
import { Box, Typography, Paper } from '@mui/material';
import { useEffect, useState } from 'react';

export default function MobileBlocker() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 4,
          maxWidth: 400,
          textAlign: 'center',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold" color="error">
          Mobile Access Restricted
        </Typography>
        <Typography>
          This application is designed for desktop use only. Please access it from a computer.
        </Typography>
      </Paper>
    </Box>
  );
}
