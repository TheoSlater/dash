"use client";
import { Box, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

interface MainContentProps {
  drawerWidth: number;
}

export default function MainContent({ drawerWidth }: MainContentProps) {
  const { user } = useAuth();

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
        <Typography variant="h4">Welcome {user?.email}</Typography>
      </Box>
      <Typography variant="body1">
        Here&apos;s a quick overview of what&apos;s happening today.
      </Typography>
    </Box>
  );
}
