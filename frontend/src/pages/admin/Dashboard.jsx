import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, IndianRupee, ListChecks, UserCog, UserPlus, Users } from "lucide-react";
import api from "../../api/api";
import { Card, PageHeader } from "../../components/ui";

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

  const shortcuts = [
    {
      to: "/admin/students/create",
      icon: UserPlus,
      iconClass: "bg-indigo-50 text-indigo-600",
      title: "Add a Student",
      description: "Create a new student login",
    },
    {
      to: "/admin/students/list",
      icon: Users,
      iconClass: "bg-emerald-50 text-emerald-600",
      title: "Manage Students",
      description: "View records and manage fees",
    },
    {
      to: "/admin/teachers/create",
      icon: UserCog,
      iconClass: "bg-violet-50 text-violet-600",
      title: "Add a Teacher",
      description: "Assign a department to a new teacher",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user.name || "Admin"} 👋`}
        description="Here's what's happening with your campus fees today."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map(({ to, icon: Icon, iconClass, title, description }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="text-sm text-slate-500">{description}</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
          </Link>
        ))}
      </div>
    </div>
  );
}
