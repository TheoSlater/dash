import { useState } from "react";
import { Layout } from "react-grid-layout";
import { TimerConfig } from "../components/TimerSetupDialog";

interface Layouts {
  [key: string]: Layout[];
}

export function useWidgets() {
  const [widgets, setWidgets] = useState<TimerConfig[]>([]);
  const [layouts, setLayouts] = useState<Layouts>({ lg: [] });
  const [editingWidget, setEditingWidget] = useState<{
    index: number;
    config: TimerConfig;
  } | null>(null);

  const handleEditWidget = (index: number) => {
    setEditingWidget({ index, config: widgets[index] });
  };

  const handleDeleteWidget = (index: number) => {
    setWidgets(widgets.filter((_, i) => i !== index));
    setLayouts({
      lg: layouts.lg.filter((_, i) => i !== index),
    });
  };

  const handleSaveWidget = (config: TimerConfig) => {
    if (editingWidget !== null) {
      const newWidgets = [...widgets];
      newWidgets[editingWidget.index] = config;
      setWidgets(newWidgets);
      setEditingWidget(null);
    } else {
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
  };

  return {
    widgets,
    layouts,
    editingWidget,
    setEditingWidget,
    handleEditWidget,
    handleDeleteWidget,
    handleSaveWidget,
  };
}
