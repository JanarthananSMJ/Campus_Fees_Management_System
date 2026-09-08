import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/api";
import { Search } from "lucide-react";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(data || []);
    } catch (err) {
      console.error("Failed to load students", err);
      setStudents([]);
    }
  };

  const groupedByClass = students.reduce((acc, student) => {
    const classKey = `${student.class}${student.section || ""}`;
    if (!acc[classKey]) acc[classKey] = [];
    acc[classKey].push(student);
    return acc;
  }, {});

  const classNames = Object.keys(groupedByClass);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students</h1>
          <p className="mt-1 text-slate-500">Browse all students, grouped by class.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search by name or roll"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>

      {classNames.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-400">
          No students found
        </div>
      )}

      <div className="space-y-6">
        {classNames.map((className) => {
          const sortedStudents = groupedByClass[className]
            .filter((s) => {
              const nameMatch = s.name?.toLowerCase().includes(search.toLowerCase());
              const rollMatch = String(s.rollNumber || "").includes(search);
              return nameMatch || rollMatch;
            })
            .sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber));

          if (sortedStudents.length === 0) return null;

          return (
            <div key={className} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600">
                Class {className}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {sortedStudents.map((student) => (
                  <Link
                    key={student._id}
                    to={`/admin/students/${student._id}/overview`}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 transition hover:border-indigo-200 hover:bg-indigo-50/50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                      {student.rollNumber}
                    </div>
                    <span className="truncate text-sm font-medium text-slate-800">{student.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
