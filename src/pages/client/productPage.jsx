import { useEffect, useState } from "react";
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";
import toast from "react-hot-toast";
import api from "../../utils/axios"; // ✅ your axios instance

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Helper to normalize API response
  const normalizeProducts = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.products && Array.isArray(data.products)) return data.products;
    return [];
  };

  // Fetch all products initially
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products", {
          headers: {
            "ngrok-skip-browser-warning": "1", // bypass Ngrok free plan warning page
          },
        });
        console.log("Fetched products:", res.data); // debug log
        setProducts(normalizeProducts(res.data));
      } catch (err) {
        toast.error("Error fetching products");
        console.error("Fetch products error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading && query.length === 0) fetchProducts();
  }, [isLoading, query]);

  // Handle search input
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsLoading(true);

    try {
      let response;
      if (value.length === 0) {
        response = await api.get("/products", {
          headers: { "ngrok-skip-browser-warning": "1" },
        });
      } else {
        response = await api.get(`/products/search/${value}`, {
          headers: { "ngrok-skip-browser-warning": "1" },
        });
      }
      console.log("Search response:", response.data); // debug log
      setProducts(normalizeProducts(response.data));
    } catch (error) {
      toast.error("Error fetching products");
      console.error("Search products error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for products..."
        className="w-[300px] h-[40px] px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
        value={query}
        onChange={handleSearch}
      />

      {/* Products Display */}
      <div className="w-full h-full flex flex-row flex-wrap justify-center items-center">
        {isLoading ? (
          <Loading />
        ) : products.length === 0 ? (
          <h1 className="text-2xl text-secondary font-semibold">
            {query.length === 0
              ? "No products available"
              : "No products match your search"}
          </h1>
        ) : (
          products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
