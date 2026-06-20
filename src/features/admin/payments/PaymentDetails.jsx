import { useParams } from "react-router-dom";
import { payments } from "../../../data/StaticData";
import BackButton from "../../../ui/BackButton";
import PaymentDetailsCards from "./PaymentDetailsCards";
import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiRotateCcw,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

const STATUS_ICONS = {
  Paid: {
    icon: <FiCheckCircle size={12} />,
  },
  Pending: {
    icon: <FiClock size={12} />,
  },
  Failed: {
    icon: <FiXCircle size={12} />,
  },
  Refunded: {
    icon: <FiRotateCcw size={12} />,
  },
};

function PaymentDetails() {
  const { id } = useParams();
  // Instead of filter.
  const payment = payments.find((p) => p.id === Number(id));
  const { student, amount, dueDate, status, method, type } = payment;

  if (!payment) {
    return <p className="p-10">Payment not found</p>;
  }

  const s = STATUS_ICONS[status] ?? STATUS_ICONS.Pending;

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <BackButton title="Payments" />

      <div className="bg-blue-500 rounded-2xl p-8 mb-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm mb-1">{type}</p>
            <h1 className="text-3xl font-bold mb-1">{student.name}</h1>
            <p className="text-white/80 text-sm mb-1">{student.id}</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-sm mb-1">Amount</p>
            <p className="text-4xl font-bold">EGP {amount}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: <FiUser />, label: "Student", value: student.name },
            {
              icon: <FiFileText />,
              label: "Student ID",
              value: student.id,
            },
            { icon: <FiCreditCard />, label: "Type", value: type },
            { icon: <FiCreditCard />, label: "Method", value: method },
            {
              icon: <FiClock />,
              label: "Due Date",
              value: new Date(dueDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
            {
              icon: s.icon,
              label: "Status",
              value: status.charAt(0).toUpperCase() + status.slice(1),
            },
          ].map((item) => (
            <PaymentDetailsCards key={item.label} item={item} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex justify-end gap-3">
        {status === "Pending" && (
          <>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
              <FiCheckCircle />
              Mark as Paid
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
              <FiXCircle />
              Cancel Payment
            </button>
          </>
        )}

        {status === "Paid" && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition">
            <FiRotateCcw />
            Refund Payment
          </button>
        )}

        {status === "Failed" && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
            <FiXCircle />
            Cancel Payment
          </button>
        )}
      </div>
    </div>
  );
}

export default PaymentDetails;
