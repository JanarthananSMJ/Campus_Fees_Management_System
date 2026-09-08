import { NavLink, Outlet, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const tabClass = ({ isActive }) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
  }`;

const StudentLayout = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <Link to="/admin/students/list" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600">
        <ArrowLeft className="h-4 w-4" />
        Back to Students
      </Link>

      <div className="inline-flex gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
        <NavLink to={`/admin/students/${id}/overview`} className={tabClass}>Overview</NavLink>
        <NavLink to={`/admin/students/${id}/fees`} className={tabClass}>Fees</NavLink>
        <NavLink to={`/admin/students/${id}/report`} className={tabClass}>Report</NavLink>
      </div>

      <Outlet />
    </div>
  );
};

export default StudentLayout;
