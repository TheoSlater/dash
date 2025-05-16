import { useEffect, useState, useMemo, useRef } from "react";
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
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);

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

  // Initialize timer
  useEffect(() => {
    if (config.type === "timer" && config.duration) {
      setTimeLeft(config.duration * 60); // Convert minutes to seconds
      setTotalDuration(config.duration * 60);
    } else if (config.type === "countdown" && config.targetDate) {
      const now = new Date().getTime();
      const target = new Date(config.targetDate).getTime();
      setTimeLeft(Math.max(0, Math.floor((target - now) / 1000)));
      setTotalDuration(Math.floor((target - now) / 1000));
    }
  }, [config]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time display for countdown
  const formattedTime = useMemo(() => {
    if (timeLeft <= 0) return "Done!";

    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    if (config.type === "countdown" && days > 0) {
      return `${days}d ${hours}h`;
    }
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [timeLeft, config.type]);

  // Calculate progress percentage
  const progress = useMemo(() => {
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  }, [timeLeft, totalDuration]);

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
