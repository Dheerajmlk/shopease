import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from "react-icons/fi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-sm h-[120px] animate-pulse" />)}
    </div>
  );

  const cards = [
    { label: "Total Products", value: stats?.totalProducts || 0, icon: FiPackage, color: "bg-[#232f3e] text-white", link: "/admin/products" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: FiShoppingBag, color: "bg-[#007185] text-white", link: "/admin/orders" },
    { label: "Total Users", value: stats?.totalUsers || 0, icon: FiUsers, color: "bg-[#f08804] text-white", link: "/admin/users" },
    { label: "Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, color: "bg-[#007600] text-white" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f1111] mb-4">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-[#232f3e]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#565959]">{card.label}</p>
                <p className="text-2xl font-bold text-[#0f1111] mt-1">{card.value}</p>
              </div>
              <div className={`p-2.5 rounded ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
            {card.link && (
              <Link to={card.link} className="text-xs text-[#007185] hover:text-[#c45500] hover:underline mt-2 inline-block">
                View Details →
              </Link>
            )}
          </div>
        ))}
      </div>

      {stats?.recentOrders?.length > 0 && (
        <div className="bg-white rounded-sm shadow-sm p-4">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#e7e7e7]">
            <h2 className="text-lg font-bold text-[#0f1111]">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#565959] border-b border-[#e7e7e7]">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-[#f0f0f0] hover:bg-[#f7f7f7]">
                    <td className="py-3 font-mono text-xs text-[#007185]">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3">{order.user?.name || "N/A"}</td>
                    <td className="py-3 font-bold">₹{order.totalAmount?.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#f0f2f2] text-[#0f1111] capitalize">
                        {order.status?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 text-[#565959]">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
