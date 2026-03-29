import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSent(true);
      if (res.data.devMode && res.data.resetLink) {
        setDevLink(res.data.resetLink);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(devLink);
    toast.success("Link copied!");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-6 px-4">
      {/* Logo */}
      <Link to="/" className="mb-6 flex items-baseline gap-0">
        <span className="text-3xl font-bold text-[#0f1111]">Shop</span>
        <span className="text-3xl font-bold text-[#f08804]">Ease</span>
      </Link>

      <div className="w-full max-w-[380px]">
        {!sent ? (
          /* ── Request Form ── */
          <div className="border border-[#ddd] rounded-lg p-6 mb-4">
            {/* Back link */}
            <Link to="/login" className="flex items-center gap-1.5 text-sm text-[#007185] hover:text-[#c45500] mb-5 hover:underline w-fit">
              <FiArrowLeft size={14} /> Back to Sign In
            </Link>

            <h1 className="text-2xl font-normal text-[#0f1111] mb-1">Forgot Password?</h1>
            <p className="text-sm text-[#565959] mb-5 leading-relaxed">
              Enter the email address linked to your ShopEase account and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded px-3 py-2.5 mb-4 text-sm text-red-700">
                <FiAlertCircle size={16} className="shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0f1111] mb-1">Email address</label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 border border-[#888c8c] rounded focus:ring-2 focus:ring-[#007185] outline-none text-sm shadow-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-2.5 rounded-lg font-medium text-sm border border-[#fcd200] shadow-sm disabled:opacity-60 transition-colors"
              >
                {loading ? "Sending reset link..." : "Send Reset Link"}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e7e7e7]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-[#767676]">or</span>
              </div>
            </div>
            <Link to="/login" className="block w-full text-center py-2.5 border border-[#d5d9d9] rounded-lg text-sm text-[#0f1111] hover:bg-[#f7f7f7] shadow-sm">
              Sign in instead
            </Link>
            <p className="text-sm text-center text-[#565959] mt-3">
              New user?{" "}
              <Link to="/register" className="text-[#007185] hover:text-[#c45500] hover:underline font-medium">
                Create account
              </Link>
            </p>
          </div>
        ) : (
          /* ── Success State ── */
          <div className="border border-[#ddd] rounded-lg p-6 mb-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mx-auto mb-4">
              <FiCheckCircle size={36} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-[#0f1111] mb-2">Check Your Email</h2>
            <p className="text-sm text-[#565959] leading-relaxed mb-1">
              We've sent a password reset link to:
            </p>
            <p className="text-sm font-bold text-[#0f1111] mb-4">{email}</p>
            <p className="text-xs text-[#565959] leading-relaxed mb-5">
              The link will expire in <strong>15 minutes</strong>. Check your spam folder if you don't see the email.
            </p>

            {/* Dev Mode: show link directly if email not configured */}
            {devLink && (
              <div className="text-left mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#fef3cd] text-[#856404] text-xs font-bold px-2 py-0.5 rounded">DEV MODE</span>
                  <span className="text-xs text-[#565959]">Email not configured — use this link:</span>
                </div>
                <div className="bg-[#f7f7f7] border border-[#e0e0e0] rounded-lg p-3 flex items-start gap-2">
                  <p className="text-xs text-[#007185] break-all flex-1 leading-relaxed">{devLink}</p>
                  <button onClick={copyLink} className="shrink-0 p-1.5 hover:bg-[#e8e8e8] rounded text-[#565959]" title="Copy link">
                    <FiCopy size={14} />
                  </button>
                </div>
                <p className="text-xs text-[#999] mt-2">Add EMAIL_USER + EMAIL_PASS to backend .env to send real emails.</p>
              </div>
            )}

            <Link to="/login"
              className="block w-full text-center py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] rounded-lg font-medium text-sm border border-[#fcd200] shadow-sm mb-3">
              Back to Sign In
            </Link>
            <button
              onClick={() => { setSent(false); setDevLink(null); setEmail(""); }}
              className="text-sm text-[#007185] hover:text-[#c45500] hover:underline"
            >
              Try a different email
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
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
