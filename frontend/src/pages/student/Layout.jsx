import React from "react";
import { Outlet, NavLink, useParams } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";

const tabClass = ({ isActive }) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
  }`;

export default function Layout() {
  const { id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-slate-900">Campus Fees</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        <div className="mb-6 inline-flex gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
          <NavLink to={`/student/${id}/overview`} className={tabClass}>Overview</NavLink>
          <NavLink to={`/student/${id}/fees`} className={tabClass}>Fees</NavLink>
          <NavLink to={`/student/${id}/report`} className={tabClass}>Report</NavLink>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
