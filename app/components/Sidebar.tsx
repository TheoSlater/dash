import Link from "next/link";
import {
  Drawer,
  Box,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { supabase } from "../utils/supabase";

const handleLogout = async () => {
  if (localStorage.getItem("demoMode") === "true") {
    localStorage.removeItem("demoMode");
    window.location.href = "/login";
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
  }
};

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function Sidebar({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
}: SidebarProps) {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, href: "/" },
    { text: "Settings", icon: <SettingsIcon />, href: "/settings" },
  ];

  const drawer = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div>
        <Toolbar>
          <Typography variant="h6" noWrap>
            My Dashboard
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <Link
              key={item.text}
              href={item.href}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </div>

      <div style={{ marginTop: "auto" }}>
        <Divider />
        <List>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </div>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="sidebar navigation"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
