import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import ProductPage from "./client/productPage";
import ProductOverviewPage from "./client/productOverview";
import CartPage from "./client/cart";
import CheckoutPage from "./client/checkOut";
import SearchProductPage from "./client/searchProducts";
import AboutPage from "./client/aboutPage";
import NotFoundPage from "./client/notFoundPage";

export default function HomePage() {
	return (
		<div className="w-full h-screen  flex flex-col items-center">
			<Header />
			<div className="w-full h-[calc(100vh-80px)]  flex flex-col items-center">
				<Routes path="/*">
					<Route
						path="/"
						element={
							<>
								
							</>
						}
					/>
					<Route path="/products" element={<ProductPage />} />
					<Route path="/about" element={<AboutPage/>} />
					<Route path="/contact" element={<h1>Contact</h1>} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/checkout" element={<CheckoutPage />} />
					<Route path="/search" element={<SearchProductPage />} />
					<Route path="/overview/:id" element={<ProductOverviewPage />} />
					<Route path="/*" element={<NotFoundPage/>} />
				</Routes>
			</div>
		</div>
	);
}