import { Link } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { Header } from "~/components/Header";
import { LessonCard } from "~/components/LessonCard";
import { lessons } from "~/data/lessons";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import type { CustomLesson } from "~/hooks/useLocalStorage";

const LANGUAGE_COLORS: Record<string, string> = {
	JavaScript: "#f7df1e",
	TypeScript: "#3178c6",
	Python: "#3572A5",
	Rust: "#dea584",
	Go: "#00ADD8",
	Java: "#b07219",
	C: "#555555",
	"C++": "#f34b7d",
	Ruby: "#701516",
	Swift: "#F05138",
	CSS: "#563d7c",
	Kotlin: "#A97BFF",
	PHP: "#4F5D95",
	Shell: "#89e051",
	HTML: "#e34c26",
	SQL: "#e38c00",
	Other: "#f59e0b",
};

export default function Lessons() {
	const {
		getBestResult,
		getCustomLessons,
		deleteCustomLesson,
		deleteAllCustomLessons,
	} = useLocalStorage();

	const [customLessons, setCustomLessons] = useState<CustomLesson[]>([]);

	useEffect(() => {
		setCustomLessons(getCustomLessons());
	}, [getCustomLessons]);

	const handleDelete = useCallback(
		(id: string) => {
			deleteCustomLesson(id);
			setCustomLessons((prev) => prev.filter((l) => l.id !== id));
		},
		[deleteCustomLesson],
	);

	const handleDeleteAll = useCallback(() => {
		deleteAllCustomLessons();
		setCustomLessons([]);
	}, [deleteAllCustomLessons]);

	return (
		<div className="min-h-screen">
			<Header />

			<main className="mx-auto max-w-4xl px-6 py-12">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight">
						Choose a Lesson
					</h1>
					<p className="mt-3 text-[#94a3b8]">
						Type and explore open source code patterns.
					</p>
				</div>

				<div className="mt-10 grid gap-4 sm:grid-cols-2">
					{lessons.map((lesson) => {
						const best = getBestResult(lesson.id);
						return (
							<LessonCard
								key={lesson.id}
								lesson={lesson}
								bestWpm={best?.wpm ?? null}
							/>
						);
					})}
				</div>

				{/* Custom uploads section */}
				{customLessons.length > 0 && (
					<div className="mt-10">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold text-[#e2e8f0]">
								Your Uploads
							</h2>
							<button
								type="button"
								onClick={handleDeleteAll}
								className="rounded-lg px-3 py-1.5 text-xs text-[#94a3b8] transition-colors hover:bg-[#ef4444]/10 hover:text-[#ef4444]"
							>
								Delete All
							</button>
						</div>

						<div className="mt-4 grid gap-4 sm:grid-cols-2">
							{customLessons.map((custom) => {
								const color =
									LANGUAGE_COLORS[custom.language] || "#f59e0b";
								const lineCount = custom.code.split("\n").length;
								const best = getBestResult(custom.id);
								return (
									<div
										key={custom.id}
										className="group relative rounded-lg border border-[#1e1e2e] bg-[#111118] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2a2a3e] hover:shadow-lg hover:shadow-black/20"
										style={{
											borderLeftColor: color,
											borderLeftWidth: "3px",
										}}
									>
										<Link
											to={`/practice/custom/${custom.id}`}
											className="block p-5"
										>
											<div className="flex items-start justify-between gap-3">
												<div className="flex items-center gap-2.5">
													<span
														className="text-lg font-semibold"
														style={{ color }}
													>
														{custom.language}
													</span>
													<span className="text-lg font-medium text-[#e2e8f0]">
														{custom.fileName}
													</span>
												</div>
												<div className="flex items-center gap-3 shrink-0">
													{best && (
														<span className="inline-flex items-center rounded-full bg-[#f59e0b]/10 px-2.5 py-0.5 text-xs font-medium text-[#f59e0b]">
															Best: {best.wpm} WPM
														</span>
													)}
													<span className="font-mono text-xs text-[#475569]">
														{lineCount}{" "}
														{lineCount === 1
															? "line"
															: "lines"}
													</span>
												</div>
											</div>
											<p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">
												Custom uploaded code
											</p>
											<div className="mt-3">
												<span className="inline-block rounded bg-[#16161f] px-2 py-0.5 font-mono text-xs text-[#475569]">
													{custom.fileName}
												</span>
											</div>
										</Link>

										{/* Delete button */}
										<button
											type="button"
											onClick={() => handleDelete(custom.id)}
											className="absolute right-2 top-2 rounded-md p-1.5 text-[#475569] opacity-0 transition-all hover:bg-[#ef4444]/10 hover:text-[#ef4444] group-hover:opacity-100"
											title="Delete upload"
										>
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<line
													x1="18"
													y1="6"
													x2="6"
													y2="18"
												/>
												<line
													x1="6"
													y1="6"
													x2="18"
													y2="18"
												/>
											</svg>
										</button>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* Upload your own code card */}
				<div className="mt-6">
					<Link
						to="/custom"
						className="group flex items-center justify-between rounded-xl border border-dashed border-[#1e1e2e] p-6 transition-all hover:border-[#f59e0b]/40 hover:bg-[#111118]"
					>
						<div>
							<h3 className="text-lg font-semibold text-[#e2e8f0]">
								Upload and Type Any Code
							</h3>
							<p className="mt-1 text-sm text-[#94a3b8]">
								Paste your own code or upload a file to practice
								with.
							</p>
						</div>
						<span className="text-2xl text-[#475569] transition-colors group-hover:text-[#f59e0b]">
							+
						</span>
					</Link>
				</div>
			</main>
		</div>
	);
}
