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
import Footer from "../components/footer";

function LandingPage() {
	const navigate = useNavigate();

	return (
		<div className="w-full h-full flex flex-col items-center justify-center px-6 text-white bg-gradient-to-br from-black via-zinc-900 to-black">
			<div className="max-w-5xl w-full flex flex-col items-center text-center">
				<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
					Pixaku
				</h1>

				<p className="mt-6 text-lg text-zinc-300 max-w-xl">
					Original anime artwork drawn by me.  
					No AI. No reposts. Just pure hand-drawn anime vibes.
				</p>

				<div className="mt-10 flex gap-4">
					<button
						onClick={() => navigate("/products")}
						className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
					>
						View Artworks
					</button>

					<button
						onClick={() => navigate("/about")}
						className="px-8 py-3 rounded-xl border border-zinc-600 hover:bg-zinc-800 transition"
					>
						About the Artist
					</button>
				</div>
			</div>

			{/* Artist values */}
			<div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
				<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
					<h3 className="text-xl font-semibold">100% Original</h3>
					<p className="text-zinc-400 mt-2">
						Every piece is hand-drawn — no tracing, no AI shortcuts.
					</p>
				</div>

				<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
					<h3 className="text-xl font-semibold">High-Res Files</h3>
					<p className="text-zinc-400 mt-2">
						Perfect for wallpapers, prints, and profiles.
					</p>
				</div>

				<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
					<h3 className="text-xl font-semibold">Support an Artist</h3>
					<p className="text-zinc-400 mt-2">
						Buying here directly supports my art journey.
					</p>
				</div>
			</div>
		</div>
	);
}

export default function HomePage() {
	return (
		<div className="w-full min-h-screen flex flex-col">
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
					<Route path="/overview/:id" element={<ProductOverviewPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</div>
			<Footer />
		</div>
	);
}

