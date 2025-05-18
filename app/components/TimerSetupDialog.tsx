import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Stack,
} from "@mui/material";
import { useState, ChangeEvent, useEffect } from "react";

interface TimerSetupDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: TimerConfig) => void;
  initialConfig?: TimerConfig;
}

export interface TimerConfig {
  type: "timer" | "countdown";
  duration?: number; // in minutes
  targetDate?: Date;
  label?: string;
}

export default function TimerSetupDialog({
  open,
  onClose,
  onSave,
  initialConfig,
}: TimerSetupDialogProps) {
  const [type, setType] = useState<"timer" | "countdown">("timer");
  const [duration, setDuration] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [label, setLabel] = useState("");

  // Initialize form with existing config when editing
  useEffect(() => {
    if (initialConfig) {
      setType(initialConfig.type);
      setLabel(initialConfig.label || "");
      if (initialConfig.type === "timer") {
        setDuration(String(initialConfig.duration || ""));
      } else if (
        initialConfig.type === "countdown" &&
        initialConfig.targetDate
      ) {
        setTargetDate(
          new Date(initialConfig.targetDate).toISOString().slice(0, 16)
        );
      }
    } else {
      // Reset form when adding new widget
      setType("timer");
      setDuration("");
      setTargetDate("");
      setLabel("");
    }
  }, [initialConfig, open]);

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value as "timer" | "countdown");
  };

  const handleSave = () => {
    const config: TimerConfig = {
      type,
      label,
    };

    if (type === "timer") {
      config.duration = Number(duration);
    } else {
      config.targetDate = new Date(targetDate);
    }

    onSave(config);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Setup Timer Widget</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <RadioGroup value={type} onChange={handleTypeChange}>
            <FormControlLabel value="timer" control={<Radio />} label="Timer" />
            <FormControlLabel
              value="countdown"
              control={<Radio />}
              label="Countdown"
            />
          </RadioGroup>

          {type === "timer" ? (
            <TextField
              label="Duration (minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              fullWidth
            />
          ) : (
            <>
              <TextField
                label="Event Label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                fullWidth
              />
              <TextField
                label="Target Date and Time"
                type="datetime-local"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Add Widget
        </Button>
      </DialogActions>
    </Dialog>
  );
}
