import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiPackage, FiShoppingBag, FiUsers } from "react-icons/fi";

const links = [
  { to: "/admin", icon: FiGrid, label: "Dashboard", end: true },
  { to: "/admin/products", icon: FiPackage, label: "Products" },
  { to: "/admin/orders", icon: FiShoppingBag, label: "Orders" },
  { to: "/admin/users", icon: FiUsers, label: "Users" },
];

export default function AdminLayout() {
  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4 py-3 sm:py-4">
        {/* Mobile: horizontal tab bar */}
        <div className="md:hidden mb-3">
          <div className="bg-white rounded-sm shadow-sm p-2">
            <nav className="flex gap-1 overflow-x-auto hide-scrollbar">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded text-sm whitespace-nowrap transition-colors flex-1 justify-center ${
                      isActive
                        ? "bg-[#232f3e] text-white font-medium"
                        : "text-[#0f1111] hover:bg-[#f0f2f2]"
                    }`
                  }>
                  <link.icon size={15} /> {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Desktop: sidebar */}
          <aside className="hidden md:block md:w-56 shrink-0">
            <div className="bg-white rounded-sm shadow-sm p-4 sticky top-[100px]">
              <h2 className="text-lg font-bold text-[#0f1111] mb-3 pb-2 border-b border-[#e7e7e7]">Admin Panel</h2>
              <nav className="flex flex-col gap-1">
                {links.map((link) => (
                  <NavLink key={link.to} to={link.to} end={link.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2.5 rounded text-sm whitespace-nowrap transition-colors ${
                        isActive
                          ? "bg-[#232f3e] text-white font-medium"
                          : "text-[#0f1111] hover:bg-[#f0f2f2]"
                      }`
                    }>
                    <link.icon size={16} /> {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
