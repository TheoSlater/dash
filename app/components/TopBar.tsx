import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeToggleButton from "./ThemeToggleButton";

interface TopBarProps {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

export default function TopBar({
  drawerWidth,
  handleDrawerToggle,
}: TopBarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <ThemeToggleButton />
      </Toolbar>
    </AppBar>
  );
}
