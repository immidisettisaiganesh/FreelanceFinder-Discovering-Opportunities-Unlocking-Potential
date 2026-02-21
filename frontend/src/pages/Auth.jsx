import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOtp, checkOtp } from "../services/authService";
import toast from "react-hot-toast";
import { FaBriefcase } from "react-icons/fa";

export default function Auth() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [devMsg, setDevMsg] = useState("");
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return toast.error("Enter a phone number");
    setLoading(true);
    setDevMsg("");
    try {
      const res = await getOtp({ phoneNumber: phone.trim() });
      const msg = res?.message || "OTP sent!";
      toast.success("OTP sent! Check backend terminal for the code.");
      setDevMsg(msg);
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await checkOtp({ phoneNumber: phone.trim(), otp });
      await fetchUser();
      toast.success("Welcome to SB Works! 🎉");
      const role = data?.user?.role;
      if (!data?.user?.isActive) navigate("/complete-profile");
      else if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "OWNER") navigate("/owner/dashboard");
      else if (role === "FREELANCER") navigate("/freelancer/dashboard");
      else navigate("/complete-profile");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP. Check backend terminal.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg,#1e293b,#2563eb)" }}>
      <div className="sb-card p-5" style={{ width: "100%", maxWidth: 420 }}>
        <div className="text-center mb-4">
          <div className="mb-3" style={{ color: "#2563eb" }}><FaBriefcase size={36} /></div>
          <h3 className="fw-bold">SB<span style={{ color: "#2563eb" }}>Works</span></h3>
          <p className="text-muted small mb-0">Freelancing Platform</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Phone Number</label>
              <input type="tel" className="form-control form-control-lg"
                placeholder="e.g. +10000000000 or any number"
                value={phone} onChange={e => setPhone(e.target.value)} required />
              <div className="form-text text-muted">
                💡 <strong>Dev mode:</strong> Any phone number works. OTP appears in backend terminal.
              </div>
            </div>
            <button className="btn btn-primary w-100 btn-lg fw-semibold" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Send OTP
            </button>
            <div className="text-center mt-4 p-3 bg-light rounded-3">
              <small className="text-muted fw-semibold">Quick Admin Login</small><br />
              <small className="text-muted">Phone: <code>+10000000000</code> · OTP: <code>123456</code></small>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            {devMsg && (
              <div className="alert alert-info small mb-3 py-2">
                ℹ️ {devMsg}
              </div>
            )}
            <div className="mb-2 text-muted small">OTP sent to <strong>{phone}</strong></div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Enter OTP Code</label>
              <input type="text" className="form-control form-control-lg text-center fw-bold"
                placeholder="e.g. 482931" value={otp}
                onChange={e => setOtp(e.target.value)} maxLength={8} required />
              <div className="form-text text-muted">Check your backend terminal window for the OTP code.</div>
            </div>
            <button className="btn btn-primary w-100 btn-lg fw-semibold" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Verify & Login
            </button>
            <button type="button" className="btn btn-link w-100 mt-2 text-muted small"
              onClick={() => { setStep(1); setOtp(""); setDevMsg(""); }}>
              ← Change number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
