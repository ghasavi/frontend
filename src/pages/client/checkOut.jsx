import { useState } from "react";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(location.state?.cart || []);

  /* ================= FORM STATE ================= */
  const [name, setName] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [village, setVillage] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const SHIPPING_FEE = 500;

  const PROVINCES = [
    { name: "Western", districts: ["Colombo", "Gampaha", "Kalutara"] },
    { name: "Central", districts: ["Kandy", "Matale", "Nuwara Eliya"] },
    { name: "Southern", districts: ["Galle", "Matara", "Hambantota"] },
    { name: "Northern", districts: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"] },
    { name: "Eastern", districts: ["Trincomalee", "Batticaloa", "Ampara"] },
    { name: "North Western", districts: ["Kurunegala", "Puttalam"] },
    { name: "North Central", districts: ["Anuradhapura", "Polonnaruwa"] },
    { name: "Uva", districts: ["Badulla", "Monaragala"] },
    { name: "Sabaragamuwa", districts: ["Ratnapura", "Kegalle"] },
  ];

  const districts = PROVINCES.find((p) => p.name === province)?.districts || [];

  /* ================= TOTALS ================= */
  const itemTotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.labelledPrice || item.price || 0) * Number(item.qty || 1),
    0
  );
  const subTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
    0
  );
  const discount = itemTotal - subTotal;
  const orderTotal = subTotal + SHIPPING_FEE;

  /* ================= CART ACTIONS ================= */
  const changeQty = (index, delta) => {
    const newCart = [...cart];
    const newQty = newCart[index].qty + delta;
    if (newQty <= 0) {
      newCart.splice(index, 1);
    } else {
      newCart[index].qty = newQty;
    }
    setCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  /* ================= VALIDATION ================= */
  const errors = {
    name: !name ? "Full name is required" : "",
    province: !province ? "Province is required" : "",
    district: !district ? "District is required" : "",
    city: !city ? "City is required" : "",
    address: !address ? "Address is required" : "",
    phone: !/^07\d{8}$/.test(phone) ? "Invalid Sri Lankan phone number" : "",
  };

  const canPlaceOrder =
    cart.length > 0 &&
    name &&
    province &&
    district &&
    city &&
    address &&
    /^07\d{8}$/.test(phone);

  /* ================= PLACE ORDER ================= */
  const placeOrder = () => {
    if (!canPlaceOrder) return;

    navigate("/payment", {
      state: {
        cart,
        name,
        phone,
        address: `${village ? village + ", " : ""}${city}, ${district}, ${province}. ${address}`,
        orderTotal,
      },
    });
  };

  return (
    <div className="w-full min-h-screen flex gap-6 p-6">

      {/* LEFT SIDE FORM */}
      <div className="flex-1 flex flex-col gap-6">

        <div className="bg-white shadow-2xl rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-secondary">Delivery Details</h2>

          <div className="mb-2">
            <input
              placeholder="Full Name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <select
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setDistrict("");
                }}
                className="input"
              >
                <option value="">Select Province</option>
                {PROVINCES.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
            </div>

            <div>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="input"
                disabled={!province}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
            </div>

            <input
              placeholder="City"
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              placeholder="Village (Optional)"
              className="input"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
            />
          </div>

          <div className="mb-2 mt-2">
            <textarea
              placeholder="Full Address"
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div className="mb-2">
            <input
              placeholder="07XXXXXXXX"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div className="mt-4">
            <p className="font-semibold">Payment Method</p>
            <div className="mt-2 px-4 py-2 border rounded-lg bg-gray-100">💳 Card Payment</div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="bg-white shadow-2xl rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-secondary">Items</h2>

          {cart.map((item, index) => (
            <div key={item.productId} className="flex items-center gap-4 mb-4">
              <img src={item.image} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-accent font-bold">Rs. {item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => changeQty(index, -1)} className="btn"><BiMinus /></button>
                <span>{item.qty}</span>
                <button onClick={() => changeQty(index, 1)} className="btn"><BiPlus /></button>
              </div>

              <button onClick={() => removeItem(index)} className="text-red-600"><BiTrash /></button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE ORDER SUMMARY */}
      <div className="w-[350px] h-fit bg-white shadow-2xl rounded-2xl p-6 sticky top-6">
        <h2 className="text-xl font-bold mb-4 text-secondary">Order Summary</h2>

        <div className="flex justify-between mb-2"><span>Items Total</span><span>Rs. {itemTotal.toFixed(2)}</span></div>
        <div className="flex justify-between mb-2 text-green-600"><span>Discount</span><span>- Rs. {discount.toFixed(2)}</span></div>
        <div className="flex justify-between mb-2"><span>Subtotal</span><span>Rs. {subTotal.toFixed(2)}</span></div>
        <div className="flex justify-between mb-2"><span>Shipping</span><span>Rs. {SHIPPING_FEE.toFixed(2)}</span></div>
        <hr className="my-3" />
        <div className="flex justify-between text-lg font-bold"><span>Order Total</span><span>Rs. {orderTotal.toFixed(2)}</span></div>

        <button
          onClick={placeOrder}
          disabled={!canPlaceOrder}
          className={`w-full mt-4 py-3 rounded-xl font-bold ${
            canPlaceOrder ? "bg-accent text-white hover:bg-secondary" : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
