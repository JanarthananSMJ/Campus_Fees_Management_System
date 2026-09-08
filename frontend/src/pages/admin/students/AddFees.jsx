import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api";
import { CheckCircle2, Clock, IndianRupee, PlusCircle, Receipt } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const StudentFees = () => {
  const { id } = useParams();

  const [fees, setFees] = useState([]);
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const loadFees = async () => {
    try {
      const res = await api.get("/fees");
      const studentFees = res.data.filter((fee) => fee.student?._id === id);
      setFees(studentFees);
    } catch (error) {
      console.error("Failed to load fees", error);
    }
  };

  useEffect(() => {
    loadFees();
  }, [id]);

  const addFees = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/fees", {
        student: id,
        amount: Number(amount),
        dueDate,
        discount: Number(discount),
        note,
      });
      setAmount("");
      setDueDate("");
      setDiscount(0);
      setNote("");
      loadFees();
    } catch (error) {
      alert("Failed to add fees");
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (feeId) => {
    try {
      await api.put(`/fees/${feeId}/pay`);
      loadFees();
    } catch (error) {
      alert("Failed to mark paid");
    }
  };

  const calculateFine = (fee) => {
    if (fee.paid) return 0;
    const today = new Date();
    const due = new Date(fee.dueDate);
    if (due >= today) return 0;
    const daysLate = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    return daysLate * 10;
  };

  const totalAssigned = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalDiscount = fees.reduce((sum, fee) => sum + (fee.discount || 0), 0);
  const totalFine = fees.reduce((sum, fee) => sum + calculateFine(fee), 0);
  const totalPaid = fees.filter((fee) => fee.paid).reduce((sum, fee) => sum + fee.amount, 0);
  const netPayable = totalAssigned - totalDiscount + totalFine;
  const remaining = Math.max(netPayable - totalPaid, 0);

  const summary = [
    { label: "Total Fees", value: totalAssigned, color: "text-slate-900" },
    { label: "Discount", value: totalDiscount, color: "text-teal-600" },
    { label: "Fine", value: totalFine, color: "text-rose-600" },
    { label: "Paid", value: totalPaid, color: "text-emerald-600" },
    { label: "Remaining", value: remaining, color: "text-amber-600", highlight: true },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {summary.map(({ label, value, color, highlight }) => (
          <div
            key={label}
            className={`rounded-2xl border p-4 shadow-sm ${
              highlight ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-white"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
            <p className={`mt-1.5 text-xl font-bold ${color}`}>₹{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <Receipt className="h-4 w-4 text-indigo-600" />
          <h2 className="font-semibold text-slate-900">Fee Records</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Due Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Fine</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fees.map((fee) => {
              const overdue = !fee.paid && new Date(fee.dueDate) < new Date();
              return (
                <tr key={fee._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">₹{fee.amount}</td>
                  <td className="px-5 py-3 text-slate-500">{new Date(fee.dueDate).toDateString()}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        fee.paid
                          ? "bg-emerald-50 text-emerald-700"
                          : overdue
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {fee.paid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                      {fee.paid ? "Paid" : overdue ? "Overdue" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">₹{calculateFine(fee)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {!fee.paid && (
                        <button
                          onClick={() => markPaid(fee._id)}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                        >
                          Mark Paid
                        </button>
                      )}
                      <a
                        href={`http://localhost:8080/api/fees/${fee._id}/invoice`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-indigo-600 hover:underline"
                      >
                        Invoice
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {fees.length === 0 && <p className="p-8 text-center text-slate-400">No fee records yet</p>}
      </div>

      <form onSubmit={addFees} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <PlusCircle className="h-4 w-4 text-indigo-600" />
          <h2 className="font-semibold text-slate-900">Add New Fees</h2>
        </div>

        <div className="grid gap-4 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`${inputClass} pl-9`}
              required
            />
          </div>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClass}
            required
          />

          <input
            type="number"
            placeholder="Discount / Scholarship"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:opacity-95 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Add Fees"}
        </button>
      </form>
    </div>
  );
};

export default StudentFees;
