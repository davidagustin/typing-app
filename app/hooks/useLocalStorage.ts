import { useCallback } from "react";

export interface LessonResult {
  lessonId: string;
  wpm: number;
  accuracy: number;
  date: string;
  timeSeconds: number;
}

export interface CustomLesson {
  id: string;
  code: string;
  language: string;
  fileName: string;
  uploadedAt: string;
}

const STORAGE_KEY = "typecode-results";
const CUSTOM_LESSONS_KEY = "typecode-custom-lessons";
const LEGACY_CUSTOM_KEY = "typecode-custom-lesson";

// ---------------------------------------------------------------------------
// Results helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Custom lessons helpers
// ---------------------------------------------------------------------------

function readCustomLessonsRaw(): CustomLesson[] {
  try {
    const raw = localStorage.getItem(CUSTOM_LESSONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CustomLesson[];
  } catch {
    return [];
  }
}

function writeCustomLessons(lessons: CustomLesson[]): void {
  try {
    localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(lessons));
  } catch {
    // silently fail
  }
}

/** Read custom lessons, migrating the legacy single-lesson key if present. */
function readCustomLessons(): CustomLesson[] {
  try {
    const legacy = localStorage.getItem(LEGACY_CUSTOM_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      const migrated: CustomLesson = {
        id: `custom-${Date.now()}`,
        code: parsed.code || "",
        language: parsed.language || "Custom",
        fileName: parsed.fileName || "custom.txt",
        uploadedAt: new Date().toISOString(),
      };
      const existing = readCustomLessonsRaw();
      existing.push(migrated);
      writeCustomLessons(existing);
      localStorage.removeItem(LEGACY_CUSTOM_KEY);
      return existing;
    }
    return readCustomLessonsRaw();
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLocalStorage() {
  // --- Results ---

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

  // --- Custom lessons ---

  const getCustomLessons = useCallback((): CustomLesson[] => {
    return readCustomLessons();
  }, []);

  const getCustomLesson = useCallback(
    (id: string): CustomLesson | null => {
      return readCustomLessons().find((l) => l.id === id) ?? null;
    },
    []
  );

  const saveCustomLesson = useCallback(
    (lesson: Omit<CustomLesson, "id" | "uploadedAt">): string => {
      const id = `custom-${Date.now()}`;
      const entry: CustomLesson = {
        ...lesson,
        id,
        uploadedAt: new Date().toISOString(),
      };
      const lessons = readCustomLessons();
      lessons.push(entry);
      writeCustomLessons(lessons);
      return id;
    },
    []
  );

  const deleteCustomLesson = useCallback((id: string): void => {
    const lessons = readCustomLessons().filter((l) => l.id !== id);
    writeCustomLessons(lessons);
  }, []);

  const deleteAllCustomLessons = useCallback((): void => {
    writeCustomLessons([]);
  }, []);

  return {
    saveResult,
    getResults,
    getBestResult,
    getRecentResults,
    getCustomLessons,
    getCustomLesson,
    saveCustomLesson,
    deleteCustomLesson,
    deleteAllCustomLessons,
  };
}
