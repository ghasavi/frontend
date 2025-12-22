import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";

export default function EditProductPage() {
	const location = useLocation();
	const navigate = useNavigate();

	// 🚨 redirect if refreshed
	useEffect(() => {
		if (!location.state) {
			toast.error("Invalid access to edit page");
			navigate("/admin/products");
		}
	}, [location, navigate]);

	if (!location.state) return null;

	const state = location.state;

	// ================= STATE =================
	const [productId] = useState(state.productId || ""); // 🔒 LOCKED
	const [name, setName] = useState(state.name || "");
	const [altNames, setAltNames] = useState(
		Array.isArray(state.altNames) ? state.altNames.join(", ") : ""
	);
	const [description, setDescription] = useState(state.description || "");

	const [displayImage, setDisplayImage] = useState(null);
	const [galleryImages, setGalleryImages] = useState([]);

	const [labelledPrice, setLabelledPrice] = useState(state.labelledPrice || 0);
	const [price, setPrice] = useState(state.price || 0);
	const [stock, setStock] = useState(state.stock || 0);

	const [size, setSize] = useState(state.size || "");
	const [medium, setMedium] = useState(state.medium || "");
	const [material, setMaterial] = useState(state.material || "");
	const [year, setYear] = useState(state.year || "");

	// ================= UPDATE PRODUCT =================
	async function updateProduct() {
		const token = localStorage.getItem("token");
		if (!token) return toast.error("Login first");

		try {
			let displayImageUrl = state.displayImage;
			let imageUrls = state.images || [];

			// upload new display image if selected
			if (displayImage) {
				displayImageUrl = await mediaUpload(displayImage);
			}

			// upload new gallery images if selected
			if (galleryImages.length > 0) {
				imageUrls = await Promise.all(
					Array.from(galleryImages).map((img) => mediaUpload(img))
				);
			}

			const product = {
				productId, // 🔒 unchanged
				name,
				altNames: altNames.split(",").map((n) => n.trim()),
				description,
				displayImage: displayImageUrl,
				images: imageUrls,
				labelledPrice,
				price,
				stock,
				size,
				medium,
				material,
				year,
			};

			await axios.put(
				import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId,
				product,
				{
					headers: { Authorization: "Bearer " + token },
				}
			);

			toast.success("Product updated 🔥");
			navigate("/admin/products");
		} catch (err) {
			console.error(err);
			toast.error("Failed to update product");
		}
	}

	// ================= UI =================
	return (
		<div className="w-full max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-3">

			{/* PRODUCT ID (LOCKED) */}
			<input
				className="input input-bordered w-full bg-gray-200 cursor-not-allowed"
				value={productId}
				disabled
			/>

			<input
				className="input input-bordered w-full"
				placeholder="Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>

			<input
				className="input input-bordered w-full"
				placeholder="Alt Names (comma separated)"
				value={altNames}
				onChange={(e) => setAltNames(e.target.value)}
			/>

			<textarea
				className="textarea textarea-bordered w-full"
				placeholder="Description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>

			{/* DISPLAY IMAGE */}
			<label className="font-semibold">Change Display Image (optional)</label>
			<input
				type="file"
				className="file-input file-input-bordered w-full"
				onChange={(e) => setDisplayImage(e.target.files[0])}
			/>

			{/* GALLERY IMAGES */}
			<label className="font-semibold">Change Gallery Images (optional)</label>
			<input
				type="file"
				multiple
				className="file-input file-input-bordered w-full"
				onChange={(e) => setGalleryImages(e.target.files)}
			/>

			<input
				type="number"
				className="input input-bordered w-full"
				placeholder="Labelled Price"
				value={labelledPrice}
				onChange={(e) => setLabelledPrice(e.target.value)}
			/>

			<input
				type="number"
				className="input input-bordered w-full"
				placeholder="Price"
				value={price}
				onChange={(e) => setPrice(e.target.value)}
			/>

			<input
				type="number"
				className="input input-bordered w-full"
				placeholder="Stock"
				value={stock}
				onChange={(e) => setStock(e.target.value)}
			/>

			<input
				className="input input-bordered w-full"
				placeholder="Size"
				value={size}
				onChange={(e) => setSize(e.target.value)}
			/>

			<input
				className="input input-bordered w-full"
				placeholder="Medium"
				value={medium}
				onChange={(e) => setMedium(e.target.value)}
			/>

			<input
				className="input input-bordered w-full"
				placeholder="Material"
				value={material}
				onChange={(e) => setMaterial(e.target.value)}
			/>

			<input
				type="number"
				className="input input-bordered w-full"
				placeholder="Year"
				value={year}
				onChange={(e) => setYear(e.target.value)}
			/>

			<div className="flex justify-between mt-4">
				<Link to="/admin/products" className="btn btn-error">
					Cancel
				</Link>
				<button onClick={updateProduct} className="btn btn-success">
					Update Product
				</button>
			</div>
		</div>
	);
}
