import { FiDownload } from "react-icons/fi";

function Actions() {
  return (
    <div className="flex gap-2">
      <button className="cursor-pointer flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
        <FiDownload size={14} /> Export Excel
      </button>
      <button className="cursor-pointer flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-200">
        <FiDownload size={14} /> Download PDF
      </button>
    </div>
  );
}

export default Actions;
