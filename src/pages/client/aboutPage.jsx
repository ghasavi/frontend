import { Paintbrush, Sparkles, Heart, Palette, User, Target, Award, Star, Zap, Mail, Instagram, Twitter, Brush } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43]">
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Floating color blobs */}
				<div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-32 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl"></div>
				
				{/* Floating particles */}
				{[...Array(20)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							background: `linear-gradient(45deg, ${i % 3 === 0 ? '#5C8374' : i % 3 === 1 ? '#9EC8B9' : '#77B0AA'})`
						}}
						animate={{
							y: [0, -15, 0],
							x: [0, Math.random() * 8 - 4, 0],
						}}
						transition={{
							duration: 4 + Math.random() * 6,
							repeat: Infinity,
							delay: Math.random() * 3
						}}
					/>
				))}
			</div>

			{/* Main Content */}
			<div className="relative z-10 px-4 lg:px-8 py-16">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 backdrop-blur-sm rounded-full border border-[#5C8374]/30 mb-6">
							<Sparkles className="w-4 h-4 text-[#E3FEF7]" />
							<span className="text-sm font-medium text-[#E3FEF7]">
								 The Story Behind the Art
							</span>
						</div>

						<h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
							Welcome to{" "}
							<span className="bg-gradient-to-r from-[#9EC8B9] via-[#77B0AA] to-[#5C8374] bg-clip-text text-transparent">
								Pixaku
							</span>
						</h1>

						<p className="text-xl text-[#E3FEF7]/80 max-w-3xl mx-auto leading-relaxed">
							Your personal portal to authentic, hand-drawn anime art — created with passion,
							shared with love.
						</p>
					</motion.div>

					{/* Main Content Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
						{/* Artist Card */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="bg-gradient-to-b from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl p-8"
						>
							<div className="flex items-center gap-4 mb-6">
								<div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center">
									<User className="w-8 h-8 text-white" />
								</div>
								<div>
									<h2 className="text-2xl font-bold text-white">Meet the Artist</h2>
									<p className="text-[#77B0AA]">Creator & Visionary</p>
								</div>
							</div>
							<p className="text-[#E3FEF7]/90 leading-relaxed">
								I'm an independent artist who lives and breathes anime-style art. Pixaku is my
								sanctuary — a space where I can share my hand-drawn creations directly with
								people who genuinely appreciate them. No middlemen, no algorithms, just pure
								artistic expression.
							</p>
							<div className="mt-6 pt-6 border-t border-[#5C8374]/20">
								<div className="flex items-center gap-4">
									<span className="px-3 py-1 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 rounded-full text-sm text-[#77B0AA]">
										🎯 Self-taught
									</span>
									<span className="px-3 py-1 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 rounded-full text-sm text-[#77B0AA]">
										💜 Anime Enthusiast
									</span>
									<span className="px-3 py-1 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 rounded-full text-sm text-[#77B0AA]">
										✨ Perfectionist
									</span>
								</div>
							</div>
						</motion.div>

						{/* Philosophy Card */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="bg-gradient-to-b from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl p-8"
						>
							<div className="flex items-center gap-4 mb-6">
								<div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#77B0AA] to-[#9EC8B9] flex items-center justify-center">
									<Target className="w-8 h-8 text-white" />
								</div>
								<div>
									<h2 className="text-2xl font-bold text-white">Our Philosophy</h2>
									<p className="text-[#77B0AA]">Art with Integrity</p>
								</div>
							</div>
							<p className="text-[#E3FEF7]/90 leading-relaxed">
								In a digital world flooded with AI-generated content, Pixaku stands as a
								beacon of authentic creativity. Every stroke, every line, every color choice
								is the result of human intuition, skill, and emotional connection.
							</p>
							<div className="mt-6 pt-6 border-t border-[#5C8374]/20">
								<h4 className="text-lg font-semibold text-white mb-3">Core Values</h4>
								<ul className="space-y-2">
									<li className="flex items-center gap-3 text-[#E3FEF7]/80">
										<div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#5C8374] to-[#77B0AA]"></div>
										<span>100% hand-drawn artwork</span>
									</li>
									<li className="flex items-center gap-3 text-[#E3FEF7]/80">
										<div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#5C8374] to-[#77B0AA]"></div>
										<span>No AI generation or tracing</span>
									</li>
									<li className="flex items-center gap-3 text-[#E3FEF7]/80">
										<div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#5C8374] to-[#77B0AA]"></div>
										<span>Direct artist-to-collector connection</span>
									</li>
									<li className="flex items-center gap-3 text-[#E3FEF7]/80">
										<div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#5C8374] to-[#77B0AA]"></div>
										<span>Support independent creative work</span>
									</li>
								</ul>
							</div>
						</motion.div>
					</div>

					{/* Process Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="mb-16"
					>
						<h2 className="text-3xl font-bold text-white text-center mb-12">
							The Creative <span className="bg-gradient-to-r from-[#9EC8B9] to-[#E3FEF7] bg-clip-text text-transparent">Process</span>
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							{[
								{
									step: "01",
									title: "Concept & Sketch",
									description: "Initial ideas and rough sketches",
									icon: "✏️",
									color: "from-[#5C8374] to-[#77B0AA]"
								},
								{
									step: "02",
									title: "Line Art",
									description: "Clean line work and detailing",
									icon: "🎨",
									color: "from-[#77B0AA] to-[#9EC8B9]"
								},
								{
									step: "03",
									title: "Coloring",
									description: "Color theory and shading",
									icon: "🌈",
									color: "from-[#9EC8B9] to-[#E3FEF7]"
								},
								{
									step: "04",
									title: "Final Polish",
									description: "High-res export & quality check",
									icon: "✨",
									color: "from-[#135D66] to-[#003C43]"
								}
							].map((stage, index) => (
								<div
									key={index}
									className="bg-gradient-to-b from-[#1B4242]/50 to-[#092635]/50 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl p-6 text-center hover:border-[#77B0AA] transition-all duration-300"
								>
									<div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r ${stage.color} flex items-center justify-center text-2xl`}>
										{stage.icon}
									</div>
									<div className="text-sm text-[#77B0AA] font-mono mb-2">{stage.step}</div>
									<h3 className="text-lg font-bold text-white mb-2">{stage.title}</h3>
									<p className="text-sm text-[#E3FEF7]/70">{stage.description}</p>
								</div>
							))}
						</div>
					</motion.div>

					{/* Why Choose Us */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="mb-16"
					>
						<div className="bg-gradient-to-r from-[#5C8374]/20 via-[#77B0AA]/20 to-[#9EC8B9]/20 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl p-8">
							<h2 className="text-3xl font-bold text-white text-center mb-8">
								Why Choose <span className="bg-gradient-to-r from-[#5C8374] to-[#77B0AA] bg-clip-text text-transparent">Pixaku?</span>
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center flex-shrink-0">
											<Award className="w-4 h-4 text-white" />
										</div>
										<div>
											<h3 className="text-lg font-semibold text-white">Authenticity Guaranteed</h3>
											<p className="text-[#E3FEF7]/80">Every piece is 100% original, drawn from scratch</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#77B0AA] to-[#9EC8B9] flex items-center justify-center flex-shrink-0">
											<Zap className="w-4 h-4 text-white" />
										</div>
										<div>
											<h3 className="text-lg font-semibold text-white">Instant Digital Delivery</h3>
											<p className="text-[#E3FEF7]/80">Get your high-res files immediately after purchase</p>
										</div>
									</div>
								</div>
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#9EC8B9] to-[#E3FEF7] flex items-center justify-center flex-shrink-0">
											<Heart className="w-4 h-4 text-[#092635]" />
										</div>
										<div>
											<h3 className="text-lg font-semibold text-white">Direct Artist Support</h3>
											<p className="text-[#E3FEF7]/80">90% of your purchase goes directly to the artist</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#135D66] to-[#003C43] flex items-center justify-center flex-shrink-0">
											<Star className="w-4 h-4 text-white" />
										</div>
										<div>
											<h3 className="text-lg font-semibold text-white">Premium Quality</h3>
											<p className="text-[#E3FEF7]/80">4K+ resolution, print-ready artwork</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Future Plans */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="mb-16"
					>
						<div className="bg-gradient-to-b from-[#1B4242]/80 to-[#092635]/80 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl p-8">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#9EC8B9] to-[#E3FEF7] flex items-center justify-center">
									<Brush className="w-8 h-8 text-[#092635]" />
								</div>
								<div>
									<h2 className="text-2xl font-bold text-white">What's Next?</h2>
									<p className="text-[#77B0AA]">Future Vision & Plans</p>
								</div>
							</div>
							<div className="space-y-4">
								<p className="text-[#E3FEF7]/90 leading-relaxed">
									Pixaku is just getting started. I'm currently working on opening commissions,
									releasing themed art collections, and expanding into new artistic styles.
									Every sale helps fuel more creativity and brings new ideas to life.
								</p>
								<div className="flex items-center gap-4 flex-wrap">
									<span className="px-3 py-1 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 rounded-full text-sm text-[#77B0AA]">
										🎭 Character Commissions
									</span>
									<span className="px-3 py-1 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 rounded-full text-sm text-[#77B0AA]">
										📚 Art Tutorials
									</span>
									<span className="px-3 py-1 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 rounded-full text-sm text-[#77B0AA]">
										🎨 Style Experiments
									</span>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Connect Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className="text-center"
					>
						<h2 className="text-2xl font-bold text-white mb-6">
							Let's Create Together
						</h2>
						<p className="text-[#E3FEF7]/80 max-w-2xl mx-auto mb-8">
							Have questions, commission ideas, or just want to chat about anime art?
							I'd love to connect with fellow art lovers!
						</p>
						<div className="flex justify-center gap-4">
							<button className="px-6 py-3 bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2">
								<Mail className="w-4 h-4" />
								Get in Touch
							</button>
							<button className="px-6 py-3 bg-gradient-to-r from-[#1B4242]/50 to-[#092635]/50 border border-[#5C8374]/30 text-[#77B0AA] font-medium rounded-lg hover:border-[#77B0AA] hover:text-[#E3FEF7] transition-all duration-200 flex items-center gap-2">
								<Instagram className="w-4 h-4" />
								Follow Journey
							</button>
						</div>
					</motion.div>

					{/* Final Message */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.7 }}
						className="mt-16 pt-8 border-t border-[#5C8374]/20 text-center"
					>
						<div className="flex items-center justify-center gap-2 mb-4">
							<Heart className="w-5 h-5 text-[#77B0AA]" />
							<span className="text-[#E3FEF7]/70 text-sm">
								Thank you for supporting independent art
							</span>
						</div>
						<p className="text-[#5C8374] text-sm">
							Every purchase helps create more art and keeps the passion alive
						</p>
					</motion.div>
				</div>
			</div>
		</div>
	);
}