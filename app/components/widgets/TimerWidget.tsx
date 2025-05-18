import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import { TimerConfig } from "../../components/TimerSetupDialog";
import { useTimer } from "../../hooks/useTimer";

interface TimerWidgetProps {
  config: TimerConfig;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TimerWidget({
  config,
  onEdit,
  onDelete,
}: TimerWidgetProps) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(0);
  const { timeLeft, progress, formattedTime } = useTimer(config);

  // Calculate container size
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const minDimension = Math.min(
        container.clientWidth,
        container.clientHeight
      );
      setContainerSize(Math.max(minDimension * 0.6, 60)); // 60px minimum
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    e.preventDefault();
    action();
  };

  return (
    <Card sx={{ height: "100%", position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          opacity: 0.7,
          "&:hover": { opacity: 1 },
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <IconButton
          size="small"
          onClick={(e) => handleButtonClick(e, onEdit)}
          sx={{ mr: 1 }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => handleButtonClick(e, onDelete)}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Box>
      <CardContent
        ref={containerRef}
        sx={{
          height: "100%",
          p: "16px !important",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {config.label && (
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              textAlign: "center",
            }}
          >
            {config.label}
          </Typography>
        )}

        <Box
          sx={{
            position: "relative",
            display: "inline-flex",
            width: containerSize,
            height: containerSize,
          }}
        >
          <CircularProgress
            variant="determinate"
            value={100}
            size={containerSize}
            thickness={4}
            sx={{
              position: "absolute",
              color:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
            }}
          />
          <CircularProgress
            variant="determinate"
            value={100 - progress}
            size={containerSize}
            thickness={4}
            sx={{
              transform: "rotate(180deg)",
              color:
                timeLeft === 0
                  ? theme.palette.success.main
                  : theme.palette.primary.main,
              transition: "color 0.3s ease",
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: `${containerSize * 0.2}px`,
                fontWeight: "bold",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {formattedTime}
            </Typography>
            {config.type === "countdown" && timeLeft > 0 && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: `${containerSize * 0.12}px`,
                  opacity: 0.7,
                  mt: 0.5,
                }}
              >
                remaining
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
