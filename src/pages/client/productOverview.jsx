import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";
import { addToWishlist } from "../../utils/wishlist";
import { UserContext } from "../../context/UserContext";

export default function ProductOverviewPage() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const wishlistKey = user?.email ? `wishlist_${user.email}` : null;

  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    if (!productId) {
      setStatus("error");
      setErrorMessage("Invalid product ID");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setProduct(res.data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setErrorMessage("Failed to load product");
      }
    };

    fetchProduct();
  }, [productId]);

  /* ================= FETCH RELATED ================= */
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await api.get("/products");
        const list = Array.isArray(res.data) ? res.data : [];
        setRelatedProducts(
          list.filter((p) => p.productId !== productId).slice(0, 3)
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchRelated();
  }, [productId]);

  if (status === "loading") return <Loading />;
  if (status === "error")
    return (
      <h2 className="text-center text-red-500 mt-20">
        {errorMessage}
      </h2>
    );

  /* ================= SAFE VALUES ================= */
  const price = Number(product?.price) || 0;
  const labelledPrice = Number(product?.labelledPrice) || 0;
  const images = Array.isArray(product?.images) ? product.images : [];
  const altNames = Array.isArray(product?.altNames) ? product.altNames : [];
  const stock = Number(product?.stock) || 0;
  const isOutOfStock = stock <= 0;

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (!user) return toast.error("Login first 😤");
    if (isOutOfStock) return toast.error("Out of stock 😭");

    try {
      const res = await api.get("/users/cart");

      const currentCart = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.cart)
        ? res.data.cart
        : [];

      const index = currentCart.findIndex(
        (item) => item.productId === product.productId
      );

      let updatedCart;

      if (index === -1) {
        updatedCart = [
          ...currentCart,
          {
            productId: product.productId,
            name: product.name,
            image: images[0] || "",
            price,
            labelledPrice,
            qty: 1,
          },
        ];
      } else {
        updatedCart = currentCart.map((item, i) =>
          i === index ? { ...item, qty: item.qty + 1 } : item
        );
      }

      await api.put("/users/cart", { cart: updatedCart });

      toast.success("Added to cart 🛒");
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
      toast.error("Failed to add to cart 😭");
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* ================= PRODUCT ================= */}
      <div className="w-full flex flex-col md:flex-row pt-6">
        {/* TITLE (MOBILE) */}
        <h1 className="md:hidden text-center text-4xl text-secondary font-semibold mb-6">
          {product.name}
          {altNames.map((a, i) => (
            <span key={i} className="text-gray-500">{` | ${a}`}</span>
          ))}
        </h1>

        {/* IMAGES */}
        <div className="w-full md:w-1/2 flex justify-center">
          <ImageSlider images={images} />
        </div>

        {/* DETAILS */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full md:w-[500px] flex flex-col items-center">
            {/* TITLE (DESKTOP) */}
            <h1 className="hidden md:block text-center text-4xl font-semibold text-secondary">
              {product.name}
              {altNames.map((a, i) => (
                <span key={i} className="text-gray-500">{` | ${a}`}</span>
              ))}
            </h1>

            {/* DESCRIPTION */}
            <p className="text-center text-gray-600 my-3">
              {product.description}
            </p>

            {/* EXTRA INFO */}
            <div className="text-center text-gray-600 space-y-1">
              {product.size && <p><b>Size:</b> {product.size}</p>}
              {product.medium && <p><b>Medium:</b> {product.medium}</p>}
              {product.material && <p><b>Material:</b> {product.material}</p>}
              {product.year && <p><b>Year:</b> {product.year}</p>}

              <p className={`font-semibold mt-2 ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
                {isOutOfStock ? "Out of stock" : `In stock (${stock})`}
              </p>
            </div>

            {/* PRICE */}
            <div className="my-4">
              {labelledPrice > price ? (
                <>
                  <span className="line-through text-gray-400 text-3xl mx-2">
                    {labelledPrice.toFixed(2)}
                  </span>
                  <span className="text-3xl font-bold text-accent mx-2">
                    {price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-accent">
                  {price.toFixed(2)}
                </span>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                className="w-[200px] h-[50px] rounded-2xl bg-accent text-white hover:bg-accent/80"
              >
                Add to Cart
              </button>

              <button
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      cart: [
                        {
                          productId: product.productId,
                          name: product.name,
                          image: images[0] || "",
                          price,
                          labelledPrice,
                          qty: 1,
                        },
                      ],
                    },
                  })
                }
                className="w-[200px] h-[50px] rounded-2xl bg-accent text-white hover:bg-accent/80"
              >
                Buy Now
              </button>

              <button
                onClick={() => {
                  if (!user) return toast.error("Login first 😤");
                  const ok = addToWishlist(product, wishlistKey);
                  ok
                    ? toast.success("Added to wishlist ❤️")
                    : toast.error("Already there 😏");
                }}
                className="w-[200px] h-[50px] rounded-2xl border-2 border-accent text-accent hover:bg-accent hover:text-white"
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RELATED ================= */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 px-6">
          <h2 className="text-3xl text-center font-semibold mb-10">
            You might also like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <div
                key={item.productId}
                onClick={() => navigate(`/overview/${item.productId}`)}
                className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-xl"
              >
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-full h-[260px] object-cover rounded-t-2xl"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-accent font-bold">
                    {Number(item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
