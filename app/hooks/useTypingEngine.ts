import { useReducer, useCallback } from "react";

export interface CharState {
  char: string;
  status: "pending" | "correct" | "incorrect" | "active";
  autoCompleted?: boolean;
}

interface TypingState {
  chars: CharState[];
  currentIndex: number;
  isComplete: boolean;
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  totalKeystrokes: number;
  hasStarted: boolean;
  code: string;
}

type TypingAction = { type: "KEYSTROKE"; key: string } | { type: "RESET" };

// Detect if a line (content after leading whitespace) is a comment
function isCommentLine(lineContent: string): boolean {
  const trimmed = lineContent.trim();
  if (!trimmed) return false;

  // C-style single-line: //
  if (trimmed.startsWith("//")) return true;

  // Block comment markers: /* and */
  if (trimmed.startsWith("/*") || trimmed.startsWith("*/")) return true;
  // Block comment continuation: * (space) or lone *
  if (/^\*(\s|$)/.test(trimmed)) return true;

  // Hash comments (Python, Ruby, Shell) — but NOT preprocessor directives or Rust attributes
  if (trimmed.startsWith("#")) {
    if (trimmed.startsWith("#!") || trimmed.startsWith("#[")) return false;
    if (
      /^#\s*(include|define|ifdef|ifndef|endif|else|elif|pragma|undef|error|warning)\b/.test(
        trimmed,
      )
    )
      return false;
    return true;
  }

  // SQL / Lua / Haskell double-dash (but not HTML -->)
  if (trimmed.startsWith("--") && !trimmed.startsWith("-->")) return true;

  return false;
}

// Skip leading whitespace and full-line comments, marking them as auto-completed.
// Returns the index of the first non-skipped character.
function skipCommentsAndWhitespace(
  code: string,
  chars: CharState[],
  startIndex: number,
): number {
  let idx = startIndex;

  while (idx < code.length) {
    // Skip leading whitespace (spaces and tabs)
    while (
      idx < code.length &&
      (code[idx] === " " || code[idx] === "\t")
    ) {
      chars[idx] = { char: chars[idx].char, status: "correct", autoCompleted: true };
      idx++;
    }

    if (idx >= code.length) break;

    // Skip blank lines (empty or whitespace-only lines)
    if (code[idx] === "\n") {
      chars[idx] = { char: chars[idx].char, status: "correct", autoCompleted: true };
      idx++;
      continue;
    }

    // Find end of the current line
    let lineEnd = idx;
    while (lineEnd < code.length && code[lineEnd] !== "\n") lineEnd++;
    const lineContent = code.substring(idx, lineEnd);

    if (isCommentLine(lineContent)) {
      // Auto-complete comment text
      for (let i = idx; i < lineEnd; i++) {
        chars[i] = { char: chars[i].char, status: "correct", autoCompleted: true };
      }
      // Auto-complete the trailing newline
      if (lineEnd < code.length && code[lineEnd] === "\n") {
        chars[lineEnd] = { char: chars[lineEnd].char, status: "correct", autoCompleted: true };
        idx = lineEnd + 1;
      } else {
        idx = lineEnd;
        break;
      }
    } else {
      break;
    }
  }

  return idx;
}

function initializeChars(code: string): CharState[] {
  const chars: CharState[] = code.split("").map((char) => ({
    char,
    status: "pending" as const,
  }));

  // Auto-skip any leading comment lines at the start of the code
  const firstActive = skipCommentsAndWhitespace(code, chars, 0);
  if (firstActive < chars.length) {
    chars[firstActive] = { ...chars[firstActive], status: "active" };
  }

  return chars;
}

function createInitialState(code: string): TypingState {
  const chars = initializeChars(code);
  const activeIdx = chars.findIndex((c) => c.status === "active");
  return {
    chars,
    currentIndex: activeIdx >= 0 ? activeIdx : chars.length,
    isComplete: activeIdx < 0,
    correctKeystrokes: 0,
    incorrectKeystrokes: 0,
    totalKeystrokes: 0,
    hasStarted: false,
    code,
  };
}

function typingReducer(state: TypingState, action: TypingAction): TypingState {
  switch (action.type) {
    case "RESET":
      return createInitialState(state.code);

    case "KEYSTROKE": {
      const { key } = action;
      const { chars, currentIndex, code } = state;

      if (state.isComplete) return state;

      // Handle Backspace
      if (key === "Backspace") {
        const currentChar = chars[currentIndex];

        // If current char is incorrect, reset it to active
        if (currentChar && currentChar.status === "incorrect") {
          const newChars = [...chars];
          newChars[currentIndex] = { ...newChars[currentIndex], status: "active" };
          return { ...state, chars: newChars };
        }

        // If current char is active and we can go back
        if (currentChar && currentChar.status === "active" && currentIndex > 0) {
          const newChars = [...chars];
          // Set current char back to pending
          newChars[currentIndex] = { ...newChars[currentIndex], status: "pending" };

          // Find the previous non-autoCompleted character
          let prevIndex = currentIndex - 1;
          while (prevIndex > 0 && newChars[prevIndex].autoCompleted) {
            newChars[prevIndex] = {
              char: newChars[prevIndex].char,
              status: "pending",
            };
            prevIndex--;
          }

          // If prevIndex is 0 and it's autoCompleted, also clear it
          if (prevIndex >= 0 && newChars[prevIndex].autoCompleted) {
            newChars[prevIndex] = {
              char: newChars[prevIndex].char,
              status: "pending",
            };
            // We can't go back further, stay at 0
            newChars[0] = { ...newChars[0], status: "active" };
            return { ...state, chars: newChars, currentIndex: 0 };
          }

          // Set the target previous char as active
          newChars[prevIndex] = {
            char: newChars[prevIndex].char,
            status: "active",
          };
          return { ...state, chars: newChars, currentIndex: prevIndex };
        }

        // Otherwise do nothing
        return state;
      }

      // All other keys below: only proceed if not complete
      if (currentIndex >= chars.length) return state;

      const currentChar = chars[currentIndex];
      if (!currentChar) return state;

      // If current char is already incorrect, user must backspace first
      if (currentChar.status === "incorrect") {
        return state;
      }

      const hasStarted = true;

      // Handle Enter key when current char is newline
      if (key === "Enter" && currentChar.char === "\n") {
        const newChars = [...chars];
        newChars[currentIndex] = { ...newChars[currentIndex], status: "correct" };

        // Auto-skip leading whitespace + comment lines on next line(s)
        const nextIndex = skipCommentsAndWhitespace(code, newChars, currentIndex + 1);

        // Check completion
        if (nextIndex >= code.length) {
          return {
            ...state,
            chars: newChars,
            currentIndex: nextIndex,
            isComplete: true,
            correctKeystrokes: state.correctKeystrokes + 1,
            totalKeystrokes: state.totalKeystrokes + 1,
            hasStarted,
          };
        }

        // Set next non-whitespace, non-comment char as active
        newChars[nextIndex] = { ...newChars[nextIndex], status: "active" };
        return {
          ...state,
          chars: newChars,
          currentIndex: nextIndex,
          correctKeystrokes: state.correctKeystrokes + 1,
          totalKeystrokes: state.totalKeystrokes + 1,
          hasStarted,
        };
      }

      // Handle Tab key when current char is tab
      if (key === "Tab" && currentChar.char === "\t") {
        const newChars = [...chars];
        newChars[currentIndex] = { ...newChars[currentIndex], status: "correct" };
        const nextIndex = currentIndex + 1;

        if (nextIndex >= code.length) {
          return {
            ...state,
            chars: newChars,
            currentIndex: nextIndex,
            isComplete: true,
            correctKeystrokes: state.correctKeystrokes + 1,
            totalKeystrokes: state.totalKeystrokes + 1,
            hasStarted,
          };
        }

        newChars[nextIndex] = { ...newChars[nextIndex], status: "active" };
        return {
          ...state,
          chars: newChars,
          currentIndex: nextIndex,
          correctKeystrokes: state.correctKeystrokes + 1,
          totalKeystrokes: state.totalKeystrokes + 1,
          hasStarted,
        };
      }

      // Handle regular character input
      if (key.length === 1) {
        const isCorrect = key === currentChar.char;
        const newChars = [...chars];

        if (isCorrect) {
          newChars[currentIndex] = { ...newChars[currentIndex], status: "correct" };
          const nextIndex = currentIndex + 1;

          if (nextIndex >= code.length) {
            return {
              ...state,
              chars: newChars,
              currentIndex: nextIndex,
              isComplete: true,
              correctKeystrokes: state.correctKeystrokes + 1,
              totalKeystrokes: state.totalKeystrokes + 1,
              hasStarted,
            };
          }

          newChars[nextIndex] = { ...newChars[nextIndex], status: "active" };
          return {
            ...state,
            chars: newChars,
            currentIndex: nextIndex,
            correctKeystrokes: state.correctKeystrokes + 1,
            totalKeystrokes: state.totalKeystrokes + 1,
            hasStarted,
          };
        } else {
          // Incorrect: mark as incorrect but do NOT advance
          newChars[currentIndex] = { ...newChars[currentIndex], status: "incorrect" };
          return {
            ...state,
            chars: newChars,
            incorrectKeystrokes: state.incorrectKeystrokes + 1,
            totalKeystrokes: state.totalKeystrokes + 1,
            hasStarted,
          };
        }
      }

      // Ignore all other keys (Shift, Ctrl, Alt, etc.)
      return state;
    }

    default:
      return state;
  }
}

export function useTypingEngine(code: string) {
  const [state, dispatch] = useReducer(typingReducer, code, createInitialState);

  const handleKeystroke = useCallback((key: string) => {
    dispatch({ type: "KEYSTROKE", key });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    chars: state.chars,
    currentIndex: state.currentIndex,
    isComplete: state.isComplete,
    correctKeystrokes: state.correctKeystrokes,
    incorrectKeystrokes: state.incorrectKeystrokes,
    totalKeystrokes: state.totalKeystrokes,
    hasStarted: state.hasStarted,
    handleKeystroke,
    reset,
  };
}
