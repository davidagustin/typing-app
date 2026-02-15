import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { useLocalStorage } from "~/hooks/useLocalStorage";

const LANGUAGES = [
	"JavaScript",
	"TypeScript",
	"Python",
	"Rust",
	"Go",
	"Java",
	"C",
	"C++",
	"C#",
	"Ruby",
	"Swift",
	"Kotlin",
	"PHP",
	"Scala",
	"Haskell",
	"Lua",
	"R",
	"Perl",
	"Dart",
	"Elixir",
	"Clojure",
	"F#",
	"OCaml",
	"Julia",
	"Zig",
	"Nim",
	"Erlang",
	"Groovy",
	"Objective-C",
	"Assembly",
	"COBOL",
	"Fortran",
	"Prolog",
	"Scheme",
	"Ada",
	"Pascal",
	"MATLAB",
	"Bash",
	"PowerShell",
	"CSS",
	"HTML",
	"SQL",
	"React",
	"Angular",
	"Vue",
	"Other",
];

const ACCEPTED_EXTENSIONS =
	".js,.ts,.tsx,.jsx,.py,.rs,.go,.java,.c,.cpp,.cs,.h,.hpp,.rb,.swift,.css,.kt,.kts,.php,.sh,.ps1,.html,.htm,.sql,.txt,.md,.lua,.r,.pl,.dart,.ex,.exs,.clj,.fs,.fsx,.ml,.mli,.jl,.zig,.nim,.erl,.hrl,.groovy,.m,.asm,.s,.cob,.cbl,.f90,.f95,.f03,.pro,.scm,.ss,.adb,.ads,.pas,.mat,.vue,.tsx,.jsx,.scala,.hs";

function cleanCode(raw: string): string {
	// Normalize line endings
	let code = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	// Trim trailing whitespace from each line
	code = code
		.split("\n")
		.map((line) => line.trimEnd())
		.join("\n");
	// Remove trailing newlines
	code = code.replace(/\n+$/, "");
	return code;
}

export default function Custom() {
	const navigate = useNavigate();
	const { saveCustomLesson } = useLocalStorage();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [language, setLanguage] = useState("JavaScript");
	const [fileName, setFileName] = useState("");
	const [code, setCode] = useState("");

	const lineCount = code ? code.split("\n").length : 0;
	const charCount = code.length;

	function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setFileName(file.name);

		const reader = new FileReader();
		reader.onload = (event) => {
			const text = event.target?.result;
			if (typeof text === "string") {
				setCode(text);
			}
		};
		reader.readAsText(file);

		// Reset input so the same file can be re-selected
		e.target.value = "";
	}

	function handleStart() {
		const cleaned = cleanCode(code);
		if (!cleaned) return;

		const id = saveCustomLesson({
			code: cleaned,
			language,
			fileName: fileName || "custom.txt",
		});

		navigate(`/practice/custom/${id}`);
	}

	return (
		<div className="min-h-screen">
			<Header />

			<main className="mx-auto max-w-2xl px-6 py-12">
				<div className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-8">
					<h1 className="text-2xl font-bold tracking-tight text-[#e2e8f0]">
						Type Your Own Code
					</h1>
					<p className="mt-2 text-sm text-[#94a3b8]">
						Paste code or upload a file to practice with.
					</p>

					<div className="mt-8 space-y-5">
						{/* Language selector and file name */}
						<div className="flex gap-3">
							<select
								value={language}
								onChange={(e) => setLanguage(e.target.value)}
								className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-3 py-2 text-sm text-[#e2e8f0] outline-none focus:border-[#f59e0b]/50"
							>
								{LANGUAGES.map((lang) => (
									<option key={lang} value={lang}>
										{lang}
									</option>
								))}
							</select>

							<input
								type="text"
								value={fileName}
								onChange={(e) => setFileName(e.target.value)}
								placeholder="filename (optional)"
								className="flex-1 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-3 py-2 font-mono text-sm text-[#e2e8f0] placeholder-[#475569] outline-none focus:border-[#f59e0b]/50"
							/>
						</div>

						{/* File upload */}
						<div>
							<input
								ref={fileInputRef}
								type="file"
								accept={ACCEPTED_EXTENSIONS}
								onChange={handleFileUpload}
								className="hidden"
							/>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#94a3b8] transition-colors hover:border-[#f59e0b]/40 hover:text-[#e2e8f0]"
							>
								&#8593; Upload File
							</button>
						</div>

						{/* Code textarea */}
						<textarea
							value={code}
							onChange={(e) => setCode(e.target.value)}
							placeholder="Paste your code here..."
							spellCheck={false}
							autoComplete="off"
							autoCapitalize="off"
							className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-4 font-mono text-sm leading-relaxed text-[#e2e8f0] placeholder-[#475569] outline-none focus:border-[#f59e0b]/50"
							style={{ minHeight: "300px" }}
						/>

						{/* Character/line count */}
						<p className="text-xs text-[#475569]">
							{lineCount} {lineCount === 1 ? "line" : "lines"} &middot;{" "}
							{charCount} {charCount === 1 ? "character" : "characters"}
						</p>

						{/* Start button */}
						<button
							type="button"
							onClick={handleStart}
							disabled={!code.trim()}
							className="w-full rounded-lg bg-[#f59e0b] px-6 py-3 text-sm font-semibold text-[#0a0a0f] transition-colors hover:bg-[#d97706] disabled:cursor-not-allowed disabled:bg-[#1e1e2e] disabled:text-[#475569]"
						>
							Start Typing
						</button>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
