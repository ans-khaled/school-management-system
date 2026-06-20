import {
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiRotateCcw,
  FiXCircle,
} from "react-icons/fi";
import StateCards from "../../../ui/StateCards";
import { payments } from "../../../data/StaticData";

const totalPayments = payments.length;
const totalPaid = payments.reduce(
  (acc, cur) => acc + (cur.status === "Paid"),
  0,
);
const totalPending = payments.reduce(
  (acc, cur) => acc + (cur.status === "Pending"),
  0,
);
const totalFaild = payments.reduce(
  (acc, cur) => acc + (cur.status === "Failed"),
  0,
);
const totalRefunded = payments.reduce(
  (acc, cur) => acc + (cur.status === "Refunded"),
  0,
);
const totalRevenue = payments
  .filter((p) => p.status === "Paid")
  .reduce((a, p) => a + Number(p.amount), 0);

const cards = [
  {
    label: "Total Payments",
    value: totalPayments,
    bg: "bg-blue-50",
    text: "text-blue-500",
    icon: <FiCreditCard />,
  },
  {
    label: "Paid",
    value: totalPaid,
    bg: "bg-green-50",
    text: "text-green-500",
    icon: <FiCheckCircle />,
  },
  {
    label: "Pending",
    value: totalPending,
    bg: "bg-yellow-50",
    text: "text-yellow-500",
    icon: <FiClock />,
  },
  {
    label: "Failed",
    value: totalFaild,
    bg: "bg-red-50",
    text: "text-red-500",
    icon: <FiXCircle />,
  },
  {
    label: "Refunded",
    value: totalRefunded,
    bg: "bg-gray-50",
    text: "text-gray-500",
    icon: <FiRotateCcw />,
  },
  {
    label: "Total Revenue",
    value: `EGP ${totalRevenue.toLocaleString()}`,
    bg: "bg-purple-50",
    text: "text-purple-500",
    icon: <FiBarChart2 />,
  },
];

function PaymentStateCards() {
  return <StateCards cards={cards} />;
}

export default PaymentStateCards;
