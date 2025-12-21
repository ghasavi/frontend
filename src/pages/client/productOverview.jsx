import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";
import { addToCart, getCart } from "../../utils/cart";

export default function ProductOverviewPage() {
	const { id: productId } = useParams();
	const navigate = useNavigate();

	const [status, setStatus] = useState("loading"); // loading | success | error
	const [product, setProduct] = useState(null);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
			.then((res) => {
				setProduct(res.data);
				setStatus("success");
			})
			.catch((err) => {
				console.error(err);
				setStatus("error");
				toast.error("Error fetching product details");
			});
	}, [productId]);

	if (status === "loading") return <Loading />;
	if (status === "error") return null;

	/* 🔐 HARD DATA SAFETY */
	const price = Number(product?.price) || 0;
	const labelledPrice = Number(product?.labelledPrice) || 0;
	const images = product?.images || [];
	const altNames = product?.altNames || [];

	return (
		<div className="w-full h-full flex flex-col md:flex-row md:max-h-full md:overflow-y-scroll pt-4">
			
			{/* MOBILE TITLE */}
			<h1 className="w-full md:hidden block my-8 text-center text-4xl text-secondary font-semibold">
				{product?.name}
				{altNames.map((altName, index) => (
					<span key={index} className="text-4xl text-gray-600">
						{" | " + altName}
					</span>
				))}
			</h1>

			{/* IMAGES */}
			<div className="w-full md:w-[50%] md:h-full flex justify-center">
				<ImageSlider images={images} />
			</div>

			{/* DETAILS */}
			<div className="w-full md:w-[50%] flex justify-center md:h-full">
				<div className="w-full md:w-[500px] md:h-[600px] flex flex-col items-center">

					{/* DESKTOP TITLE */}
					<h1 className="w-full hidden md:block text-center text-4xl text-secondary font-semibold">
						{product?.name}
						{altNames.map((altName, index) => (
							<span key={index} className="text-4xl text-gray-600">
								{" | " + altName}
							</span>
						))}
					</h1>

					{/* PRODUCT ID */}
					<h1 className="w-full text-center my-2 text-md text-gray-600 font-semibold">
						{product?.productId}
					</h1>

					{/* DESCRIPTION */}
					<p className="w-full text-center my-2 text-md text-gray-600 font-semibold">
						{product?.description}
					</p>

					{/* ADDITIONAL DETAILS */}
					<div className="w-full text-center my-2 text-md text-gray-600 font-semibold space-y-1">
						{product?.size && (
							<p>
								<span className="font-bold">Size:</span> {product.size}
							</p>
						)}
						{product?.medium && (
							<p>
								<span className="font-bold">Medium:</span> {product.medium}
							</p>
						)}
						{product?.material && (
							<p>
								<span className="font-bold">Material:</span> {product.material}
							</p>
						)}
						{product?.year && (
							<p>
								<span className="font-bold">Year:</span> {product.year}
							</p>
						)}
					</div>

					{/* PRICE */}
					{labelledPrice > price ? (
						<div>
							<span className="text-4xl mx-4 text-gray-500 line-through">
								{labelledPrice.toFixed(2)}
							</span>
							<span className="text-4xl mx-4 font-bold text-accent">
								{price.toFixed(2)}
							</span>
						</div>
					) : (
						<span className="text-4xl mx-4 font-bold text-accent">
							{price.toFixed(2)}
						</span>
					)}

					{/* ACTIONS */}
					<div className="w-full flex flex-col md:flex-row gap-2 justify-center items-center mt-4">
						<button
							className="w-[200px] h-[50px] mx-4 cursor-pointer bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300"
							onClick={() => {
								addToCart(product, 1);
								console.log("Cart:", getCart());
							}}
						>
							Add to Cart
						</button>

						<button
							className="w-[200px] h-[50px] mx-4 cursor-pointer bg-accent text-white rounded-2xl hover:bg-accent/80 transition-all duration-300"
							onClick={() =>
								navigate("/checkout", {
									state: {
										cart: [
											{
												productId: product?.productId,
												name: product?.name,
												image: images?.[0] || "",
												price,
												labelledPrice,
												qty: 1,
											},
										],
									},
								})
							}
						>
							Buy Now
						</button>
					</div>

				</div>
			</div>
		</div>
	);
}
