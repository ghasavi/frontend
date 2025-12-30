import { Instagram, Twitter, Heart, Palette, Mail, ArrowUpRight, Users, Sparkles, Brush, Package, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="w-full bg-gradient-to-t from-[#000000] via-[#092635] to-[#000000] border-t border-[#5C8374]/30">
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute bottom-0 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/5 to-[#9EC8B9]/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/5 to-[#77B0AA]/5 rounded-full blur-3xl"></div>
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-12">
				
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
					{/* Brand Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="space-y-4"
					>
						<div className="flex items-center gap-3 mb-2">
							<div className="relative group">
								<div className="absolute -inset-2 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
								<div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#5C8374] to-[#77B0AA] flex items-center justify-center">
									<Sparkles className="w-5 h-5 text-white" />
								</div>
							</div>
							<div>
								<span className="text-2xl font-bold bg-gradient-to-r from-[#5C8374] to-[#77B0AA] bg-clip-text text-transparent">
									Pixaku
								</span>
								<p className="text-[10px] text-[#5C8374] tracking-wider">ANIME ART</p>
							</div>
						</div>
						<p className="text-sm text-[#77B0AA]/70 max-w-md leading-relaxed">
							Authentic anime art, hand-drawn with passion. 
							No AI. No reposts. Just pure artistic expression.
						</p>
						
						{/* Social Links */}
						<div className="flex items-center gap-3 pt-4">
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
									className="p-2 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 border border-[#5C8374]/30 rounded-lg hover:border-[#77B0AA] hover:bg-gradient-to-r hover:from-[#5C8374]/20 hover:to-[#77B0AA]/20 transition-all duration-200"
									aria-label={social.label}
								>
									<div className="text-[#77B0AA] hover:text-[#E3FEF7] transition-colors">
										{social.icon}
									</div>
								</motion.a>
							))}
						</div>
					</motion.div>

					{/* Quick Links Grid */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className="grid grid-cols-2 gap-8"
					>
						<div className="space-y-4">
							<h4 className="text-sm font-semibold text-white flex items-center gap-2">
								<Palette className="w-4 h-4 text-[#77B0AA]" />
								Explore
							</h4>
							<div className="space-y-3">
								{[
									{ name: "Gallery", path: "/products", icon: "🎨" },
									{ name: "Artists", path: "/artists", icon: "👤" },
									{ name: "About", path: "/about", icon: "ℹ️" }
								].map((item) => (
									<Link
										key={item.name}
										to={item.path}
										className="group flex items-center gap-2 text-sm text-[#77B0AA]/70 hover:text-[#E3FEF7] transition-colors duration-200"
									>
										<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">{item.icon}</span>
										<span className="group-hover:translate-x-1 transition-transform duration-200">{item.name}</span>
									</Link>
								))}
							</div>
						</div>

						<div className="space-y-4">
							<h4 className="text-sm font-semibold text-white flex items-center gap-2">
								<Users className="w-4 h-4 text-[#77B0AA]" />
								Account
							</h4>
							<div className="space-y-3">
								{[
									{ name: "Profile", path: "/profile", icon: "👤" },
									{ name: "Orders", path: "/myorders", icon: "📦" },
									{ name: "Wishlist", path: "/wishlist", icon: "💖" },
									{ name: "Reviews", path: "/reviews", icon: "⭐" }
								].map((item) => (
									<Link
										key={item.name}
										to={item.path}
										className="group flex items-center gap-2 text-sm text-[#77B0AA]/70 hover:text-[#E3FEF7] transition-colors duration-200"
									>
										<span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">{item.icon}</span>
										<span className="group-hover:translate-x-1 transition-transform duration-200">{item.name}</span>
									</Link>
								))}
							</div>
						</div>
					</motion.div>

					{/* Newsletter */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.2 }}
						className="space-y-4"
					>
						<h4 className="text-sm font-semibold text-white flex items-center gap-2">
							<Mail className="w-4 h-4 text-[#77B0AA]" />
							Stay Updated
						</h4>
						<p className="text-sm text-[#77B0AA]/70">
							Get notified about new artworks and exclusive offers.
						</p>
						<div className="relative">
							<input
								type="email"
								placeholder="Your email"
								className="w-full px-4 py-3 bg-gradient-to-r from-[#1B4242]/30 to-[#092635]/30 backdrop-blur-sm border border-[#5C8374]/30 rounded-lg text-white placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all"
							/>
							<button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white text-sm rounded hover:opacity-90 transition-opacity duration-200">
								Join
							</button>
						</div>
					</motion.div>
				</div>

				{/* Divider */}
				<div className="my-8 h-px bg-gradient-to-r from-transparent via-[#5C8374]/30 to-transparent"></div>

				{/* Bottom Section */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-6">
					{/* Copyright */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.3 }}
						className="text-center md:text-left"
					>
						<p className="text-xs text-[#5C8374]">
							© {new Date().getFullYear()} Pixaku • All rights reserved
						</p>
						<p className="text-xs text-[#5C8374]/50 mt-1">
							Artworks are original and may not be reproduced without permission
						</p>
					</motion.div>

					{/* Made with Love */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.4 }}
						className="flex items-center gap-2"
					>
						<div className="relative">
							<Heart className="w-4 h-4 text-[#77B0AA] animate-pulse" />
							<div className="absolute inset-0 bg-[#77B0AA] rounded-full blur-sm opacity-20"></div>
						</div>
						<span className="text-xs text-[#5C8374]">
							Crafted with passion
						</span>
					</motion.div>

					{/* Legal Links */}
					<div className="flex items-center gap-6">
						<Link to="/privacy" className="text-xs text-[#5C8374] hover:text-[#77B0AA] transition-colors">
							Privacy
						</Link>
						<Link to="/terms" className="text-xs text-[#5C8374] hover:text-[#77B0AA] transition-colors">
							Terms
						</Link>
						<Link to="/support" className="text-xs text-[#5C8374] hover:text-[#77B0AA] transition-colors">
							Support
						</Link>
					</div>
				</div>

				{/* Commission CTA */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.5 }}
					className="mt-10 pt-8 border-t border-[#5C8374]/20 text-center"
				>
					<div className="inline-flex items-center gap-2 group cursor-pointer">
						<div className="p-2 rounded-lg bg-gradient-to-r from-[#5C8374]/10 to-[#77B0AA]/10 group-hover:from-[#5C8374]/20 group-hover:to-[#77B0AA]/20 transition-all duration-200">
							<Brush className="w-4 h-4 text-[#77B0AA]" />
						</div>
						<div className="text-left">
							<p className="text-sm font-medium text-white">
								Commission inquiries?
							</p>
							<p className="text-xs text-[#77B0AA] group-hover:text-[#E3FEF7] transition-colors">
								Contact for custom artwork
							</p>
						</div>
						<ArrowUpRight className="w-4 h-4 text-[#5C8374] group-hover:text-[#77B0AA] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
					</div>
				</motion.div>

				{/* Trust Badges */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.6 }}
					className="mt-8 flex flex-wrap justify-center gap-6"
				>
					<div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#1B4242]/30 to-[#092635]/30 border border-[#5C8374]/20 rounded-lg">
						<Award className="w-3 h-3 text-[#77B0AA]" />
						<span className="text-xs text-[#77B0AA]">Secure Payments</span>
					</div>
					<div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#1B4242]/30 to-[#092635]/30 border border-[#5C8374]/20 rounded-lg">
						<Package className="w-3 h-3 text-[#77B0AA]" />
						<span className="text-xs text-[#77B0AA]">Instant Delivery</span>
					</div>
					<div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#1B4242]/30 to-[#092635]/30 border border-[#5C8374]/20 rounded-lg">
						<Sparkles className="w-3 h-3 text-[#77B0AA]" />
						<span className="text-xs text-[#77B0AA]">100% Original</span>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}