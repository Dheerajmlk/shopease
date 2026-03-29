import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { FiPackage } from "react-icons/fi";
import { Link } from "react-router-dom";

const statusColors = {
  pending: "bg-[#fef3cd] text-[#856404]",
  confirmed: "bg-[#cce5ff] text-[#004085]",
  shipped: "bg-[#e2d5f1] text-[#6f42c1]",
  delivered: "bg-[#d4edda] text-[#155724]",
  return_requested: "bg-[#fff3cd] text-[#856404]",
  returned: "bg-[#f0f0f0] text-[#565959]",
  cancelled: "bg-[#f8d7da] text-[#721c24]",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnModal, setReturnModal] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    api.get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error fetching orders");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/return`, { reason });
      setOrders(orders.map((o) => o._id === orderId ? { ...o, status: "return_requested", returnReason: reason } : o));
      setReturnModal(null);
      setReason("");
      toast.success("Return request submitted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  if (loading) return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-sm h-[200px] animate-pulse mb-4" />)}
      </div>
    </div>
  );

  if (orders.length === 0) {
    return (
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
  }

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-[#0f1111] mb-4">Your Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-sm shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-[#f0f2f2] px-4 py-3 border-b border-[#d5d9d9] flex flex-wrap justify-between items-center gap-2 text-sm">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-[#565959] uppercase">Order Placed</p>
                    <p className="text-[#0f1111]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#565959] uppercase">Total</p>
                    <p className="text-[#0f1111] font-bold">₹{order.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#565959]">ORDER # {order._id.slice(-8).toUpperCase()}</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-[#f0f0f0] text-[#565959]'}`}>
                    {order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-contain bg-[#f7f7f7] rounded p-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#007185] hover:text-[#c45500] cursor-pointer line-clamp-1">{item.name}</p>
                        <p className="text-sm text-[#0f1111] font-bold mt-0.5">₹{item.price?.toLocaleString()}</p>
                        <p className="text-xs text-[#565959]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#e7e7e7]">
                  {order.status === "delivered" && (
                    <button onClick={() => setReturnModal(order._id)}
                      className="text-sm text-[#0f1111] px-4 py-1.5 border border-[#d5d9d9] rounded-full hover:bg-[#f7f7f7] shadow-sm">
                      Return Items
                    </button>
                  )}
                  <Link to="/products"
                    className="text-sm text-[#0f1111] px-4 py-1.5 border border-[#d5d9d9] rounded-full hover:bg-[#f7f7f7] shadow-sm">
                    Buy Again
                  </Link>
                </div>

                {order.returnReason && (
                  <div className="mt-3 p-3 bg-[#fef3cd] rounded text-sm">
                    <span className="font-medium">Return reason:</span> {order.returnReason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Return Modal */}
        {returnModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-bold text-[#0f1111] mb-3">Request a Return</h3>
              <textarea placeholder="Please tell us why you'd like to return this item..." value={reason} onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none h-28 resize-none text-sm" />
              <div className="flex gap-3 mt-4">
                <button onClick={() => { setReturnModal(null); setReason(""); }}
                  className="flex-1 py-2 border border-[#d5d9d9] rounded-full text-[#0f1111] hover:bg-[#f7f7f7] text-sm font-medium shadow-sm">Cancel</button>
                <button onClick={() => handleReturn(returnModal)}
                  className="flex-1 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] rounded-full text-sm font-medium border border-[#fcd200] shadow-sm">Submit Return</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
