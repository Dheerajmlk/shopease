import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });

  const fetchWishlist = async () => {
    if (!user) { setWishlist({ products: [] }); return; }
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data);
    } catch { setWishlist({ products: [] }); }
  };

  useEffect(() => { fetchWishlist(); }, [user]);

  const toggleWishlist = async (productId) => {
    try {
      const res = await api.post("/wishlist/toggle", { productId });
      setWishlist(res.data);
      const isInList = res.data.products.some((p) => p._id === productId);
      toast.success(isInList ? "Added to wishlist" : "Removed from wishlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const isInWishlist = (productId) => wishlist.products?.some((p) => p._id === productId) || false;

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
