import { useParams, Link, useNavigate } from "react-router";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { Header } from "~/components/Header";
import { StatsBar } from "~/components/StatsBar";
import { ResultsScreen } from "~/components/ResultsScreen";
import { getLessonBySlug } from "~/data/lessons";
import { useTypingEngine } from "~/hooks/useTypingEngine";
import { useTimer } from "~/hooks/useTimer";
import { useLocalStorage } from "~/hooks/useLocalStorage";

// ---------------------------------------------------------------------------
// CodeLine - renders a single line of characters
// ---------------------------------------------------------------------------

interface CharData {
	char: string;
	status: "pending" | "correct" | "incorrect" | "active";
	autoCompleted?: boolean;
}

function CodeLine({
	lineNumber,
	chars,
	isActiveLine,
}: {
	lineNumber: number;
	chars: CharData[];
	isActiveLine: boolean;
}) {
	const lineRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isActiveLine && lineRef.current) {
			lineRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, [isActiveLine]);

	return (
		<div ref={lineRef} className="flex">
			{/* Line number */}
			<span className="mr-6 inline-block w-8 shrink-0 select-none text-right font-mono text-xs leading-[1.7em] text-[#475569]/50">
				{lineNumber}
			</span>

			{/* Characters */}
			<span className="flex-1">
				{chars.map((c, i) => {
					// Newline at end of a line: show dim return symbol
					if (c.char === "\n") {
						return (
							<span
								key={i}
								className={`char-newline ${
									c.status === "active" ? "char-active" : ""
								}`}
							/>
						);
					}

					// Tab: render as 4 spaces
					if (c.char === "\t") {
						return (
							<span
								key={i}
								className={getCharClass(c.status)}
								style={{ display: "inline-block", width: "4ch" }}
							>
								{" "}
							</span>
						);
					}

					// Regular character (including spaces)
					return (
						<span key={i} className={getCharClass(c.status)}>
							{c.char}
						</span>
					);
				})}
			</span>
		</div>
	);
}

function getCharClass(status: CharData["status"]): string {
	switch (status) {
		case "pending":
			return "char-pending";
		case "correct":
			return "char-correct";
		case "incorrect":
			return "char-incorrect";
		case "active":
			return "char-active";
	}
}

// ---------------------------------------------------------------------------
// splitCharsIntoLines - splits the flat chars array at newline boundaries
// ---------------------------------------------------------------------------

function splitCharsIntoLines(chars: CharData[]): CharData[][] {
	const lines: CharData[][] = [];
	let current: CharData[] = [];

	for (const c of chars) {
		current.push(c);
		if (c.char === "\n") {
			lines.push(current);
			current = [];
		}
	}
	// Push remaining chars (last line without trailing newline)
	if (current.length > 0) {
		lines.push(current);
	}

	return lines;
}

// ---------------------------------------------------------------------------
// Practice page
// ---------------------------------------------------------------------------

export default function Practice() {
	const { lang, project } = useParams();
	const navigate = useNavigate();
	const { saveResult } = useLocalStorage();
	const hiddenInputRef = useRef<HTMLTextAreaElement>(null);
	const codeContainerRef = useRef<HTMLDivElement>(null);
	const hasSavedRef = useRef(false);

	// Resolve lesson - from built-in data OR localStorage custom code
	const lesson = useMemo(() => {
		if (lang === "custom") {
			try {
				const raw =
					typeof window !== "undefined"
						? localStorage.getItem("typecode-custom-lesson")
						: null;
				if (raw) {
					const parsed = JSON.parse(raw);
					return {
						id: "custom-upload",
						language: parsed.language || "Custom",
						languageSlug: "custom",
						project: parsed.fileName || "Your Code",
						projectSlug: "upload",
						description: "Custom uploaded code",
						fileName: parsed.fileName || "custom.txt",
						code: parsed.code || "",
						color: "#f59e0b",
					};
				}
			} catch {
				// Invalid localStorage data
			}
			return undefined;
		}
		return lang && project ? getLessonBySlug(lang, project) : undefined;
	}, [lang, project]);

	const engine = useTypingEngine(lesson?.code ?? "");
	const timer = useTimer();

	const {
		chars,
		currentIndex,
		isComplete,
		correctKeystrokes,
		incorrectKeystrokes,
		totalKeystrokes,
		hasStarted,
		handleKeystroke,
		reset: resetEngine,
	} = engine;

	const {
		seconds,
		start: startTimer,
		stop: stopTimer,
		reset: resetTimer,
		formatted,
	} = timer;

	// Derived stats
	const wpm =
		seconds > 0 ? Math.round((correctKeystrokes / 5) / (seconds / 60)) : 0;
	const accuracy =
		totalKeystrokes > 0
			? Math.round((correctKeystrokes / totalKeystrokes) * 100)
			: 100;
	const progress =
		chars.length > 0 ? (currentIndex / chars.length) * 100 : 0;

	// Split chars into lines (memoize to avoid re-splitting on every render)
	const lines = useMemo(() => splitCharsIntoLines(chars), [chars]);

	// Find which line the active character is on
	const activeLineIndex = useMemo(() => {
		let count = 0;
		for (let i = 0; i < lines.length; i++) {
			count += lines[i].length;
			if (currentIndex < count) return i;
		}
		return lines.length - 1;
	}, [lines, currentIndex]);

	// Start timer when typing begins
	useEffect(() => {
		if (hasStarted && !timer.isRunning) {
			startTimer();
		}
	}, [hasStarted, timer.isRunning, startTimer]);

	// Stop timer and save when complete
	useEffect(() => {
		if (isComplete && timer.isRunning) {
			stopTimer();
		}
		if (isComplete && !hasSavedRef.current && lesson) {
			hasSavedRef.current = true;
			saveResult({
				lessonId: lesson.id,
				wpm,
				accuracy,
				timeSeconds: seconds,
				date: new Date().toISOString(),
			});
		}
	}, [isComplete, timer.isRunning, stopTimer, wpm, accuracy, seconds, lesson, saveResult]);

	// Keydown handler
	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			// Ignore modifier combos except Backspace
			if ((e.ctrlKey || e.altKey || e.metaKey) && e.key !== "Backspace") {
				return;
			}

			// Prevent Tab from moving focus
			if (e.key === "Tab") {
				e.preventDefault();
			}

			handleKeystroke(e.key);
		},
		[handleKeystroke]
	);

	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [onKeyDown]);

	// Keep hidden input focused for mobile
	useEffect(() => {
		const focus = () => hiddenInputRef.current?.focus();
		focus();
		document.addEventListener("click", focus);
		return () => document.removeEventListener("click", focus);
	}, []);

	// Reset handler
	const handleRestart = useCallback(() => {
		hasSavedRef.current = false;
		resetEngine();
		resetTimer();
		hiddenInputRef.current?.focus();
	}, [resetEngine, resetTimer]);

	const handleBack = useCallback(() => {
		navigate("/lessons");
	}, [navigate]);

	// 404-style not found
	if (!lesson) {
		return (
			<div className="min-h-screen">
				<Header />
				<main className="flex flex-col items-center justify-center px-6 py-24 text-center">
					<h1 className="text-4xl font-bold text-[#e2e8f0]">
						Lesson Not Found
					</h1>
					<p className="mt-4 text-[#94a3b8]">
						We couldn't find a lesson for{" "}
						<span className="font-mono text-[#f59e0b]">
							{lang}/{project}
						</span>
						.
					</p>
					<Link
						to="/lessons"
						className="mt-8 rounded-lg bg-[#f59e0b] px-6 py-2.5 text-sm font-semibold text-[#0a0a0f] hover:bg-[#d97706]"
					>
						Browse Lessons
					</Link>
					<Link
						to="/custom"
						className="mt-3 text-sm text-[#94a3b8] hover:text-[#f59e0b]"
					>
						or type your own code
					</Link>
				</main>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<Header />

			{/* Lesson info bar */}
			<div className="flex items-center gap-3 border-b border-[#1e1e2e] px-6 py-3">
				<span
					className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
					style={{
						backgroundColor: `${lesson.color}15`,
						color: lesson.color,
					}}
				>
					{lesson.language}
				</span>
				<span className="text-sm text-[#94a3b8]">{lesson.project}</span>
				<span className="text-[#1e1e2e]">/</span>
				<span className="font-mono text-xs text-[#475569]">
					{lesson.fileName}
				</span>
			</div>

			{/* Code display */}
			<div
				ref={codeContainerRef}
				className="flex-1 overflow-y-auto px-6 py-8 pb-24"
				onClick={() => hiddenInputRef.current?.focus()}
			>
				<div className="mx-auto max-w-3xl font-mono text-[15px] leading-[1.7]">
					{lines.map((lineChars, lineIdx) => (
						<CodeLine
							key={lineIdx}
							lineNumber={lineIdx + 1}
							chars={lineChars}
							isActiveLine={lineIdx === activeLineIndex}
						/>
					))}
				</div>
			</div>

			{/* Hidden input for mobile keyboard */}
			<textarea
				ref={hiddenInputRef}
				className="pointer-events-none fixed left-0 top-0 h-0 w-0 opacity-0"
				autoCapitalize="off"
				autoComplete="off"
				autoCorrect="off"
				spellCheck={false}
				tabIndex={-1}
				aria-hidden="true"
				onKeyDown={(e) => {
					// Mobile fallback - already handled by document listener
					// but prevents any default mobile behaviors
					if (e.key === "Tab") {
						e.preventDefault();
					}
				}}
			/>

			{/* Stats bar */}
			<StatsBar
				wpm={wpm}
				accuracy={accuracy}
				time={formatted}
				progress={progress}
				isActive={hasStarted && !isComplete}
			/>

			{/* Results overlay */}
			{isComplete && (
				<ResultsScreen
					wpm={wpm}
					accuracy={accuracy}
					time={formatted}
					correctChars={correctKeystrokes}
					incorrectChars={incorrectKeystrokes}
					totalChars={totalKeystrokes}
					lessonName={`${lesson.language} - ${lesson.project}`}
					onRestart={handleRestart}
					onBack={handleBack}
				/>
			)}
		</div>
	);
}
