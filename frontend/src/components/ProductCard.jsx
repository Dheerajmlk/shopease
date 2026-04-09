import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProductCard({ product, compact = false }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Please login first"); return; }
    addToCart(product._id);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Please login first"); return; }
    toggleWishlist(product._id);
  };

  const inWishlist = isInWishlist(product._id);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        size={compact ? 10 : 12}
        fill={i < Math.floor(rating) ? "#de7921" : "none"}
        className={i < Math.floor(rating) ? "text-[#de7921]" : "text-[#d5d9d9]"}
      />
    ));
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className={`product-card group bg-white rounded-sm overflow-hidden transition-all duration-200 relative block`}
    >
      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-1.5 right-1.5 z-10 p-1 rounded-full shadow-md transition-all ${
          inWishlist ? "bg-red-50 text-red-500" : "bg-white/90 text-gray-400 opacity-0 group-hover:opacity-100"
        } hover:text-red-500`}
      >
        <FiHeart size={compact ? 12 : 14} fill={inWishlist ? "currentColor" : "none"} />
      </button>

      {/* Discount Badge */}
      {product.discount > 0 && (
        <span className={`absolute top-0 left-0 z-10 bg-[#cc0c39] text-white font-bold rounded-br-md ${compact ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5'}`}>
          {product.discount}% off
        </span>
      )}

      {/* Image */}
      <div className={`${compact ? 'h-32' : 'h-44 sm:h-52'} bg-[#f7f7f7] flex items-center justify-center overflow-hidden p-2`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23f0f0f0'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className={compact ? "px-2 py-1.5" : "px-2.5 py-2 sm:px-3 sm:py-2.5"}>
        <h3 className={`text-[#0f1111] font-medium leading-snug line-clamp-1 hover:text-[#c45500] ${compact ? 'text-[11px]' : 'text-xs sm:text-sm'}`}>
          {product.name}
        </h3>

        {/* Rating */}
        {product.ratings > 0 && (
          <div className="flex items-center gap-0.5 mt-0.5">
            <div className="flex">{renderStars(product.ratings)}</div>
            <span className="text-[#007185] text-[10px] sm:text-xs ml-0.5">{product.reviewCount?.toLocaleString() || 0}</span>
          </div>
        )}

        {/* Price + Discount on same line */}
        <div className="flex items-baseline gap-1 mt-1 flex-wrap">
          <span className={`${compact ? 'text-sm' : 'text-base sm:text-lg'} font-semibold text-[#0f1111]`}>
            <span className="text-[10px] align-top">₹</span>{product.price?.toLocaleString()}
          </span>
          {product.originalPrice > 0 && product.originalPrice > product.price && (
            <span className="text-[10px] sm:text-xs text-[#565959] line-through">
              ₹{product.originalPrice?.toLocaleString()}
            </span>
          )}
          {product.discount > 0 && (
            <span className="text-[10px] sm:text-xs text-[#cc0c39] font-semibold">
              {product.discount}% off
            </span>
          )}
        </div>

        {/* Tags */}
        {(product.isBestSeller || (product.isFeatured && !product.isBestSeller)) && (
          <div className="mt-1">
            {product.isBestSeller && (
              <span className="text-[9px] sm:text-[10px] bg-[#f0c14b] text-[#111] px-1.5 py-0.5 rounded-sm font-bold">#1 Best Seller</span>
            )}
            {product.isFeatured && !product.isBestSeller && (
              <span className="text-[9px] sm:text-[10px] bg-[#232f3e] text-white px-1.5 py-0.5 rounded-sm font-bold">Featured</span>
            )}
          </div>
        )}

        {/* Add to cart - only on non-compact */}
        {!compact && (
          <button
            onClick={handleAddToCart}
            className="w-full mt-2 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-xs sm:text-sm py-1.5 rounded-full font-medium border border-[#fcd200] shadow-sm transition-colors flex items-center justify-center gap-1"
          >
            <FiShoppingCart size={13} />
            Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
}
