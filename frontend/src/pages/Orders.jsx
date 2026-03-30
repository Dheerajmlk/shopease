import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { FiPackage, FiArrowRight, FiRotateCcw } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const statusColors = {
  pending:          "bg-[#fef3cd] text-[#856404]",
  confirmed:        "bg-[#cce5ff] text-[#004085]",
  shipped:          "bg-[#e2d5f1] text-[#6f42c1]",
  delivered:        "bg-[#d4edda] text-[#155724]",
  return_requested: "bg-[#fff3cd] text-[#856404]",
  returned:         "bg-[#f0f0f0] text-[#565959]",
  cancelled:        "bg-[#f8d7da] text-[#721c24]",
};

const statusSteps = ["confirmed", "shipped", "delivered"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnModal, setReturnModal] = useState(null);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/orders")
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : res.data?.orders || []))
      .catch((err) => { toast.error(err.response?.data?.message || "Error fetching orders"); setOrders([]); })
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = async (orderId) => {
    if (!reason.trim()) { toast.error("Please enter a reason"); return; }
    try {
      await api.put(`/orders/${orderId}/return`, { reason });
      setOrders(orders.map((o) => o._id === orderId ? { ...o, status: "return_requested", returnReason: reason } : o));
      setReturnModal(null); setReason("");
      toast.success("Return request submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting return");
    }
  };

  if (loading) return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-sm h-[200px] animate-pulse mb-4" />)}
      </div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <div className="bg-white rounded-sm shadow-sm p-12 text-center">
          <FiPackage className="mx-auto text-[#d5d9d9] mb-4" size={80} />
          <h2 className="text-2xl font-bold text-[#0f1111] mb-2">No orders yet</h2>
          <p className="text-sm text-[#565959] mb-4">Looks like you haven't placed any orders.</p>
          <Link to="/products" className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] px-8 py-2.5 rounded-full font-medium text-sm border border-[#fcd200] shadow-sm">
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#0f1111]">Your Orders</h1>
          {orders.some(o => ["return_requested","returned"].includes(o.status)) && (
            <Link to="/returns" className="flex items-center gap-1 text-sm text-[#007185] hover:text-[#c45500] font-medium">
              <FiRotateCcw size={14} /> View Returns <FiArrowRight size={14} />
            </Link>
          )}
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const canReturn = order.status === "delivered";
            const hasReturnReq = ["return_requested","returned"].includes(order.status);
            const currentStep = statusSteps.indexOf(order.status);
            return (
              <div key={order._id} className="bg-white rounded-sm shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-[#f0f2f2] px-4 py-3 border-b border-[#d5d9d9] flex flex-wrap justify-between items-center gap-2 text-sm">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-[#565959] uppercase tracking-wide">Order Placed</p>
                      <p className="text-[#0f1111] font-medium">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#565959] uppercase tracking-wide">Total</p>
                      <p className="text-[#0f1111] font-bold">₹{order.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-[#565959] uppercase tracking-wide">Ship To</p>
                      <p className="text-[#0f1111] font-medium">{order.shippingAddress?.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#565959] mb-0.5">ORDER # {order._id.slice(-8).toUpperCase()}</p>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-[#f0f0f0] text-[#565959]"}`}>
                      {order.status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                {/* Progress Tracker */}
                {["confirmed","shipped","delivered"].includes(order.status) && (
                  <div className="px-4 pt-3 pb-1">
                    <div className="flex items-center">
                      {statusSteps.map((step, idx) => (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx <= currentStep ? "bg-[#007600] text-white" : "bg-[#d5d9d9] text-[#565959]"}`}>
                              {idx <= currentStep ? "✓" : idx + 1}
                            </div>
                            <p className={`text-xs mt-1 ${idx <= currentStep ? "text-[#007600] font-semibold" : "text-[#565959]"}`}>
                              {step.charAt(0).toUpperCase() + step.slice(1)}
                            </p>
                          </div>
                          {idx < statusSteps.length - 1 && (
                            <div className={`flex-1 h-0.5 mb-4 mx-1 ${idx < currentStep ? "bg-[#007600]" : "bg-[#d5d9d9]"}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="p-4">
                  <div className="space-y-4 divide-y divide-[#f0f0f0]">
                    {order.items.map((item, idx) => {
                      const productId = item.product?._id || (typeof item.product === "string" ? item.product : null);
                      return (
                        <div key={idx} className="flex gap-4 pt-4 first:pt-0">
                          <div
                            onClick={() => productId && navigate(`/products/${productId}`)}
                            className={`w-20 h-20 bg-[#f7f7f7] rounded p-1 flex-shrink-0 transition-opacity ${productId ? "cursor-pointer hover:opacity-75" : ""}`}
                          >
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              onClick={() => productId && navigate(`/products/${productId}`)}
                              className={`text-sm font-medium line-clamp-2 leading-snug ${productId ? "text-[#007185] hover:text-[#c45500] cursor-pointer" : "text-[#0f1111]"}`}
                            >
                              {item.name}
                            </p>
                            <p className="text-sm text-[#0f1111] font-bold mt-1">₹{item.price?.toLocaleString()}</p>
                            <p className="text-xs text-[#565959]">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-3 p-3 bg-[#f7f8f8] rounded text-xs text-[#565959] border border-[#e7e7e7]">
                      <span className="font-semibold text-[#0f1111]">Delivered to: </span>
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.zip}
                    </div>
                  )}

                  {/* Return Reason */}
                  {hasReturnReq && order.returnReason && (
                    <div className="mt-3 p-3 bg-[#fef3cd] rounded text-sm border border-[#fcd200]">
                      <span className="font-semibold text-[#856404]">Return reason: </span>
                      <span className="text-[#856404]">{order.returnReason}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#e7e7e7]">
                    <Link to="/products" className="text-sm text-[#0f1111] px-4 py-1.5 border border-[#d5d9d9] rounded-full hover:bg-[#f7f7f7] shadow-sm font-medium">
                      Buy Again
                    </Link>
                    {canReturn && (
                      <button
                        onClick={() => { setReturnModal(order._id); setReason(""); }}
                        className="flex items-center gap-1.5 text-sm text-[#0f1111] px-4 py-1.5 border border-[#d5d9d9] rounded-full hover:bg-[#f7f7f7] shadow-sm font-medium"
                      >
                        <FiRotateCcw size={13} /> Return Items
                      </button>
                    )}
                    {hasReturnReq && (
                      <Link to="/returns" className="flex items-center gap-1.5 text-sm text-[#856404] px-4 py-1.5 border border-[#fcd200] rounded-full hover:bg-[#fef9ee] shadow-sm font-medium bg-[#fef3cd]">
                        <FiRotateCcw size={13} /> View Return Status
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Return Modal */}
      {returnModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <FiRotateCcw size={20} className="text-[#f08804]" />
              <h3 className="text-lg font-bold text-[#0f1111]">Request a Return</h3>
            </div>
            <p className="text-sm text-[#565959] mb-3">We'll process your return within 3–5 business days.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {["Damaged product","Wrong item","Not as described","Changed my mind"].map((r) => (
                <button key={r} onClick={() => setReason(r)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${reason === r ? "bg-[#ffd814] border-[#fcd200] text-[#0f1111] font-medium" : "border-[#d5d9d9] text-[#565959] hover:bg-[#f7f7f7]"}`}>
                  {r}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Add more details (optional)..."
              value={reason} onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none h-24 resize-none text-sm"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setReturnModal(null); setReason(""); }}
                className="flex-1 py-2 border border-[#d5d9d9] rounded-full text-[#0f1111] hover:bg-[#f7f7f7] text-sm font-medium">Cancel</button>
              <button onClick={() => handleReturn(returnModal)}
                className="flex-1 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] rounded-full text-sm font-medium border border-[#fcd200]">Submit Return</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
