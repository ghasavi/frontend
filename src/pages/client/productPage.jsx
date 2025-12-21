import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";
import toast from "react-hot-toast";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Fetch all products initially
  useEffect(() => {
    if (isLoading && query.length === 0) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
        .then((res) => {
          setProducts(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          toast.error("Error fetching products");
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [isLoading, query]);

  // Handle search input
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsLoading(true);

    if (value.length === 0) {
      // Show all products if search is cleared
      try {
        const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products");
        setProducts(res.data);
      } catch (error) {
        toast.error("Error fetching products");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/products/search/" + value
      );
      setProducts(response.data);
    } catch (error) {
      toast.error("Error fetching products");
      console.error(error);
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
