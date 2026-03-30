import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { FiRotateCcw, FiPackage, FiArrowLeft, FiClock, FiCheckCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const returnStatusConfig = {
  return_requested: {
    label: "Return Requested",
    color: "bg-[#fff3cd] text-[#856404] border-[#fcd200]",
    icon: <FiClock size={14} />,
    desc: "Your return request is under review. We'll update you within 24–48 hours.",
  },
  returned: {
    label: "Return Completed",
    color: "bg-[#d4edda] text-[#155724] border-[#c3e6cb]",
    icon: <FiCheckCircle size={14} />,
    desc: "Your return has been processed. Refund will reflect in 5–7 business days.",
  },
};

const steps = [
  { label: "Return Requested", key: "return_requested" },
  { label: "Pick-up Scheduled", key: "pickup" },
  { label: "Item Received", key: "received" },
  { label: "Refund Initiated", key: "returned" },
];

export default function Returns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/orders")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : res.data?.orders || [];
        setReturns(all.filter(o => ["return_requested", "returned"].includes(o.status)));
      })
      .catch(() => { toast.error("Error fetching returns"); setReturns([]); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 py-8">
        {[...Array(2)].map((_, i) => <div key={i} className="bg-white rounded-sm h-[200px] animate-pulse mb-4" />)}
      </div>
    </div>
  );

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/orders")} className="p-2 hover:bg-[#d5d9d9] rounded-full transition-colors">
            <FiArrowLeft size={20} className="text-[#0f1111]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#0f1111]">Returns & Refunds</h1>
            <p className="text-sm text-[#565959]">Track your return requests</p>
          </div>
        </div>

        {/* Return Policy Info */}
        <div className="bg-white rounded-sm shadow-sm p-4 mb-4 border-l-4 border-[#007185]">
          <p className="text-sm font-semibold text-[#0f1111] mb-1">ShopEase Return Policy</p>
          <p className="text-xs text-[#565959]">
            Most items can be returned within <strong>30 days</strong> of delivery. Refunds are processed within 5–7 business days after we receive the item.
            For queries, contact support at <span className="text-[#007185]">support@shopease.in</span>.
          </p>
        </div>

        {returns.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm p-12 text-center">
            <FiRotateCcw className="mx-auto text-[#d5d9d9] mb-4" size={64} />
            <h2 className="text-xl font-bold text-[#0f1111] mb-2">No Return Requests</h2>
            <p className="text-sm text-[#565959] mb-6">You haven't requested any returns yet.</p>
            <Link to="/orders" className="inline-flex items-center gap-2 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] px-6 py-2 rounded-full font-medium text-sm border border-[#fcd200] shadow-sm">
              <FiPackage size={16} /> View Orders
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map((order) => {
              const cfg = returnStatusConfig[order.status];
              const currentStep = order.status === "returned" ? 3 : 0;

              return (
                <div key={order._id} className="bg-white rounded-sm shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="bg-[#f0f2f2] px-4 py-3 border-b border-[#d5d9d9] flex flex-wrap justify-between items-center gap-2">
                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-xs text-[#565959] uppercase tracking-wide">Order Placed</p>
                        <p className="font-medium text-[#0f1111]">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#565959] uppercase tracking-wide">Amount Paid</p>
                        <p className="font-bold text-[#0f1111]">₹{order.totalAmount?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#565959] mb-1">ORDER # {order._id.slice(-8).toUpperCase()}</p>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Return Progress Steps */}
                    <div className="mb-4">
                      <p className="text-xs text-[#565959] uppercase tracking-wide mb-3 font-semibold">Return Progress</p>
                      <div className="flex items-center">
                        {steps.map((step, idx) => (
                          <div key={step.key} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx <= currentStep ? "bg-[#007600] text-white" : "bg-[#d5d9d9] text-[#565959]"}`}>
                                {idx <= currentStep ? "✓" : idx + 1}
                              </div>
                              <p className={`text-xs mt-1 text-center max-w-[60px] leading-tight ${idx <= currentStep ? "text-[#007600] font-semibold" : "text-[#565959]"}`}>
                                {step.label}
                              </p>
                            </div>
                            {idx < steps.length - 1 && (
                              <div className={`flex-1 h-0.5 mb-4 mx-1 ${idx < currentStep ? "bg-[#007600]" : "bg-[#d5d9d9]"}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Message */}
                    <div className={`p-3 rounded text-sm border mb-4 ${cfg.color}`}>
                      {cfg.desc}
                    </div>

                    {/* Return Reason */}
                    {order.returnReason && (
                      <div className="p-3 bg-[#f7f8f8] rounded text-sm border border-[#e7e7e7] mb-4">
                        <span className="font-semibold text-[#0f1111]">Your reason: </span>
                        <span className="text-[#565959]">{order.returnReason}</span>
                      </div>
                    )}

                    {/* Items */}
                    <div className="border border-[#e7e7e7] rounded overflow-hidden">
                      <p className="text-xs font-semibold text-[#565959] uppercase tracking-wide bg-[#f7f8f8] px-3 py-2 border-b border-[#e7e7e7]">
                        Items in this return
                      </p>
                      {order.items.map((item, idx) => {
                        const productId = item.product?._id || (typeof item.product === "string" ? item.product : null);
                        return (
                          <div key={idx} className="flex gap-3 p-3 border-b border-[#f0f0f0] last:border-b-0">
                            <div
                              onClick={() => productId && navigate(`/products/${productId}`)}
                              className={`w-14 h-14 bg-[#f7f7f7] rounded p-1 flex-shrink-0 ${productId ? "cursor-pointer hover:opacity-75" : ""}`}
                            >
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                onClick={() => productId && navigate(`/products/${productId}`)}
                                className={`text-sm font-medium line-clamp-1 ${productId ? "text-[#007185] hover:text-[#c45500] cursor-pointer" : "text-[#0f1111]"}`}
                              >
                                {item.name}
                              </p>
                              <p className="text-sm font-bold text-[#0f1111]">₹{item.price?.toLocaleString()}</p>
                              <p className="text-xs text-[#565959]">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Refund Summary */}
                    <div className="mt-4 flex justify-between items-center p-3 bg-[#f7f8f8] rounded border border-[#e7e7e7]">
                      <div>
                        <p className="text-sm font-semibold text-[#0f1111]">Refund Amount</p>
                        <p className="text-xs text-[#565959]">
                          {order.status === "returned" ? "Refund processed" : "Will be refunded on approval"}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-[#007600]">₹{order.totalAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
