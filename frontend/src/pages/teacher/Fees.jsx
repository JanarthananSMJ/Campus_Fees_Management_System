import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { CheckCircle2, Clock } from "lucide-react";

export default function TeacherFees() {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await api.get("/fees");
    setFees(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Fees Overview</h1>
        <p className="mt-1 text-slate-500">Fee status across all students.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
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
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      f.paid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {f.paid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    {f.paid ? "Paid" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {fees.length === 0 && (
          <p className="p-8 text-center text-slate-400">No fee records found</p>
        )}
      </div>
    </div>
  );
}
