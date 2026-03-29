import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Verify token on mount
  useEffect(() => {
    api.get(`/auth/verify-reset-token/${token}`)
      .then((res) => {
        setTokenValid(true);
        setUserEmail(res.data.email);
      })
      .catch(() => {
        setTokenValid(false);
      })
      .finally(() => setVerifying(false));
  }, [token]);

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"][strength];
  const strengthColor = ["", "#cc0c39", "#f0c14b", "#f0c14b", "#007600", "#007600"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  /* ── Loading ── */
  if (verifying) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Link to="/"><span className="text-3xl font-bold text-[#0f1111]">Shop</span><span className="text-3xl font-bold text-[#f08804]">Ease</span></Link>
        <div className="flex items-center gap-3 text-[#565959]">
          <FiLoader size={20} className="animate-spin" />
          <span className="text-sm">Verifying your reset link...</span>
        </div>
      </div>
    );
  }

  /* ── Invalid token ── */
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center pt-10 px-4">
        <Link to="/" className="mb-8"><span className="text-3xl font-bold text-[#0f1111]">Shop</span><span className="text-3xl font-bold text-[#f08804]">Ease</span></Link>
        <div className="w-full max-w-[380px] border border-[#ddd] rounded-lg p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mx-auto mb-4">
            <FiAlertCircle size={36} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-[#0f1111] mb-2">Link Expired or Invalid</h2>
          <p className="text-sm text-[#565959] leading-relaxed mb-6">
            This password reset link is invalid or has already expired. Reset links are valid for <strong>15 minutes</strong> only.
          </p>
          <Link to="/forgot-password"
            className="block w-full text-center py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] rounded-lg font-medium text-sm border border-[#fcd200] shadow-sm mb-3">
            Request a New Link
          </Link>
          <Link to="/login" className="text-sm text-[#007185] hover:underline">Back to Sign In</Link>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center pt-10 px-4">
        <Link to="/" className="mb-8"><span className="text-3xl font-bold text-[#0f1111]">Shop</span><span className="text-3xl font-bold text-[#f08804]">Ease</span></Link>
        <div className="w-full max-w-[380px] border border-[#ddd] rounded-lg p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mx-auto mb-4">
            <FiCheckCircle size={36} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-[#0f1111] mb-2">Password Reset!</h2>
          <p className="text-sm text-[#565959] leading-relaxed mb-6">
            Your password has been reset successfully. Redirecting you to sign in...
          </p>
          <Link to="/login"
            className="block w-full text-center py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] rounded-lg font-medium text-sm border border-[#fcd200] shadow-sm">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  /* ── Reset Form ── */
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-6 px-4">
      <Link to="/" className="mb-6"><span className="text-3xl font-bold text-[#0f1111]">Shop</span><span className="text-3xl font-bold text-[#f08804]">Ease</span></Link>

      <div className="w-full max-w-[380px]">
        <div className="border border-[#ddd] rounded-lg p-6 mb-4">
          <h1 className="text-2xl font-normal text-[#0f1111] mb-1">Create New Password</h1>
          <p className="text-sm text-[#565959] mb-5">
            For <span className="font-semibold text-[#0f1111]">{userEmail}</span>. Choose a strong password.
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded px-3 py-2.5 mb-4 text-sm text-red-700">
              <FiAlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-[#0f1111] mb-1">New Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-9 pr-10 py-2.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm shadow-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#0f1111]">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {/* Strength Bar */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthColor : "#e0e0e0" }} />
                    ))}
                  </div>
                  <p className="text-xs mt-1" style={{ color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-[#0f1111] mb-1">Confirm New Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm shadow-sm"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#0f1111]">
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {confirm && password !== confirm && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
              {confirm && password === confirm && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><FiCheckCircle size={12} /> Passwords match</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-2.5 rounded-lg font-medium text-sm border border-[#fcd200] shadow-sm disabled:opacity-60 transition-colors">
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-auto pt-8 pb-6 w-full border-t border-[#e7e7e7] bg-gradient-to-b from-transparent to-[#f7f7f7]">
        <div className="flex justify-center gap-6 text-xs text-[#007185]">
          <span className="hover:underline cursor-pointer">Conditions of Use</span>
          <span className="hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:underline cursor-pointer">Help</span>
        </div>
        <p className="text-center text-xs text-[#565959] mt-2">&copy; 2024 ShopEase</p>
      </div>
    </div>
  );
}
