import { useCallback } from "react";

export interface LessonResult {
  lessonId: string;
  wpm: number;
  accuracy: number;
  date: string;
  timeSeconds: number;
}

const STORAGE_KEY = "typecode-results";

function readResults(): LessonResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as LessonResult[];
  } catch {
    return [];
  }
}

function writeResults(results: LessonResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // localStorage may be full or unavailable; silently fail
  }
}

export function useLocalStorage() {
  const saveResult = useCallback((result: LessonResult) => {
    const results = readResults();
    results.push(result);
    writeResults(results);
  }, []);

  const getResults = useCallback((): LessonResult[] => {
    return readResults();
  }, []);

  const getBestResult = useCallback(
    (lessonId: string): LessonResult | null => {
      const results = readResults();
      const matching = results.filter((r) => r.lessonId === lessonId);
      if (matching.length === 0) return null;
      return matching.reduce((best, current) =>
        current.wpm > best.wpm ? current : best
      );
    },
    []
  );

  const getRecentResults = useCallback(
    (limit: number = 10): LessonResult[] => {
      const results = readResults();
      return results
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, limit);
    },
    []
  );

  return {
    saveResult,
    getResults,
    getBestResult,
    getRecentResults,
  };
}
