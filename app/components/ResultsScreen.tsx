interface ResultsScreenProps {
	wpm: number;
	accuracy: number;
	time: string;
	correctChars: number;
	incorrectChars: number;
	totalChars: number;
	lessonName: string;
	onRestart: () => void;
	onBack: () => void;
}

function getRating(wpm: number): { label: string; color: string } {
	if (wpm > 80) return { label: "Excellent", color: "#22c55e" };
	if (wpm > 60) return { label: "Great", color: "#f59e0b" };
	if (wpm > 40) return { label: "Good", color: "#94a3b8" };
	return { label: "Keep Practicing", color: "#ef4444" };
}

export function ResultsScreen({
	wpm,
	accuracy,
	time,
	correctChars,
	incorrectChars,
	totalChars,
	lessonName,
	onRestart,
	onBack,
}: ResultsScreenProps) {
	const rating = getRating(wpm);

	return (
		<div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div className="animate-fade-in-scale w-full max-w-md rounded-xl border border-[#1e1e2e] bg-[#111118] p-8 shadow-2xl shadow-black/40">
				{/* Lesson name */}
				<p className="text-center text-sm text-[#475569]">{lessonName}</p>

				{/* Rating */}
				<p
					className="mt-1 text-center text-lg font-semibold"
					style={{ color: rating.color }}
				>
					{rating.label}
				</p>

				{/* Hero WPM */}
				<div className="mt-6 flex flex-col items-center">
					<span className="text-6xl font-bold font-mono tabular-nums text-[#f59e0b] leading-none">
						{wpm}
					</span>
					<span className="mt-2 text-xs uppercase tracking-wider text-[#475569]">
						Words per Minute
					</span>
				</div>

				{/* Secondary stats grid */}
				<div className="mt-8 grid grid-cols-2 gap-4">
					<div className="rounded-lg bg-[#0a0a0f] p-3 text-center">
						<span className="block text-xl font-bold font-mono tabular-nums text-[#e2e8f0]">
							{accuracy}%
						</span>
						<span className="text-[10px] uppercase tracking-wider text-[#475569]">
							Accuracy
						</span>
					</div>

					<div className="rounded-lg bg-[#0a0a0f] p-3 text-center">
						<span className="block text-xl font-bold font-mono tabular-nums text-[#e2e8f0]">
							{time}
						</span>
						<span className="text-[10px] uppercase tracking-wider text-[#475569]">
							Time
						</span>
					</div>

					<div className="rounded-lg bg-[#0a0a0f] p-3 text-center">
						<span className="block text-xl font-bold font-mono tabular-nums text-[#22c55e]">
							{correctChars}
						</span>
						<span className="text-[10px] uppercase tracking-wider text-[#475569]">
							Correct
						</span>
					</div>

					<div className="rounded-lg bg-[#0a0a0f] p-3 text-center">
						<span className="block text-xl font-bold font-mono tabular-nums text-[#ef4444]">
							{incorrectChars}
						</span>
						<span className="text-[10px] uppercase tracking-wider text-[#475569]">
							Incorrect
						</span>
					</div>
				</div>

				{/* Total chars */}
				<p className="mt-4 text-center text-xs text-[#475569]">
					{totalChars} total characters
				</p>

				{/* Actions */}
				<div className="mt-6 flex gap-3">
					<button
						type="button"
						onClick={onBack}
						className="flex-1 rounded-lg border border-[#1e1e2e] bg-transparent px-4 py-2.5 text-sm font-medium text-[#94a3b8] hover:border-[#2a2a3e] hover:text-[#e2e8f0] cursor-pointer"
					>
						Back to Lessons
					</button>
					<button
						type="button"
						onClick={onRestart}
						className="flex-1 rounded-lg bg-[#f59e0b] px-4 py-2.5 text-sm font-semibold text-[#0a0a0f] hover:bg-[#d97706] cursor-pointer"
					>
						Try Again
					</button>
				</div>
			</div>
		</div>
	);
}
