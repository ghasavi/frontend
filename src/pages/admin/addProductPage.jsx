import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import axios from "axios";

export default function AddProductPage() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [description, setDescription] = useState("");

  const [displayImage, setDisplayImage] = useState(null);
  const [images, setImages] = useState([]);

  const [labelledPrice, setLabelledPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [size, setSize] = useState("");
  const [material, setMaterial] = useState("");
  const [year, setYear] = useState("");

  const navigate = useNavigate();

  async function AddProduct() {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Login first");

    if (!displayImage) return toast.error("Display image is required");
    if (images.length === 0) return toast.error("Add at least one gallery image");

    try {
      // upload display image
      const displayImageUrl = await mediaUpload(displayImage);

      // upload gallery images
      const imageUrls = await Promise.all(
        Array.from(images).map((img) => mediaUpload(img))
      );

      const product = {
        productId,
        name,
        altNames: altNames.split(",").map(n => n.trim()),
        description,
        displayImage: displayImageUrl,
        images: imageUrls,
        labelledPrice,
        price,
        stock,
        size,
        material,
        year,
      };

      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/products",
        product,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      toast.success("Product added 🔥");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-3">
      <input className="input input-bordered w-full" placeholder="Product ID" onChange={e=>setProductId(e.target.value)} />
      <input className="input input-bordered w-full" placeholder="Name" onChange={e=>setName(e.target.value)} />
      <input className="input input-bordered w-full" placeholder="Alt Names (comma separated)" onChange={e=>setAltNames(e.target.value)} />
      <textarea className="textarea textarea-bordered w-full" placeholder="Description" onChange={e=>setDescription(e.target.value)} />

      {/* DISPLAY IMAGE */}
      <label className="font-semibold">Display Image</label>
      <input type="file" className="file-input file-input-bordered w-full" onChange={e=>setDisplayImage(e.target.files[0])} />

      {/* GALLERY IMAGES */}
      <label className="font-semibold">Gallery Images</label>
      <input type="file" multiple className="file-input file-input-bordered w-full" onChange={e=>setImages(e.target.files)} />

      <input type="number" className="input input-bordered w-full" placeholder="Labelled Price" onChange={e=>setLabelledPrice(e.target.value)} />
      <input type="number" className="input input-bordered w-full" placeholder="Price" onChange={e=>setPrice(e.target.value)} />
      <input type="number" className="input input-bordered w-full" placeholder="Stock" onChange={e=>setStock(e.target.value)} />
      <input className="input input-bordered w-full" placeholder="Size" onChange={e=>setSize(e.target.value)} />
      <input className="input input-bordered w-full" placeholder="Medium" onChange={e=>setMedium(e.target.value)} />
      <input className="input input-bordered w-full" placeholder="Material" onChange={e=>setMaterial(e.target.value)} />
      <input type="number" className="input input-bordered w-full" placeholder="Year" onChange={e=>setYear(e.target.value)} />

      <div className="flex justify-between mt-4">
        <Link to="/admin/products" className="btn btn-error">Cancel</Link>
        <button onClick={AddProduct} className="btn btn-success">Add Product</button>
      </div>
    </div>
  );
}
