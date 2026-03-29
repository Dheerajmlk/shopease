import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-4">
      <Link to="/" className="mb-4">
        <span className="text-3xl font-bold text-[#0f1111]">Shop</span>
        <span className="text-3xl font-bold text-[#f08804]">Ease</span>
      </Link>

      <div className="w-full max-w-[350px] px-4">
        <div className="border border-[#ddd] rounded-lg p-5 mb-4">
          <h1 className="text-[28px] font-normal text-[#0f1111] mb-4">Create account</h1>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-[#0f1111] mb-1">Your name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                placeholder="First and last name"
                className="w-full px-3 py-1.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0f1111] mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-3 py-1.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0f1111] mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="At least 6 characters"
                className="w-full px-3 py-1.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm shadow-sm" />
              <p className="text-xs text-[#565959] mt-1">Passwords must be at least 6 characters.</p>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-2 rounded-lg font-medium text-sm border border-[#fcd200] shadow-sm disabled:opacity-50">
              {loading ? "Creating..." : "Create your ShopEase account"}
            </button>
          </form>
          <p className="text-xs text-[#565959] mt-4">
            By creating an account, you agree to ShopEase's Conditions of Use and Privacy Notice.
          </p>
          <div className="border-t border-[#e7e7e7] mt-4 pt-4">
            <p className="text-sm text-[#0f1111]">
              Already have an account? <Link to="/login" className="text-[#007185] hover:text-[#c45500] hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

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
