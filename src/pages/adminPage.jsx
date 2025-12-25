import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import Loading from "../components/loading";

import AddProductPage from "./admin/addProductPage";
import AdminProductsPage from "./admin/productsPage";
import EditProductPage from "./admin/editProductPage";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminUsersPage from "./admin/adminUsersPage";

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("unauthenticated");
        navigate("/login");
        return;
      }

      try {
        const res = await api.get("/api/users/"); // token automatically included
        if (res.data.role !== "admin") {
          setStatus("unauthorized");
          toast.error("You are not authorized to access this page");
          navigate("/");
        } else {
          setStatus("authenticated");
        }
      } catch (err) {
        console.error(err);
        setStatus("unauthenticated");
        toast.error("You are not authenticated, please login");
        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  const getClass = (name) =>
    path.includes(name)
      ? "bg-[var(--color-accent)] text-white p-4 font-bold"
      : "text-[var(--color-accent)] p-4 font-semibold";

  if (status === "loading" || status === "unauthenticated") return <Loading />;

  return (
    <div className="w-full h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="h-full w-[300px] bg-white shadow-md flex flex-col">
        <Link className={getClass("products")} to="/admin/products">
          Products
        </Link>
        <Link className={getClass("users")} to="/admin/users">
          Users
        </Link>
        <Link className={getClass("orders")} to="/admin/orders">
          Orders
        </Link>
        <Link className={getClass("reviews")} to="/admin/reviews">
          Reviews
        </Link>
      </div>

      {/* Main Content */}
      <div className="h-full flex-1 p-4 bg-white rounded-xl shadow-md overflow-y-auto">
        <Routes>
          <Route path="/products" element={<AdminProductsPage />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/orders" element={<AdminOrdersPage />} />
          <Route path="/reviews" element={<h1>Reviews</h1>} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product" element={<EditProductPage />} />
        </Routes>
      </div>
    </div>
  );
}
