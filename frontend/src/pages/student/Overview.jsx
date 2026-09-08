import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams } from "react-router-dom";
import { CalendarDays, Home, User } from "lucide-react";

export default function Overview() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    const { data } = await api.get(`/students/${id}/profile`);
    setStudent(data.student);
  };

  if (!student) {
    return <div className="rounded-2xl border border-slate-100 bg-white p-8 text-slate-400 shadow-sm">Loading...</div>;
  }

  const rows = [
    { icon: User, label: "Class & Section", value: `${student.class} - ${student.section}` },
    { icon: CalendarDays, label: "Date of Birth", value: student.dob?.slice(0, 10) || "—" },
    { icon: Home, label: "Address", value: student.address || "—" },
  ];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white">
          {student.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
          <p className="text-sm text-slate-500">Roll No. {student.rollNumber}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl bg-slate-50 p-4">
            <Icon className="h-4 w-4 text-indigo-500" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
