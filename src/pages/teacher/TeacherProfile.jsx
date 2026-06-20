import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FiGrid, FiBook, FiBarChart2, FiBell, FiLogOut, FiCalendar,
  FiFileText, FiUser, FiMail, FiPhone, FiMapPin, FiUsers,
  FiLoader, FiEdit2, FiCheckCircle, FiAward, FiHash, FiX, FiSave,
} from "react-icons/fi";

const BASE    = "https://helwalrabee.com/api";
const TOKEN   = "LgIX4I1w7eGBy0nyIwQH2tZs6pyBHqRxxMLG0FnZfe32d748";
const HEADERS = { "Content-Type": "application/json", "Authorization": `Bearer ${TOKEN}` };

async function authedFetch(url) {
  const res  = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message ?? `Request failed (${res.status})`);
  }
  return json;
}


const CLASS_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500",
  "bg-orange-500", "bg-pink-500", "bg-teal-500",
];

export default function TeacherProfile() {
  const [activeNav, setActiveNav] = useState("My Profile");
  const [editing, setEditing]     = useState(false);
  const queryClient = useQueryClient();

  // ── 1. profile ───────────────────────────────────────────────────────────────
  const { data, isLoading, isError, error: profileErrorObj } = useQuery({
    queryKey: ["teacher-profile-page"],
    queryFn: () => authedFetch(`${BASE}/teacher/profile`),
  });

  // Real API shape: data = { id, name, email, role, ..., teacher: { teacher_id, phone, ... } }
  // (inverted from the doc's example — user fields are top-level, teacher fields are nested)
  const user    = data?.data ?? null;
  const profile = data?.data?.teacher ?? null;

  // ── 2. classrooms (for the "Classrooms" panel) ────────────────────────────────
  const { data: classroomsData } = useQuery({
    queryKey: ["teacher-profile-classrooms"],
    queryFn: () => authedFetch(`${BASE}/teacher/classrooms`),
  });
  const classrooms = classroomsData?.data ?? [];
  const totalStudents = classrooms.reduce((s, c) => s + (c.students_count ?? 0), 0);

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm({
    values: {
      name:          user?.name ?? "",
      email:         user?.email ?? "",
      phone:         profile?.phone ?? "",
      address:       profile?.address ?? "",
      qualification: profile?.qualification ?? "",
    },
  });

  // ── 3. update profile ──────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const res  = await fetch(`${BASE}/teacher/profile`, { method: "PUT", headers: HEADERS, body: JSON.stringify(formData) });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? "Update failed");
      return json;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["teacher-profile-page"] });
      setEditing(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-blue-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center max-w-sm">
          <FiX className="text-red-400 text-4xl mx-auto mb-4" />
          <p className="text-slate-800 font-semibold mb-1">Couldn't load your profile</p>
          <p className="text-slate-500 text-sm">{profileErrorObj?.message ?? "Something went wrong."}</p>
          <p className="text-slate-400 text-xs mt-3">Check that the token at the top of this file is valid and not expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">

        {/* top bar */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() ?? "T"}
          </div>
        </div>

        <div className="p-8 max-w-5xl mx-auto">

          {/* HERO */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-5xl font-bold shrink-0">
                  {user?.name?.[0]?.toUpperCase() ?? "T"}
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Teacher</p>
                  <h2 className="text-3xl font-bold mb-3">{user?.name ?? "—"}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                      <FiHash size={11} /> {profile?.teacher_id ?? "—"}
                    </span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                      <FiMail size={11} /> {user?.email ?? "—"}
                    </span>
                    {profile?.subject_specialization && (
                      <span className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                        <FiBook size={11} /> {profile.subject_specialization}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0">
                  <FiEdit2 size={14} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditing(false); reset(); }}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <FiX size={14} /> Cancel
                  </button>
                  <button onClick={handleSubmit(d => updateMutation.mutate(d))} disabled={!isDirty || updateMutation.isPending}
                    className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    {updateMutation.isPending ? <FiLoader className="animate-spin" size={14} /> : <FiSave size={14} />}
                    {updateMutation.isPending ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PERSONAL INFO */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
            <div className="flex items-center gap-2 mb-5">
              <FiUser className="text-blue-500" size={18} />
              <p className="font-semibold text-slate-800">Personal Information</p>
              {editing && <span className="ml-auto text-[11px] font-semibold bg-blue-50 text-blue-500 px-2.5 py-1 rounded-lg">Editing</span>}
            </div>

            {editing ? (
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Full Name</label>
                  <input {...register("name")} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Email Address</label>
                  <input type="email" {...register("email")} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Phone</label>
                  <input type="tel" {...register("phone")} placeholder="+1-555-0123" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Qualification</label>
                  <input {...register("qualification")} placeholder="Master's in Mathematics" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Address</label>
                  <textarea {...register("address")} rows={2} placeholder="123 Main St, City" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {[
                  { label: "Full Name",            value: user?.name ?? "—",                icon: <FiUser /> },
                  { label: "Email Address",        value: user?.email ?? "—",               icon: <FiMail /> },
                  { label: "Teacher ID",           value: profile?.teacher_id ?? "—",       icon: <FiHash /> },
                  { label: "Date of Birth",        value: profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—", icon: <FiCalendar /> },
                  { label: "Gender",                value: profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "—", icon: <FiUser /> },
                  { label: "Phone",                 value: profile?.phone ?? "—",            icon: <FiPhone /> },
                  { label: "Address",                value: profile?.address ?? "—",          icon: <FiMapPin /> },
                  { label: "Hire Date",              value: profile?.hire_date ? new Date(profile.hire_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—", icon: <FiCheckCircle /> },
                  { label: "Qualification",          value: profile?.qualification ?? "—",    icon: <FiAward /> },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">{item.label}</p>
                      <p className="text-slate-800 font-medium text-sm mt-0.5 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">

            {/* CLASSROOMS */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <FiGrid className="text-purple-500" size={16} />
                <p className="font-semibold text-slate-800">My Classrooms</p>
              </div>
              {classrooms.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No classrooms assigned yet.</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {classrooms.map((c, i) => (
                    <div key={c.id ?? i} className="px-6 py-4 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${CLASS_COLORS[i % CLASS_COLORS.length]} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                        {c.name?.[0] ?? "C"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{c.name}</p>
                        <p className="text-slate-400 text-xs">Grade {c.grade_level} · {c.academic_year}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 shrink-0">{c.students_count ?? 0} students</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <FiUsers className="text-green-500" size={16} />
                <p className="font-semibold text-slate-800">Teaching Summary</p>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                {[
                  { label: "Classrooms",      value: classrooms.length,  icon: <FiGrid />,      bg: "bg-blue-50",   text: "text-blue-500" },
                  { label: "Total Students",  value: totalStudents,      icon: <FiUsers />,     bg: "bg-green-50",  text: "text-green-500" },
                  { label: "Specialization",  value: profile?.subject_specialization ?? "—", icon: <FiBook />,      bg: "bg-purple-50", text: "text-purple-500" },
                  { label: "Years Active",    value: profile?.hire_date ? `${new Date().getFullYear() - new Date(profile.hire_date).getFullYear()} yrs` : "—", icon: <FiAward />, bg: "bg-orange-50", text: "text-orange-500" },
                ].map(c => (
                  <div key={c.label} className="bg-slate-50 rounded-xl p-4">
                    <div className={`w-8 h-8 rounded-lg ${c.bg} ${c.text} flex items-center justify-center mb-2`}>{c.icon}</div>
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">{c.label}</p>
                    <p className="text-slate-800 font-bold text-sm mt-0.5 truncate">{c.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
