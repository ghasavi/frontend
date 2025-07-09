import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductOverview() {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data); // Save product details to state
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [productId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Overview</h1>
      {product ? (
        <div className="bg-white p-4 rounded shadow-md">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="w-48 h-48 object-cover rounded mb-4"
          />
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-gray-700 mt-2">{product.description}</p>
          <p className="mt-2 font-bold">Rs. {product.price}</p>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}
