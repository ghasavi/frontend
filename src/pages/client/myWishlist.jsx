import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { getWishlist, removeFromWishlist } from "../../utils/wishlist";

export default function MyWishlistPage() {
  const { user } = useContext(UserContext);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const wishlistKey = user?.email ? `wishlist_${user.email}` : null;

  useEffect(() => {
    if (!wishlistKey) return;
    const userWishlist = getWishlist(wishlistKey);
    setWishlist(userWishlist);
  }, [wishlistKey]);

  function handleRemove(productId) {
    if (!wishlistKey) return;
    removeFromWishlist(productId, wishlistKey);
    setWishlist(getWishlist(wishlistKey));
  }

  if (!user) return <p className="text-center mt-20">Login to see your wishlist 😤</p>;
  if (wishlist.length === 0) return <p className="text-center mt-20">Your wishlist is empty 💔</p>;

  return (
    <div className="w-full px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">My Wishlist ❤️</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {wishlist.map((item) => (
          <div key={item.productId} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-[260px] object-cover rounded-t-2xl cursor-pointer"
              onClick={() => navigate(`/overview/${item.productId}`)}
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-accent font-bold text-lg mt-2">{Number(item.price).toFixed(2)}</p>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                onClick={() => handleRemove(item.productId)}
              >
                Remove ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
