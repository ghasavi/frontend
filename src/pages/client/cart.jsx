import { useState, useEffect } from "react";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    try {
      const res = await api.get("/users/cart");
      const cartData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.cart)
        ? res.data.cart
        : [];
      setCart(cartData);
    } catch (err) {
      console.error("FETCH CART ERROR:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= UPDATE QTY ================= */
  const updateCartItem = async (productId, qtyChange) => {
    const updatedCart = cart
      .map((item) => {
        if (item.productId === productId) {
          const newQty = item.qty + qtyChange;
          return { ...item, qty: newQty > 0 ? newQty : 0 };
        }
        return item;
      })
      .filter((item) => item.qty > 0);

    try {
      const res = await api.put("/users/cart", { cart: updatedCart });
      const cartData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.cart)
        ? res.data.cart
        : updatedCart;
      setCart(cartData);
    } catch (err) {
      console.error("UPDATE CART ERROR:", err);
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (productId) => {
    try {
      const res = await api.put("/users/cart", {
        cart: cart.filter((item) => item.productId !== productId),
      });
      const cartData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.cart)
        ? res.data.cart
        : [];
      setCart(cartData);
      setSelectedIds((prev) => prev.filter((id) => id !== productId));
    } catch (err) {
      console.error("REMOVE ITEM ERROR:", err);
    }
  };

  /* ================= SELECTION ================= */
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

  /* ================= TOTALS ================= */
  const itemTotal = selectedItems.reduce(
    (sum, item) =>
      sum +
      Number(item.labelledPrice || item.price || 0) *
        Number(item.qty || 1),
    0
  );
  const finalTotal = selectedItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.qty || 1),
    0
  );
  const discount = itemTotal - finalTotal;
  const canCheckout = selectedItems.length > 0;

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    if (!canCheckout) return;
    navigate("/checkout", { state: { cart: selectedItems } });
  };

  /* ================= ORDER SUMMARY COMPONENT ================= */
  const OrderSummary = () => (
    <div className="bg-white shadow-2xl rounded-2xl p-6 flex flex-col w-full md:w-[350px]">
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
        className={`w-full py-3 rounded-xl font-bold transition ${
          canCheckout
            ? "bg-accent text-white hover:bg-secondary"
            : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
      >
        Checkout
      </button>
    </div>
  );

  /* ================= RENDER ================= */
  return (
    <div className="w-full h-full flex flex-col items-center pt-4 relative">
      {/* EMPTY CART */}
      {cart.length === 0 && (
        <p className="text-xl text-gray-500 mt-20">Your cart is empty 🛒</p>
      )}

      {/* SELECT ALL */}
      {cart.length > 0 && (
        <div className="w-[70%] md:w-[600px] flex justify-between mb-4">
          <button
            onClick={toggleSelectAll}
            className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold"
          >
            {isAllSelected ? "Unselect All" : "Select All"}
          </button>
          <p className="text-sm text-gray-600">
            {selectedItems.length} selected
          </p>
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
            className={`w-[70%] md:w-[600px] my-4 rounded-3xl shadow-xl flex items-center p-4 ${
              isSelected ? "bg-primary" : "bg-gray-200"
            }`}
          >
            <button
              onClick={() => toggleSelect(item.productId)}
              className={`mr-4 w-6 h-6 rounded-full border-2 ${
                isSelected
                  ? "bg-accent border-accent"
                  : "border-gray-400 bg-white"
              }`}
            />

            <img
              src={item.image}
              alt={item.name}
              className="w-[80px] h-[80px] object-cover rounded-xl"
            />

            <div className="flex-1 pl-4">
              <h1 className="font-semibold text-secondary">{item.name}</h1>
              {labelledPrice > price ? (
                <div>
                  <span className="line-through text-gray-500 mr-2">
                    {labelledPrice.toFixed(2)}
                  </span>
                  <span className="font-bold text-accent">
                    {price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-accent">{price.toFixed(2)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={qty <= 1}
                onClick={() => updateCartItem(item.productId, -1)}
                className="p-2 rounded bg-accent text-white disabled:bg-gray-400"
              >
                <BiMinus />
              </button>
              <span className="font-semibold">{qty}</span>
              <button
                onClick={() => updateCartItem(item.productId, 1)}
                className="p-2 rounded bg-accent text-white"
              >
                <BiPlus />
              </button>
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              className="ml-4 text-red-600"
            >
              <BiTrash />
            </button>
          </div>
        );
      })}

      {/* DESKTOP SUMMARY */}
      <div className="hidden md:absolute md:top-4 md:right-4 md:flex z-50">
        <OrderSummary />
      </div>

      {/* MOBILE SUMMARY */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 w-full md:hidden p-4">
          <OrderSummary />
        </div>
      )}
    </div>
  );
}
