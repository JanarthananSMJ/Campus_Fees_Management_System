import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams } from "react-router-dom";
import { CheckCircle2, Clock, Receipt } from "lucide-react";

export default function Fees() {
  const { id } = useParams();
  const [fees, setFees] = useState([]);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    const { data } = await api.get(`/students/${id}/profile`);
    setFees(data.fees);
  };

  if (fees.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-400">
        No fee records yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fees.map((f) => (
        <div
          key={f._id}
          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                f.paid ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              {f.paid ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-semibold text-slate-900">₹{f.amount}</p>
              <p className="text-xs text-slate-500">Due {new Date(f.dueDate).toDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                f.paid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {f.paid ? "Paid" : "Pending"}
            </span>
            <a
              href={`http://localhost:8080/api/fees/${f._id}/invoice`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              <Receipt className="h-4 w-4" />
              Invoice
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
