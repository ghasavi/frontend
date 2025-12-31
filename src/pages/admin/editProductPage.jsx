import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Upload,
  Image,
  Package,
  Edit,
  Tag,
  DollarSign,
  Box,
  Calendar,
  Ruler,
  Palette,
  Layers,
  FileText,
  X,
  Save,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Eye
} from "lucide-react";
import mediaUpload from "../../utils/mediaUpload";
import api from "../../utils/axios";

export default function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentYear = new Date().getFullYear();

  /* ===================== STATE ===================== */
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState(null);

  // Form fields
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [description, setDescription] = useState("");

  const [displayImage, setDisplayImage] = useState(null);
  const [displayImagePreview, setDisplayImagePreview] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [price, setPrice] = useState("");
  const [labelledPrice, setLabelledPrice] = useState("");
  const [stock, setStock] = useState("");
  const [size, setSize] = useState("");
  const [medium, setMedium] = useState("");
  const [material, setMaterial] = useState("");
  const [year, setYear] = useState("");

  const [errors, setErrors] = useState({});

  /* ===================== FETCH PRODUCT ===================== */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        const data = res.data;
        setProduct(data);

        // Set form fields
        setProductId(data.productId || "");
        setName(data.name || "");
        setAltNames(data.altNames?.join(", ") || "");
        setDescription(data.description || "");
        setSize(data.size || "");
        setMedium(data.medium || "");
        setMaterial(data.material || "");
        setPrice(data.price?.toString() || "");
        setLabelledPrice(data.labelledPrice?.toString() || "");
        setStock(data.stock?.toString() || "");
        setYear(data.year?.toString() || "");

        // Handle images
        setDisplayImagePreview(data.displayImage || "");
        setExistingImages(data.images || []);
        setImagePreviews(data.images || []);

        setLoading(false);
        toast.success("Product loaded successfully! 📦");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch product. Redirecting...");
        setTimeout(() => navigate("/admin/products"), 1500);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  /* ===================== IMAGE HANDLING ===================== */
  const handleDisplayImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDisplayImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisplayImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    const actualIndex = existingImages.length + index;
    
    newImages.splice(index, 1);
    newPreviews.splice(actualIndex, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = (index) => {
    const newExistingImages = [...existingImages];
    const newPreviews = [...imagePreviews];
    
    newExistingImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setExistingImages(newExistingImages);
    setImagePreviews(newPreviews);
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
        if (Number(value) > currentYear) return "Year cannot be in the future";
        break;
      case "displayImage":
        if (!value && !displayImagePreview) return "Display image is required";
        break;
      case "images":
        if (imagePreviews.length === 0)
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

  /* ===================== SAVE CHANGES ===================== */
  const handleSave = async () => {
    if (!validateAllFields()) {
      toast.error("Please fix all errors before submitting ⚠️");
      return;
    }

    setSaving(true);
    try {
      // Upload new images
      const displayImageUrl = displayImage ? 
        await mediaUpload(displayImage) : 
        displayImagePreview;

      const newImageUrls = await Promise.all(
        images.map((img) => mediaUpload(img))
      );
      const allImageUrls = [...existingImages, ...newImageUrls];

      // Prepare updated product
      const updatedProduct = {
        productId,
        name,
        altNames: altNames ? altNames.split(",").map(n => n.trim()) : [],
        description,
        displayImage: displayImageUrl,
        images: allImageUrls,
        price: Number(price),
        labelledPrice: Number(labelledPrice),
        stock: Number(stock),
        size,
        medium,
        material,
        year: Number(year),
      };

      await api.put(`/products/${id}`, updatedProduct);
      toast.success("🎉 Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update product 😞");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#092635] via-[#1B4242] to-[#003C43] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-12 h-12 text-[#77B0AA] animate-spin" />
          <p className="text-[#E3FEF7] text-lg">Loading product...</p>
        </div>
      </div>
    );
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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/products")}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#E3FEF7]" />
          </motion.button>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#5C8374] to-[#77B0AA] flex items-center justify-center shadow-lg">
            <Edit className="w-7 h-7 text-[#E3FEF7]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#E3FEF7]">Edit Product</h1>
            <p className="text-[#E3FEF7]/70">
              Update product details and images
              <span className="ml-2 px-2 py-1 bg-[#77B0AA]/20 text-[#77B0AA] text-xs rounded-full">
                ID: {productId}
              </span>
            </p>
          </div>
          <Sparkles className="ml-auto text-[#5C8374] w-6 h-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-white/95 to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 p-6">
              <h3 className="text-lg font-bold text-[#092635] mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#5C8374]" />
                Product Preview
              </h3>
              
              {/* Display Image Preview */}
              <div className="mb-6">
                <div className="text-sm text-[#5C8374] mb-2">Display Image</div>
                <div className="relative">
                  {displayImagePreview ? (
                    <img
                      src={displayImagePreview}
                      alt="Display preview"
                      className="w-full h-48 object-cover rounded-xl border border-[#5C8374]/20"
                    />
                  ) : (
                    <div className="w-full h-48 bg-[#5C8374]/10 rounded-xl border-2 border-dashed border-[#5C8374]/30 flex items-center justify-center">
                      <Image className="w-12 h-12 text-[#5C8374]/30" />
                    </div>
                  )}
                </div>
              </div>

              {/* Current Gallery Images */}
              <div>
                <div className="text-sm text-[#5C8374] mb-2">Gallery Images ({imagePreviews.length})</div>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-[#5C8374]/20"
                      />
                      <button
                        type="button"
                        onClick={() => index < existingImages.length ? 
                          removeExistingImage(index) : 
                          removeNewImage(index - existingImages.length)
                        }
                        className="absolute -top-1 -right-1 w-5 h-5 bg-[#F44336] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-[#5C8374]/10">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-[#5C8374]/5 rounded-lg">
                    <div className="text-sm text-[#5C8374]">Price</div>
                    <div className="text-lg font-bold text-[#092635]">
                      Rs.{price ? Number(price).toFixed(2) : "0.00"}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-[#5C8374]/5 rounded-lg">
                    <div className="text-sm text-[#5C8374]">Stock</div>
                    <div className={`text-lg font-bold ${
                      stock <= 10 ? 'text-[#FF9800]' : 'text-[#4CAF50]'
                    }`}>
                      {stock || "0"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-white/95 to-[#E3FEF7]/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl shadow-[#003C43]/10 overflow-hidden">
              {/* Form Header */}
              <div className="p-6 border-b border-[#5C8374]/10 bg-gradient-to-r from-[#5C8374]/5 to-[#77B0AA]/5">
                <h2 className="text-xl font-bold text-[#092635]">Edit Product Information</h2>
                <p className="text-sm text-[#5C8374]">Update the fields below</p>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Product ID (read-only) */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                        <Tag className="w-4 h-4" />
                        Product ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={productId}
                          readOnly
                          className="w-full px-4 py-3 bg-[#5C8374]/5 border border-[#5C8374]/30 rounded-xl text-[#092635] font-mono cursor-not-allowed"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-xs bg-[#5C8374] text-white px-2 py-1 rounded-full">
                            Read Only
                          </span>
                        </div>
                      </div>
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
                    {/* Display Image Upload */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                        <Image className="w-4 h-4" />
                        Update Display Image
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
                          } rounded-xl p-4 text-center hover:border-[#77B0AA] transition-colors bg-white/50`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-[#5C8374]/50" />
                            <span className="text-[#5C8374]">Click to update display image</span>
                            <span className="text-xs text-[#5C8374]/50">Current image will be replaced</span>
                          </div>
                        </label>
                      </div>
                      {errors.displayImage && (
                        <div className="flex items-center gap-1 mt-1 text-[#F44336] text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.displayImage}
                        </div>
                      )}
                    </div>

                    {/* Gallery Images Upload */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[#5C8374] mb-2">
                        <Image className="w-4 h-4" />
                        Add Gallery Images
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
                          } rounded-xl p-4 text-center hover:border-[#77B0AA] transition-colors bg-white/50`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-[#5C8374]/50" />
                            <span className="text-[#5C8374]">Click to add more gallery images</span>
                            <span className="text-xs text-[#5C8374]/50">Select multiple images</span>
                          </div>
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
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/admin/products")}
                    className="px-6 py-3 bg-gradient-to-r from-[#9E9E9E] to-[#BDBDBD] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-gray-400/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2196F3] to-[#64B5F6] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#2196F3]/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}