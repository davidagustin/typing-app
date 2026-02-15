import { useState } from "react";

const BTC_ADDRESS = "bc1qkq0g79l2c7s33h28qlevt7jffxajcd3";
const ETH_ADDRESS = "0x846a4460455f9db3c0b3cd1e0e7d1070288e88f2";
const STRIPE_URL = "https://buy.stripe.com/fZucN5epreyuchqdtZfnO00";

export function Footer() {
	const [copied, setCopied] = useState<string | null>(null);

	const copy = (address: string, label: string) => {
		navigator.clipboard
			.writeText(address)
			.then(() => {
				setCopied(label);
				setTimeout(() => setCopied(null), 2000);
			})
			.catch(() => {});
	};

	return (
		<footer className="border-t border-[#1e1e2e] px-6 py-5">
			<div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
				<p className="text-xs text-[#475569]">
					Support this project
				</p>
				<div className="flex flex-wrap items-center gap-3">
					<a
						href={STRIPE_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-[#475569] hover:text-[#e2e8f0] transition-colors"
					>
						Stripe
					</a>
					<span className="text-[#1e1e2e]">|</span>
					<button
						type="button"
						onClick={() => copy(BTC_ADDRESS, "BTC")}
						className="text-xs text-[#475569] hover:text-[#e2e8f0] transition-colors cursor-pointer"
					>
						{copied === "BTC" ? "Copied!" : "BTC"}
					</button>
					<span className="text-[#1e1e2e]">|</span>
					<button
						type="button"
						onClick={() => copy(ETH_ADDRESS, "ETH")}
						className="text-xs text-[#475569] hover:text-[#e2e8f0] transition-colors cursor-pointer"
					>
						{copied === "ETH" ? "Copied!" : "ETH"}
					</button>
				</div>
			</div>
		</footer>
	);
}
