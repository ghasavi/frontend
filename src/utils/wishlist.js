// utils/wishlist.js

// Get wishlist for a specific user
export function getWishlist(key = "wishlist") {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Add to wishlist for a specific user
export function addToWishlist(product, key = "wishlist") {
  const wishlist = getWishlist(key);

  const exists = wishlist.find(item => item.productId === product.productId);
  if (exists) return false;

  wishlist.push({
    productId: product.productId,
    name: product.name,
    image: product.images?.[0] || "",
    price: product.price,
  });

  localStorage.setItem(key, JSON.stringify(wishlist));
  return true;
}

// Remove from wishlist for a specific user
export function removeFromWishlist(productId, key = "wishlist") {
  const wishlist = getWishlist(key).filter(item => item.productId !== productId);
  localStorage.setItem(key, JSON.stringify(wishlist));
}
