"use client";
import { Box, Toolbar, Typography, Chip } from "@mui/material";
import { useAuth } from "../context/AuthContext";

interface MainContentProps {
  drawerWidth: number;
}

export default function MainContent({ drawerWidth }: MainContentProps) {
  const { user, isDemo } = useAuth();
  console.log("Demo mode:", isDemo); // Debug log

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar />
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography variant="h4">
          Welcome {isDemo ? "Demo User" : user?.email}
        </Typography>
        {isDemo && (
          <Chip
            label="DEMO MODE"
            color="warning"
            variant="filled"
            sx={{ fontWeight: "bold" }}
          />
        )}
      </Box>
      {isDemo && (
        <Typography variant="body2" color="warning.main" mb={2}>
          You are in demo mode - no changes will be saved
        </Typography>
      )}
      <Typography variant="body1">
        Here&apos;s a quick overview of what&apos;s happening today.
      </Typography>
      {/* Add cards, charts, or widgets here */}
    </Box>
  );
}
