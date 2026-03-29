import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";

export default function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const items = cart.items || [];

  if (items.length === 0) {
    return (
      <div className="bg-[#e3e6e6] min-h-screen">
        <div className="max-w-[1500px] mx-auto px-4 py-8">
          <div className="bg-white rounded-sm shadow-sm p-12 text-center">
            <FiShoppingBag className="mx-auto text-[#d5d9d9] mb-4" size={80} />
            <h2 className="text-2xl font-bold text-[#0f1111] mb-2">Your ShopEase Cart is empty</h2>
            <p className="text-sm text-[#565959] mb-4">Your shopping cart is waiting. Give it purpose - fill it with groceries, clothing, electronics, and more.</p>
            <Link to="/products" className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] px-8 py-2.5 rounded-full font-medium text-sm border border-[#fcd200] shadow-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
              <h1 className="text-2xl font-bold text-[#0f1111] mb-1">Shopping Cart</h1>
              <p className="text-sm text-[#565959] mb-4 border-b border-[#e7e7e7] pb-4">Price</p>

              <div className="divide-y divide-[#e7e7e7]">
                {items.map((item) => (
                  <div key={item.product?._id || item._id} className="flex gap-4 py-4">
                    <Link to={`/products/${item.product?._id}`} className="shrink-0">
                      <img src={item.product?.image} alt={item.product?.name} className="w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] object-contain bg-[#f7f7f7] rounded p-2" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product?._id}`} className="text-base sm:text-lg text-[#0f1111] hover:text-[#c45500] line-clamp-2">
                        {item.product?.name}
                      </Link>
                      <p className="text-xs text-[#007600] mt-1">In Stock</p>
                      <p className="text-xs text-[#565959] mt-0.5">Category: {item.product?.category}</p>

                      {/* Quantity & Actions */}
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <div className="flex items-center border border-[#d5d9d9] rounded-full overflow-hidden shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                            className="px-3 py-1.5 hover:bg-[#f0f2f2] text-[#0f1111]"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-4 py-1.5 text-sm font-medium bg-[#f0f2f2] border-x border-[#d5d9d9] min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                            className="px-3 py-1.5 hover:bg-[#f0f2f2] text-[#0f1111]"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <span className="text-[#d5d9d9]">|</span>
                        <button
                          onClick={() => removeFromCart(item.product?._id)}
                          className="text-sm text-[#007185] hover:text-[#c45500] hover:underline flex items-center gap-1"
                        >
                          <FiTrash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-[#0f1111]">₹{(item.product?.price * item.quantity)?.toLocaleString()}</p>
                      {item.product?.discount > 0 && (
                        <p className="text-xs text-[#cc0c39]">{item.product?.discount}% off</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right border-t border-[#e7e7e7] pt-4 mt-2">
                <p className="text-lg text-[#0f1111]">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items): <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Box */}
          <div className="w-full lg:w-[300px] shrink-0">
            <div className="bg-white rounded-sm shadow-sm p-4 sticky top-[100px]">
              <p className="text-xs text-[#007600] mb-2">
                Your order is eligible for FREE Delivery.
              </p>
              <p className="text-lg text-[#0f1111] mb-4">
                Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items): <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
              </p>
              <Link
                to="/checkout"
                className="block w-full text-center bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-2.5 rounded-full font-medium text-sm border border-[#fcd200] shadow-sm"
              >
                Proceed to Buy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
