import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { CheckCircle2, Clock } from "lucide-react";
import { Card, PageHeader, StatusBadge } from "../../components/ui";

export default function TeacherFees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/fees");
      setFees(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.department ? `${user.department} — Fees Overview` : "Student Fees Overview"}
        description="Fee status for all students in your department."
      />

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Due Date</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fees.map((f) => (
              <tr key={f._id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-800">{f.student?.name || "—"}</td>
                <td className="px-5 py-3 text-slate-600">₹{f.amount}</td>
                <td className="px-5 py-3 text-slate-500">{new Date(f.dueDate).toDateString()}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={f.paid ? "paid" : "pending"} icon={f.paid ? CheckCircle2 : Clock}>
                    {f.paid ? "Paid" : "Pending"}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && fees.length === 0 && (
          <p className="p-8 text-center text-slate-400">No fee records found</p>
        )}
        {loading && <p className="p-8 text-center text-slate-400">Loading fee records...</p>}
      </Card>
    </div>
  );
}
