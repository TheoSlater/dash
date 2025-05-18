"use client";
import { Box, CssBaseline } from "@mui/material";
import { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import MainContent from "./components/MainContent";
import AddWidgetButton from "./components/AddWidgetButton";
import TimerSetupDialog from "./components/TimerSetupDialog";
import TimerWidget from "./components/widgets/TimerWidget";
import { useWidgets } from "./hooks/useWidgets";

const ResponsiveGridLayout = WidthProvider(Responsive);
const drawerWidth = 240;

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const {
    widgets,
    layouts,
    editingWidget,
    setEditingWidget,
    handleEditWidget,
    handleDeleteWidget,
    handleSaveWidget,
  } = useWidgets();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAddWidget = (type: string) => {
    if (type === "timer") {
      setSetupOpen(true);
    }
  };

  if (!mounted) return null;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopBar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <MainContent drawerWidth={drawerWidth} />

        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
        >
          {widgets.map((widget, index) => (
            <div key={`timer-${index}`}>
              <TimerWidget
                config={widget}
                onEdit={() => handleEditWidget(index)}
                onDelete={() => handleDeleteWidget(index)}
              />
            </div>
          ))}
        </ResponsiveGridLayout>

        <AddWidgetButton onAddWidget={handleAddWidget} />
        <TimerSetupDialog
          open={setupOpen}
          onClose={() => {
            setSetupOpen(false);
            setEditingWidget(null);
          }}
          onSave={(config) => {
            handleSaveWidget(config);
            setSetupOpen(false);
          }}
          initialConfig={editingWidget?.config}
        />
      </Box>
    </Box>
  );
}
