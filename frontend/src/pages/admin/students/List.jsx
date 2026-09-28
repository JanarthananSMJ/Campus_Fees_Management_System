import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/api";
import { Search } from "lucide-react";
import { Card, EmptyState, Input, PageHeader } from "../../../components/ui";

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

  const groupedByCourse = students.reduce((acc, student) => {
    const courseKey = student.course || "Unassigned";
    if (!acc[courseKey]) acc[courseKey] = [];
    acc[courseKey].push(student);
    return acc;
  }, {});

  const courseNames = Object.keys(groupedByCourse);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Students" description="Browse all students, grouped by course." />
        <Input
          icon={Search}
          wrapperClassName="w-full sm:w-72"
          placeholder="Search by name or roll"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {courseNames.length === 0 && <EmptyState>No students found</EmptyState>}

      <div className="space-y-6">
        {courseNames.map((courseName) => {
          const sortedStudents = groupedByCourse[courseName]
            .filter((s) => {
              const nameMatch = s.name?.toLowerCase().includes(search.toLowerCase());
              const rollMatch = String(s.rollNumber || "").includes(search);
              return nameMatch || rollMatch;
            })
            .sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber));

          if (sortedStudents.length === 0) return null;

          return (
            <Card key={courseName} className="p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600">
                {courseName}
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
            </Card>
          );
        })}
      </div>
    </div>
  );
}
