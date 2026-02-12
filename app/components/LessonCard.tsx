import { Link } from "react-router";

interface LessonCardProps {
	lesson: {
		id: string;
		language: string;
		languageSlug: string;
		project: string;
		projectSlug: string;
		description: string;
		fileName: string;
		code: string;
		color: string;
	};
	bestWpm?: number | null;
}

export function LessonCard({ lesson, bestWpm }: LessonCardProps) {
	const lineCount = lesson.code.split("\n").length;

	return (
		<Link
			to={`/practice/${lesson.languageSlug}/${lesson.projectSlug}`}
			className="group block rounded-lg border border-[#1e1e2e] bg-[#111118] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2a2a3e] hover:shadow-lg hover:shadow-black/20"
			style={{ borderLeftColor: lesson.color, borderLeftWidth: "3px" }}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-2.5">
					<span
						className="text-lg font-semibold"
						style={{ color: lesson.color }}
					>
						{lesson.language}
					</span>
					<span className="text-lg font-medium text-[#e2e8f0]">
						{lesson.project}
					</span>
				</div>

				<div className="flex items-center gap-3 shrink-0">
					{bestWpm != null && (
						<span className="inline-flex items-center rounded-full bg-[#f59e0b]/10 px-2.5 py-0.5 text-xs font-medium text-[#f59e0b]">
							Best: {bestWpm} WPM
						</span>
					)}
					<span className="text-xs text-[#475569] font-mono">
						{lineCount} {lineCount === 1 ? "line" : "lines"}
					</span>
				</div>
			</div>

			<p className="mt-2 text-sm text-[#94a3b8] leading-relaxed line-clamp-2">
				{lesson.description}
			</p>

			<div className="mt-3">
				<span className="inline-block rounded bg-[#16161f] px-2 py-0.5 font-mono text-xs text-[#475569]">
					{lesson.fileName}
				</span>
			</div>
		</Link>
	);
}
