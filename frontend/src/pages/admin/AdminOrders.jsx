import { useEffect, useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";

const statusOptions = ["pending", "confirmed", "shipped", "delivered", "return_requested", "returned", "cancelled"];
const statusColors = {
  pending: "bg-[#fef3cd] text-[#856404]",
  confirmed: "bg-[#cce5ff] text-[#004085]",
  shipped: "bg-[#e2d5f1] text-[#6f42c1]",
  delivered: "bg-[#d4edda] text-[#155724]",
  return_requested: "bg-[#fff3cd] text-[#856404]",
  returned: "bg-[#f0f0f0] text-[#565959]",
  cancelled: "bg-[#f8d7da] text-[#721c24]",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/orders").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/admin/orders/${id}/status`, { status });
      setOrders(orders.map((o) => (o._id === id ? res.data : o)));
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  if (loading) return <div className="bg-white rounded-sm h-[400px] animate-pulse" />;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-[#0f1111] mb-4">Orders ({orders.length})</h1>
      {orders.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-12 text-center">
          <p className="text-[#565959]">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-sm shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-[#f0f2f2] px-3 sm:px-4 py-2.5 border-b border-[#d5d9d9]">
                <div className="flex flex-wrap justify-between items-start gap-2 text-sm">
                  <div className="flex flex-wrap gap-3 sm:gap-6">
                    <div>
                      <p className="text-[10px] text-[#565959] uppercase">Order ID</p>
                      <p className="font-mono text-xs text-[#007185]">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#565959] uppercase">Customer</p>
                      <p className="text-xs">{order.user?.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#565959] uppercase">Total</p>
                      <p className="text-xs font-bold">₹{order.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-[#565959] uppercase">Date</p>
                      <p className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="text-xs border border-[#888c8c] rounded px-1.5 sm:px-2 py-1 bg-white focus:ring-2 focus:ring-[#007185] outline-none cursor-pointer">
                      {statusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              {/* Order Items */}
              <div className="p-3 sm:p-4">
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <img src={item.image} alt={item.name} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.style.opacity = "0.3"; }} className="w-10 h-10 object-contain bg-[#f7f7f7] rounded p-0.5 shrink-0" />
                      <span className="text-[#0f1111] flex-1 min-w-0 truncate">{item.name}</span>
                      <span className="text-[#565959] shrink-0">x{item.quantity}</span>
                      <span className="font-medium shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-[#565959] mt-3 pt-2 border-t border-[#f0f0f0]">
                  <span className="font-medium">Ship to:</span> {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
                </div>
                {order.returnReason && (
                  <div className="mt-2 p-2 bg-[#fef3cd] rounded text-xs">
                    <span className="font-medium">Return reason:</span> {order.returnReason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
