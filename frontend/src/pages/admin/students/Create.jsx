import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { CheckCircle2, KeyRound, User, Users } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

export default function Students() {
  const [classes, setClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState("");
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [lastCreds, setLastCreds] = useState(null);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    class: "",
    section: "",
    rollNumber: "",
    address: "",
    loginId: "",
    studentPassword: "",
    parentName: "",
    parentPhone: "",
    parentPassword: "",
  });

  const nav = useNavigate();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const { data } = await api.get("/students");
    const classList = [...new Set(data.map((s) => s.class))];
    setClasses(classList);
  };

  const loadStudentsByClass = async (className) => {
    setCurrentClass(className);
    const { data } = await api.get(`/students/class/${className}`);
    setStudents(data);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const add = async (e) => {
    e.preventDefault();

    const { data } = await api.post("/students", form);

    setLastCreds(data.credentials || null);

    setForm({
      name: "",
      dob: "",
      gender: "",
      class: "",
      section: "",
      rollNumber: "",
      address: "",
      loginId: "",
      studentPassword: "",
      parentName: "",
      parentPhone: "",
      parentPassword: "",
    });

    loadClasses();
  };

  const removeStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    await api.delete(`/students/${id}`);
    if (currentClass) loadStudentsByClass(currentClass);
    else loadClasses();
  };

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.rollNumber && s.rollNumber.toString().includes(q))
    );
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Student</h1>
        <p className="mt-1 text-slate-500">Create a student record along with student & parent logins.</p>
      </div>

      <form onSubmit={add} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <User className="h-4 w-4 text-indigo-600" />
          <h2 className="font-semibold text-slate-900">Student Details</h2>
        </div>
        <div className="grid gap-4 pt-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Student Name</label>
            <input className={inputClass} value={form.name} onChange={set("name")} required />
          </div>
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input type="date" className={inputClass} value={form.dob} onChange={set("dob")} required />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select className={inputClass} value={form.gender} onChange={set("gender")} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Class</label>
            <input className={inputClass} value={form.class} onChange={set("class")} required />
          </div>
          <div>
            <label className={labelClass}>Section</label>
            <input className={inputClass} value={form.section} onChange={set("section")} required />
          </div>
          <div>
            <label className={labelClass}>Roll Number</label>
            <input className={inputClass} value={form.rollNumber} onChange={set("rollNumber")} required />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelClass}>Address</label>
            <input className={inputClass} value={form.address} onChange={set("address")} required />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <KeyRound className="h-4 w-4 text-indigo-600" />
          <h2 className="font-semibold text-slate-900">Student Login</h2>
        </div>
        <div className="grid gap-4 pt-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Login ID</label>
            <input className={inputClass} value={form.loginId} onChange={set("loginId")} required />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              value={form.studentPassword}
              onChange={set("studentPassword")}
              required
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Users className="h-4 w-4 text-indigo-600" />
          <h2 className="font-semibold text-slate-900">Parent Information</h2>
        </div>
        <div className="grid gap-4 pt-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Parent Name</label>
            <input className={inputClass} value={form.parentName} onChange={set("parentName")} required />
          </div>
          <div>
            <label className={labelClass}>Parent Phone</label>
            <input className={inputClass} value={form.parentPhone} onChange={set("parentPhone")} required />
          </div>
          <div>
            <label className={labelClass}>Parent Password</label>
            <input
              type="password"
              className={inputClass}
              value={form.parentPassword}
              onChange={set("parentPassword")}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:opacity-95"
        >
          Add Student
        </button>
      </form>

      {lastCreds && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="text-sm text-emerald-900">
            <p className="font-semibold">Student added successfully</p>
            <p className="mt-1">
              Login ID: <b>{lastCreds.loginId}</b> &nbsp;·&nbsp; Password:{" "}
              <b>{lastCreds.studentPassword}</b>
            </p>
            {lastCreds.parentLoginId && (
              <p className="mt-1">
                Parent Login: <b>{lastCreds.parentLoginId}</b> &nbsp;·&nbsp; Password:{" "}
                <b>{lastCreds.parentPassword}</b>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">Browse by Class</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {classes.map((c) => (
            <button
              key={c}
              onClick={() => loadStudentsByClass(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                currentClass === c
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Class {c}
            </button>
          ))}
          {classes.length === 0 && <p className="text-sm text-slate-400">No classes yet.</p>}
        </div>

        {currentClass && (
          <div className="mt-5">
            <input
              placeholder="Search by name or roll number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={inputClass}
            />

            <ul className="mt-4 divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <li key={s._id} className="flex items-center justify-between py-3">
                  <button
                    onClick={() => nav(`/admin/students/${s._id}/overview`)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    {s.rollNumber}. {s.name}
                  </button>
                  <button
                    onClick={() => removeStudent(s._id)}
                    className="rounded-lg px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {filteredStudents.length === 0 && (
              <p className="mt-4 text-sm text-slate-400">No students found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
