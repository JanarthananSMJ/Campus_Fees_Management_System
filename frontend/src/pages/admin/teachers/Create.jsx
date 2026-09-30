import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { CheckCircle2, KeyRound, UserCog } from "lucide-react";
import { DEPARTMENTS } from "../../../constants/academics";
import { Button, Card, Input, PageHeader, Select, SectionHeading, Toast } from "../../../components/ui";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [success, setSuccess] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    const { data } = await api.get("/teachers");
    setTeachers(data);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/teachers", form);

      setSuccess(`Teacher added for ${form.department}`);
      setShowPopup(true);
      setForm({ name: "", email: "", password: "", department: "" });
      loadTeachers();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {showPopup && (
        <Toast message="New Teacher added" onClose={() => setShowPopup(false)} />
      )}

      <PageHeader
        title="Add Teacher"
        description="Create a teacher login and assign the department whose students' fees they can view."
      />

      <Card className="overflow-hidden">
        <SectionHeading icon={UserCog} title="Teacher Details" />
        <form onSubmit={add} className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Teacher Name" value={form.name} onChange={set("name")} required />
            <Select label="Department" value={form.department} onChange={set("department")} required>
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </div>

          <div className="mt-8 flex items-center gap-2 border-b border-slate-100 pb-4">
            <KeyRound className="h-4 w-4 text-indigo-600" />
            <h2 className="font-semibold text-slate-900">Teacher Login</h2>
          </div>
          <div className="grid gap-4 pt-5 sm:grid-cols-2">
            <Input label="Email" type="email" value={form.email} onChange={set("email")} required />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={set("password")}
              required
            />
          </div>

          <Button type="submit" disabled={saving} className="mt-6">
            {saving ? "Adding..." : "Add Teacher"}
          </Button>
        </form>
      </Card>

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-sm font-semibold text-emerald-900">{success}</p>
        </div>
      )}

      <Card className="p-6">
        <h2 className="font-semibold text-slate-900">Teachers</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {teachers.map((t) => (
            <li key={t._id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{t.name}</p>
                <p className="text-xs text-slate-500">{t.email}</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {t.department}
              </span>
            </li>
          ))}
        </ul>

        {teachers.length === 0 && (
          <p className="mt-4 text-sm text-slate-400">No teachers added yet.</p>
        )}
      </Card>
    </div>
  );
}
