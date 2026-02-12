interface StatsBarProps {
	wpm: number;
	accuracy: number;
	time: string;
	progress: number;
	isActive: boolean;
}

function getAccuracyColor(accuracy: number): string {
	if (accuracy >= 95) return "#22c55e";
	if (accuracy >= 80) return "#f59e0b";
	return "#ef4444";
}

export function StatsBar({
	wpm,
	accuracy,
	time,
	progress,
	isActive,
}: StatsBarProps) {
	const accuracyColor = getAccuracyColor(accuracy);

	return (
		<div className="fixed bottom-0 inset-x-0 z-50 border-t border-[#1e1e2e] bg-[#111118]/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
				{/* WPM */}
				<div className="flex flex-col items-center min-w-[80px]">
					<span
						className="text-2xl font-bold font-mono tabular-nums leading-none text-[#f59e0b]"
						style={{
							opacity: isActive ? 1 : 0.5,
						}}
					>
						{wpm}
					</span>
					<span className="mt-1 text-[10px] uppercase tracking-wider text-[#475569]">
						WPM
					</span>
				</div>

				{/* Accuracy */}
				<div className="flex flex-col items-center min-w-[80px]">
					<span
						className="text-2xl font-bold font-mono tabular-nums leading-none"
						style={{ color: accuracyColor, opacity: isActive ? 1 : 0.5 }}
					>
						{accuracy}%
					</span>
					<span className="mt-1 text-[10px] uppercase tracking-wider text-[#475569]">
						Accuracy
					</span>
				</div>

				{/* Time */}
				<div className="flex flex-col items-center min-w-[80px]">
					<span
						className="text-2xl font-bold font-mono tabular-nums leading-none text-[#e2e8f0]"
						style={{ opacity: isActive ? 1 : 0.5 }}
					>
						{time}
					</span>
					<span className="mt-1 text-[10px] uppercase tracking-wider text-[#475569]">
						Time
					</span>
				</div>

				{/* Progress */}
				<div className="flex flex-col items-center min-w-[120px]">
					<div className="flex w-full items-center gap-2">
						<div className="h-1.5 flex-1 rounded-full bg-[#1e1e2e] overflow-hidden">
							<div
								className="h-full rounded-full bg-[#f59e0b] transition-all duration-300 ease-out"
								style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
							/>
						</div>
						<span className="text-xs font-mono tabular-nums text-[#475569]">
							{Math.round(progress)}%
						</span>
					</div>
					<span className="mt-1 text-[10px] uppercase tracking-wider text-[#475569]">
						Progress
					</span>
				</div>
			</div>
		</div>
	);
}
