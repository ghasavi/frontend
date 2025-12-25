import { useEffect, useState } from "react";
import api from "../../utils/axios"; // centralized axios
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import Loading from "../../components/loading";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // delete product
  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this product?`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/products/${productId}`);
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="relative w-full h-full max-h-full overflow-y-auto p-4 font-[var(--font-main)]">
      <Link
        to="/admin/add-product"
        className="fixed bottom-6 right-6 bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] text-white font-bold py-3 px-5 rounded-full shadow-lg transition duration-300"
      >
        + Add Product
      </Link>

      <div className="overflow-x-auto">
        <table className="w-full text-center border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-[var(--color-accent)] text-white">
            <tr>
              <th className="py-3 px-2">Product ID</th>
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Image</th>
              <th className="py-3 px-2">Labelled Price</th>
              <th className="py-3 px-2">Price</th>
              <th className="py-3 px-2">Stock</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr
                key={item.productId}
                className={`${
                  index % 2 === 0 ? "bg-[var(--color-primary)]" : "bg-gray-100"
                } hover:bg-gray-200 transition`}
              >
                <td className="py-2 px-2">{item.productId}</td>
                <td className="py-2 px-2">{item.name}</td>
                <td className="py-2 px-2">
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-2">{item.labelledPrice}</td>
                <td className="py-2 px-2">{item.price}</td>
                <td className="py-2 px-2">{item.stock}</td>
                <td className="py-2 px-2">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => deleteProduct(item.productId)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash size={18} />
                    </button>
                    <button
                      onClick={() =>
                        navigate("/admin/edit-product", { state: item })
                      }
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <FaEdit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
