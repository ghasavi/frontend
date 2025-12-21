import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={"/overview/" + product.productId}
      className="w-[300px] h-[400px] bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300 m-4 overflow-hidden flex flex-col border border-gray-100"
    >
      {/* IMAGE */}
      <div className="relative h-[220px] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
  src={product.displayImage}
  alt={product.name}
  className="h-full w-full object-cover transform hover:scale-105 transition"
/>

        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
        {/* Stock Badge */}
        <span
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${
            product.isAvailable && product.stock > 0
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {product.isAvailable && product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {product.name}
          </h2>
          <p className="text-sm text-gray-500 mt-2 h-[48px] overflow-hidden text-ellipsis line-clamp-3">
  {product.description || "No description available"}
</p>


          
        </div>

        {/* PRICING */}
        <div className="mt-4 flex flex-col gap-1">
          {product.labelledPrice !== product.price ? (
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-accent">
                Rs. {product.price.toLocaleString()}
              </p>
              <p className="text-gray-400 line-through text-sm">
                Rs. {product.labelledPrice.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold text-accent">
              Rs. {product.price.toLocaleString()}
            </p>
          )}
        </div>

        {/* BUY BUTTON */}
        <button
          disabled={!product.isAvailable || product.stock <= 0}
          className={`mt-4 w-full py-2 rounded-xl font-semibold text-white text-sm transition-colors duration-300 ${
            product.isAvailable && product.stock > 0
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {product.isAvailable && product.stock > 0 ? "Buy Now" : "Unavailable"}
        </button>
      </div>
    </Link>
  );
}
