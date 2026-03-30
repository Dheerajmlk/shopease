import { useEffect, useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiLink } from "react-icons/fi";

const CATEGORIES = ["Electronics", "Mobiles", "Fashion", "Footwear", "Home & Kitchen", "Accessories", "Sports", "Books"];
const emptyForm = { name: "", description: "", price: "", originalPrice: "", discount: "", category: "Electronics", stock: "", isFeatured: false, isBestSeller: false, imageUrl: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [imageMode, setImageMode] = useState("url"); // "url" | "file"
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    api.get("/admin/products").then((res) => setProducts(Array.isArray(res.data) ? res.data : [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImage(null);
    setImageMode("url");
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name, description: p.description,
      price: p.price, originalPrice: p.originalPrice || "",
      discount: p.discount || "", category: p.category,
      stock: p.stock, isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller, imageUrl: p.image || "",
    });
    setImage(null);
    setImageMode("url");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k !== "imageUrl") fd.append(k, v);
    });
    if (imageMode === "file" && image) {
      fd.append("image", image);
    } else if (imageMode === "url" && form.imageUrl) {
      fd.append("imageUrl", form.imageUrl);
    }

    try {
      if (editing) {
        await api.put(`/admin/products/${editing}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product updated successfully!");
      } else {
        if (imageMode === "file" && !image) { toast.error("Please select an image file"); setSaving(false); return; }
        if (imageMode === "url" && !form.imageUrl) { toast.error("Please enter an image URL"); setSaving(false); return; }
        await api.post("/admin/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product added successfully!");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting product");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="bg-white rounded-sm h-[400px] animate-pulse" />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl font-bold text-[#0f1111]">Products ({products.length})</h1>
        <div className="flex gap-3 items-center">
          <input
            type="text" placeholder="Search products..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="text-sm border border-[#888c8c] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#007185] outline-none w-52"
          />
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] px-4 py-2 rounded-full text-sm font-medium border border-[#fcd200] shadow-sm whitespace-nowrap">
            <FiPlus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#565959] border-b border-[#e7e7e7] bg-[#f0f2f2]">
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Discount</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Tags</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-b border-[#f0f0f0] hover:bg-[#f7f7f7] transition-colors">
                <td className="p-3">
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-[#f7f7f7] rounded p-1 border border-[#e0e0e0]" />
                </td>
                <td className="p-3 font-medium text-[#0f1111] max-w-[200px]">
                  <span className="block truncate">{p.name}</span>
                </td>
                <td className="p-3 text-[#565959]">{p.category}</td>
                <td className="p-3">
                  <span className="font-bold text-[#0f1111]">₹{p.price?.toLocaleString()}</span>
                  {p.originalPrice > 0 && <span className="text-xs text-[#565959] line-through block">₹{p.originalPrice?.toLocaleString()}</span>}
                </td>
                <td className="p-3">
                  {p.discount > 0
                    ? <span className="text-xs bg-[#cc0c39] text-white px-2 py-0.5 rounded-sm font-bold">{p.discount}%</span>
                    : <span className="text-[#999]">—</span>}
                </td>
                <td className="p-3">
                  <span className={p.stock > 0 ? "text-[#007600] font-medium" : "text-[#cc0c39] font-medium"}>{p.stock}</span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1 flex-wrap">
                    {p.isFeatured && <span className="text-[10px] bg-[#232f3e] text-white px-1.5 py-0.5 rounded">Featured</span>}
                    {p.isBestSeller && <span className="text-[10px] bg-[#f0c14b] text-[#111] px-1.5 py-0.5 rounded font-bold">Best Seller</span>}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(p)} className="text-[#007185] hover:text-[#c45500] transition-colors" title="Edit">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="text-[#cc0c39] hover:text-red-700 transition-colors" title="Delete">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#565959]">No products found</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-[#e7e7e7] sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-[#0f1111]">{editing ? "✏️ Edit Product" : "➕ Add New Product"}</h3>
              <button onClick={() => setShowModal(false)} className="text-[#565959] hover:text-[#0f1111] p-1 rounded-full hover:bg-[#f0f0f0]">
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-[#0f1111] mb-1">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  placeholder="e.g. Wireless Bluetooth Headphones"
                  className="w-full px-3 py-2 border border-[#888c8c] rounded-lg focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-[#0f1111] mb-1">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required
                  placeholder="Describe the product features..."
                  className="w-full px-3 py-2 border border-[#888c8c] rounded-lg focus:ring-2 focus:ring-[#007185] outline-none h-20 resize-none text-sm" />
              </div>

              {/* Price row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0f1111] mb-1">Sale Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0"
                    className="w-full px-3 py-2 border border-[#888c8c] rounded-lg focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0f1111] mb-1">MRP (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} min="0"
                    className="w-full px-3 py-2 border border-[#888c8c] rounded-lg focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0f1111] mb-1">Discount %</label>
                  <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} min="0" max="100"
                    className="w-full px-3 py-2 border border-[#888c8c] rounded-lg focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                </div>
              </div>

              {/* Category + Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-[#0f1111] mb-1">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
                    className="w-full px-3 py-2 border border-[#888c8c] rounded-lg focus:ring-2 focus:ring-[#007185] outline-none text-sm bg-white">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0f1111] mb-1">Stock *</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required min="0"
                    className="w-full px-3 py-2 border border-[#888c8c] rounded-lg focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                </div>
              </div>

              {/* Image Section */}
              <div>
                <label className="block text-sm font-bold text-[#0f1111] mb-2">Product Image *</label>
                {/* Toggle */}
                <div className="flex rounded-lg overflow-hidden border border-[#d5d9d9] mb-3 w-fit">
                  <button type="button"
                    onClick={() => setImageMode("url")}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${imageMode === "url" ? "bg-[#232f3e] text-white" : "bg-white text-[#565959] hover:bg-[#f0f0f0]"}`}>
                    <FiLink size={14} /> Image URL
                  </button>
                  <button type="button"
                    onClick={() => setImageMode("file")}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${imageMode === "file" ? "bg-[#232f3e] text-white" : "bg-white text-[#565959] hover:bg-[#f0f0f0]"}`}>
                    <FiImage size={14} /> Upload File
                  </button>
                </div>

                {imageMode === "url" ? (
                  <div>
                    <input type="url" value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-... or any direct image link"
                      className="w-full px-3 py-2 border border-[#888c8c] rounded-lg focus:ring-2 focus:ring-[#007185] outline-none text-sm" />
                    {form.imageUrl && (
                      <div className="mt-2 flex items-center gap-3">
                        <img src={form.imageUrl} alt="preview" className="w-16 h-16 object-contain rounded border border-[#e0e0e0] bg-[#f7f7f7] p-1"
                          onError={(e) => { e.target.style.display = "none"; }} />
                        <span className="text-xs text-[#007600]">✓ Image URL set</span>
                      </div>
                    )}
                    <p className="text-xs text-[#565959] mt-1.5">💡 Use Unsplash: <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-[#007185] underline">unsplash.com</a> → right-click image → Copy image address</p>
                  </div>
                ) : (
                  <div>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}
                      className="w-full text-sm text-[#565959] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#ffd814] file:text-[#0f1111] file:font-medium hover:file:bg-[#f7ca00] file:cursor-pointer" />
                    {image && <p className="text-xs text-[#007600] mt-1">✓ {image.name} selected</p>}
                    <p className="text-xs text-[#cc0c39] mt-1">⚠️ File upload requires valid Cloudinary credentials in backend .env</p>
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6 py-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-[#888c8c] accent-[#007185]" />
                  <span className="text-[#0f1111] font-medium">Featured</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                    className="w-4 h-4 rounded border-[#888c8c] accent-[#007185]" />
                  <span className="text-[#0f1111] font-medium">Best Seller</span>
                </label>
              </div>

              {/* Submit */}
              <button type="submit" disabled={saving}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-2.5 rounded-full font-medium text-sm disabled:opacity-50 border border-[#fcd200] shadow-sm transition-colors">
                {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
