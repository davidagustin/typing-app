# TypeCode

A precision typing practice application for programmers. Type syntactically correct code across 49 lessons spanning 46 languages while real-time metrics track your accuracy, speed, and improvement.

**Live Demo:** https://typing-app.app-production.workers.dev

**Repository:** https://github.com/davidagustin/typing-app

---

## Features

### Real-Time Typing Engine
- Character-by-character verification with reducer-based state machine
- Immediate visual feedback on keystroke correctness
- Support for special keys: Tab, Enter, Backspace with intelligent handling
- Keystroke statistics: WPM, accuracy rate, total/correct/incorrect count

### Built-In Code Lessons
49 professional code examples across 46 diverse language ecosystems:
- **Core Languages:** JavaScript, TypeScript, Python, Rust, Go, Java, C, C++, C#, Ruby, Swift, Kotlin, PHP, Scala, Haskell, Lua, R, Perl, Dart, Elixir, Clojure, F#, OCaml, Julia, Zig, Nim, Erlang, Groovy, Objective-C, Ada, Pascal
- **Shell Scripting:** Bash, PowerShell
- **Markup & Data:** CSS, HTML, SQL
- **Legacy & Specialized:** Assembly, COBOL, Fortran, Prolog, Scheme, MATLAB
- **Frontend Frameworks:** React (2 lessons), Angular (2 lessons), Vue (2 lessons)

### Custom Code Support
Upload or paste any code file you want to practice:
- Multi-language support with auto-detection
- File upload with drag-and-drop interface
- localStorage persistence for custom lessons across sessions
- Code normalization (line-ending standardization, trailing whitespace cleanup)
- Supports 20+ file extensions including .js, .ts, .py, .rs, .go, .java, .cpp, .rb, and more

### Smart Auto-Completion
Language-aware handling of comments and indentation:
- Leading whitespace automatically skipped (tab/space indentation)
- Inline and full-line comments auto-completed (supports //, #, --, /* */)
- Comment detection uses space-after-marker heuristic to avoid false positives on CSS custom properties (--var), HTML IDs (#selector), C pointer dereferences (*ptr), and Ruby modulo operators (%)
- Comment detection excludes C preprocessor directives, Rust attributes, and shell shebangs
- Blank lines intelligently skipped
- Transparent auto-completion highlighted in UI

### Performance Tracking
- Real-time statistics during practice sessions with precise WPM timer (200ms updates using Date.now())
- Dismissable results modal with "Review Code" button for post-session analysis
- Performance rating system based on accuracy thresholds
- Local storage persistence for session history (no backend required)

### Responsive Dark Theme
- Optimized for both desktop and mobile environments
- Monospace font rendering for accurate code display
- **Syntax Highlighting** with One Dark theme colors (keywords purple, strings green, functions blue, types yellow, operators cyan) — colors reveal per-word after typing correctly
- Custom CSS animations: blinking cursor, fade-in overlays, smooth transitions
- High contrast color scheme for long typing sessions

---

## Tech Stack

### Frontend Framework
- **React 19** with Server-Side Rendering
- **React Router 7** full-stack framework
- **TypeScript 5.9** for type safety

### Styling
- **Tailwind CSS 4** utility-first CSS framework
- Custom CSS animations and dark theme

### Build & Deployment
- **Vite 6** as build tooling and development server
- **Cloudflare Workers** for edge deployment with global low-latency
- **wrangler** CLI for serverless configuration and deployment

### Dependencies
Zero external UI libraries, state management libraries, or form libraries. Total production dependencies: 3 packages.
- react (19.0.0)
- react-dom (19.0.0)
- react-router (7.9.6)
- isbot (for SSR bot detection)

---

## Architecture

### Project Structure

```
app/
├── routes/
│   ├── home.tsx          # Landing page with lesson selection
│   ├── lessons.tsx       # Lesson browsing with search, language filter, grid/table view toggle, sort options
│   ├── custom.tsx        # Custom code upload and management with multi-file support
│   └── practice.tsx      # Main typing practice interface
├── components/
│   ├── Header.tsx        # Navigation and branding
│   ├── LessonCard.tsx    # Lesson preview and selection
│   ├── StatsBar.tsx      # Live metrics display (WPM, accuracy)
│   └── ResultsScreen.tsx # Performance summary after session
├── hooks/
│   ├── useTypingEngine.ts     # Core typing state machine
│   ├── useTimer.ts            # Elapsed time tracking
│   └── useLocalStorage.ts     # Persistent lesson storage
├── utils/
│   └── syntaxHighlight.ts     # Token-based syntax highlighting engine
├── data/
│   └── lessons.ts        # 49 built-in lessons with metadata
├── entry.server.tsx      # SSR entry point for Cloudflare Workers
├── root.tsx              # Root layout and app shell
└── app.css               # Global styles and animations
```

### Design Patterns

#### Pure Reducer-Based Typing Engine
The core typing logic is a pure reducer function (`typingReducer`) that manages immutable state transitions:

```typescript
interface TypingState {
  chars: CharState[];           // Array of character + status pairs
  currentIndex: number;         // Active character position
  isComplete: boolean;          // Completion flag
  correctKeystrokes: number;    // Accuracy metric
  incorrectKeystrokes: number;  // Error metric
  totalKeystrokes: number;      // Total input count
  hasStarted: boolean;          // Session start flag
  code: string;                 // Source code string
}

type TypingAction =
  | { type: "KEYSTROKE"; key: string }
  | { type: "RESET" };
```

Each keystroke triggers a deterministic state transition:
- Correct key → advance cursor, mark character as correct
- Incorrect key → mark character as incorrect, prevent advancement (user must backspace)
- Backspace → revert cursor, reset incorrect characters
- Enter/Tab → special handling with auto-completion of next line's indentation and comments

**Engineering benefit:** Pure reducer functions are trivial to unit test, easy to reason about, and naturally support undo/redo.

#### Language-Aware Comment Detection
The engine detects and auto-skips comments (both full-line and inline) with language-specific logic and space-after-marker heuristic to avoid false positives:

```typescript
function isComment(text: string): boolean {
  const trimmed = text.trim();
  // C-style: // (space after marker required)
  if (/^\/\/\s/.test(trimmed)) return true;
  // Block comments: /* */ or * continuation
  if (trimmed.startsWith("/*") || trimmed.startsWith("*/")) return true;
  if (/^\*\s/.test(trimmed)) return true; // Continuation line
  // Hash (Python, Ruby, Shell) - excludes #! shebangs, #[ Rust attributes, CSS #selectors
  if (trimmed.startsWith("#")) {
    if (trimmed.startsWith("#!") || trimmed.startsWith("#[")) return false;
    // Exclude C preprocessor directives
    if (/^#\s*(include|define|ifdef|ifndef|endif)/.test(trimmed)) return false;
    // Require space after # to avoid CSS selectors
    if (!/^#\s/.test(trimmed)) return false;
    return true;
  }
  // SQL / Lua / Haskell: -- (but not HTML --> or CSS custom properties)
  if (trimmed.startsWith("--")) {
    if (trimmed.startsWith("-->")) return false;
    // Require space after -- to avoid CSS custom properties (--var)
    if (!/^--\s/.test(trimmed)) return false;
    return true;
  }
  return false;
}
```

This approach handles the complexity of multiple language syntax rules while avoiding false positives on CSS custom properties (--var), HTML IDs (#selector), C pointer dereferences (*ptr), and Ruby modulo operators (%).

#### Separation of Concerns via Custom Hooks
Three focused custom hooks encapsulate distinct responsibilities:

1. **useTypingEngine** — Keystroke processing, character validation, state transitions
2. **useTimer** — Elapsed time tracking, optional time limits, tick lifecycle
3. **useLocalStorage** — Persistent storage of custom lessons, retrieval, deletion

Each hook exports a clean interface, making them easy to test independently and reuse across components.

#### SSR with Cloudflare Workers
The application uses React Router's full-stack capabilities with server-side rendering on Cloudflare Workers:
- `entry.server.tsx` — Server entry point that handles request routing and SSR
- `root.tsx` — Root layout component that establishes global HTML structure
- Isbot middleware prevents bot crawlers from unnecessarily rendering interactive content

**Benefit:** Reduced Time to First Byte (TTFB) and improved perceived performance.

#### Responsive Component Hierarchy
Components are structured with a clear parent-child flow:
- **Header** — Navigation, branding, routing
- **LessonCard** — Self-contained lesson preview with metadata
- **StatsBar** — Renders live typing metrics (WPM, accuracy %)
- **ResultsScreen** — Performance summary overlay after practice session

---

## How It Works

### Typing Engine State Machine

The typing engine implements a robust state machine that handles character-by-character input:

1. **Initialization** — Code is parsed into an array of `CharState` objects. Leading comments and whitespace are pre-marked as auto-completed.
2. **Keystroke Input** — Each keystroke dispatches an action to the reducer.
3. **Character Matching** — If the key matches the expected character, mark as `correct` and advance cursor.
4. **Error Handling** — Mismatches mark the character as `incorrect`. User must backspace to retry.
5. **Special Keys**:
   - Enter — Auto-skips the next line's indentation and any comments
   - Tab — Matches tab characters (rendered as 4 spaces)
   - Backspace — Reverts cursor and clears error states
6. **Completion** — When all characters are consumed, the session is marked complete.

### Custom Lesson Management

Custom lessons leverage browser localStorage for persistence:
- Each lesson is stored as JSON with metadata (language, fileName, code)
- A unique lesson ID is generated for routing
- Users can upload files via input or paste code directly
- Code is normalized (line endings, trailing whitespace) before storage
- Custom lessons are seamlessly accessible from the practice interface

### Real-Time Metrics

Live metrics update on every keystroke:
- **WPM** — Words per minute, calculated from total keystrokes
- **Accuracy** — Percentage of correct keystrokes
- **Progress** — Visual representation of completion percentage

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+ or compatible package manager

### Development Setup

Clone the repository:
```bash
git clone https://github.com/davidagustin/typing-app.git
cd typing-app
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

This generates an optimized build in the `dist` directory.

### Type Checking

Verify TypeScript compliance:
```bash
npm run typecheck
```

This runs the TypeScript compiler and React Router's type generation.

### Preview Production Build

Build and preview locally:
```bash
npm run preview
```

---

## Deployment

This project is deployed on **Cloudflare Workers** for global edge performance.

### Deploy to Cloudflare

Ensure you have a Cloudflare account and wrangler CLI installed:

```bash
npm run deploy
```

This command:
1. Compiles TypeScript and optimizes assets with Vite
2. Uploads the compiled bundle to Cloudflare Workers
3. Makes the application available at your configured Cloudflare Workers domain

### Environment Configuration

Configure Cloudflare via `wrangler.toml`:
```toml
name = "typing-app"
main = "dist/index.js"
compatibility_date = "2024-12-11"
```

Customize the `name`, `main`, and other fields as needed for your deployment.

---

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start local development server with hot reload |
| `npm run build` | Build for production (optimize, minify, bundle) |
| `npm run preview` | Preview production build locally |
| `npm run check` | Full type check and dry-run deployment |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm run typecheck` | TypeScript type verification |
| `npm run cf-typegen` | Generate Cloudflare and React Router types |

---

## Technical Highlights

### Zero Runtime Dependencies (UI Layer)
This project intentionally avoids third-party UI component libraries and state management frameworks. The architecture demonstrates:
- Raw React hooks for state management (useReducer, useState, useCallback)
- CSS-only animations and interactivity (no animation libraries)
- Tailwind CSS for responsive design without custom component libraries
- Deep understanding of React fundamentals and browser APIs

**Result:** Minimal bundle size, maximum code clarity, and complete control over behavior.

### Pure Functions & Immutability
The typing engine uses functional programming principles:
- Reducer function is a pure, side-effect-free computation
- State updates produce new objects rather than mutations
- Character arrays are spread and reconstructed on each keystroke
- Predictable, debuggable state transitions

### SSR with Edge Deployment
Combines modern full-stack architecture with global performance:
- Server-side rendering reduces Time to Interactive (TTI)
- Cloudflare Workers edge deployment minimizes latency globally
- Bot detection via isbot prevents unnecessary rendering for crawlers

### Language Diversity
The included 49 lessons span multiple programming paradigms across 46 languages:
- **Imperative:** JavaScript, TypeScript, Python, C, C++, C#, Go, Rust, Ruby, PHP, Perl, Bash, PowerShell
- **Functional:** Haskell, F#, OCaml, Elixir, Clojure, Scheme, Erlang, Scala
- **Object-Oriented:** Java, Kotlin, Swift, Objective-C, Groovy, Ruby, C++, C#, Scala
- **Declarative:** CSS, HTML, SQL, Prolog
- **Scientific/Numerical:** R, Julia, MATLAB, Fortran
- **Systems/Low-Level:** C, C++, Rust, Assembly, Zig, Nim, Ada, Pascal
- **Modern Frontend Frameworks:** React (2 lessons), Angular (2 lessons), Vue (2 lessons)
- **Legacy/Specialized:** COBOL, Fortran, Assembly, Prolog, Scheme, Ada, Pascal, Lua
- Provides exceptionally well-rounded practice for polyglot developers across decades of programming language evolution

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

The application uses modern CSS (CSS Grid, custom properties) and JavaScript (ES2020+). Legacy browser support is not prioritized.

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes with clear messages
4. Push to your fork and open a Pull Request

Ensure all TypeScript type checks pass and code follows the existing style.

---

## License

This project is open source and available under the MIT License. See LICENSE file for details.

---

## Contact & Attribution

**Author:** David Agustin
**Repository:** https://github.com/davidagustin/typing-app
**Live Demo:** https://typing-app.app-production.workers.dev

Built with React Router 7, Cloudflare Workers, and Tailwind CSS.
