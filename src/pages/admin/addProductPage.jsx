import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import api from "../../utils/axios";

export default function AddProductPage() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  /* ===================== STATE ===================== */
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [description, setDescription] = useState("");

  const [displayImage, setDisplayImage] = useState(null);
  const [images, setImages] = useState([]);

  const [labelledPrice, setLabelledPrice] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [size, setSize] = useState("");
  const [medium, setMedium] = useState("");
  const [material, setMaterial] = useState("");
  const [year, setYear] = useState("");

  const [errors, setErrors] = useState({});

  /* ===================== VALIDATION ===================== */
  function validateField(field, value, extra = {}) {
    switch (field) {
      case "productId":
      case "name":
      case "altNames":
      case "description":
      case "size":
      case "medium":
      case "material":
        if (!value.trim()) return "This field is required";
        break;

      case "price":
        if (value === "") return "Price is required";
        if (Number(value) <= 0) return "Price must be greater than 0";
        break;

      case "labelledPrice":
        if (value === "") return "Labelled price is required";
        if (Number(value) < 0) return "Cannot be negative";
        if (Number(value) >= Number(extra.price))
          return "Labelled price must be LOWER than price";
        break;

      case "stock":
        if (value === "") return "Stock is required";
        if (Number(value) < 0) return "Stock cannot be negative";
        break;

      case "year":
        if (!value) return "Year is required";
        if (Number(value) > currentYear)
          return "Year cannot be in the future";
        break;

      case "displayImage":
        if (!value) return "Display image is required";
        break;

      case "images":
        if (!value || value.length === 0)
          return "At least one gallery image required";
        break;

      default:
        return "";
    }
    return "";
  }

  function hasErrors() {
    return Object.values(errors).some(Boolean);
  }

  function validateAllFields() {
    const newErrors = {
      productId: validateField("productId", productId),
      name: validateField("name", name),
      altNames: validateField("altNames", altNames),
      description: validateField("description", description),
      price: validateField("price", price),
      labelledPrice: validateField("labelledPrice", labelledPrice, { price }),
      stock: validateField("stock", stock),
      size: validateField("size", size),
      medium: validateField("medium", medium),
      material: validateField("material", material),
      year: validateField("year", year),
      displayImage: validateField("displayImage", displayImage),
      images: validateField("images", images),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }

  /* ===================== SUBMIT ===================== */
  async function AddProduct() {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Login first");

    if (!validateAllFields()) {
      toast.error("Fix the errors before submitting");
      return;
    }

    try {
      const displayImageUrl = await mediaUpload(displayImage);
      const imageUrls = await Promise.all(
        Array.from(images).map((img) => mediaUpload(img))
      );

      const product = {
        productId,
        name,
        altNames: altNames
          ? altNames.split(",").map((n) => n.trim())
          : [],
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

      await api.post("/api/products", product);

      toast.success("Product added 🔥");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  }

  /* ===================== UI ===================== */
  return (
    <div className="w-full max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-3">

      {[
        ["Product ID", productId, setProductId, "productId"],
        ["Name", name, setName, "name"],
        ["Alt Names (comma separated)", altNames, setAltNames, "altNames"],
        ["Description", description, setDescription, "description", true],
        ["Size", size, setSize, "size"],
        ["Medium", medium, setMedium, "medium"],
        ["Material", material, setMaterial, "material"],
      ].map(([label, value, setter, key, textarea]) => (
        <div key={key}>
          {textarea ? (
            <textarea
              className={`textarea textarea-bordered w-full ${errors[key] && "border-red-500"}`}
              placeholder={label}
              value={value}
              onChange={(e) => {
                setter(e.target.value);
                setErrors(p => ({ ...p, [key]: validateField(key, e.target.value) }));
              }}
            />
          ) : (
            <input
              className={`input input-bordered w-full ${errors[key] && "border-red-500"}`}
              placeholder={label}
              value={value}
              onChange={(e) => {
                setter(e.target.value);
                setErrors(p => ({ ...p, [key]: validateField(key, e.target.value) }));
              }}
            />
          )}
          {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
        </div>
      ))}

      <input
        type="number"
        min="1"
        className={`input input-bordered w-full ${errors.price && "border-red-500"}`}
        placeholder="Price"
        value={price}
        onChange={(e) => {
          setPrice(e.target.value);
          setErrors(p => ({
            ...p,
            price: validateField("price", e.target.value),
            labelledPrice: validateField("labelledPrice", labelledPrice, { price: e.target.value })
          }));
        }}
      />
      {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

      <input
        type="number"
        min="0"
        className={`input input-bordered w-full ${errors.labelledPrice && "border-red-500"}`}
        placeholder="Labelled Price"
        value={labelledPrice}
        onChange={(e) => {
          setLabelledPrice(e.target.value);
          setErrors(p => ({
            ...p,
            labelledPrice: validateField("labelledPrice", e.target.value, { price })
          }));
        }}
      />
      {errors.labelledPrice && <p className="text-red-500 text-sm">{errors.labelledPrice}</p>}

      <input
        type="number"
        min="0"
        className={`input input-bordered w-full ${errors.stock && "border-red-500"}`}
        placeholder="Stock"
        value={stock}
        onChange={(e) => {
          setStock(e.target.value);
          setErrors(p => ({ ...p, stock: validateField("stock", e.target.value) }));
        }}
      />
      {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}

      {/* YEAR PICKER */}
      <input
        type="date"
        max={`${currentYear}-12-31`}
        className={`input input-bordered w-full ${errors.year && "border-red-500"}`}
        onChange={(e) => setYear(new Date(e.target.value).getFullYear())}
      />
      {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}

      <label className="font-semibold">Display Image</label>
      <input type="file" className="file-input file-input-bordered w-full"
        onChange={(e) => setDisplayImage(e.target.files[0])}
      />

      <label className="font-semibold">Gallery Images</label>
      <input type="file" multiple className="file-input file-input-bordered w-full"
        onChange={(e) => setImages(e.target.files)}
      />

      <div className="flex justify-between mt-4">
        <Link to="/admin/products" className="btn btn-error">Cancel</Link>
        <button onClick={AddProduct} className="btn btn-success">
          Add Product
        </button>
      </div>
    </div>
  );
}
