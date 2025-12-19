import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import ProductsPage from "./Products";
import AddProductsPage from "./AddProducts";
import EditProductPage from "./EditProductsPage";
import UserPage from "./UsersPage";
import AdminPage from "./AdminsPage";
import AdminUsersPage from "./adminUsersPage";
import CreateAdminPage from "./RegisterAdmin";
import OrdersPage from "./OrdersPage";
import DisplayOrderPage from "./DisplayOrderPage";
import ProductReviews from "./ProductReviews";
import ManageReviews from "./ManageReviews";
import axios from "axios";
import NotFoundPage from "../client/notFoundPage";

function AdminHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/check-admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (
          response.status === 200 &&
          response.data.message === "Authorized access"
        ) {
          setIsAdmin(true);
          navigate("/admin/orders");
        }
      } catch (error) {
        navigate("/auth");
      }
    })();
  }, []);

  return (
    <>
      {isAdmin && (
        <div className="flex min-h-screen bg-gray-50">
          <aside className="relative h-screen w-2/10 bg-white p-8 drop-shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <img
                src={user.avatar}
                alt="user avatar"
                className="size-15 rounded-full object-cover object-center"
              />
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {user.username}
                </p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <hr className="mt-4 mb-12" />

            <ul className="w-full space-y-6 text-lg font-semibold">
              <li className="w-full">
                <Link
                  className={`cursor-pointer rounded-lg p-2 text-gray-800 ring-1 ring-gray-300 ${location.pathname.includes("orders") ? "bg-blue-500 text-white" : "bg-gray-100"} block`}
                  to={"/admin/orders"}
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  className={`cursor-pointer rounded-lg p-2 text-gray-800 ring-1 ring-gray-300 ${location.pathname.includes("products") ? "bg-blue-500 text-white" : "bg-gray-100"} block`}
                  to={"/admin/products"}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  className={`cursor-pointer rounded-lg p-2 text-gray-800 ring-1 ring-gray-300 ${location.pathname.includes("users") ? "bg-blue-500 text-white" : "bg-gray-100"} block`}
                  to={"/admin/users"}
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  className={`cursor-pointer rounded-lg p-2 text-gray-800 ring-1 ring-gray-300 ${location.pathname.includes("admins") ? "bg-blue-500 text-white" : "bg-gray-100"} block`}
                  to={"/admin/admins"}
                >
                  Admins
                </Link>
              </li>
              <li>
                <Link
                  className={`cursor-pointer rounded-lg p-2 text-gray-800 ring-1 ring-gray-300 ${location.pathname.includes("reviews") ? "bg-blue-500 text-white" : "bg-gray-100"} block`}
                  to={"/admin/reviews"}
                >
                  Reviews
                </Link>
              </li>
            </ul>

            <Link to={"/auth"}>
              <p className="absolute bottom-4 left-1/2 w-8/10 -translate-x-1/2 rounded-md bg-red-400 px-4 py-2 text-center text-lg font-semibold text-white hover:bg-red-500">
                Sign Out
              </p>
            </Link>
          </aside>

          <main className="h-screen flex-8/10 overflow-y-scroll bg-gray-50 p-8 inset-shadow-sm">
            <Routes>
              <Route path="/orders/" element={<OrdersPage />} />
              <Route path="/order-info" element={<DisplayOrderPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/add-products" element={<AddProductsPage />} />
              <Route path="/edit-products" element={<EditProductPage />} />
              <Route path="/reviews" element={<ProductReviews />} />
              <Route path="/manage-reviews" element={<ManageReviews />} />
              <Route path="/users" element={<AdminUsersPage />} />
              <Route path="/admins" element={<AdminPage />} />
              <Route path="/admins/add-admin" element={<CreateAdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      )}
    </>
  );
}

export default AdminHome;