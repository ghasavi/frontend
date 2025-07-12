import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";

export default function EditProductPage() {
	const location = useLocation();
	const navigate = useNavigate();

	// 🛡️ redirect if page was refreshed and state is missing
	useEffect(() => {
		if (!location.state) {
			toast.error("Invalid access to edit page");
			navigate("/admin/products");
		}
	}, [location, navigate]);

	if (!location.state) return null;

	// ✅ Destructure with fallback
	const state = location.state;
	const [productId, setProductId] = useState(state.productId || "");
	const [name, setName] = useState(state.name || "");
	const [altNames, setAltNames] = useState(Array.isArray(state.altNames) ? state.altNames.join(",") : "");
	const [description, setDescription] = useState(state.description || "");
	const [images, setImages] = useState([]);
	const [labelledPrice, setLabelledPrice] = useState(state.labelledPrice || "");
	const [price, setPrice] = useState(state.price || "");
	const [stock, setStock] = useState(state.stock || "");

	async function updateProduct() {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("Please login first");
			return;
		}

		let imageUrls = state.images;

		const promisesArray = [];

		for (let i = 0; i < images.length; i++) {
			promisesArray[i] = mediaUpload(images[i]);
		}

		try {
			if (images.length > 0) {
				imageUrls = await Promise.all(promisesArray);
			}

			const altNamesArray = altNames.split(",").map((name) => name.trim());

			const product = {
				productId,
				name,
				altNames: altNamesArray,
				description,
				images: imageUrls,
				labelledPrice,
				price,
				stock,
			};

			await axios.put(
				import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId,
				product,
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);

			toast.success("Product updated successfully");
			navigate("/admin/products");
		} catch (e) {
			console.log(e);
			toast.error(e.response?.data?.message || "Failed to update");
		}
	}

	return (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<h1 className="text-3xl font-bold mb-4">Edit Product</h1>
			<input
				type="text"
				disabled
				placeholder="Product ID"
				className="input input-bordered w-full max-w-xs"
				value={productId}
				onChange={(e) => setProductId(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Name"
				className="input input-bordered w-full max-w-xs"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Alt Names"
				className="input input-bordered w-full max-w-xs"
				value={altNames}
				onChange={(e) => setAltNames(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Description"
				className="input input-bordered w-full max-w-xs"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<input
				type="file"
				placeholder="Images"
				multiple
				className="input input-bordered w-full max-w-xs"
				onChange={(e) => setImages(e.target.files)}
			/>
			<input
				type="number"
				placeholder="Labelled Price"
				className="input input-bordered w-full max-w-xs"
				value={labelledPrice}
				onChange={(e) => setLabelledPrice(e.target.value)}
			/>
			<input
				type="number"
				placeholder="Price"
				className="input input-bordered w-full max-w-xs"
				value={price}
				onChange={(e) => setPrice(e.target.value)}
			/>
			<input
				type="number"
				placeholder="Stock"
				className="input input-bordered w-full max-w-xs"
				value={stock}
				onChange={(e) => setStock(e.target.value)}
			/>

			<div className="w-full flex justify-center flex-row items-center mt-4">
				<Link
					to="/admin/products"
					className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-4"
				>
					Cancel
				</Link>
				<button
					className="bg-green-500 text-white font-bold py-2 px-4 rounded"
					onClick={updateProduct}
				>
					Update Product
				</button>
			</div>
		</div>
	);
}
