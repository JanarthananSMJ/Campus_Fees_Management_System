import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api";
import { CheckCircle2, Clock, IndianRupee, PlusCircle, Receipt } from "lucide-react";
import { Button, Card, Input, SectionHeading, StatusBadge } from "../../../components/ui";

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

      <Card className="overflow-hidden">
        <SectionHeading icon={Receipt} title="Fee Records" />
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
              const status = fee.paid ? "paid" : overdue ? "overdue" : "pending";
              return (
                <tr key={fee._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">₹{fee.amount}</td>
                  <td className="px-5 py-3 text-slate-500">{new Date(fee.dueDate).toDateString()}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={status} icon={fee.paid ? CheckCircle2 : Clock}>
                      {fee.paid ? "Paid" : overdue ? "Overdue" : "Pending"}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3 text-slate-500">₹{calculateFine(fee)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {!fee.paid && (
                        <Button size="sm" onClick={() => markPaid(fee._id)}>
                          Mark Paid
                        </Button>
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
      </Card>

      <Card className="overflow-hidden">
        <SectionHeading icon={PlusCircle} title="Add New Fees" />
        <form onSubmit={addFees} className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              icon={IndianRupee}
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Discount / Scholarship"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} className="mt-5">
            {loading ? "Saving..." : "Add Fees"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default StudentFees;
