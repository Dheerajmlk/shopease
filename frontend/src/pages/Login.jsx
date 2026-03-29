import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success("Welcome back!");
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-4">
      {/* Logo */}
      <Link to="/" className="mb-4">
        <span className="text-3xl font-bold text-[#0f1111]">Shop</span>
        <span className="text-3xl font-bold text-[#f08804]">Ease</span>
      </Link>

      <div className="w-full max-w-[350px] px-4">
        <div className="border border-[#ddd] rounded-lg p-5 mb-4">
          <h1 className="text-[28px] font-normal text-[#0f1111] mb-4">Sign in</h1>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-[#0f1111] mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-3 py-1.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm shadow-sm" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-[#0f1111]">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#007185] hover:text-[#c45500] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-3 py-1.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm shadow-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-2 rounded-lg font-medium text-sm border border-[#fcd200] shadow-sm disabled:opacity-50">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="text-xs text-[#565959] mt-4">
            By continuing, you agree to ShopEase's Conditions of Use and Privacy Notice.
          </p>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e7e7e7]"></div></div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-[#767676]">New to ShopEase?</span>
          </div>
        </div>

        <Link to="/register"
          className="block w-full text-center py-2 border border-[#d5d9d9] rounded-lg text-sm text-[#0f1111] hover:bg-[#f7f7f7] shadow-sm">
          Create your ShopEase account
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 pb-6 w-full border-t border-[#e7e7e7] bg-gradient-to-b from-transparent to-[#f7f7f7]">
        <div className="flex justify-center gap-6 text-xs text-[#007185]">
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">Conditions of Use</span>
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">Help</span>
        </div>
        <p className="text-center text-xs text-[#565959] mt-2">&copy; 2024 ShopEase</p>
      </div>
    </div>
  );
}
