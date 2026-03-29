import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) { setCart({ items: [] }); return; }
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch { setCart({ items: [] }); }
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId) => {
    try {
      const res = await api.post("/cart/add", { productId, quantity: 1 });
      setCart(res.data);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding to cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.put("/cart/update", { productId, quantity });
      setCart(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      setCart(res.data);
      toast.success("Removed from cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error removing from cart");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
      setCart({ items: [] });
    } catch {}
  };

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart, loading, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
