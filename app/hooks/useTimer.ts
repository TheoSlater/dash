import { useState, useEffect, useMemo } from "react";
import { TimerConfig } from "../components/TimerSetupDialog";

export function useTimer(config: TimerConfig) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);

  useEffect(() => {
    if (config.type === "timer" && config.duration) {
      setTimeLeft(config.duration * 60);
      setTotalDuration(config.duration * 60);
    } else if (config.type === "countdown" && config.targetDate) {
      const now = new Date().getTime();
      const target = new Date(config.targetDate).getTime();
      setTimeLeft(Math.max(0, Math.floor((target - now) / 1000)));
      setTotalDuration(Math.floor((target - now) / 1000));
    }
  }, [config]);

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

  const progress = useMemo(() => {
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  }, [timeLeft, totalDuration]);

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

  return { timeLeft, progress, formattedTime };
}
