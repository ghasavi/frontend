import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  Image,
  PackagePlus,
  Tag,
  DollarSign,
  Box,
  Calendar,
  Ruler,
  Palette,
  Layers,
  FileText,
  X,
  Plus,
  Sparkles,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle
} from "lucide-react";
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
  const [displayImagePreview, setDisplayImagePreview] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [price, setPrice] = useState("");
  const [labelledPrice, setLabelledPrice] = useState("");
  const [stock, setStock] = useState("");
  const [size, setSize] = useState("");
  const [medium, setMedium] = useState("");
  const [material, setMaterial] = useState("");
  const [year, setYear] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  /* ===================== IMAGE HANDLING ===================== */
  const handleDisplayImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDisplayImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisplayImagePreview(reader.result);
        console.log("Preview set:", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e) => {
  const files = Array.from(e.target.files);
  setImages(files);

  Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  ).then((previews) => setImagePreviews(previews));
};


  const removeGalleryImage = (index) => {
  const newImages = [...images];
  const newPreviews = [...imagePreviews];
  newImages.splice(index, 1);
  newPreviews.splice(index, 1);
  setImages(newImages);
  setImagePreviews(newPreviews);

  // Re-validate images
  setErrors((p) => ({
    ...p,
    images: validateField("images", newImages),
  }));
};


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
        if (value === "") return "Original price is required";
        if (Number(value) < 0) return "Cannot be negative";
        if (extra.price && Number(value) <= Number(extra.price))
          return "Original price must be HIGHER than selling price";
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
  async function handleAddProduct() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first 🔐");
      return;
    }

    if (!validateAllFields()) {
      toast.error("Please fix all errors before submitting ⚠️");
      return;
    }

    setIsSubmitting(true);
    try {

      // Upload display image separately
const displayImageUrl = await mediaUpload(displayImage);

// Upload gallery images
const galleryUrls = await Promise.all(images.map((img) => mediaUpload(img)));


      // Prepare product data
      const product = {
        productId,
        name,
        altNames: altNames ? altNames.split(",").map((n) => n.trim()) : [],
        description,
        images: galleryUrls,
        displayImage: displayImageUrl,
        price: Number(price),
        labelledPrice: Number(labelledPrice),
        stock: Number(stock),
        size,
        medium,
        material,
        year: Number(year),
      };

      console.log("FINAL PRODUCT DATA:", {
  images: galleryUrls,
  displayImage: displayImageUrl,
});



await api.post("/products", product, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});


      toast.success("🎉 Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add product 😞");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] p-4 md:p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#5C8374]/10 to-[#9EC8B9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-[#135D66]/10 to-[#77B0AA]/10 rounded-full blur-3xl"></div>
        
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(45deg, ${i % 3 === 0 ? '#5C8374' : i % 3 === 1 ? '#9EC8B9' : '#77B0AA'})`
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            to="/admin/products"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#E3FEF7]" />
          </Link>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center shadow-lg">
            <PackagePlus className="w-7 h-7 text-[#E3FEF7]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#E3FEF7]">Add New Product</h1>
            <p className="text-[#E3FEF7]/70">
              Fill in the details to add a new product to your store
            </p>
          </div>
          <Sparkles className="ml-auto text-[#5C8374] w-6 h-6" />
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/95 to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden"
        >
          {/* Form Header */}
          <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
            <h2 className="text-xl font-bold text-[#092635]">Product Information</h2>
            <p className="text-sm text-[#5C8374]">All fields are required</p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Product ID */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <Tag className="w-4 h-4" />
                    Product ID
                  </label>
                  <input
                    type="text"
                    value={productId}
                    onChange={(e) => {
                      setProductId(e.target.value);
                      setErrors(p => ({ ...p, productId: validateField("productId", e.target.value) }));
                    }}
                    className={`w-full px-4 py-3 bg-white border ${
                      errors.productId ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                    } rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all`}
                    placeholder="Enter unique product ID"
                  />
                  {errors.productId && (
                    <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.productId}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <FileText className="w-4 h-4" />
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors(p => ({ ...p, name: validateField("name", e.target.value) }));
                    }}
                    className={`w-full px-4 py-3 bg-white border ${
                      errors.name ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                    } rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Alt Names */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <Tag className="w-4 h-4" />
                    Alternative Names
                  </label>
                  <input
                    type="text"
                    value={altNames}
                    onChange={(e) => {
                      setAltNames(e.target.value);
                      setErrors(p => ({ ...p, altNames: validateField("altNames", e.target.value) }));
                    }}
                    className={`w-full px-4 py-3 bg-white border ${
                      errors.altNames ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                    } rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all`}
                    placeholder="Comma separated alternative names"
                  />
                  {errors.altNames && (
                    <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.altNames}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors(p => ({ ...p, description: validateField("description", e.target.value) }));
                    }}
                    rows="4"
                    className={`w-full px-4 py-3 bg-white border ${
                      errors.description ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                    } rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all resize-none`}
                    placeholder="Enter detailed product description"
                  />
                  {errors.description && (
                    <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Size */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <Ruler className="w-4 h-4" />
                    Size
                  </label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => {
                      setSize(e.target.value);
                      setErrors(p => ({ ...p, size: validateField("size", e.target.value) }));
                    }}
                    className={`w-full px-4 py-3 bg-white border ${
                      errors.size ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                    } rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all`}
                    placeholder="e.g., 24x36 inches"
                  />
                  {errors.size && (
                    <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.size}
                    </div>
                  )}
                </div>

                {/* Medium */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <Palette className="w-4 h-4" />
                    Medium
                  </label>
                  <input
                    type="text"
                    value={medium}
                    onChange={(e) => {
                      setMedium(e.target.value);
                      setErrors(p => ({ ...p, medium: validateField("medium", e.target.value) }));
                    }}
                    className={`w-full px-4 py-3 bg-white border ${
                      errors.medium ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                    } rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all`}
                    placeholder="e.g., Oil on Canvas"
                  />
                  {errors.medium && (
                    <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.medium}
                    </div>
                  )}
                </div>

                {/* Material */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <Layers className="w-4 h-4" />
                    Material
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => {
                      setMaterial(e.target.value);
                      setErrors(p => ({ ...p, material: validateField("material", e.target.value) }));
                    }}
                    className={`w-full px-4 py-3 bg-white border ${
                      errors.material ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                    } rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all`}
                    placeholder="e.g., Canvas, Paper, etc."
                  />
                  {errors.material && (
                    <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.material}
                    </div>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <Calendar className="w-4 h-4" />
                    Year
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={currentYear}
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      setErrors(p => ({ ...p, year: validateField("year", e.target.value) }));
                    }}
                    className={`w-full px-4 py-3 bg-white border ${
                      errors.year ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                    } rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all`}
                    placeholder={`Year (max ${currentYear})`}
                  />
                  {errors.year && (
                    <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.year}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing and Stock Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Selling Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                  <DollarSign className="w-4 h-4 text-[#4CAF50]" />
                  Selling Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C8374]">Rs. </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      setErrors(p => ({
                        ...p,
                        price: validateField("price", e.target.value),
                        labelledPrice: validateField("labelledPrice", labelledPrice, { price: e.target.value })
                      }));
                    }}
                    className={`w-full pl-8 pr-4 py-3 bg-white border ${
                      errors.price ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                    } rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.price}
                  </div>
                )}
              </div>

              {/* Original Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                  <Tag className="w-4 h-4 text-[#FF9800]" />
                  Original Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C8374]">Rs. </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={labelledPrice}
                    onChange={(e) => {
                      setLabelledPrice(e.target.value);
                      setErrors(p => ({
                        ...p,
                        labelledPrice: validateField("labelledPrice", e.target.value, { price })
                      }));
                    }}
                    className={`w-full pl-8 pr-4 py-3 bg-white border ${
                      errors.labelledPrice ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                    } rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all`}
                    placeholder="0.00"
                  />
                </div>
                {errors.labelledPrice && (
                  <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.labelledPrice}
                  </div>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                  <Box className="w-4 h-4" />
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => {
                    setStock(e.target.value);
                    setErrors(p => ({ ...p, stock: validateField("stock", e.target.value) }));
                  }}
                  className={`w-full px-4 py-3 bg-white border ${
                    errors.stock ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                  } rounded-xl text-[#092635] placeholder:text-[#5C8374]/50 focus:outline-none focus:ring-2 focus:ring-[#77B0AA] focus:border-transparent transition-all`}
                  placeholder="Quantity available"
                />
                {errors.stock && (
                  <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.stock}
                  </div>
                )}
              </div>
            </div>

            {/* Images Section */}
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Display Image */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <Image className="w-4 h-4" />
                    Display Image (Main)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDisplayImageChange}
                      className="hidden"
                      id="display-image"
                    />
                    <label
                      htmlFor="display-image"
                      className={`block cursor-pointer border-2 border-dashed ${
                        errors.displayImage ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                      } rounded-xl p-6 text-center hover:border-[#77B0AA] transition-colors ${
                        displayImagePreview ? 'bg-white' : 'bg-white/50'
                      }`}
                    >
                      {displayImagePreview ? (
                        <div className="relative">
                          <img
                            src={displayImagePreview}
                            alt="Display preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-[#5C8374]/50" />
                          <span className="text-[#5C8374]">Click to upload display image</span>
                          <span className="text-xs text-[#5C8374]/50">Recommended: 800x800px</span>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.displayImage && (
                    <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.displayImage}
                    </div>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                    <Image className="w-4 h-4" />
                    Gallery Images
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesChange}
                      className="hidden"
                      id="gallery-images"
                    />
                    <label
                      htmlFor="gallery-images"
                      className={`block cursor-pointer border-2 border-dashed ${
                        errors.images ? 'border-[#F44336]' : 'border-[#5C8374]/30'
                      } rounded-xl p-4 text-center hover:border-[#77B0AA] transition-colors ${
                        imagePreviews.length > 0 ? 'bg-white' : 'bg-white/50'
                      }`}
                    >
                      {imagePreviews.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeGalleryImage(index);
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-[#F44336] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <div className="flex items-center justify-center h-20 border-2 border-dashed border-[#5C8374]/30 rounded-lg">
                            <Plus className="w-6 h-6 text-[#5C8374]/50" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-[#5C8374]/50" />
                          <span className="text-[#5C8374]">Click to upload gallery images</span>
                          <span className="text-xs text-[#5C8374]/50">Select multiple images</span>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.images && (
                    <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.images}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-[#5C8374]/10 mt-8">
              <Link to="/admin/products">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#9E9E9E] to-[#BDBDBD] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-gray-400/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Cancel
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddProduct}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#4CAF50]/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Add Product
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gradient-to-br from-white/95 to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-6"
        >
          <h3 className="text-lg font-bold text-[#092635] mb-4">Quick Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#5C8374]/5 rounded-xl">
              <div className="text-sm text-[#5C8374]">Product ID</div>
              <div className="text-lg font-bold text-[#092635] truncate">
                {productId || "Not set"}
              </div>
            </div>
            <div className="text-center p-4 bg-[#5C8374]/5 rounded-xl">
              <div className="text-sm text-[#5C8374]">Price</div>
              <div className="text-lg font-bold text-[#092635]">
                {price ? `Rs. ${Number(price).toFixed(2)}` : "Not set"}
              </div>
            </div>
            <div className="text-center p-4 bg-[#5C8374]/5 rounded-xl">
              <div className="text-sm text-[#5C8374]">Stock</div>
              <div className="text-lg font-bold text-[#092635]">
                {stock || "Not set"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}