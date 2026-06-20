import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FiGrid, FiUsers, FiBook, FiBarChart2, FiCreditCard,
  FiTruck, FiBell, FiLogOut, FiUser, FiFileText,
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiX,
  FiArrowLeft, FiLoader, FiMail, FiCalendar,
  FiShield, FiCheck, FiAlertCircle, FiSettings,
} from "react-icons/fi";

const BASE    = "https://helwalrabee.com/api";
const TOKEN   = "Lsi2Drq68lLNjeHC373MSd2fZtznLJZk6hHpjRuIf9d85cae";
const HEADERS = { "Content-Type": "application/json", "Authorization": `Bearer ${TOKEN}` };
const PER     = 10;

const ROLE_STYLE = {
  super_admin: { bg: "bg-red-50",    text: "text-red-500",    label: "Super Admin",  cardBg: "bg-red-500" },
  admin:       { bg: "bg-purple-50", text: "text-purple-500", label: "Admin",        cardBg: "bg-purple-500" },
  teacher:     { bg: "bg-blue-50",   text: "text-blue-500",   label: "Teacher",      cardBg: "bg-blue-500" },
  student:     { bg: "bg-green-50",  text: "text-green-500",  label: "Student",      cardBg: "bg-green-500" },
  parent:      { bg: "bg-orange-50", text: "text-orange-500", label: "Parent",       cardBg: "bg-orange-500" },
};

const CARD_COLORS = [
  { bg: "bg-blue-500",   light: "bg-blue-50",   text: "text-blue-500" },
  { bg: "bg-purple-500", light: "bg-purple-50",  text: "text-purple-500" },
  { bg: "bg-green-500",  light: "bg-green-50",   text: "text-green-500" },
  { bg: "bg-orange-500", light: "bg-orange-50",  text: "text-orange-500" },
  { bg: "bg-pink-500",   light: "bg-pink-50",    text: "text-pink-500" },
  { bg: "bg-teal-500",   light: "bg-teal-50",    text: "text-teal-500" },
];
// ── Profile Card (for teacher/student/parent — own profile only) ──────────────
function OwnProfile({ me, onEdit }) {
  const role     = ROLE_STYLE[me.role] ?? { bg: "bg-slate-50", text: "text-slate-500", label: me.role, cardBg: "bg-slate-500" };
  const verified = !!me.email_verified_at;

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">My Profile</h1>
      <p className="text-slate-400 text-sm mb-8">
        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>

      {/* profile hero */}
      <div className={`${role.cardBg} rounded-2xl p-8 mb-6 text-white`}>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-5xl font-bold">
            {me.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-sm mb-1">#{me.id}</p>
            <h2 className="text-3xl font-bold mb-2">{me.name}</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">{role.label}</span>
              <span className="text-white/80 text-sm">{me.email}</span>
              {verified
                ? <span className="flex items-center gap-1 text-white/80 text-xs"><FiCheck size={12} /> Email Verified</span>
                : <span className="flex items-center gap-1 text-white/60 text-xs"><FiAlertCircle size={12} /> Not Verified</span>
              }
            </div>
          </div>
          <button onClick={() => onEdit(me)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <FiSettings size={14} /> Edit Profile
          </button>
        </div>
      </div>

      {/* info grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: <FiUser />,     label: "Full Name",      value: me.name },
          { icon: <FiMail />,     label: "Email Address",  value: me.email },
          { icon: <FiShield />,   label: "Role",           value: role.label },
          { icon: <FiCheck />,    label: "Verification",   value: verified ? `Verified on ${new Date(me.email_verified_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : "Not verified yet" },
          { icon: <FiCalendar />, label: "Member Since",   value: me.created_at ? new Date(me.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
          { icon: <FiCalendar />, label: "Last Updated",   value: me.updated_at ? new Date(me.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${role.bg} ${role.text} flex items-center justify-center text-lg`}>
              {item.icon}
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">{item.label}</p>
              <p className="text-slate-800 font-semibold text-sm mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── User Detail Subpage (for admin/super_admin viewing any user) ──────────────
function UserDetail({ user, onBack, onEdit, onDelete }) {
  const role     = ROLE_STYLE[user.role] ?? { bg: "bg-slate-50", text: "text-slate-500", label: user.role, cardBg: "bg-slate-500" };
  const color    = CARD_COLORS[user.id % CARD_COLORS.length];
  const verified = !!user.email_verified_at;

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6 transition-colors">
        <FiArrowLeft size={16} /> Back to Users
      </button>

      <div className={`${role.cardBg} rounded-2xl p-8 mb-6 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl font-bold">
              {user.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">User #{user.id}</p>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <div className="flex items-center gap-3">
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">{role.label}</span>
                {verified
                  ? <span className="flex items-center gap-1 text-white/80 text-xs"><FiCheck size={12} /> Verified</span>
                  : <span className="flex items-center gap-1 text-white/60 text-xs"><FiAlertCircle size={12} /> Not Verified</span>
                }
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(user)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              <FiEdit2 size={14} /> Edit
            </button>
            <button onClick={() => onDelete(user)} className="flex items-center gap-2 bg-red-400/30 hover:bg-red-400/50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              <FiTrash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: <FiUser />,     label: "Full Name",      value: user.name },
          { icon: <FiMail />,     label: "Email",          value: user.email },
          { icon: <FiShield />,   label: "Role",           value: role.label },
          { icon: <FiCheck />,    label: "Email Verified", value: verified ? new Date(user.email_verified_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Not verified" },
          { icon: <FiCalendar />, label: "Joined",         value: user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
          { icon: <FiCalendar />, label: "Last Updated",   value: user.updated_at ? new Date(user.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${color.light} ${color.text} flex items-center justify-center text-lg`}>
              {item.icon}
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">{item.label}</p>
              <p className="text-slate-800 font-semibold text-sm mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const qc = useQueryClient();

  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [modal,      setModal]      = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [form,       setForm]       = useState({ name: "", email: "", password: "", role: "student" });
  const [detail,     setDetail]     = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");

  // ── fetch current user first ────────────────────────────────────────────────
  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      fetch(`${BASE}/auth/me`, { headers: HEADERS })
        .then(r => r.json()),
  });

  const me     = meData?.data ?? null;
  const isAdmin      = me?.role === "admin" || me?.role === "super_admin";
  const isSuperAdmin = me?.role === "super_admin";

  // ── fetch all users (only for admin/super_admin) ────────────────────────────
  const { data, isLoading: usersLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch(`${BASE}/users`, { headers: HEADERS })
        .then(r => { if (!r.ok) throw new Error("fetch failed"); return r.json(); }),
    enabled: isAdmin,
  });

  const allUsers = Array.isArray(data?.data) ? data.data : Array.isArray(data?.data?.data) ? data.data.data : [];

  // admins see all, but regular admins don't see super_admins
  const users = isSuperAdmin
    ? allUsers
    : allUsers.filter(u => u.role !== "super_admin");

  const byRole = role => users.filter(u => u.role === role).length;

  const filtered = users.filter(u => {
    const matchS = [u.name, u.email, u.role].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchR = roleFilter === "all" || u.role === roleFilter;
    return matchS && matchR;
  });
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const rows  = filtered.slice((page - 1) * PER, page * PER);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["users"] });
    qc.invalidateQueries({ queryKey: ["me"] });
  };

  const createM = useMutation({
    mutationFn: body => fetch(`${BASE}/users`, {
      method: "POST", headers: HEADERS, body: JSON.stringify(body),
    }).then(r => r.json().then(d => { if (!r.ok) { console.error("ERR:", JSON.stringify(d)); throw new Error(JSON.stringify(d?.errors ?? d?.message)); } return d; })),
    onSuccess: () => { refresh(); toast.success("User created!"); setModal(null); },
    onError:   e => toast.error(e.message),
  });

  const updateM = useMutation({
    mutationFn: ({ id, ...body }) => fetch(`${BASE}/users/${id}`, {
      method: "PUT", headers: HEADERS, body: JSON.stringify(body),
    }).then(r => r.json().then(d => { if (!r.ok) { console.error("ERR:", JSON.stringify(d)); throw new Error(JSON.stringify(d?.errors ?? d?.message)); } return d; })),
    onSuccess: () => { refresh(); toast.success("User updated!"); setModal(null); },
    onError:   e => toast.error(e.message),
  });

  const deleteM = useMutation({
    mutationFn: id => fetch(`${BASE}/users/${id}`, { method: "DELETE", headers: HEADERS })
      .then(r => { if (!r.ok) throw new Error("delete failed"); return r.json(); }),
    onSuccess: () => { refresh(); toast.success("User deleted."); setDelTarget(null); setDetail(null); },
    onError:   e => toast.error(e.message),
  });

  const openAdd  = ()  => { setForm({ name: "", email: "", password: "", role: "student" }); setModal("add"); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, password: "", role: u.role }); setModal(u); };

  const submitForm = e => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error("Name & email required"); return; }
    if (modal === "add") {
      if (!form.password) { toast.error("Password required"); return; }
      createM.mutate(form);
    } else {
      const body = { name: form.name, email: form.email, role: form.role };
      if (form.password) body.password = form.password;
      updateM.mutate({ id: modal.id, ...body });
    }
  };

  const busy = createM.isPending || updateM.isPending;

  // ── loading state ───────────────────────────────────────────────────────────
  if (meLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center gap-3 text-slate-400">
        <FiLoader className="text-2xl animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* ── NON-ADMIN: show own profile only ─────────────────────────────────── */}
      {!isAdmin && me && (
        <>
          <OwnProfile me={me} onEdit={openEdit} />
          {/* edit modal for own profile */}
          {modal !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)} />
              <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-[#1a2332] px-6 py-5 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-base">Edit Profile</p>
                    <p className="text-slate-400 text-xs mt-1">Update your information</p>
                  </div>
                  <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <FiX size={18} />
                  </button>
                </div>
                <form onSubmit={submitForm} className="p-6 space-y-4">
                  {[
                    { label: "Full Name *", key: "name",     type: "text",     placeholder: "Your name" },
                    { label: "Email *",     key: "email",    type: "email",    placeholder: "your@email.com" },
                    { label: "New Password (optional)", key: "password", type: "password", placeholder: "Leave blank to keep current" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.label}</label>
                      <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                    </div>
                  ))}
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                    <button type="submit" disabled={busy} className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                      {busy && <FiLoader size={13} className="animate-spin" />} Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── ADMIN: show full users management ────────────────────────────────── */}
      {isAdmin && (
        <>
          {detail ? (
            <UserDetail
              user={detail}
              onBack={() => setDetail(null)}
              onEdit={u => { openEdit(u); }}
              onDelete={u => setDelTarget(u)}
            />
          ) : (
            <main className="flex-1 p-10 overflow-y-auto">

              <div className="flex items-center justify-between mb-7">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Users</h1>
                  <p className="text-slate-400 text-sm mt-1">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-200">
                  <FiPlus size={15} /> Add User
                </button>
              </div>

              {/* stat cards */}
              <div className="grid grid-cols-5 gap-4 mb-7">
                {[
                  { label: "Total Users", value: users.length,                          bg: "bg-blue-50",   text: "text-blue-500" },
                  { label: "Admins",      value: byRole("admin") + byRole("super_admin"), bg: "bg-purple-50", text: "text-purple-500" },
                  { label: "Teachers",    value: byRole("teacher"),                      bg: "bg-teal-50",   text: "text-teal-500" },
                  { label: "Students",    value: byRole("student"),                      bg: "bg-green-50",  text: "text-green-500" },
                  { label: "Parents",     value: byRole("parent"),                       bg: "bg-orange-50", text: "text-orange-500" },
                ].map(c => (
                  <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                      <FiUsers className={`${c.text} text-lg`} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wide">{c.label}</p>
                      <p className="text-xl font-bold text-slate-800 mt-0.5">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* table */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-slate-800">User Management</p>
                    <p className="text-slate-400 text-xs mt-0.5">{filtered.length} total users</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex gap-1.5 flex-wrap">
                      {(isSuperAdmin
                        ? ["all", "super_admin", "admin", "teacher", "student", "parent"]
                        : ["all", "admin", "teacher", "student", "parent"]
                      ).map(r => (
                        <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors
                            ${roleFilter === r ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                          {r === "all" ? "All" : r === "super_admin" ? "Super Admin" : r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search users..."
                        className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-48 transition-all" />
                    </div>
                  </div>
                </div>

                {usersLoading ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
                    <FiLoader className="text-2xl animate-spin" />
                    <span className="text-sm">Loading users…</span>
                  </div>
                ) : isError ? (
                  <div className="text-center py-24 text-red-400 text-sm">Failed to load. Check API or network.</div>
                ) : rows.length === 0 ? (
                  <div className="text-center py-24 text-slate-400 text-sm">No users found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {["User", "Email", "Role", "Verified", "Joined", "Actions"].map(h => (
                            <th key={h} className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {rows.map(u => {
                          const role    = ROLE_STYLE[u.role] ?? { bg: "bg-slate-50", text: "text-slate-500", label: u.role };
                          const color   = CARD_COLORS[u.id % CARD_COLORS.length];
                          const verified = !!u.email_verified_at;
                          return (
                            <tr key={u.id} className="hover:bg-slate-50/70 transition-colors group cursor-pointer" onClick={() => setDetail(u)}>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full ${color.light} ${color.text} flex items-center justify-center font-bold text-xs shrink-0`}>
                                    {u.name?.[0]?.toUpperCase() ?? "?"}
                                  </div>
                                  <span className="font-semibold text-slate-800">{u.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-500">{u.email}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${role.bg} ${role.text}`}>
                                  {role.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {verified
                                  ? <span className="flex items-center gap-1 text-green-500 text-xs font-semibold"><FiCheck size={12} /> Verified</span>
                                  : <span className="flex items-center gap-1 text-slate-400 text-xs"><FiAlertCircle size={12} /> Pending</span>
                                }
                              </td>
                              <td className="px-6 py-4 text-slate-400 text-xs">
                                {u.created_at ? new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                              </td>
                              <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => openEdit(u)} className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                                    <FiEdit2 size={13} />
                                  </button>
                                  <button onClick={() => setDelTarget(u)} className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
                                    <FiTrash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {pages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Page {page} of {pages}</span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                        <button key={n} onClick={() => setPage(n)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors
                            ${n === page ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </main>
          )}

          {/* ADD / EDIT MODAL */}
          {modal !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)} />
              <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-[#1a2332] px-6 py-5 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-base">{modal === "add" ? "Add New User" : "Edit User"}</p>
                    <p className="text-slate-400 text-xs mt-1">{modal === "add" ? "Fill in the details below" : "Update user information"}</p>
                  </div>
                  <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <FiX size={18} />
                  </button>
                </div>
                <form onSubmit={submitForm} className="p-6 space-y-4">
                  {[
                    { label: "Full Name *", key: "name",     type: "text",     placeholder: "Ahmed Hassan" },
                    { label: "Email *",     key: "email",    type: "email",    placeholder: "ahmed@school.com" },
                    { label: modal === "add" ? "Password *" : "New Password (optional)", key: "password", type: "password", placeholder: "••••••••" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.label}</label>
                      <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Role *</label>
                    <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white">
                      {(isSuperAdmin
                        ? ["student", "teacher", "parent", "admin", "super_admin"]
                        : ["student", "teacher", "parent", "admin"]
                      ).map(r => (
                        <option key={r} value={r}>{r === "super_admin" ? "Super Admin" : r.charAt(0).toUpperCase() + r.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                    <button type="submit" disabled={busy} className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                      {busy && <FiLoader size={13} className="animate-spin" />}
                      {modal === "add" ? "Add User" : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DELETE CONFIRM */}
          {delTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDelTarget(null)} />
              <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl p-8 text-center shadow-2xl">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 className="text-red-400 text-xl" />
                </div>
                <p className="text-slate-800 font-bold text-lg mb-2">Delete User</p>
                <p className="text-slate-500 text-sm mb-6">
                  Are you sure you want to delete <strong className="text-slate-800">{delTarget.name}</strong>? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDelTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={() => deleteM.mutate(delTarget.id)} disabled={deleteM.isPending}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {deleteM.isPending ? <FiLoader size={13} className="animate-spin" /> : <FiTrash2 size={13} />}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
