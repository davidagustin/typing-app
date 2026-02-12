import { Link } from "react-router";
import { Header } from "~/components/Header";
import { LessonCard } from "~/components/LessonCard";
import { lessons } from "~/data/lessons";
import { useLocalStorage } from "~/hooks/useLocalStorage";

export default function Lessons() {
	const { getBestResult } = useLocalStorage();

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
								Paste your own code or upload a file to practice with.
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
