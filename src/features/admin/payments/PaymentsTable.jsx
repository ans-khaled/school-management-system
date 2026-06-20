import { payments } from "../../../data/StaticData";
import InputSearch from "../../../ui/InputSearch";
import PaymentRow from "./PaymentRow";
import PaymentsTableOperations from "./PaymentsTableOperations";

const thStyle =
  "px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide";

function PaymentsTable({ filteredPayments = {} }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 justify-between flex items-center  gap-4">
        <div>
          <p className="font-semibold text-slate-800">Payments Management</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {payments.length} total payments
          </p>
        </div>

        <div className="flex gap-[1.6rem]">
          <PaymentsTableOperations />
          <InputSearch placeholder="payment" />
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-sm">
          No payments found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className={thStyle}>Student</th>
                <th className={thStyle}>Type</th>
                <th className={thStyle}>Amount</th>
                <th className={thStyle}>Method</th>
                <th className={thStyle}>Due Date</th>
                <th className={thStyle}>Status</th>
                <th className={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((p) => (
                <PaymentRow payment={p} key={p.key} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentsTable;
