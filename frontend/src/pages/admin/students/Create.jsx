import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { CheckCircle2, KeyRound, Search, User } from "lucide-react";
import { DEPARTMENTS, DEPARTMENT_COURSES } from "../../../constants/academics";
import { Button, Card, Input, PageHeader, Select, SectionHeading } from "../../../components/ui";

export default function Students() {
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [lastCreds, setLastCreds] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    department: "",
    course: "",
    rollNumber: "",
    address: "",
    loginId: "",
    studentPassword: "",
  });

  const nav = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await api.get("/students");
    const courseList = [...new Set(data.map((s) => s.course))];
    setCourses(courseList);
  };

  const loadStudentsByCourse = async (courseName) => {
    setCurrentCourse(courseName);
    const { data } = await api.get(`/students/course/${courseName}`);
    setStudents(data);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const setDepartment = (e) => {
    setForm({ ...form, department: e.target.value, course: "" });
  };

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post("/students", form);

      setLastCreds(data.credentials || null);

      setForm({
        name: "",
        dob: "",
        gender: "",
        department: "",
        course: "",
        rollNumber: "",
        address: "",
        loginId: "",
        studentPassword: "",
      });

      loadCourses();
    } finally {
      setSaving(false);
    }
  };

  const removeStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    await api.delete(`/students/${id}`);
    if (currentCourse) loadStudentsByCourse(currentCourse);
    else loadCourses();
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
      <PageHeader title="Add Student" description="Create a student record along with a student login." />

      <Card className="overflow-hidden">
        <SectionHeading icon={User} title="Student Details" />
        <form onSubmit={add} className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="Student Name" value={form.name} onChange={set("name")} required />
            <Input
              label="Date of Birth"
              type="date"
              value={form.dob}
              onChange={set("dob")}
              required
            />
            <Select label="Gender" value={form.gender} onChange={set("gender")} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
            <Select label="Department" value={form.department} onChange={setDepartment} required>
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
            <Select
              label="Course"
              value={form.course}
              onChange={set("course")}
              disabled={!form.department}
              required
            >
              <option value="">Select Course</option>
              {(DEPARTMENT_COURSES[form.department] || []).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Input label="Roll Number" value={form.rollNumber} onChange={set("rollNumber")} required />
            <Input
              label="Address"
              wrapperClassName="sm:col-span-2 lg:col-span-3"
              value={form.address}
              onChange={set("address")}
              required
            />
          </div>

          <div className="mt-8 flex items-center gap-2 border-b border-slate-100 pb-4">
            <KeyRound className="h-4 w-4 text-indigo-600" />
            <h2 className="font-semibold text-slate-900">Student Login</h2>
          </div>
          <div className="grid gap-4 pt-5 sm:grid-cols-2">
            <Input label="Login ID" value={form.loginId} onChange={set("loginId")} required />
            <Input
              label="Password"
              type="password"
              value={form.studentPassword}
              onChange={set("studentPassword")}
              required
            />
          </div>

          <Button type="submit" disabled={saving} className="mt-6">
            {saving ? "Adding..." : "Add Student"}
          </Button>
        </form>
      </Card>

      {lastCreds && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="text-sm text-emerald-900">
            <p className="font-semibold">Student added successfully</p>
            <p className="mt-1">
              Login ID: <b>{lastCreds.loginId}</b> &nbsp;·&nbsp; Password:{" "}
              <b>{lastCreds.studentPassword}</b>
            </p>
          </div>
        </div>
      )}

      <Card className="p-6">
        <h2 className="font-semibold text-slate-900">Browse by Course</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {courses.map((c) => (
            <button
              key={c}
              onClick={() => loadStudentsByCourse(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                currentCourse === c
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
          {courses.length === 0 && <p className="text-sm text-slate-400">No courses yet.</p>}
        </div>

        {currentCourse && (
          <div className="mt-5">
            <Input
              icon={Search}
              placeholder="Search by name or roll number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  <Button variant="danger" size="sm" onClick={() => removeStudent(s._id)}>
                    Delete
                  </Button>
                </li>
              ))}
            </ul>

            {filteredStudents.length === 0 && (
              <p className="mt-4 text-sm text-slate-400">No students found</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
