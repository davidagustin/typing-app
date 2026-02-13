import { useState, useRef, useCallback } from "react";

export function useTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return;
    startTimeRef.current = Date.now();
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 200);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      setElapsedMs(Date.now() - startTimeRef.current);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setElapsedMs(0);
    startTimeRef.current = 0;
  }, []);

  const seconds = elapsedMs / 1000;
  const displaySeconds = Math.floor(seconds);
  const minutes = Math.floor(displaySeconds / 60);
  const remainingSeconds = displaySeconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

  return {
    seconds,
    isRunning,
    start,
    stop,
    reset,
    formatted,
  };
}
