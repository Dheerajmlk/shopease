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
        size={compact ? 11 : 13}
        fill={i < Math.floor(rating) ? "#de7921" : "none"}
        className={i < Math.floor(rating) ? "text-[#de7921]" : "text-[#d5d9d9]"}
      />
    ));
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className={`product-card group bg-white rounded-sm overflow-hidden transition-all duration-200 relative block ${compact ? 'p-2' : ''}`}
    >
      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full shadow-md transition-all ${
          inWishlist ? "bg-red-50 text-red-500" : "bg-white/90 text-gray-400 opacity-0 group-hover:opacity-100"
        } hover:text-red-500`}
      >
        <FiHeart size={16} fill={inWishlist ? "currentColor" : "none"} />
      </button>

      {/* Discount Badge */}
      {product.discount > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-[#cc0c39] text-white text-xs font-bold px-2 py-0.5 rounded-sm">
          {product.discount}% off
        </span>
      )}

      {/* Image */}
      <div className={`${compact ? 'h-32' : 'h-48 sm:h-56'} bg-[#f7f7f7] flex items-center justify-center overflow-hidden p-3`}>
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className={compact ? "p-2" : "p-3 sm:p-4"}>
        <h3 className={`text-[#0f1111] font-medium leading-tight ${compact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-2'} hover:text-[#c45500]`}>
          {product.name}
        </h3>

        {/* Rating */}
        {product.ratings > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">{renderStars(product.ratings)}</div>
            <span className="text-[#007185] text-xs">{product.reviewCount?.toLocaleString() || 0}</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className={`${compact ? 'text-base' : 'text-lg sm:text-xl'} font-medium text-[#0f1111]`}>
              <span className="text-xs align-top">₹</span>{product.price?.toLocaleString()}
            </span>
            {product.originalPrice > 0 && product.originalPrice > product.price && (
              <span className="text-xs text-[#565959] line-through">
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
          {product.discount > 0 && (
            <p className="text-xs text-[#cc0c39] font-medium mt-0.5">
              Save ₹{((product.originalPrice || 0) - product.price).toLocaleString()} ({product.discount}% off)
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {product.isBestSeller && (
            <span className="text-[10px] bg-[#f0c14b] text-[#111] px-1.5 py-0.5 rounded-sm font-bold">#1 Best Seller</span>
          )}
          {product.isFeatured && !product.isBestSeller && (
            <span className="text-[10px] bg-[#232f3e] text-white px-1.5 py-0.5 rounded-sm font-bold">Featured</span>
          )}
        </div>

        {/* Add to cart - only on non-compact */}
        {!compact && (
          <button
            onClick={handleAddToCart}
            className="w-full mt-3 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-sm py-1.5 rounded-full font-medium border border-[#fcd200] shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <FiShoppingCart size={14} />
            Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
}
