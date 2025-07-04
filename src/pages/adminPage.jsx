import { Routes, Route } from 'react-router-dom';
import AdminProductPage from './admin/adminProducts.jsx'; // Make sure the path is correct

export default function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Page</h1>
        <p className="mt-4 text-gray-600">Welcome to the admin page!</p>
      </div>

      <div className="mt-8 w-full flex justify-center">
        <Routes>
          <Route path="/products" element={<AdminProductPage />} />
          <Route path="/orders" element={<h1>Orders</h1>} />
          <Route path="/users" element={<h1>Users</h1>} />
          <Route path="/reviews" element={<h1>Reviews</h1>} />
        </Routes>
      </div>
    </div>
  );
}
