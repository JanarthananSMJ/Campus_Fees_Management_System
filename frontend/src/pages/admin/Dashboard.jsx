import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, IndianRupee, ListChecks, UserPlus, Users } from "lucide-react";
import api from "../../api/api";

export default function AdminDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [stats, setStats] = useState({ students: 0, pending: 0, collected: 0 });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [{ data: students }, { data: fees }] = await Promise.all([
        api.get("/students"),
        api.get("/fees"),
      ]);
      const pending = fees.filter((f) => !f.paid).length;
      const collected = fees
        .filter((f) => f.paid)
        .reduce((sum, f) => sum + (f.amount || 0), 0);
      setStats({ students: students.length, pending, collected });
    } catch {
      // dashboard stats are best-effort
    }
  };

  const cards = [
    { label: "Total Students", value: stats.students, icon: Users, color: "from-indigo-500 to-indigo-600" },
    { label: "Pending Fees", value: stats.pending, icon: ListChecks, color: "from-amber-500 to-orange-500" },
    { label: "Collected", value: `₹${stats.collected}`, icon: IndianRupee, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name || "Admin"} 👋</h1>
        <p className="mt-1 text-slate-500">Here's what's happening with your campus fees today.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link
          to="/admin/students/create"
          className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Add a Student</p>
              <p className="text-sm text-slate-500">Create a new student & parent login</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
        </Link>

        <Link
          to="/admin/students/list"
          className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Manage Students</p>
              <p className="text-sm text-slate-500">View records and manage fees</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
        </Link>
      </div>
    </div>
  );
}
