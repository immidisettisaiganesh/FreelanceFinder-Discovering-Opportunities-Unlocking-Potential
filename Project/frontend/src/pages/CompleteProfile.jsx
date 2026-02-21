import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function CompleteProfile() {
  const [form, setForm] = useState({ name: "", email: "", role: "FREELANCER" });
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await completeProfile(form);
      await fetchUser();
      navigate(form.role === "OWNER" ? "/owner" : "/freelancer");
      toast.success("Profile completed!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error completing profile");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background:"linear-gradient(135deg,#1e293b,#2563eb)"}}>
      <div className="sb-card p-5" style={{width:"100%",maxWidth:460}}>
        <h4 className="fw-bold mb-1">Complete Your Profile</h4>
        <p className="text-muted small mb-4">Tell us about yourself to get started</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input className="form-control" placeholder="Your full name" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} required minLength={5} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">I want to...</label>
            <div className="row g-3 mt-1">
              {[["FREELANCER","Find Work","I'm a freelancer looking for projects"],["OWNER","Hire Talent","I'm a client looking to hire"]].map(([val,label,desc])=>(
                <div className="col-6" key={val}>
                  <div className={`p-3 rounded-3 border-2 border cursor-pointer text-center ${form.role===val?"border-primary bg-primary bg-opacity-10":"border-light"}`}
                    onClick={() => setForm({...form, role: val})} style={{cursor:"pointer",borderWidth:2,borderStyle:"solid",borderColor:form.role===val?"#2563eb":"#dee2e6"}}>
                    <div className="fw-semibold">{label}</div>
                    <small className="text-muted">{desc}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary w-100 btn-lg fw-semibold" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"/> : null}Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}
