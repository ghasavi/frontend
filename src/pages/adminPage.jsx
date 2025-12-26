import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import Loading from "../components/loading";

// Admin Pages
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("unauthenticated");
        navigate("/login");
        return;
      }

      try {
        // This route checks if user is admin
        const res = await api.get("/users/check-admin");
        if (res.data.user.role !== "admin") {
          setStatus("unauthorized");
          toast.error("You are not authorized to access this page");
          navigate("/");
        } else {
          setUser(res.data.user);
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
      ? "bg-blue-500 text-white p-4 font-bold"
      : "text-blue-500 p-4 font-semibold";

  if (status === "loading" || status === "unauthenticated") return <Loading />;

  return (
    <div className="w-full h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="h-full w-[300px] bg-white shadow-md flex flex-col p-6">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={user?.avatar || "/defaultUser.png"}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => (e.target.src = "/defaultUser.png")}
          />
          <div className="text-center">
            <p className="text-lg font-bold">{user?.username}</p>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-4 text-lg font-semibold">
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
        </nav>

        <Link to="/login" className="mt-auto">
          <p className="w-full text-center px-4 py-2 bg-red-400 rounded-md text-white hover:bg-red-500">
            Sign Out
          </p>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/products" element={<AdminProductsPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/orders" element={<AdminOrdersPage />} />
          <Route path="/reviews" element={<h1>Reviews</h1>} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
}
