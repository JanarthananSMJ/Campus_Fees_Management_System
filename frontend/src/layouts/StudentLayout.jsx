import { useEffect, useState } from "react";
import { NavLink, Outlet, useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, LayoutGrid, Receipt } from "lucide-react";
import api from "../api/api";

const TABS = [
  { to: "overview", label: "Overview", icon: LayoutGrid },
  { to: "fees", label: "Fees", icon: Receipt },
  { to: "report", label: "Report", icon: FileText },
];

const StudentLayout = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get(`/students/${id}/profile`)
      .then(({ data }) => active && setStudent(data.student))
      .catch(() => active && setStudent(null));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="space-y-5">
      <Link
        to="/admin/students/list"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Students
      </Link>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white">
            {student?.name?.charAt(0).toUpperCase() || "S"}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{student?.name || "Loading..."}</p>
            <p className="truncate text-xs text-slate-500">
              {student?.rollNumber ? `Roll No. ${student.rollNumber}` : "Student profile"}
            </p>
          </div>
        </div>

        <nav className="flex gap-1 rounded-xl bg-slate-100 p-1">
          {TABS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={`/admin/students/${id}/${to}`}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <Outlet />
    </div>
  );
};

export default StudentLayout;
