import { Link } from "react-router-dom";
import { FaBriefcase, FaUsers, FaShieldAlt, FaStar, FaCheckCircle, FaComments } from "react-icons/fa";

export default function Home() {
  const features = [
    { icon: <FaBriefcase size={28}/>, title: "Post Projects", desc: "Clients post diverse projects from creative to technical tasks easily." },
    { icon: <FaUsers size={28}/>, title: "Bid & Connect", desc: "Skilled freelancers bid on projects matching their expertise." },
    { icon: <FaComments size={28}/>, title: "Real-time Chat", desc: "Integrated messaging for seamless collaboration between parties." },
    { icon: <FaShieldAlt size={28}/>, title: "Admin Oversight", desc: "Dedicated admin team ensures integrity and security of every transaction." },
    { icon: <FaCheckCircle size={28}/>, title: "Work Submission", desc: "Freelancers submit work directly through the platform for review." },
    { icon: <FaStar size={28}/>, title: "Reviews & Ratings", desc: "Transparent feedback system to build trust and reputation." },
  ];
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark px-4 py-3" style={{background:"#1e293b",position:"sticky",top:0,zIndex:100}}>
        <span className="navbar-brand fw-bold fs-4">SB<span style={{color:"#2563eb"}}>Works</span></span>
        <div className="d-flex gap-2">
          <Link to="/auth" className="btn btn-outline-light btn-sm">Sign In</Link>
          <Link to="/auth" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>
      {/* Hero */}
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="badge bg-primary mb-3 px-3 py-2">🚀 Freelancing Reimagined</span>
              <h1 className="display-4 fw-bold mb-4">Discover Opportunities, Unlock Your Potential</h1>
              <p className="lead mb-4" style={{color:"#94a3b8"}}>SB Works connects skilled freelancers with clients seeking quality work. Post projects, submit proposals, collaborate in real-time, and build your career.</p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/auth" className="btn btn-primary btn-lg px-4">Find Work</Link>
                <Link to="/auth" className="btn btn-outline-light btn-lg px-4">Hire Talent</Link>
              </div>
              <div className="d-flex gap-4 mt-4">
                {[["500+","Projects Posted"],["200+","Skilled Freelancers"],["95%","Success Rate"]].map(([n,l])=>(
                  <div key={l}><div className="fw-bold fs-4">{n}</div><small style={{color:"#94a3b8"}}>{l}</small></div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              <div className="p-4 rounded-4" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",width:"100%",maxWidth:420}}>
                {[{name:"Sarah M.",role:"Graphic Designer",rating:5,badge:"Top Rated"},{name:"James K.",role:"Web Developer",rating:5,badge:"Rising Talent"},{name:"Emma R.",role:"Content Writer",rating:4,badge:"Verified"}].map(f=>(
                  <div key={f.name} className="d-flex align-items-center gap-3 mb-3 p-3 rounded-3" style={{background:"rgba(255,255,255,0.05)"}}>
                    <div style={{width:42,height:42,borderRadius:"50%",background:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"white"}}>{f.name[0]}</div>
                    <div className="flex-1">
                      <div className="fw-semibold text-white">{f.name}</div>
                      <small style={{color:"#94a3b8"}}>{f.role}</small>
                    </div>
                    <span className="badge bg-primary">{f.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Everything You Need to Succeed</h2>
            <p className="text-muted">A complete platform for freelancers and clients alike</p>
          </div>
          <div className="row g-4">
            {features.map((f,i)=>(
              <div key={i} className="col-md-4">
                <div className="sb-card p-4 h-100 text-center fade-in">
                  <div className="mb-3" style={{color:"#2563eb"}}>{f.icon}</div>
                  <h5 className="fw-semibold mb-2">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-5" style={{background:"linear-gradient(135deg,#1e293b,#2563eb)"}}>
        <div className="container text-center text-white">
          <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
          <p className="mb-4 opacity-75">Join thousands of freelancers and clients on SB Works today.</p>
          <Link to="/auth" className="btn btn-light btn-lg px-5 fw-semibold">Join SB Works Free</Link>
        </div>
      </section>
      <footer className="py-4 text-center text-muted" style={{background:"#1e293b",color:"#64748b !important"}}>
        <small style={{color:"#64748b"}}>© 2024 SBWorks. All rights reserved.</small>
      </footer>
    </div>
  );
}
