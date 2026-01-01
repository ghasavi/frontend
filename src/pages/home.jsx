import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "../components/header";
import ProductPage from "./client/productPage";
import ProductOverviewPage from "./client/productOverview";
import CartPage from "./client/cart";
import CheckoutPage from "./client/checkOut";
import AboutPage from "./client/aboutPage";
import NotFoundPage from "./client/notFoundPage";
import ProfilePage from "./client/profile";
import EditProfile from "./client/editProfile";
import MyOrders from "./client/myOrders";
import MyReviews from "./client/myReviews";
import MyWishlistPage from "./client/myWishlist";
import Footer from "../components/footer";
import { Paintbrush, Sparkles, Palette, Heart, ArrowRight, Star, Brush, Zap, Target, Award, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

function LandingPage() {
	const navigate = useNavigate();

	const featuredArtworks = [
  {
    image: "/featured/20241225_180306.jpg",
    title: "Satoru Gojo"
  },
  {
    image: "/featured/20250226_173613.jpg",
    title: "Aki Hayakawa"
  },
  {
    image: "/featured/20241230_172738.jpg",
    title: "Ken Takakura"
  },
  {
    image: "/featured/20241224_171845.jpg",
    title: "Levi Ackerman"
  }
];

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] overflow-hidden">
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Floating color blobs */}
				<div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
				
				{/* Anime art style floating elements */}
				{[...Array(25)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							background: `linear-gradient(45deg, ${i % 3 === 0 ? '#5C8374' : i % 3 === 1 ? '#9EC8B9' : '#77B0AA'})`,
							opacity: 0.6 + Math.random() * 0.4
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
			<div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
				<div className="max-w-6xl w-full flex flex-col items-center text-center space-y-8 py-16">
					{/* Header Badge */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5C8374]/20 to-[#77B0AA]/20 backdrop-blur-sm rounded-full border border-[#5C8374]/30 mb-4"
					>
						<Sparkles className="w-4 h-4 text-[#E3FEF7]" />
						<span className="text-sm font-medium text-[#E3FEF7]">
							 Premium Anime Art Collection
						</span>
					</motion.div>

					{/* Main Logo */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8 }}
						className="relative"
					>
						<div className="absolute -inset-6 bg-gradient-to-r from-[#5C8374] via-[#77B0AA] to-[#5C8374] blur-3xl opacity-15 animate-gradient-x rounded-full" />
						<h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter relative">
							<span className="bg-gradient-to-r from-[#5C8374] via-[#E3FEF7] to-[#77B0AA] bg-clip-text text-transparent">
								PIXAKU
							</span>
						</h1>
						<p className="mt-4 text-lg text-[#77B0AA] font-light tracking-widest">
							Where Anime Dreams Become Art
						</p>
					</motion.div>

					{/* Tagline */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.1 }}
						className="max-w-3xl"
					>
						<p className="text-xl md:text-2xl text-[#E3FEF7]/90 font-light leading-relaxed">
							Original anime artwork drawn with passion.
							<br />
							<span className="italic text-[#9EC8B9]">No AI. Just pure hand-drawn creativity.</span>
						</p>
					</motion.div>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="flex flex-col sm:flex-row gap-4 mt-8"
					>
						<button
							onClick={() => navigate("/products")}
							className="group relative px-12 py-4 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] text-white font-bold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#5C8374]/40 flex items-center justify-center gap-3"
						>
							<Palette className="w-6 h-6" />
							Explore Art Gallery
							<ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
						</button>

						<button
							onClick={() => navigate("/about")}
							className="group px-12 py-4 rounded-xl border border-[#77B0AA]/50 bg-gradient-to-r from-[#1B4242]/40 to-[#092635]/40 backdrop-blur-sm text-[#E3FEF7] font-bold text-lg hover:border-[#9EC8B9] hover:shadow-lg hover:shadow-[#9EC8B9]/20 transition-all duration-300 flex items-center justify-center gap-3"
						>
							<Users className="w-6 h-6" />
							Meet the Artist
						</button>
					</motion.div>
				</div>

				

				{/* Artist Values */}
				<div className="mt-20 max-w-6xl w-full px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Why Choose{" "}
							<span className="bg-gradient-to-r from-[#9EC8B9] to-[#E3FEF7] bg-clip-text text-transparent">
								Pixaku?
							</span>
						</h2>
						<p className="text-xl text-[#E3FEF7]/70 max-w-2xl mx-auto">
							The premier marketplace for authentic anime artwork
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[
							{
								title: "100% Original",
								description: "Every stroke is hand-drawn — no AI, no tracing, just pure artistic expression.",
								icon: <CheckCircle className="w-8 h-8" />,
								color: "from-[#5C8374] to-[#77B0AA]"
							},
							{
								title: "High-Res Files",
								description: "4K+ resolution perfect for prints, wallpapers, and digital displays.",
								icon: <Target className="w-8 h-8" />,
								color: "from-[#77B0AA] to-[#9EC8B9]"
							},
							{
								title: "Direct Support",
								description: "Your purchase directly supports my art journey and enables more creations.",
								icon: <Heart className="w-8 h-8" />,
								color: "from-[#9EC8B9] to-[#E3FEF7]"
							}
						].map((value, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{ y: -8, scale: 1.02 }}
								className="group bg-gradient-to-b from-[#1B4242]/50 to-[#092635]/50 backdrop-blur-sm border border-[#5C8374]/30 rounded-2xl p-8 hover:border-[#77B0AA]/50 transition-all duration-300 cursor-pointer"
							>
								<div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${value.color} mb-6 shadow-lg`}>
									<div className="text-white">
										{value.icon}
									</div>
								</div>
								<h3 className="text-xl font-bold text-white mb-3">
									{value.title}
								</h3>
								<p className="text-[#E3FEF7]/80 leading-relaxed">
									{value.description}
								</p>
								<div className="mt-6 pt-6 border-t border-[#5C8374]/20">
									<div className="w-full h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Featured Art Preview */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="mt-24 max-w-7xl w-full px-4"
				>
					<div className="flex items-center justify-center gap-3 mb-10">
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#5C8374] to-transparent"></div>
						<h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
							<Paintbrush className="w-8 h-8 text-[#9EC8B9]" />
							<span className="bg-gradient-to-r from-[#77B0AA] to-[#E3FEF7] bg-clip-text text-transparent">
								Featured Artworks
							</span>
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#5C8374] to-transparent"></div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {featuredArtworks.map((art, index) => (
    <motion.div
      key={index}
      whileHover={{ scale: 1.05 }}
      className="group relative aspect-square rounded-xl overflow-hidden"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5C8374] via-[#77B0AA] to-[#5C8374] rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      
      <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#5C8374]/30 group-hover:border-[#77B0AA]/50 transition-all duration-500">
        <img
          src={art.image}
          alt={art.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
        <div className="absolute bottom-3 left-3">
          <p className="text-white text-sm font-semibold">{art.title}</p>
        </div>
      </div>
    </motion.div>
  ))}
</div>


					<div className="text-center mt-10">
						<button
							onClick={() => navigate("/products")}
							className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#1B4242] to-[#092635] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#1B4242]/30 transition-all duration-300 border border-[#5C8374]/30 hover:border-[#9EC8B9]/50"
						>
							View All Artworks
							<Zap className="w-4 h-4" />
						</button>
					</div>
				</motion.div>

				{/* Final CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="mt-24 mb-20 max-w-3xl w-full px-4"
				>
					<div className="bg-gradient-to-r from-[#5C8374]/20 via-[#77B0AA]/20 to-[#9EC8B9]/20 backdrop-blur-sm border border-[#77B0AA]/30 rounded-2xl p-10 text-center">
						<Award className="w-16 h-16 text-[#E3FEF7] mx-auto mb-6" />
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Ready to Discover{" "}
							<span className="bg-gradient-to-r from-[#5C8374] via-[#77B0AA] to-[#E3FEF7] bg-clip-text text-transparent">
								Amazing Art?
							</span>
						</h2>
						<p className="text-xl text-[#E3FEF7]/80 mb-8 max-w-2xl mx-auto">
							Join thousands of anime art collectors who've found their perfect masterpiece
						</p>
						<button
							onClick={() => navigate("/products")}
							className="group px-14 py-4 bg-gradient-to-r from-[#5C8374] via-[#77B0AA] to-[#5C8374] bg-[length:200%_100%] animate-gradient-x text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-[#77B0AA]/40 transition-all duration-300"
						>
							<span className="flex items-center justify-center gap-3">
								<Brush className="w-6 h-6" />
								Start Exploring Now
								<ArrowRight className="w-6 h-6 transform group-hover:translate-x-3 transition-transform" />
							</span>
						</button>
						<p className="text-[#77B0AA] text-sm mt-6">
							Sign-up required • 30-day satisfaction guarantee
						</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default function HomePage() {
	return (
		<div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-[#092635] via-[#1B4242] to-[#003C43]">
			<Header />
			<div className="w-full flex-1">
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/products" element={<ProductPage />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/checkout" element={<CheckoutPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/editProfile" element={<EditProfile />} />
					<Route path="/myorders" element={<MyOrders />} />
					<Route path="/reviews" element={<MyReviews />} />
					<Route path="/wishlist" element={<MyWishlistPage />} />
					<Route path="/overview/:id" element={<ProductOverviewPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</div>
			<Footer />
		</div>
	);
}