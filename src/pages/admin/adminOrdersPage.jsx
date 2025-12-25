import { useEffect, useState } from "react";
import api from "../../utils/axios"; // centralized axios
import Loading from "../../components/loading";
import Modal from "react-modal";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // delete order
  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      `Delete order ${orderId}? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
      toast.success("Order deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order");
    }
  };

  // update order status
  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/${status}`);
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
      );
      if (activeOrder?.orderId === orderId) {
        setActiveOrder({ ...activeOrder, status });
      }
      toast.success("Order status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full h-full max-h-full overflow-y-auto p-4 font-[var(--font-main)]">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto my-10 p-6 outline-none"
        overlayClassName="fixed inset-0 bg-[#00000040] flex justify-center items-center"
      >
        {activeOrder && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--color-accent)]">
              Order Details - {activeOrder.orderId}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Name:</span> {activeOrder.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {activeOrder.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {activeOrder.phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span> {activeOrder.address}
                </p>
              </div>

              <div>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`font-bold ${
                      activeOrder.status === "pending"
                        ? "text-yellow-500"
                        : activeOrder.status === "completed"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {activeOrder.status.toUpperCase()}
                  </span>
                  <select
                    value={activeOrder.status}
                    onChange={(e) => updateStatus(activeOrder.orderId, e.target.value)}
                    className="ml-2 border rounded p-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </select>
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(activeOrder.date).toLocaleDateString("en-GB")}
                </p>
                <p>
                  <span className="font-semibold">Total:</span>{" "}
                  {activeOrder.total.toLocaleString("en-LK", {
                    style: "currency",
                    currency: "LKR",
                  })}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-4">Products</h3>
            <table className="w-full text-center border border-gray-200 shadow rounded">
              <thead className="bg-[var(--color-accent)] text-white">
                <tr>
                  <th className="py-2 px-2">Image</th>
                  <th className="py-2 px-2">Product</th>
                  <th className="py-2 px-2">Price</th>
                  <th className="py-2 px-2">Quantity</th>
                  <th className="py-2 px-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {activeOrder.products.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-[var(--color-primary)]" : "bg-gray-100"}>
                    <td className="py-2 px-2">
                      <img
                        src={item.productInfo.images[0]}
                        alt={item.productInfo.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td>{item.productInfo.name}</td>
                    <td>
                      {item.productInfo.price.toLocaleString("en-LK", {
                        style: "currency",
                        currency: "LKR",
                      })}
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      {(item.productInfo.price * item.quantity).toLocaleString("en-LK", {
                        style: "currency",
                        currency: "LKR",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-secondary)] transition"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-secondary)] transition"
              >
                Print
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Orders table */}
      <table className="w-full text-center border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[var(--color-accent)] text-white">
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order.orderId}
              onClick={() => {
                setActiveOrder(order);
                setIsModalOpen(true);
              }}
              className={`cursor-pointer ${index % 2 === 0 ? "bg-[var(--color-primary)]" : "bg-gray-100"} hover:bg-gray-200 transition`}
            >
              <td>{order.orderId}</td>
              <td>{order.name}</td>
              <td>{order.email}</td>
              <td>{order.phone}</td>
              <td>
                {order.total.toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
              </td>
              <td>{new Date(order.date).toLocaleDateString("en-GB")}</td>
              <td className={`font-semibold ${
                order.status === "pending" ? "text-yellow-500" :
                order.status === "completed" ? "text-green-600" : "text-red-500"
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOrder(order.orderId);
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
