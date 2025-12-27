import { useState, useEffect } from "react";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const token = localStorage.getItem("token"); // JWT from login

  // ---------------- FETCH CART ----------------
  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/users/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart || []);
    } catch (err) {
      console.error("FETCH CART ERROR:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ---------------- UPDATE CART ITEM QTY ----------------
  const updateCartItem = async (productId, qtyChange) => {
    const updatedCart = cart.map((item) => {
      if (item.productId === productId) {
        const newQty = item.qty + qtyChange;
        return { ...item, qty: newQty > 0 ? newQty : 0 };
      }
      return item;
    }).filter(item => item.qty > 0);

    try {
      const res = await axios.put(
        "/api/users/cart",
        { cart: updatedCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
    } catch (err) {
      console.error("UPDATE CART ERROR:", err);
    }
  };

  // ---------------- REMOVE ITEM ----------------
  const removeItem = async (productId) => {
    try {
      const res = await axios.put(
        "/api/users/cart/remove-purchased",
        { productIds: [productId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
      setSelectedIds((prev) => prev.filter((id) => id !== productId));
    } catch (err) {
      console.error("REMOVE ITEM ERROR:", err);
    }
  };

  // ---------------- SELECTION ----------------
  const toggleSelect = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isAllSelected = cart.length > 0 && selectedIds.length === cart.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(cart.map((item) => item.productId));
  };

  const selectedItems = cart.filter((item) =>
    selectedIds.includes(item.productId)
  );

  // ---------------- TOTALS ----------------
  const itemTotal = selectedItems.reduce(
    (sum, item) => sum + Number(item.labelledPrice || item.price || 0) * Number(item.qty || 1),
    0
  );

  const finalTotal = selectedItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
    0
  );

  const discount = itemTotal - finalTotal;
  const canCheckout = selectedItems.length > 0;

  // ---------------- CHECKOUT ----------------
  const handleCheckout = () => {
    if (!canCheckout) return;
    navigate("/checkout", { state: { cart: selectedItems } });
  };

  // ---------------- RENDER ----------------
  return (
    <div className="w-full h-full flex flex-col items-center pt-4 relative">

      {/* ORDER SUMMARY (DESKTOP) */}
      <div className="hidden md:flex w-[350px] absolute top-4 right-4 bg-white shadow-2xl rounded-2xl p-6 flex-col z-50">
        <h2 className="text-xl font-bold text-secondary mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2 text-gray-700">
          <span>Item Total</span>
          <span>Rs. {itemTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2 text-green-600">
          <span>Discount</span>
          <span>- Rs. {discount.toFixed(2)}</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between text-lg font-bold text-secondary mb-4">
          <span>Total</span>
          <span>Rs. {finalTotal.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={!canCheckout}
          className={`w-full py-3 rounded-xl font-bold transition ${canCheckout ? "bg-accent text-white hover:bg-secondary" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
        >
          Checkout
        </button>
      </div>

      {/* EMPTY CART */}
      {cart.length === 0 && (
        <p className="text-xl text-gray-500 mt-20">Your cart is empty 🛒</p>
      )}

      {/* SELECT ALL */}
      {cart.length > 0 && (
        <div className="w-[70%] md:w-[600px] flex justify-between mb-4">
          <button
            onClick={toggleSelectAll}
            className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-accent transition"
          >
            {isAllSelected ? "Unselect All" : "Select All"}
          </button>
          <p className="text-sm text-gray-600">{selectedItems.length} selected</p>
        </div>
      )}

      {/* CART ITEMS */}
      {cart.map((item) => {
        const price = Number(item.price) || 0;
        const labelledPrice = Number(item.labelledPrice) || 0;
        const qty = Number(item.qty) || 1;
        const isSelected = selectedIds.includes(item.productId);

        return (
          <div
            key={item.productId}
            className={`w-[70%] md:w-[600px] my-4 md:h-[100px] rounded-tl-3xl rounded-bl-3xl shadow-2xl flex flex-col md:flex-row relative items-center p-2 ${isSelected ? "bg-primary" : "bg-gray-200 opacity-80"}`}
          >
            {/* SELECT */}
            <button
              onClick={() => toggleSelect(item.productId)}
              className={`absolute left-[-35px] w-6 h-6 rounded-full border-2 ${isSelected ? "bg-accent border-accent" : "border-gray-400 bg-white"}`}
            />
            <img src={item.image} alt={item.name} className="w-[100px] h-[100px] object-cover rounded-3xl" />
            {/* INFO */}
            <div className="w-[250px] pl-4">
              <h1 className="text-xl font-semibold text-secondary">{item.name}</h1>
              {labelledPrice > price ? (
                <div>
                  <span className="line-through text-gray-500 mr-2">{labelledPrice.toFixed(2)}</span>
                  <span className="font-bold text-accent">{price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="font-bold text-accent">{price.toFixed(2)}</span>
              )}
            </div>
            {/* QTY */}
            <div className="w-[100px] flex justify-evenly items-center">
              <button
                disabled={qty <= 1}
                className={`p-2 rounded-xl ${qty <= 1 ? "bg-gray-400 cursor-not-allowed" : "bg-accent text-white hover:bg-secondary"}`}
                onClick={() => updateCartItem(item.productId, -1)}
              >
                <BiMinus />
              </button>
              <span className="font-semibold">{qty}</span>
              <button
                className="p-2 rounded-xl bg-accent text-white hover:bg-secondary"
                onClick={() => updateCartItem(item.productId, 1)}
              >
                <BiPlus />
              </button>
            </div>
            {/* REMOVE */}
            <button
              className="absolute right-[-35px] p-2 rounded-full text-red-600 hover:bg-red-600 hover:text-white"
              onClick={() => removeItem(item.productId)}
            >
              <BiTrash />
            </button>
          </div>
        );
      })}

      {/* MOBILE SUMMARY */}
      <div className="md:hidden w-full h-[120px] shadow-2xl flex flex-col items-center justify-center">
        <p className="text-xl font-bold text-secondary">
          Total: <span className="text-accent">Rs. {finalTotal.toFixed(2)}</span>
        </p>
        <button
          onClick={handleCheckout}
          disabled={!canCheckout}
          className={`mt-2 px-6 py-2 rounded-lg font-bold ${canCheckout ? "bg-accent text-white" : "bg-gray-400 text-gray-700"}`}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
