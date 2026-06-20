import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiXCircle,
  FiRotateCcw,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const STATUS_STYLE = {
  Paid: {
    bg: "bg-green-50",
    text: "text-green-500",
    icon: <FiCheckCircle size={12} />,
  },
  Pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-500",
    icon: <FiClock size={12} />,
  },
  Failed: {
    bg: "bg-red-50",
    text: "text-red-500",
    icon: <FiXCircle size={12} />,
  },
  Refunded: {
    bg: "bg-gray-50",
    text: "text-gray-500",
    icon: <FiRotateCcw size={12} />,
  },
};

function PaymentRow({ payment }) {
  const navigate = useNavigate();
  const { id, student, amount, dueDate, status, method, type } = payment;
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
            {(student.name?.[0] ?? "?").toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{student.name}</p>
            <p className="text-slate-400 text-[11px]">{student.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600">{type}</td>
      <td className="px-6 py-4 font-semibold text-slate-800">
        EGP {Number(amount).toLocaleString()}
      </td>
      <td className="px-6 py-4 text-slate-500">{method}</td>
      <td className="px-6 py-4 text-slate-500">
        {new Date(dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${s.bg} ${s.text}`}
        >
          {s.icon} {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 transition-opacity">
          {/* View (for all except Pending if you want) */}
          {status !== "Pending" && (
            <button
              onClick={() => navigate(`/admin/payments/${id}`)}
              className="cursor-pointer p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-500 transition-colors"
              title="View Details"
            >
              <FiFileText size={14} />
            </button>
          )}

          {/* Pending → Mark Paid + Cancel */}
          {status === "Pending" && (
            <>
              <button
                className="cursor-pointer p-2 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition-colors"
                title="Mark as Paid"
              >
                <FiCheckCircle size={14} />
              </button>

              <button
                className="cursor-pointer p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                title="Cancel Payment"
              >
                <FiXCircle size={14} />
              </button>
            </>
          )}

          {/* Paid → Refund */}
          {status === "Paid" && (
            <button
              className="cursor-pointer p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
              title="Refund Payment"
            >
              <FiRotateCcw size={14} />
            </button>
          )}

          {/* Failed → Cancel */}
          {status === "Failed" && (
            <button
              className="cursor-pointer p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              title="Cancel Payment"
            >
              <FiXCircle size={14} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default PaymentRow;
