import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { GraduationCap, LogOut, Menu, Receipt, X } from "lucide-react";

export default function TeacherLayout() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [navOpen, setNavOpen] = useState(false);

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const sidebar = (
    <>
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-base font-bold text-white">Campus Fees</span>
        </div>
        <button
          onClick={() => setNavOpen(false)}
          className="rounded-lg p-1.5 text-teal-200/70 hover:bg-teal-800 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <NavLink
          to="/teacher/fees"
          onClick={() => setNavOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-teal-500 text-white shadow-md shadow-teal-900/40"
                : "text-teal-200/70 hover:bg-teal-800 hover:text-white"
            }`
          }
        >
          <Receipt className="h-4 w-4" />
          Fees
        </NavLink>
      </nav>

      <div className="border-t border-teal-800 p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white">
            {(user.name || "T").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.name || "Teacher"}</p>
            <p className="truncate text-xs text-teal-200/70">Teacher</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-teal-200/70 transition-colors hover:bg-teal-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen overflow-hidden bg-slate-50 lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-teal-900 text-teal-100 lg:flex lg:h-screen">
        {sidebar}
      </aside>

      {/* Mobile sidebar drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setNavOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-teal-900 text-teal-100 shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex h-screen min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900">Campus Fees</span>
          </div>
          <button
            onClick={() => setNavOpen(true)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
