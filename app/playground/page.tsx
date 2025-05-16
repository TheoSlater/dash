"use client";
import { useState, useEffect } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { Box } from "@mui/material";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import AddWidgetButton from "../components/AddWidgetButton";
import TimerSetupDialog, { TimerConfig } from "../components/TimerSetupDialog";
import TimerWidget from "../components/widgets/TimerWidget";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Layouts {
  [key: string]: Layout[];
}

export default function Playground() {
  const [mounted, setMounted] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<{ index: number; config: TimerConfig } | null>(null);
  const [layouts, setLayouts] = useState<Layouts>({
    lg: [],
  });
  const [widgets, setWidgets] = useState<TimerConfig[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddWidget = (type: string) => {
    if (type === "timer") {
      setSetupOpen(true);
    }
  };

  const handleEditWidget = (index: number) => {
    setEditingWidget({ index, config: widgets[index] });
    setSetupOpen(true);
  };

  const handleDeleteWidget = (index: number) => {
    setWidgets(widgets.filter((_, i) => i !== index));
    setLayouts({
      lg: layouts.lg.filter((_, i) => i !== index),
    });
  };

  const handleSaveTimer = (config: TimerConfig) => {
    if (editingWidget !== null) {
      // Update existing widget
      const newWidgets = [...widgets];
      newWidgets[editingWidget.index] = config;
      setWidgets(newWidgets);
      setEditingWidget(null);
    } else {
      // Add new widget
      const newWidgetId = `timer-${widgets.length}`;
      setWidgets([...widgets, config]);
      setLayouts({
        lg: [
          ...layouts.lg,
          {
            i: newWidgetId,
            x: (layouts.lg.length * 4) % 12,
            y: Infinity,
            w: 4,
            h: 2,
            minW: 2,
            maxW: 6,
          },
        ],
      });
    }
    setSetupOpen(false);
  };

  if (!mounted) return null;

  return (
    <Box sx={{ p: 2 }}>
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
        onSave={handleSaveTimer}
        initialConfig={editingWidget?.config}
      />
    </Box>
  );
}
