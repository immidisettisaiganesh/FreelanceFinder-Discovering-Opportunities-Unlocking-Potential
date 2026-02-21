import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Auth from "./pages/Auth";
import CompleteProfile from "./pages/CompleteProfile";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
// Owner
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProjects from "./pages/owner/OwnerProjects";
import OwnerProject from "./pages/owner/OwnerProject";
import OwnerChat from "./pages/owner/OwnerChat";
// Freelancer
import FreelancerLayout from "./layouts/FreelancerLayout";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import FreelancerProposals from "./pages/freelancer/FreelancerProposals";
import FreelancerProjects from "./pages/freelancer/FreelancerProjects";
import FreelancerChat from "./pages/freelancer/FreelancerChat";
import BrowseProjects from "./pages/freelancer/BrowseProjects";
// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProposals from "./pages/admin/AdminProposals";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{height:"100vh"}}><div className="spinner-border text-primary"/></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      {/* Owner/Client */}
      <Route path="/owner" element={<ProtectedRoute role="OWNER"><OwnerLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="projects" element={<OwnerProjects />} />
        <Route path="projects/:id" element={<OwnerProject />} />
        <Route path="chat" element={<OwnerChat />} />
        <Route path="chat/:userId" element={<OwnerChat />} />
      </Route>
      {/* Freelancer */}
      <Route path="/freelancer" element={<ProtectedRoute role="FREELANCER"><FreelancerLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<FreelancerDashboard />} />
        <Route path="browse" element={<BrowseProjects />} />
        <Route path="proposals" element={<FreelancerProposals />} />
        <Route path="my-projects" element={<FreelancerProjects />} />
        <Route path="chat" element={<FreelancerChat />} />
        <Route path="chat/:userId" element={<FreelancerChat />} />
      </Route>
      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="proposals" element={<AdminProposals />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
