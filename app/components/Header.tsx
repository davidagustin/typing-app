import { Link } from "react-router";

export function Header() {
	return (
		<header className="flex items-center justify-between px-6 h-14 border-b border-[#1e1e2e]">
			<Link to="/" className="font-mono text-xl font-bold tracking-tight">
				<span className="text-[#f59e0b]">type</span>
				<span className="text-[#e2e8f0]">code</span>
			</Link>

			<nav className="flex items-center gap-6">
				<Link
					to="/lessons"
					className="text-sm text-[#94a3b8] hover:text-[#e2e8f0]"
				>
					lessons
				</Link>
				<Link
					to="/custom"
					className="text-sm text-[#94a3b8] hover:text-[#e2e8f0]"
				>
					upload
				</Link>
			</nav>
		</header>
	);
}
