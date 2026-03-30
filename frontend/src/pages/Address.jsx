import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck, FiHome, FiBriefcase, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const LABELS = ["Home", "Work", "Other"];
const labelIcon = { Home: <FiHome size={14} />, Work: <FiBriefcase size={14} />, Other: <FiMapPin size={14} /> };

const emptyForm = { label: "Home", street: "", city: "", state: "", zip: "", isDefault: false };

export default function Address() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/user/addresses")
      .then((res) => setAddresses(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Failed to load addresses"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (addr) => { setForm({ label: addr.label, street: addr.street, city: addr.city, state: addr.state, zip: addr.zip, isDefault: addr.isDefault }); setEditId(addr._id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); };

  const handleSave = async () => {
    if (!form.street || !form.city || !form.state || !form.zip) {
      toast.error("Please fill all fields"); return;
    }
    setSaving(true);
    try {
      let res;
      if (editId) {
        res = await api.put(`/user/addresses/${editId}`, form);
      } else {
        res = await api.post("/user/addresses", form);
      }
      setAddresses(res.data);
      closeForm();
      toast.success(editId ? "Address updated!" : "Address added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving address");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const res = await api.delete(`/user/addresses/${id}`);
      setAddresses(res.data);
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await api.put(`/user/addresses/${id}/default`);
      setAddresses(res.data);
      toast.success("Default address updated");
    } catch {
      toast.error("Failed to update default");
    }
  };

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <FiMapPin size={22} className="text-[#f08804]" />
            <h1 className="text-2xl font-bold text-[#0f1111]">Manage Addresses</h1>
          </div>
          <p className="text-sm text-[#565959] ml-8">Logged in as <span className="font-medium text-[#0f1111]">{user?.name}</span> — {user?.email}</p>
        </div>

        {/* Add Button */}
        <button
          onClick={openAdd}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-dashed border-[#007185] text-[#007185] hover:bg-[#f0f9fa] py-3 rounded-sm mb-4 font-medium text-sm transition-colors"
        >
          <FiPlus size={18} /> Add a New Address
        </button>

        {/* Address Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#e7e7e7]">
                <h2 className="text-lg font-bold text-[#0f1111]">{editId ? "Edit Address" : "Add New Address"}</h2>
                <button onClick={closeForm} className="p-1.5 hover:bg-[#f7f7f7] rounded-full transition-colors">
                  <FiX size={20} className="text-[#565959]" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-3">
                {/* Label selector */}
                <div>
                  <label className="text-xs font-semibold text-[#565959] uppercase tracking-wide mb-1.5 block">Address Type</label>
                  <div className="flex gap-2">
                    {LABELS.map((l) => (
                      <button key={l} onClick={() => setForm({ ...form, label: l })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${form.label === l ? "bg-[#ffd814] border-[#fcd200] text-[#0f1111]" : "border-[#d5d9d9] text-[#565959] hover:bg-[#f7f7f7]"}`}>
                        {labelIcon[l]} {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#565959] uppercase tracking-wide mb-1 block">Street / House No.</label>
                  <input type="text" placeholder="123, MG Road, Apartment 4B"
                    value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#565959] uppercase tracking-wide mb-1 block">City</label>
                    <input type="text" placeholder="Mumbai"
                      value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#565959] uppercase tracking-wide mb-1 block">State</label>
                    <input type="text" placeholder="Maharashtra"
                      value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-3 py-2.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#565959] uppercase tracking-wide mb-1 block">PIN Code</label>
                  <input type="text" placeholder="400001" maxLength={6}
                    value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value.replace(/\D/g, "") })}
                    className="w-full px-3 py-2.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-[#007185] cursor-pointer" />
                  <span className="text-sm text-[#0f1111]">Set as default delivery address</span>
                </label>
              </div>

              <div className="flex gap-3 px-6 pb-5">
                <button onClick={closeForm}
                  className="flex-1 py-2.5 border border-[#d5d9d9] rounded-full text-[#0f1111] hover:bg-[#f7f7f7] text-sm font-medium shadow-sm">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] rounded-full text-sm font-medium border border-[#fcd200] shadow-sm disabled:opacity-50">
                  {saving ? "Saving..." : editId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Address List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => <div key={i} className="bg-white rounded-sm h-[120px] animate-pulse" />)}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm p-10 text-center">
            <FiMapPin className="mx-auto text-[#d5d9d9] mb-3" size={52} />
            <p className="text-lg font-bold text-[#0f1111] mb-1">No Saved Addresses</p>
            <p className="text-sm text-[#565959]">Click "Add a New Address" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr._id} className={`bg-white rounded-sm shadow-sm overflow-hidden border-l-4 ${addr.isDefault ? "border-[#007185]" : "border-transparent"}`}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Label + Default Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#0f1111] bg-[#f0f2f2] px-2.5 py-1 rounded-full">
                          {labelIcon[addr.label] || <FiMapPin size={12} />}
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-[#007185] bg-[#e8f5f6] px-2.5 py-1 rounded-full">
                            <FiCheck size={11} /> Default
                          </span>
                        )}
                      </div>
                      {/* Address Text */}
                      <p className="text-sm text-[#0f1111]">{addr.street}</p>
                      <p className="text-sm text-[#565959]">{addr.city}, {addr.state} – {addr.zip}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => openEdit(addr)}
                        className="flex items-center gap-1 text-xs text-[#007185] hover:text-[#c45500] px-2.5 py-1.5 border border-[#d5d9d9] rounded-full hover:bg-[#f7f7f7] transition-colors font-medium">
                        <FiEdit2 size={12} /> Edit
                      </button>
                      <button onClick={() => handleDelete(addr._id)}
                        className="flex items-center gap-1 text-xs text-[#cc0c39] hover:text-white px-2.5 py-1.5 border border-[#f5c6cb] rounded-full hover:bg-[#cc0c39] transition-colors font-medium">
                        <FiTrash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Set as Default link */}
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr._id)}
                      className="mt-3 text-xs text-[#007185] hover:text-[#c45500] font-medium underline">
                      Set as default address
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tip */}
        <div className="mt-6 p-4 bg-white rounded-sm shadow-sm border border-[#e7e7e7]">
          <p className="text-xs text-[#565959]">
            💡 <strong>Tip:</strong> Your default address is auto-filled at checkout. You can always choose a different address during checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
