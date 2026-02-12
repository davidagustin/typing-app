import { Header } from "~/components/Header";
import { Link } from "react-router";

const LANGUAGES = [
	{ name: "JavaScript", color: "#f7df1e" },
	{ name: "TypeScript", color: "#3178c6" },
	{ name: "Python", color: "#3572A5" },
	{ name: "Rust", color: "#dea584" },
	{ name: "Go", color: "#00ADD8" },
	{ name: "Java", color: "#b07219" },
	{ name: "C", color: "#555555" },
	{ name: "Ruby", color: "#701516" },
	{ name: "Swift", color: "#F05138" },
	{ name: "CSS", color: "#563d7c" },
	{ name: "Kotlin", color: "#A97BFF" },
	{ name: "PHP", color: "#4F5D95" },
];

export default function Home() {
	return (
		<div className="min-h-screen">
			<Header />

			{/* Hero */}
			<section className="flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center min-h-[calc(100vh-56px)]">
				<h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
					Type <span className="text-[#f59e0b]">Real Code</span>.
					<br />
					Get Faster.
				</h1>
				<p className="mt-6 max-w-lg text-lg text-[#94a3b8] leading-relaxed">
					Practice typing with real programming syntax. Track your speed
					and accuracy across 12 languages.
				</p>
				<Link
					to="/lessons"
					className="mt-10 inline-flex items-center rounded-lg bg-[#f59e0b] px-8 py-3.5 text-base font-semibold text-[#0a0a0f] hover:bg-[#d97706] transition-colors"
				>
					Start Practicing
				</Link>
				<p className="mt-4 text-sm text-[#475569]">
					Free. No sign-up required.
				</p>

				{/* Code preview */}
				<div className="mt-16 w-full max-w-2xl rounded-xl border border-[#1e1e2e] bg-[#111118] p-6 text-left shadow-2xl shadow-black/30">
					<div className="flex items-center gap-2 mb-4">
						<span className="h-3 w-3 rounded-full bg-[#ef4444]/60" />
						<span className="h-3 w-3 rounded-full bg-[#f59e0b]/60" />
						<span className="h-3 w-3 rounded-full bg-[#22c55e]/60" />
						<span className="ml-3 text-xs text-[#475569] font-mono">
							server.js
						</span>
					</div>
					<pre className="font-mono text-sm leading-7 overflow-x-auto">
						<code>
							<span className="text-[#e2e8f0]">{"const "}</span>
							<span className="text-[#e2e8f0]">{"express "}</span>
							<span className="text-[#e2e8f0]">{"= "}</span>
							<span className="text-[#e2e8f0]">{'require("e'}</span>
							<span className="text-[#f59e0b] bg-[#f59e0b]/20 rounded-sm">
								x
							</span>
							<span className="text-[#475569]">{'press");'}</span>
							{"\n"}
							<span className="text-[#475569]">
								{'const app = express();'}
							</span>
							{"\n"}
							{"\n"}
							<span className="text-[#475569]">
								{'app.use(express.json());'}
							</span>
							{"\n"}
							{"\n"}
							<span className="text-[#475569]">
								{'app.get("/api/tasks", (req, res) => {'}
							</span>
							{"\n"}
							<span className="text-[#475569]">
								{"  const items = [...tasks.values()];"}
							</span>
							{"\n"}
							<span className="text-[#475569]">
								{"  res.json({ data: items });"}
							</span>
							{"\n"}
							<span className="text-[#475569]">{"});"}</span>
						</code>
					</pre>
				</div>
			</section>

			{/* Features */}
			<section className="px-6 py-20">
				<div className="mx-auto max-w-4xl">
					<h2 className="text-center text-3xl font-bold tracking-tight">
						Built for developers
					</h2>
					<p className="mt-3 text-center text-[#94a3b8]">
						Not random words. Real code patterns you use every day.
					</p>

					<div className="mt-12 grid gap-6 sm:grid-cols-3">
						<div className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-6">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f59e0b]/10 text-lg">
								&lt;/&gt;
							</div>
							<h3 className="mt-4 text-lg font-semibold text-[#e2e8f0]">
								Real Code
							</h3>
							<p className="mt-2 text-sm text-[#94a3b8] leading-relaxed">
								Practice with actual programming patterns, not random
								words. Curly braces, arrow functions, and all.
							</p>
						</div>

						<div className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-6">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3178c6]/10 text-lg">
								#
							</div>
							<h3 className="mt-4 text-lg font-semibold text-[#e2e8f0]">
								12 Languages
							</h3>
							<p className="mt-2 text-sm text-[#94a3b8] leading-relaxed">
								JavaScript, Python, Rust, Go, and more. Each lesson
								uses idiomatic code from real projects.
							</p>
						</div>

						<div className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-6">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#22c55e]/10 text-lg">
								~
							</div>
							<h3 className="mt-4 text-lg font-semibold text-[#e2e8f0]">
								Track Progress
							</h3>
							<p className="mt-2 text-sm text-[#94a3b8] leading-relaxed">
								Monitor your WPM and accuracy over time. See your best
								scores and watch yourself improve.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Languages */}
			<section className="px-6 py-20 border-t border-[#1e1e2e]">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="text-3xl font-bold tracking-tight">
						12 Languages. Real Syntax.
					</h2>
					<p className="mt-3 text-[#94a3b8]">
						Practice the languages you actually use at work.
					</p>
					<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
						{LANGUAGES.map((lang) => (
							<span
								key={lang.name}
								className="inline-flex items-center gap-2 rounded-full border border-[#1e1e2e] bg-[#111118] px-4 py-2 text-sm font-medium text-[#e2e8f0]"
							>
								<span
									className="h-2.5 w-2.5 rounded-full"
									style={{ backgroundColor: lang.color }}
								/>
								{lang.name}
							</span>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-[#1e1e2e] px-6 py-12 text-center">
				<p className="text-[#475569]">
					Built for developers who want to type faster.
				</p>
				<Link
					to="/lessons"
					className="mt-4 inline-block text-sm font-medium text-[#f59e0b] hover:text-[#d97706]"
				>
					Start practicing now
				</Link>
			</footer>
		</div>
	);
}
