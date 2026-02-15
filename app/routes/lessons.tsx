import { Link } from "react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
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

type ViewMode = "grid" | "table";
type SortOption = "language" | "project" | "lines" | "wpm";

export default function Lessons() {
	const {
		getBestResult,
		getCustomLessons,
		deleteCustomLesson,
		deleteAllCustomLessons,
	} = useLocalStorage();

	const [customLessons, setCustomLessons] = useState<CustomLesson[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedLanguage, setSelectedLanguage] = useState("all");
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [sortBy, setSortBy] = useState<SortOption>("language");

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

	// Extract unique languages for filter dropdown
	const uniqueLanguages = useMemo(() => {
		const langs = new Set(lessons.map((l) => l.language));
		return Array.from(langs).sort();
	}, []);

	// Filter and sort lessons
	const filteredAndSortedLessons = useMemo(() => {
		let filtered = lessons;

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(lesson) =>
					lesson.language.toLowerCase().includes(query) ||
					lesson.project.toLowerCase().includes(query) ||
					lesson.description.toLowerCase().includes(query) ||
					lesson.fileName.toLowerCase().includes(query),
			);
		}

		// Language filter
		if (selectedLanguage !== "all") {
			filtered = filtered.filter(
				(lesson) => lesson.language === selectedLanguage,
			);
		}

		// Sort
		const sorted = [...filtered];
		switch (sortBy) {
			case "language":
				sorted.sort((a, b) => a.language.localeCompare(b.language));
				break;
			case "project":
				sorted.sort((a, b) => a.project.localeCompare(b.project));
				break;
			case "lines":
				sorted.sort(
					(a, b) =>
						b.code.split("\n").length - a.code.split("\n").length,
				);
				break;
			case "wpm": {
				sorted.sort((a, b) => {
					const aWpm = getBestResult(a.id)?.wpm ?? 0;
					const bWpm = getBestResult(b.id)?.wpm ?? 0;
					return bWpm - aWpm;
				});
				break;
			}
		}

		return sorted;
	}, [searchQuery, selectedLanguage, sortBy, getBestResult]);

	// Calculate stats
	const stats = useMemo(() => {
		const completed = lessons.filter(
			(lesson) => getBestResult(lesson.id) !== null,
		).length;
		const allWpms = lessons
			.map((lesson) => getBestResult(lesson.id)?.wpm)
			.filter((wpm): wpm is number => wpm !== null && wpm !== undefined);
		const avgWpm =
			allWpms.length > 0
				? Math.round(
						allWpms.reduce((sum, wpm) => sum + wpm, 0) /
							allWpms.length,
					)
				: 0;

		return {
			total: lessons.length,
			completed,
			avgWpm,
		};
	}, [getBestResult]);

	return (
		<div className="min-h-screen bg-[#0a0a0f]">
			<Header />

			<main className="mx-auto max-w-7xl px-6 py-12">
				{/* Header Section */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold tracking-tight text-[#e2e8f0]">
						Choose a Lesson
					</h1>
					<p className="mt-2 text-lg text-[#94a3b8]">
						Type and explore open source code patterns across 42
						programming languages.
					</p>

					{/* Stats Summary */}
					<div className="mt-6 flex flex-wrap gap-6 text-sm">
						<div className="flex items-center gap-2">
							<span className="text-[#94a3b8]">Total lessons:</span>
							<span className="font-semibold text-[#e2e8f0]">
								{stats.total}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-[#94a3b8]">Completed:</span>
							<span className="font-semibold text-[#f59e0b]">
								{stats.completed}
							</span>
						</div>
						{stats.avgWpm > 0 && (
							<div className="flex items-center gap-2">
								<span className="text-[#94a3b8]">
									Average WPM:
								</span>
								<span className="font-semibold text-[#e2e8f0]">
									{stats.avgWpm}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Filter Bar */}
				<div className="sticky top-0 z-10 -mx-6 bg-[#0a0a0f]/95 px-6 py-4 backdrop-blur-sm">
					<div className="flex flex-wrap items-center gap-3">
						{/* Search */}
						<div className="relative flex-1 min-w-[240px]">
							<svg
								className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#475569]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.35-4.35" />
							</svg>
							<input
								type="text"
								placeholder="Search lessons..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full rounded-lg border border-[#1e1e2e] bg-[#111118] py-2 pl-10 pr-4 text-sm text-[#e2e8f0] placeholder-[#475569] outline-none transition-colors focus:border-[#f59e0b]/50 focus:ring-1 focus:ring-[#f59e0b]/50"
							/>
						</div>

						{/* Language Filter */}
						<select
							value={selectedLanguage}
							onChange={(e) => setSelectedLanguage(e.target.value)}
							className="rounded-lg border border-[#1e1e2e] bg-[#111118] px-4 py-2 text-sm text-[#e2e8f0] outline-none transition-colors hover:border-[#2a2a3e] focus:border-[#f59e0b]/50 focus:ring-1 focus:ring-[#f59e0b]/50"
						>
							<option value="all">All Languages</option>
							{uniqueLanguages.map((lang) => (
								<option key={lang} value={lang}>
									{lang}
								</option>
							))}
						</select>

						{/* View Toggle */}
						<div className="flex rounded-lg border border-[#1e1e2e] bg-[#111118] p-1">
							<button
								type="button"
								onClick={() => setViewMode("grid")}
								className={`rounded px-3 py-1 text-sm font-medium transition-all ${
									viewMode === "grid"
										? "bg-[#f59e0b] text-[#0a0a0f]"
										: "text-[#94a3b8] hover:text-[#e2e8f0]"
								}`}
							>
								Grid
							</button>
							<button
								type="button"
								onClick={() => setViewMode("table")}
								className={`rounded px-3 py-1 text-sm font-medium transition-all ${
									viewMode === "table"
										? "bg-[#f59e0b] text-[#0a0a0f]"
										: "text-[#94a3b8] hover:text-[#e2e8f0]"
								}`}
							>
								Table
							</button>
						</div>

						{/* Sort Dropdown */}
						<select
							value={sortBy}
							onChange={(e) =>
								setSortBy(e.target.value as SortOption)
							}
							className="rounded-lg border border-[#1e1e2e] bg-[#111118] px-4 py-2 text-sm text-[#e2e8f0] outline-none transition-colors hover:border-[#2a2a3e] focus:border-[#f59e0b]/50 focus:ring-1 focus:ring-[#f59e0b]/50"
						>
							<option value="language">Sort by Language</option>
							<option value="project">Sort by Project</option>
							<option value="lines">Sort by Line Count</option>
							<option value="wpm">Sort by Best WPM</option>
						</select>
					</div>

					{/* Results Count */}
					<div className="mt-3 text-xs text-[#94a3b8]">
						Showing {filteredAndSortedLessons.length} of{" "}
						{lessons.length} lessons
					</div>
				</div>

				{/* Lessons Display */}
				<div className="mt-6">
					{filteredAndSortedLessons.length === 0 ? (
						<div className="rounded-lg border border-dashed border-[#1e1e2e] bg-[#111118] py-16 text-center">
							<p className="text-sm text-[#94a3b8]">
								No lessons found matching your filters.
							</p>
							<button
								type="button"
								onClick={() => {
									setSearchQuery("");
									setSelectedLanguage("all");
								}}
								className="mt-3 text-sm text-[#f59e0b] hover:underline"
							>
								Clear filters
							</button>
						</div>
					) : viewMode === "grid" ? (
						<div className="grid gap-4 sm:grid-cols-2">
							{filteredAndSortedLessons.map((lesson) => {
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
					) : (
						<div className="overflow-hidden rounded-lg border border-[#1e1e2e] bg-[#111118]">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="border-b border-[#1e1e2e] bg-[#0a0a0f]">
										<tr>
											<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
												Language
											</th>
											<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
												Project
											</th>
											<th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#94a3b8] sm:table-cell">
												File
											</th>
											<th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
												Lines
											</th>
											<th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#94a3b8] md:table-cell">
												Best WPM
											</th>
											<th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
												Action
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-[#1e1e2e]">
										{filteredAndSortedLessons.map(
											(lesson) => {
												const lineCount =
													lesson.code.split("\n")
														.length;
												const best =
													getBestResult(lesson.id);
												return (
													<tr
														key={lesson.id}
														className="transition-colors hover:bg-[#16161f]"
													>
														<td className="whitespace-nowrap px-4 py-3">
															<span
																className="text-sm font-semibold"
																style={{
																	color: lesson.color,
																}}
															>
																{lesson.language}
															</span>
														</td>
														<td className="px-4 py-3">
															<div className="text-sm font-medium text-[#e2e8f0]">
																{lesson.project}
															</div>
															<div className="text-xs text-[#94a3b8] line-clamp-1 sm:hidden">
																{
																	lesson.description
																}
															</div>
														</td>
														<td className="hidden whitespace-nowrap px-4 py-3 font-mono text-xs text-[#94a3b8] sm:table-cell">
															{lesson.fileName}
														</td>
														<td className="whitespace-nowrap px-4 py-3 text-right font-mono text-xs text-[#94a3b8]">
															{lineCount}
														</td>
														<td className="hidden whitespace-nowrap px-4 py-3 text-right md:table-cell">
															{best ? (
																<span className="inline-flex items-center rounded-full bg-[#f59e0b]/10 px-2.5 py-0.5 text-xs font-medium text-[#f59e0b]">
																	{best.wpm}
																</span>
															) : (
																<span className="text-xs text-[#475569]">
																	—
																</span>
															)}
														</td>
														<td className="whitespace-nowrap px-4 py-3 text-right">
															<Link
																to={`/practice/${lesson.languageSlug}/${lesson.projectSlug}`}
																className="inline-flex items-center rounded-md bg-[#f59e0b]/10 px-3 py-1.5 text-xs font-medium text-[#f59e0b] transition-colors hover:bg-[#f59e0b]/20"
															>
																Start
															</Link>
														</td>
													</tr>
												);
											},
										)}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>

				{/* Custom uploads section */}
				{customLessons.length > 0 && (
					<div className="mt-12">
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
									LANGUAGE_COLORS[custom.language] ||
									"#f59e0b";
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
												<div className="flex shrink-0 items-center gap-3">
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
				<div className="mt-8">
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
			<Footer />
		</div>
	);
}
