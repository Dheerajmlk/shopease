import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";
import { FiLock, FiShield } from "react-icons/fi";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "" });

  const items = cart.items || [];

  const handlePay = async () => {
    if (!address.street || !address.city || !address.state || !address.zip) {
      toast.error("Please fill all address fields");
      return;
    }
    setLoading(true);
    try {
      // Fetch the publishable key from the backend so no env var is needed in Vercel
      const { data: keyData } = await api.get("/payment/razorpay-key");
      const razorpayKey = keyData.key;
      if (!razorpayKey) throw new Error("Payment configuration missing. Please contact support.");

      const { data: rzOrder } = await api.post("/payment/create-order", { amount: cartTotal });

      const options = {
        key: razorpayKey,
        amount: rzOrder.amount,
        currency: "INR",
        name: "ShopEase",
        description: "Order Payment",
        order_id: rzOrder.id,
        handler: async (response) => {
          try {
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await api.post("/orders", {
              shippingAddress: address,
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            });
            await clearCart();
            toast.success("Order placed successfully! 🎉");
            navigate("/orders");
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#131921" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => toast.error("Payment failed"));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment error");
    }
    setLoading(false);
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#f0f2f2] to-[#e3e6e6] border-b border-[#bbb] py-3">
        <div className="max-w-[1000px] mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-medium text-[#0f1111]">Checkout (<span className="text-[#007185]">{items.reduce((s, i) => s + i.quantity, 0)} items</span>)</h1>
          <div className="flex items-center gap-1 text-[#565959] text-sm">
            <FiLock size={14} />
            <span>Secure checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Address & Items */}
          <div className="flex-1 space-y-4">
            {/* Shipping Address */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h2 className="text-lg font-bold text-[#0f1111] mb-4 pb-2 border-b border-[#e7e7e7]">
                1. Delivery Address
              </h2>
              <div className="space-y-3">
                <input type="text" placeholder="Street Address" value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                <input type="text" placeholder="City" value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="State" value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                  <input type="text" placeholder="PIN Code" value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h2 className="text-lg font-bold text-[#0f1111] mb-4 pb-2 border-b border-[#e7e7e7]">
                2. Review Items
              </h2>
              <div className="divide-y divide-[#e7e7e7]">
                {items.map((item) => (
                  <div key={item.product?._id} className="flex gap-3 py-3">
                    <img src={item.product?.image} alt={item.product?.name} className="w-16 h-16 object-contain bg-[#f7f7f7] rounded p-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#0f1111] line-clamp-1">{item.product?.name}</p>
                      <p className="text-sm font-bold text-[#0f1111]">₹{item.product?.price?.toLocaleString()}</p>
                      <p className="text-xs text-[#565959]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-[#0f1111] shrink-0">₹{(item.product?.price * item.quantity)?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="w-full lg:w-[300px] shrink-0">
            <div className="bg-white rounded-sm shadow-sm p-5 sticky top-[100px]">
              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-2.5 rounded-full font-medium text-sm mb-4 disabled:opacity-50 border border-[#fcd200] shadow-sm"
              >
                {loading ? "Processing..." : "Place your order"}
              </button>

              <p className="text-xs text-[#565959] mb-4 pb-4 border-b border-[#e7e7e7]">
                By placing your order, you agree to ShopEase's privacy notice and conditions of use.
              </p>

              <h3 className="font-bold text-[#0f1111] mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#565959]">Items ({items.reduce((s, i) => s + i.quantity, 0)}):</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#565959]">Delivery:</span>
                  <span className="text-[#007600]">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[#e7e7e7] mt-3 pt-3">
                <span className="text-lg font-bold text-[#cc0c39]">Order Total:</span>
                <span className="text-lg font-bold text-[#cc0c39]">₹{cartTotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-[#565959] mt-3">
                <FiShield size={12} className="text-[#007600]" />
                <span>Your transaction is secured with SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
