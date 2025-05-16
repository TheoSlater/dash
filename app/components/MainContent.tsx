"use client";
import { Box, Toolbar, Typography } from "@mui/material";
import { supabase } from "../utils/supabase";

interface MainContentProps {
  drawerWidth: number;
}
const {
  data: { user },
} = await supabase.auth.getUser();
export default function MainContent({ drawerWidth }: MainContentProps) {
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
      <Typography variant="h4" gutterBottom>
        Welcome Back {user?.email}
      </Typography>
      <Typography variant="body1">
        Here&apos;s a quick overview of what&apos;s happening today.
      </Typography>
      {/* Add cards, charts, or widgets here */}w
    </Box>
  );
}
