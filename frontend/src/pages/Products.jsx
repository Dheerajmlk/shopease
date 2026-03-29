import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    api.get("/products/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    params.set("page", page);
    params.set("limit", 16);

    api.get(`/products?${params}`).then((res) => {
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    }).finally(() => setLoading(false));
  }, [search, category, sort, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== "page") params.delete("page");
    setSearchParams(params);
  };

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4 py-4">
        {/* Breadcrumb / Header */}
        <div className="bg-white rounded-sm shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#0f1111]">
                {category || search ? `Results${search ? ` for "${search}"` : ''}${category ? ` in ${category}` : ''}` : "All Products"}
              </h1>
              <p className="text-sm text-[#565959] mt-0.5">{total} results</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-[#565959]">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="text-sm border border-[#888c8c] rounded-lg px-3 py-1.5 bg-[#f0f2f2] hover:bg-[#e3e6e6] focus:ring-2 focus:ring-[#007185] outline-none cursor-pointer"
              >
                <option value="">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
                <option value="discount">Discount</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-[220px] shrink-0">
            <div className="bg-white rounded-sm shadow-sm p-4 sticky top-[100px]">
              <h3 className="font-bold text-[#0f1111] mb-3">Category</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam("category", "")}
                  className={`block text-sm w-full text-left py-0.5 ${!category ? "font-bold text-[#c45500]" : "text-[#0f1111] hover:text-[#c45500]"}`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateParam("category", c)}
                    className={`block text-sm w-full text-left py-0.5 ${category === c ? "font-bold text-[#c45500]" : "text-[#0f1111] hover:text-[#c45500]"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Search within results */}
              <div className="mt-6">
                <h3 className="font-bold text-[#0f1111] mb-2">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => updateParam("search", e.target.value)}
                    className="w-full text-sm border border-[#888c8c] rounded px-2.5 py-1.5 focus:ring-2 focus:ring-[#007185] outline-none"
                  />
                  {search && (
                    <button onClick={() => updateParam("search", "")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#565959] hover:text-[#0f1111]">
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#232f3e] text-white px-4 py-3 rounded-full shadow-xl flex items-center gap-2 font-medium"
          >
            <FiFilter size={18} />
            Filters
          </button>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-[#0f1111]">Filters</h3>
                  <button onClick={() => setShowFilters(false)}><FiX size={24} /></button>
                </div>
                <h4 className="font-bold text-[#0f1111] mb-2">Category</h4>
                <div className="space-y-2 mb-4">
                  <button onClick={() => { updateParam("category", ""); setShowFilters(false); }}
                    className={`block text-sm ${!category ? "font-bold text-[#c45500]" : "text-[#0f1111]"}`}>All Categories</button>
                  {categories.map((c) => (
                    <button key={c} onClick={() => { updateParam("category", c); setShowFilters(false); }}
                      className={`block text-sm ${category === c ? "font-bold text-[#c45500]" : "text-[#0f1111]"}`}>{c}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-sm h-[320px] animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-sm shadow-sm p-12 text-center">
                <FiSearch size={48} className="mx-auto text-[#d5d9d9] mb-4" />
                <h2 className="text-lg font-bold text-[#0f1111] mb-2">No results found</h2>
                <p className="text-sm text-[#565959]">Try different keywords or remove some filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>

                {pages > 1 && (
                  <div className="flex justify-center items-center gap-1 mt-6">
                    <button
                      onClick={() => updateParam("page", Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 text-sm border border-[#d5d9d9] rounded-l-lg hover:bg-[#f7f7f7] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                      let pageNum;
                      if (pages <= 7) pageNum = i + 1;
                      else if (page <= 4) pageNum = i + 1;
                      else if (page >= pages - 3) pageNum = pages - 6 + i;
                      else pageNum = page - 3 + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => updateParam("page", pageNum)}
                          className={`px-3 py-1.5 text-sm border border-[#d5d9d9] ${
                            page === pageNum ? "bg-[#edfdff] border-[#007185] text-[#007185] font-bold" : "hover:bg-[#f7f7f7]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => updateParam("page", Math.min(pages, page + 1))}
                      disabled={page === pages}
                      className="px-3 py-1.5 text-sm border border-[#d5d9d9] rounded-r-lg hover:bg-[#f7f7f7] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
