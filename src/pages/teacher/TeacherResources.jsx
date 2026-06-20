import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FiFolder,
  FiUpload,
  FiSearch,
  FiFile,
  FiVideo,
  FiImage,
  FiLink,
  FiBookOpen,
  FiFileText as FiRef,
  FiClipboard,
  FiLoader,
  FiAlertCircle,
  FiX,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiChevronRight,
  FiArrowLeft,
  FiTrendingUp,
  FiUser,
  FiTag,
  FiEye,
  FiCheckCircle,
  FiSave,
  FiBook,
  FiGrid,
} from "react-icons/fi";

const BASE = "https://helwalrabee.com/api";
const STORAGE_BASE = "https://helwalrabee.com/storage"; // Laravel public storage convention: {domain}/storage/{file_path}
const TOKEN = "LgIX4I1w7eGBy0nyIwQH2tZs6pyBHqRxxMLG0FnZfe32d748";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};
const AUTH_ONLY = { Authorization: `Bearer ${TOKEN}` };

function safeArr(v) {
  return Array.isArray(v)
    ? v
    : Array.isArray(v?.data)
      ? v.data
      : Array.isArray(v?.data?.data)
        ? v.data.data
        : [];
}

async function authedFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...HEADERS, ...(options.headers ?? {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const msg = json.message ?? `Request failed (${res.status})`;
    const errs = json.errors ? Object.values(json.errors).flat().join(" ") : "";
    throw new Error(errs ? `${msg}: ${errs}` : msg);
  }
  return json;
}

const TYPE_META = {
  document: {
    icon: <FiFile />,
    color: "bg-blue-50 text-blue-600",
    label: "Document",
  },
  video: {
    icon: <FiVideo />,
    color: "bg-purple-50 text-purple-600",
    label: "Video",
  },
  image: {
    icon: <FiImage />,
    color: "bg-pink-50 text-pink-600",
    label: "Image",
  },
  link: { icon: <FiLink />, color: "bg-teal-50 text-teal-600", label: "Link" },
  assignment: {
    icon: <FiClipboard />,
    color: "bg-orange-50 text-orange-600",
    label: "Assignment",
  },
  lesson_plan: {
    icon: <FiBookOpen />,
    color: "bg-green-50 text-green-600",
    label: "Lesson Plan",
  },
  reference: {
    icon: <FiRef />,
    color: "bg-indigo-50 text-indigo-600",
    label: "Reference",
  },
};
function typeMeta(t) {
  return (
    TYPE_META[t] ?? {
      icon: <FiFile />,
      color: "bg-slate-50 text-slate-500",
      label: t ?? "Other",
    }
  );
}

const VISIBILITY_LABEL = {
  public: "Public",
  teachers_only: "Teachers Only",
  students_only: "Students Only",
  classroom_only: "Classroom Only",
  private: "Private",
};

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function fmtSize(mb) {
  if (mb == null) return "—";
  return mb < 1 ? `${Math.round(mb * 1024)} KB` : `${mb.toFixed(1)} MB`;
}

// ── Upload / Edit Modal ──────────────────────────────────────────────────────────
function ResourceFormModal({
  resource,
  classrooms,
  subjects,
  onClose,
  onSuccess,
}) {
  const isEdit = !!resource;
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: isEdit
      ? {
          title: resource.title ?? "",
          description: resource.description ?? "",
          visibility: resource.visibility ?? "classroom_only",
          tags: Array.isArray(resource.tags)
            ? resource.tags.join(", ")
            : (resource.tags ?? ""),
          is_active: resource.is_active ?? true,
        }
      : {
          type: "document",
          visibility: "classroom_only",
        },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (isEdit) {
        const body = {
          title: formData.title,
          description: formData.description,
          visibility: formData.visibility,
          tags: (formData.tags ?? "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          is_active: !!formData.is_active,
        };
        return authedFetch(`${BASE}/teacher/resources/${resource.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      }
      // Create — multipart/form-data per the doc
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description ?? "");
      fd.append("type", formData.type);
      if (formData.subject_id) fd.append("subject_id", formData.subject_id);
      if (formData.classroom_id)
        fd.append("classroom_id", formData.classroom_id);
      fd.append("visibility", formData.visibility);
      fd.append("tags", formData.tags ?? "");
      if (formData.type === "link" && formData.url) {
        fd.append("url", formData.url);
      } else if (file) {
        fd.append("file", file);
      }
      const res = await fetch(`${BASE}/teacher/resources`, {
        method: "POST",
        headers: AUTH_ONLY,
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        const msg = json.message ?? `Request failed (${res.status})`;
        const errs = json.errors
          ? Object.values(json.errors).flat().join(" ")
          : "";
        throw new Error(errs ? `${msg}: ${errs}` : msg);
      }
      return json;
    },
    onSuccess: () => {
      toast.success(isEdit ? "Resource updated" : "Resource uploaded");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message, { duration: 6000 }),
  });

  const watchedType = !isEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <p className="font-semibold text-slate-800">
            {isEdit ? "Edit Resource" : "Upload Resource"}
          </p>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Title
            </label>
            <input
              {...register("title", { required: true })}
              placeholder="Algebra Fundamentals Guide"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">Title is required</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={2}
              placeholder="Complete guide to algebra fundamentals..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all"
            />
          </div>

          {!isEdit && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                    Type
                  </label>
                  <select
                    {...register("type", { required: true })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  >
                    {Object.entries(TYPE_META).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                    Subject
                  </label>
                  <select
                    {...register("subject_id")}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  >
                    <option value="">None</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Classroom
                </label>
                <select
                  {...register("classroom_id")}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                >
                  <option value="">None / All</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  File or Link URL
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors mb-2 ${file ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  {file ? (
                    <>
                      <FiCheckCircle className="text-blue-500 text-xl mx-auto mb-1" />
                      <p className="text-sm font-medium text-blue-600">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <FiUpload className="text-slate-400 text-xl mx-auto mb-1" />
                      <p className="text-sm text-slate-500">
                        Click to choose a file
                      </p>
                    </>
                  )}
                </div>
                <input
                  {...register("url")}
                  placeholder="…or paste a URL (for type=Link)"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Visibility
              </label>
              <select
                {...register("visibility", { required: true })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              >
                {Object.entries(VISIBILITY_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            {isEdit && (
              <label className="flex items-center gap-2.5 cursor-pointer pb-2.5">
                <input
                  type="checkbox"
                  {...register("is_active")}
                  className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-400"
                />
                <span className="text-sm text-slate-700">Active</span>
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Tags
            </label>
            <input
              {...register("tags")}
              placeholder="algebra, fundamentals, grade9"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
            <p className="text-slate-400 text-[11px] mt-1">Comma-separated</p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <FiLoader className="animate-spin" size={14} />
              ) : isEdit ? (
                <FiSave size={14} />
              ) : (
                <FiUpload size={14} />
              )}
              {mutation.isPending
                ? "Saving…"
                : isEdit
                  ? "Save Changes"
                  : "Upload"}
            </button>
          </div>
          {mutation.isError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-red-600 text-[11px] font-mono break-words leading-relaxed">
                {mutation.error?.message}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm ───────────────────────────────────────────────────────────────
function DeleteConfirmModal({ resource, onClose, onSuccess }) {
  const mutation = useMutation({
    mutationFn: () =>
      authedFetch(`${BASE}/teacher/resources/${resource.id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Resource deleted");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <FiTrash2 size={18} />
          </div>
          <p className="font-semibold text-slate-800">Delete this resource?</p>
        </div>
        <p className="text-slate-500 text-sm mb-5">
          "{resource.title}" will be permanently removed. This can't be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <FiLoader className="animate-spin" size={14} />
            ) : (
              <FiTrash2 size={14} />
            )}
            {mutation.isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Resource Detail Drawer ───────────────────────────────────────────────────────
function ResourceDetailDrawer({ resourceId, onClose, onEdit, onDelete }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teacher-resource-detail", resourceId],
    queryFn: () => authedFetch(`${BASE}/teacher/resources/${resourceId}`),
  });
  const r = data?.data ?? null;

  // The official /download endpoint is broken server-side (it crashes while logging
  // the download, before ever returning a URL — see resource_downloads schema bug).
  // We bypass it entirely and link straight to Laravel's public storage path instead.
  const directUrl = r?.file_path ? `${STORAGE_BASE}/${r.file_path}` : null;
  const isLinkType = r?.type === "link" && r?.url;
  const openUrl = isLinkType ? r.url : directUrl;

  const meta = r ? typeMeta(r.type) : typeMeta();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="bg-slate-100 w-full max-w-lg h-full overflow-y-auto shadow-2xl">
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            <FiArrowLeft size={16} /> Back
          </button>
          {r && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(r)}
                className="flex items-center gap-1.5 text-blue-500 text-xs font-semibold hover:underline"
              >
                <FiEdit2 size={12} /> Edit
              </button>
              <button
                onClick={() => onDelete(r)}
                className="flex items-center gap-1.5 text-red-500 text-xs font-semibold hover:underline"
              >
                <FiTrash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <FiLoader className="text-blue-500 text-3xl animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center py-24 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center mb-4">
              <FiAlertCircle size={28} />
            </div>
            <p className="text-slate-800 font-bold text-base mb-2">
              This resource couldn't load
            </p>
            <p className="text-slate-500 text-sm mb-4">
              The server returned an error fetching this record.
            </p>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left w-full max-w-sm">
              <p className="text-red-600 text-[11px] font-mono break-words leading-relaxed">
                {error?.message}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Hero */}
            <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20">
                  {meta.label}
                </span>
                {!r.is_active && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20">
                    Inactive
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mb-1">{r.title}</h2>
              {r.description && (
                <p className="text-white/80 text-sm">{r.description}</p>
              )}
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Subject",
                  value: r.subject?.name ?? "—",
                  icon: <FiBook />,
                },
                {
                  label: "Classroom",
                  value: r.classroom?.name ?? "All",
                  icon: <FiGrid />,
                },
                {
                  label: "File Size",
                  value: fmtSize(r.file_size),
                  icon: <FiFile />,
                },
                {
                  label: "Downloads",
                  value: r.download_count ?? 0,
                  icon: <FiDownload />,
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    {c.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">
                      {c.label}
                    </p>
                    <p className="text-slate-800 font-semibold text-sm mt-0.5 truncate">
                      {c.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Visibility + uploader + date */}
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <FiEye className="text-slate-400" size={14} />
                <span className="text-sm text-slate-700">
                  {VISIBILITY_LABEL[r.visibility] ?? r.visibility}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiUser className="text-slate-400" size={14} />
                <span className="text-sm text-slate-700">
                  Uploaded by {r.uploader?.name ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiTag className="text-slate-400" size={14} />
                <span className="text-sm text-slate-700">
                  {fmtDate(r.created_at)}
                </span>
              </div>
            </div>

            {/* Tags */}
            {Array.isArray(r.tags) && r.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {r.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Download button — direct link, bypasses the broken /download tracking endpoint */}
            {openUrl ? (
              <a
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <FiDownload size={14} /> {isLinkType ? "Open Link" : "Download"}
              </a>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-slate-500 text-sm">
                  No file or link attached to this resource.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherResources() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("all"); // all | mine | popular
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formModal, setFormModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailId, setDetailId] = useState(null);

  // 1) All accessible resources
  const {
    data: allData,
    isLoading: allLoading,
    isError: allError,
    error: allErrorObj,
  } = useQuery({
    queryKey: ["teacher-resources-all", typeFilter, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (search) params.set("search", search);
      return authedFetch(`${BASE}/teacher/resources?${params.toString()}`);
    },
    enabled: tab === "all",
  });
  const allResources = safeArr(allData?.data);

  // 2) My resources
  const {
    data: mineData,
    isLoading: mineLoading,
    isError: mineError,
    error: mineErrorObj,
  } = useQuery({
    queryKey: ["teacher-resources-mine"],
    queryFn: () => authedFetch(`${BASE}/teacher/resources/my/list`),
    enabled: tab === "mine",
  });
  const myResources = safeArr(mineData?.data);

  // 3) Popular resources
  const {
    data: popularData,
    isLoading: popularLoading,
    isError: popularError,
    error: popularErrorObj,
  } = useQuery({
    queryKey: ["teacher-resources-popular"],
    queryFn: () => authedFetch(`${BASE}/teacher/resources/popular/list`),
    enabled: tab === "popular",
  });
  const popularResources = safeArr(popularData?.data);

  // 4) Classrooms + a derived subject list (bootstrapped from resources, no dedicated subjects endpoint documented)
  const { data: classroomsData } = useQuery({
    queryKey: ["teacher-classrooms-for-resources"],
    queryFn: () => authedFetch(`${BASE}/teacher/classrooms`),
  });
  const classrooms = safeArr(classroomsData?.data);

  const subjects = useMemo(() => {
    const map = {};
    [...allResources, ...myResources].forEach((r) => {
      if (r.subject?.id && !map[r.subject.id]) map[r.subject.id] = r.subject;
    });
    return Object.values(map);
  }, [allResources, myResources]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["teacher-resources-all"] });
    queryClient.invalidateQueries({ queryKey: ["teacher-resources-mine"] });
    queryClient.invalidateQueries({ queryKey: ["teacher-resources-popular"] });
    queryClient.invalidateQueries({ queryKey: ["teacher-resource-detail"] });
  };

  const activeList =
    tab === "all"
      ? allResources
      : tab === "mine"
        ? myResources
        : popularResources;
  const activeLoading =
    tab === "all" ? allLoading : tab === "mine" ? mineLoading : popularLoading;
  const activeError =
    tab === "all" ? allError : tab === "mine" ? mineError : popularError;
  const activeErrorObj =
    tab === "all"
      ? allErrorObj
      : tab === "mine"
        ? mineErrorObj
        : popularErrorObj;

  const totalDownloads = myResources.reduce(
    (s, r) => s + (r.download_count ?? 0),
    0,
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-slate-100">
      <main className="flex-1 overflow-y-auto">
        {/* top bar */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Resources</h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
          <button
            onClick={() => setFormModal("create")}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiUpload size={14} /> Upload Resource
          </button>
        </div>

        <div className="p-8">
          {/* STAT CARDS */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "My Uploads",
                value: myResources.length,
                bg: "bg-blue-50",
                text: "text-blue-500",
                icon: <FiFolder />,
              },
              {
                label: "My Total Downloads",
                value: totalDownloads,
                bg: "bg-green-50",
                text: "text-green-500",
                icon: <FiTrendingUp />,
              },
              {
                label: "Classrooms",
                value: classrooms.length,
                bg: "bg-purple-50",
                text: "text-purple-500",
                icon: <FiGrid />,
              },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}
                >
                  <span className={`${c.text} text-xl`}>{c.icon}</span>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">
                    {c.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-800 mt-0.5">
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1 mb-5 w-fit">
            {[
              { key: "all", label: "All Resources" },
              { key: "mine", label: "My Uploads" },
              { key: "popular", label: "Popular" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t.key ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* SEARCH + TYPE FILTER (only on All tab) */}
          {tab === "all" && (
            <div className="flex items-center gap-4 mb-5 flex-wrap">
              <div className="relative w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>
              <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1 flex-wrap">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${typeFilter === "all" ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  All
                </button>
                {Object.entries(TYPE_META).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setTypeFilter(k)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${typeFilter === k ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RESOURCE GRID */}
          {activeLoading ? (
            <div className="flex items-center justify-center py-20">
              <FiLoader className="text-blue-500 text-3xl animate-spin" />
            </div>
          ) : activeError ? (
            <div className="bg-white rounded-2xl shadow-sm p-14 text-center">
              <FiAlertCircle className="text-red-400 text-3xl mx-auto mb-3" />
              <p className="text-slate-700 font-semibold text-sm">
                Couldn't load resources
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {activeErrorObj?.message}
              </p>
            </div>
          ) : activeList.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-14 text-center">
              <FiFolder className="text-slate-300 text-4xl mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                {tab === "mine"
                  ? "You haven't uploaded any resources yet."
                  : "No resources found."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {activeList.map((r, i) => {
                const meta = typeMeta(r.type);
                return (
                  <button
                    key={r.id ?? i}
                    onClick={() => setDetailId(r.id)}
                    className="text-left bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-11 h-11 rounded-xl ${meta.color} flex items-center justify-center shrink-0 text-lg`}
                      >
                        {meta.icon}
                      </div>
                      {tab === "popular" && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-orange-500">
                          <FiTrendingUp size={11} /> {r.download_count ?? 0}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-slate-800 text-sm leading-snug mb-1 line-clamp-2">
                      {r.title}
                    </p>
                    <p className="text-slate-400 text-[11px] mb-3">
                      {meta.label}
                      {r.subject?.name ? ` · ${r.subject.name}` : ""}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-50">
                      <span className="flex items-center gap-1 truncate">
                        <FiUser size={10} /> {r.uploader?.name ?? "—"}
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <FiDownload size={10} /> {r.download_count ?? 0}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {(formModal === "create" ||
        (formModal && typeof formModal === "object")) && (
        <ResourceFormModal
          resource={typeof formModal === "object" ? formModal : null}
          classrooms={classrooms}
          subjects={subjects}
          onClose={() => setFormModal(null)}
          onSuccess={refresh}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          resource={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={refresh}
        />
      )}

      {detailId && (
        <ResourceDetailDrawer
          resourceId={detailId}
          onClose={() => setDetailId(null)}
          onEdit={(r) => {
            setDetailId(null);
            setFormModal(r);
          }}
          onDelete={(r) => {
            setDetailId(null);
            setDeleteTarget(r);
          }}
        />
      )}
    </div>
  );
}
