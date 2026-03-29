import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const products = wishlist.products || [];

  if (products.length === 0) {
    return (
      <div className="bg-[#e3e6e6] min-h-screen">
        <div className="max-w-[1500px] mx-auto px-4 py-8">
          <div className="bg-white rounded-sm shadow-sm p-12 text-center">
            <FiHeart className="mx-auto text-[#d5d9d9] mb-4" size={80} />
            <h2 className="text-2xl font-bold text-[#0f1111] mb-2">Your Wishlist is empty</h2>
            <p className="text-sm text-[#565959] mb-4">Add items you'd like to buy later by clicking the heart icon.</p>
            <Link to="/products" className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] px-8 py-2.5 rounded-full font-medium text-sm border border-[#fcd200] shadow-sm">
              Discover Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4 py-4">
        <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6 mb-4">
          <h1 className="text-2xl font-bold text-[#0f1111]">Your Wishlist</h1>
          <p className="text-sm text-[#565959]">{products.length} items</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
