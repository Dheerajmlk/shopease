import { useEffect, useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/users").then((res) => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  if (loading) return <div className="bg-white rounded-sm h-[300px] animate-pulse" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f1111] mb-4">Users ({users.length})</h1>
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#565959] border-b border-[#e7e7e7] bg-[#f0f2f2]">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Joined</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-[#f0f0f0] hover:bg-[#f7f7f7]">
                <td className="p-3 font-medium text-[#0f1111]">{u.name}</td>
                <td className="p-3 text-[#565959]">{u.email}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    u.role === "admin" ? "bg-[#232f3e] text-white" : "bg-[#f0f2f2] text-[#565959]"
                  }`}>
                    {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                  </span>
                </td>
                <td className="p-3 text-[#565959]">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  {u.role !== "admin" && (
                    <button onClick={() => handleDelete(u._id)} className="text-[#cc0c39] hover:text-red-700">
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
