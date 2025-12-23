import { Instagram, Twitter, Github, Heart } from "lucide-react";

export default function Footer() {
	return (
		<footer className="w-full bg-zinc-950 border-t border-zinc-800 text-zinc-400">
			<div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
				
				{/* BRAND */}
				<div>
					<h2 className="text-2xl font-extrabold text-white">
						Pixaku
					</h2>
					<p className="mt-3 text-sm leading-relaxed">
						Original anime artwork drawn by me.  
						No AI. No reposts. Just passion and pixels.
					</p>
					<p className="mt-4 text-sm flex items-center gap-1">
						Made with <Heart size={14} className="text-red-500" /> by an artist
					</p>
				</div>

				{/* LINKS */}
				<div>
					<h3 className="text-white font-semibold mb-4">
						Explore
					</h3>
					<ul className="space-y-2 text-sm">
						<li className="hover:text-white transition cursor-pointer">
							Artworks
						</li>
						<li className="hover:text-white transition cursor-pointer">
							About Me
						</li>
						<li className="hover:text-white transition cursor-pointer">
							Cart
						</li>
						<li className="hover:text-white transition cursor-pointer">
							Checkout
						</li>
					</ul>
				</div>

				{/* SOCIALS */}
				<div>
					<h3 className="text-white font-semibold mb-4">
						Find Me
					</h3>
					<div className="flex gap-4">
						<a href="#" className="hover:text-white transition">
							<Instagram />
						</a>
						
						
					</div>

					<p className="mt-6 text-xs text-zinc-500">
						For commissions or collabs, hit my socials 👀
					</p>
				</div>
			</div>

			<div className="border-t border-zinc-800 text-center py-4 text-xs text-zinc-500">
				© {new Date().getFullYear()} Pixaku. All artworks are original and owned by the artist.
			</div>
		</footer>
	);
}
