import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductsPage from "./productsPage";
import AddProductsPage from "./addProductsPage";
import EditProductPage from "./editProductPage";
import AdminUsersPage from "./adminUsersPage";
import OrdersPage from "./ordersPage";
import DisplayOrderPage from "./displayOrderPage";
import NotFoundPage from "../client/notFoundPage";
import api from "../../utils/axios";

function AdminHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if logged-in user is admin
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/check-admin"); // correct backend route
        if (res.status === 200 && res.data.ok) setIsAdmin(true);
        else navigate("/auth"); // redirect non-admins
      } catch (err) {
        console.error("Admin check failed:", err);
        navigate("/auth");
      }
    })();
  }, [navigate]);

  if (!isAdmin) return null; // don't render until admin check passes

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="relative h-screen w-2/12 bg-white p-8 drop-shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <img
            src={user?.avatar || "/defaultUser.png"}
            alt="user avatar"
            className="w-16 h-16 rounded-full object-cover object-center"
          />
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{user?.username}</p>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <hr className="mt-4 mb-12" />

        <ul className="w-full space-y-6 text-lg font-semibold">
          <li>
            <Link
              className={`block rounded-lg p-2 ring-1 ring-gray-300 ${
                location.pathname.includes("dashboard")
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
              to="/admin/dashboard"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className={`block rounded-lg p-2 ring-1 ring-gray-300 ${
                location.pathname.includes("orders")
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
              to="/admin/orders"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              className={`block rounded-lg p-2 ring-1 ring-gray-300 ${
                location.pathname.includes("products")
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
              to="/admin/products"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              className={`block rounded-lg p-2 ring-1 ring-gray-300 ${
                location.pathname.includes("users")
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
              to="/admin/users"
            >
              Users
            </Link>
          </li>
        </ul>

        <Link to="/auth">
          <p className="absolute bottom-4 left-1/2 w-10/12 -translate-x-1/2 rounded-md bg-red-400 px-4 py-2 text-center text-lg font-semibold text-white hover:bg-red-500">
            Sign Out
          </p>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <Routes>
          <Route path="/dashboard" element={<div>Welcome to Admin Dashboard</div>} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/add-products" element={<AddProductsPage />} />
          <Route path="/edit-products/:id" element={<EditProductPage />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/order-info/:id" element={<DisplayOrderPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminHome;
