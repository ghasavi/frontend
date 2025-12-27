import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";
import { addToCart } from "../../utils/cart";
import { addToWishlist } from "../../utils/wishlist";
import { UserContext } from "../../context/UserContext";

export default function ProductOverviewPage() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const wishlistKey = user?.email ? `wishlist_${user.email}` : null;

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  /* ================= FETCH CURRENT PRODUCT ================= */
  useEffect(() => {
    if (!productId) {
      setStatus("error");
      setErrorMessage("Invalid product ID");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        if (!res.data || typeof res.data !== "object" || Array.isArray(res.data)) {
          setStatus("error");
          setErrorMessage("Invalid product data from server");
          return;
        }
        setProduct(res.data);
        setStatus("success");
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setErrorMessage(
          err.response?.data?.includes("<!DOCTYPE html>")
            ? "Ngrok tunnel might be expired. Update backend URL."
            : "Error fetching product details"
        );
        setStatus("error");
      }
    };

    fetchProduct();
  }, [productId]);

  /* ================= FETCH RELATED PRODUCTS ================= */
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await api.get("/products");
        const data = Array.isArray(res.data) ? res.data : [];
        const others = data.filter((p) => p.productId !== productId).slice(0, 3);
        setRelatedProducts(others);
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      }
    };
    fetchRelated();
  }, [productId]);

  if (status === "loading") return <Loading />;
  if (status === "error")
    return (
      <h2 className="text-center text-red-500 mt-20 px-4">
        {errorMessage || "Failed to load product"}
      </h2>
    );

  const price = Number(product?.price) || 0;
  const labelledPrice = Number(product?.labelledPrice) || 0;
  const images = Array.isArray(product?.images) ? product.images : [];
  const altNames = Array.isArray(product?.altNames) ? product.altNames : [];
  const stock = Number(product?.stock) || 0;
  const isOutOfStock = stock <= 0;

  return (
    <div className="w-full flex flex-col">
      {/* ================= CURRENT PRODUCT ================= */}
      <div className="w-full flex flex-col md:flex-row pt-4">
        {/* MOBILE TITLE */}
        <h1 className="w-full md:hidden block my-8 text-center text-4xl text-secondary font-semibold">
          {product?.name}
          {altNames.map((altName, index) => (
            <span key={index} className="text-4xl text-gray-600">{` | ${altName}`}</span>
          ))}
        </h1>

        {/* IMAGES */}
        <div className="w-full md:w-[50%] flex justify-center">
          <ImageSlider images={images} />
        </div>

        {/* DETAILS */}
        <div className="w-full md:w-[50%] flex justify-center">
          <div className="w-full md:w-[500px] flex flex-col items-center">
            {/* DESKTOP TITLE */}
            <h1 className="w-full hidden md:block text-center text-4xl text-secondary font-semibold">
              {product?.name}
              {altNames.map((altName, index) => (
                <span key={index} className="text-4xl text-gray-600">{` | ${altName}`}</span>
              ))}
            </h1>

            {/* DESCRIPTION */}
            <p className="w-full text-center my-2 text-md text-gray-600 font-semibold">
              {product?.description}
            </p>

            {/* ADDITIONAL DETAILS */}
            <div className="w-full text-center my-2 text-md text-gray-600 font-semibold space-y-1">
              {product?.size && <p><span className="font-bold">Size:</span> {product.size}</p>}
              {product?.medium && <p><span className="font-bold">Medium:</span> {product.medium}</p>}
              {product?.material && <p><span className="font-bold">Material:</span> {product.material}</p>}
              {product?.year && <p><span className="font-bold">Year:</span> {product.year}</p>}

              <p className={`mt-2 font-semibold text-center ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
                {isOutOfStock ? "Out of stock" : `In stock (${stock})`}
              </p>
            </div>

            {/* PRICE */}
            {labelledPrice > price ? (
              <div>
                <span className="text-4xl mx-4 text-gray-500 line-through">{labelledPrice.toFixed(2)}</span>
                <span className="text-4xl mx-4 font-bold text-accent">{price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-4xl mx-4 font-bold text-accent">{price.toFixed(2)}</span>
            )}

            {/* ACTIONS */}
            <div className="w-full flex flex-col md:flex-row gap-2 justify-center items-center mt-4">
              <button
                className={`w-[200px] h-[50px] mx-4 rounded-2xl transition-all duration-300 ${isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-accent text-white hover:bg-accent/80"}`}
                onClick={() => {
                  if (isOutOfStock) return toast.error("Out of stock 😭");
                  addToCart(product, 1);
                  toast.success("Added to cart 🛒");
                }}
              >
                Add to Cart
              </button>

              <button
                className={`w-[200px] h-[50px] mx-4 rounded-2xl transition-all duration-300 ${isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-accent text-white hover:bg-accent/80"}`}
                onClick={() => {
                  if (isOutOfStock) return toast.error("Out of stock 😭");
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
                  });
                }}
              >
                Buy Now
              </button>

              <button
                className="w-[200px] h-[50px] mx-4 rounded-2xl border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300"
                onClick={() => {
                  if (!user) return toast.error("Login first to save wishlist 😤");
                  const added = addToWishlist(product, wishlistKey);
                  if (added) toast.success("Added to wishlist ❤️");
                  else toast.error("Already in wishlist 😏");
                }}
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <div className="w-full mt-20 px-6">
          <h2 className="text-3xl text-secondary font-semibold text-center mb-10">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <div
                key={item.productId || item._id}
                className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => navigate(`/overview/${item.productId}`)}
              >
                <img
                  src={Array.isArray(item.images) ? item.images[0] : ""}
                  alt={item.name}
                  className="w-full h-[260px] object-cover rounded-t-2xl"
                />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold text-secondary">{item.name}</h3>
                  <p className="text-accent font-bold text-lg mt-2">{Number(item.price || 0).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
