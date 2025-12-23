export default function AboutPage() {
	return (
		<div className="w-full min-h-full px-6 py-20 bg-gradient-to-br from-black via-zinc-900 to-black text-white">
			<div className="max-w-4xl mx-auto">

				{/* TITLE */}
				<h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">
					About Pixaku
				</h1>

				<p className="text-zinc-300 text-center max-w-2xl mx-auto mb-14">
					Pixaku is my personal art space — where I share and sell the anime
					artwork I draw by hand.
				</p>

				{/* MAIN CONTENT */}
				<div className="space-y-10">

					<section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
						<h2 className="text-2xl font-semibold mb-3">
							Who I Am
						</h2>
						<p className="text-zinc-400 leading-relaxed">
							I’m an independent artist who loves drawing anime-style characters,
							expressions, and scenes. Pixaku exists so I can share my work
							directly with people who genuinely enjoy it — without repost pages,
							AI scraping, or middlemen.
						</p>
					</section>

					<section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
						<h2 className="text-2xl font-semibold mb-3">
							How the Art Is Made
						</h2>
						<p className="text-zinc-400 leading-relaxed">
							Every artwork on Pixaku is drawn manually, from sketch to final
							render. No AI generation, no tracing, no stolen references.
							What you see here is the result of time, practice, and a lot of late
							nights.
						</p>
					</section>

					<section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
						<h2 className="text-2xl font-semibold mb-3">
							Why Buy From Pixaku?
						</h2>
						<ul className="list-disc list-inside text-zinc-400 space-y-2">
							<li>100% original anime artwork</li>
							<li>High-resolution digital files</li>
							<li>No AI, no reposts, no stolen art</li>
							<li>Directly supports an independent artist</li>
						</ul>
					</section>

					<section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
						<h2 className="text-2xl font-semibold mb-3">
							Commissions & Future Plans
						</h2>
						<p className="text-zinc-400 leading-relaxed">
							I plan to open commissions and release themed art drops in the
							future. Pixaku will keep growing as I experiment with new styles
							and ideas.
						</p>
					</section>

				</div>

				{/* FOOTER NOTE */}
				<p className="mt-16 text-center text-sm text-zinc-500">
					Thanks for checking out my work and supporting independent art 💜
				</p>

			</div>
		</div>
	);
}
