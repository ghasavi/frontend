import { Instagram, Twitter, Heart, Palette, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="w-full bg-gradient-to-t from-[#0F0E23] to-[#19183B] border-t border-[#708993]/20 mt-20">
			<div className="max-w-6xl mx-auto px-6 py-10">
				
				{/* Main Footer Content */}
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
					
					{/* Left: Brand & Tagline */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.4 }}
						className="flex-1"
					>
						<div className="flex items-center gap-3 mb-3">
							<div className="relative group">
								<div className="absolute -inset-2 bg-gradient-to-r from-[#A1C2BD] to-[#708993] rounded-lg blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
								<div className="relative w-8 h-8 bg-gradient-to-br from-[#708993] to-[#A1C2BD] rounded-lg flex items-center justify-center">
									<Palette className="w-4 h-4 text-[#0F0E23]" />
								</div>
							</div>
							<span className="text-2xl font-bold text-[#E7F2EF] tracking-tighter">
								pixaku
							</span>
						</div>
						<p className="text-sm text-[#A1C2BD]/60 max-w-md">
							Authentic anime art, hand-drawn with passion. No AI. No compromises.
						</p>
					</motion.div>

					{/* Right: Quick Links */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className="flex gap-10"
					>
						<div className="space-y-3">
							<h4 className="text-xs uppercase tracking-wider text-[#708993] font-semibold">
								Explore
							</h4>
							<div className="space-y-2">
								{["Gallery", "Artists", "About"].map((item) => (
									<Link
										key={item}
										to={`/${item.toLowerCase()}`}
										className="block text-sm text-[#E7F2EF]/70 hover:text-[#A1C2BD] hover:translate-x-1 transition-all duration-200"
									>
										{item}
									</Link>
								))}
							</div>
						</div>

						<div className="space-y-3">
							<h4 className="text-xs uppercase tracking-wider text-[#708993] font-semibold">
								Artist
							</h4>
							<div className="space-y-2">
								{["Profile", "Orders", "Wishlist"].map((item) => (
									<Link
										key={item}
										to={`/${item.toLowerCase()}`}
										className="block text-sm text-[#E7F2EF]/70 hover:text-[#A1C2BD] hover:translate-x-1 transition-all duration-200"
									>
										{item}
									</Link>
								))}
							</div>
						</div>
					</motion.div>
				</div>

				{/* Social & Legal Row */}
				<div className="pt-8 border-t border-[#708993]/10">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						
						{/* Social Icons */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.2 }}
							className="flex items-center gap-4"
						>
							{[
								{ icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
								{ icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
								{ icon: <Mail className="w-4 h-4" />, label: "Email" }
							].map((social) => (
								<motion.a
									key={social.label}
									href="#"
									whileHover={{ y: -3, scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
									className="group relative p-2 bg-[#19183B] border border-[#708993]/20 rounded-lg hover:border-[#A1C2BD]/40 hover:bg-[#19183B]/80 transition-all duration-200"
									aria-label={social.label}
								>
									<div className="text-[#A1C2BD] group-hover:text-[#E7F2EF] transition-colors">
										{social.icon}
									</div>
									<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[#19183B] text-xs text-[#E7F2EF] rounded border border-[#708993]/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
										{social.label}
									</div>
								</motion.a>
							))}
						</motion.div>

						{/* Copyright */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.3 }}
							className="text-center"
						>
							<p className="text-xs text-[#708993]/50">
								© {new Date().getFullYear()} Pixaku • All rights reserved
							</p>
							<p className="text-xs text-[#708993]/30 mt-1">
								Artworks are original and may not be reproduced
							</p>
						</motion.div>

						{/* Made with Love */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.4 }}
							className="flex items-center gap-2"
						>
							<Heart className="w-3 h-3 text-[#708993]" />
							<span className="text-xs text-[#708993]/50">
								Made with passion
							</span>
						</motion.div>
					</div>
				</div>

				{/* Commission CTA */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.5 }}
					className="mt-8 pt-6 border-t border-[#708993]/10 text-center"
				>
					<div className="inline-flex items-center gap-2 group cursor-pointer">
						<span className="text-sm text-[#A1C2BD]/70 group-hover:text-[#E7F2EF] transition-colors">
							Commission inquiries?
						</span>
						<ArrowUpRight className="w-3 h-3 text-[#708993] group-hover:text-[#A1C2BD] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
					</div>
				</motion.div>
			</div>
		</footer>
	);
}