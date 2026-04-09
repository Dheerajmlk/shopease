import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { FiHeart, FiShoppingCart, FiStar, FiCheck, FiShield, FiTruck, FiRotateCcw } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <div className="bg-white rounded-sm p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-[400px] bg-gray-100 animate-pulse rounded" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-100 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-1/4" />
              <div className="h-12 bg-gray-100 animate-pulse rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="bg-[#e3e6e6] min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-sm p-12 text-center shadow-sm">
        <h2 className="text-xl font-bold text-[#0f1111] mb-2">Product not found</h2>
        <Link to="/products" className="text-[#007185] hover:text-[#c45500] hover:underline">Back to products</Link>
      </div>
    </div>
  );

  const inWishlist = isInWishlist(product._id);

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1500px] mx-auto px-4 py-2">
        <div className="text-sm text-[#565959]">
          <Link to="/" className="text-[#007185] hover:text-[#c45500] hover:underline">Home</Link>
          {" > "}
          <Link to={`/products?category=${product.category}`} className="text-[#007185] hover:text-[#c45500] hover:underline">{product.category}</Link>
          {" > "}
          <span className="text-[#565959]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 pb-8">
        <div className="bg-white rounded-sm shadow-sm p-4 sm:p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-[1fr_1fr_300px] gap-6 lg:gap-10">
            {/* Image */}
            <div className="flex items-center justify-center bg-[#f7f7f7] rounded-lg p-4 sm:p-6 aspect-square sm:sticky sm:top-[120px]">
              <img src={product.image} alt={product.name} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.style.opacity = "0.3"; }} className="max-h-full max-w-full object-contain" />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3">
              <h1 className="text-xl sm:text-2xl font-medium text-[#0f1111] leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[#007185]">{product.ratings}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={16} fill={i < Math.floor(product.ratings) ? "#de7921" : "none"}
                      className={i < Math.floor(product.ratings) ? "text-[#de7921]" : "text-[#d5d9d9]"} />
                  ))}
                </div>
                <span className="text-sm text-[#007185] hover:text-[#c45500] cursor-pointer">{product.reviewCount?.toLocaleString()} ratings</span>
                {product.isBestSeller && (
                  <span className="text-xs bg-[#f0c14b] text-[#111] px-2 py-0.5 rounded-sm font-bold">#1 Best Seller</span>
                )}
              </div>

              <hr className="border-[#e7e7e7]" />

              {/* Price Section */}
              <div>
                {product.discount > 0 && (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl sm:text-3xl text-[#cc0c39] font-medium">-{product.discount}%</span>
                    <span className="text-2xl sm:text-3xl text-[#0f1111] font-medium">
                      <span className="text-sm align-top">₹</span>{product.price?.toLocaleString()}
                    </span>
                  </div>
                )}
                {!product.discount && (
                  <span className="text-2xl sm:text-3xl text-[#0f1111] font-medium">
                    <span className="text-sm align-top">₹</span>{product.price?.toLocaleString()}
                  </span>
                )}
                {product.originalPrice > 0 && product.originalPrice > product.price && (
                  <p className="text-sm text-[#565959]">
                    M.R.P.: <span className="line-through">₹{product.originalPrice?.toLocaleString()}</span>
                  </p>
                )}
                <p className="text-xs text-[#565959] mt-1">Inclusive of all taxes</p>
              </div>

              <hr className="border-[#e7e7e7]" />

              {/* Features */}
              <div className="flex gap-6 py-2">
                <div className="text-center">
                  <FiTruck className="mx-auto text-[#007185] mb-1" size={24} />
                  <p className="text-xs text-[#007185]">Free Delivery</p>
                </div>
                <div className="text-center">
                  <FiRotateCcw className="mx-auto text-[#007185] mb-1" size={24} />
                  <p className="text-xs text-[#007185]">7 Day Return</p>
                </div>
                <div className="text-center">
                  <FiShield className="mx-auto text-[#007185] mb-1" size={24} />
                  <p className="text-xs text-[#007185]">Secure Payment</p>
                </div>
              </div>

              <hr className="border-[#e7e7e7]" />

              {/* Description */}
              <div>
                <h3 className="font-bold text-[#0f1111] mb-2">About this item</h3>
                <p className="text-sm text-[#333] leading-relaxed">{product.description}</p>
              </div>
            </div>

            {/* Buy Box */}
            <div className="border border-[#d5d9d9] rounded-lg p-4 h-fit sticky top-[120px]">
              <p className="text-2xl text-[#0f1111] font-medium mb-1">
                <span className="text-sm align-top">₹</span>{product.price?.toLocaleString()}
              </p>
              {product.discount > 0 && (
                <p className="text-xs text-[#565959] mb-2">
                  Save ₹{((product.originalPrice || 0) - product.price).toLocaleString()} ({product.discount}%)
                </p>
              )}
              <p className="text-sm text-[#007600] mb-1">
                <FiTruck className="inline mr-1" size={14} />
                FREE delivery
              </p>

              <p className={`text-sm font-medium mb-4 ${product.stock > 0 ? "text-[#007600]" : "text-[#cc0c39]"}`}>
                {product.stock > 0 ? (
                  <><FiCheck className="inline mr-1" size={14} />In Stock ({product.stock} available)</>
                ) : "Currently unavailable"}
              </p>

              <button
                onClick={() => { if (!user) { toast.error("Please login first"); return; } addToCart(product._id); }}
                disabled={product.stock === 0}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-2.5 rounded-full font-medium text-sm mb-2 disabled:opacity-50 disabled:cursor-not-allowed border border-[#fcd200] shadow-sm flex items-center justify-center gap-2"
              >
                <FiShoppingCart size={16} /> Add to Cart
              </button>

              <button
                onClick={async () => { if (!user) { toast.error("Please login first"); return; } await addToCart(product._id); toast.success("Proceeding to checkout..."); navigate("/checkout"); }}
                disabled={product.stock === 0}
                className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] py-2.5 rounded-full font-medium text-sm mb-3 disabled:opacity-50 disabled:cursor-not-allowed border border-[#ff8f00] shadow-sm"
              >
                Buy Now
              </button>

              <button
                onClick={() => { if (!user) { toast.error("Please login first"); return; } toggleWishlist(product._id); }}
                className={`w-full py-2 rounded-full text-sm border flex items-center justify-center gap-2 transition-colors ${
                  inWishlist
                    ? "border-red-300 text-red-500 bg-red-50 hover:bg-red-100"
                    : "border-[#d5d9d9] text-[#0f1111] hover:bg-[#f7f7f7]"
                }`}
              >
                <FiHeart size={16} fill={inWishlist ? "currentColor" : "none"} />
                {inWishlist ? "In Wishlist" : "Add to Wishlist"}
              </button>

              <div className="mt-4 text-xs text-[#565959] space-y-1">
                <div className="flex justify-between">
                  <span>Sold by</span>
                  <span className="text-[#007185]">ShopEase</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment</span>
                  <span>Secure transaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
