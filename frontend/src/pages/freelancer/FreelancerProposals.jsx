import { useState, useEffect } from "react";
import { getProposals } from "../../services/proposalService";

export default function FreelancerProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getProposals().then(d => setProposals(d.proposals || [])).finally(() => setLoading(false)); }, []);

  const statusMap = { 0: { label: "Rejected", cls: "badge-rejected" }, 1: { label: "Pending", cls: "badge-pending" }, 2: { label: "Accepted", cls: "badge-approved" } };

  return (
    <div className="fade-in">
      <h4 className="fw-bold mb-4">My Proposals</h4>
      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary"/></div> :
        proposals.length === 0 ? <div className="sb-card p-5 text-center"><p className="text-muted">No proposals yet. Browse projects and start bidding!</p></div> :
        <div className="sb-card overflow-hidden">
          <table className="table mb-0">
            <thead className="table-light"><tr><th>Proposal</th><th>Bid</th><th>Delivery</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {proposals.map(p => (
                <tr key={p._id}>
                  <td><div className="fw-semibold" style={{maxWidth:300}}>{p.description?.substring(0,80)}...</div></td>
                  <td><strong className="text-primary">${p.price}</strong></td>
                  <td>{p.duration} days</td>
                  <td><span className={`badge ${statusMap[p.status]?.cls} px-3 py-2`}>{statusMap[p.status]?.label}</span></td>
                  <td><small className="text-muted">{new Date(p.createdAt).toLocaleDateString()}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}
