import Header from "../../ui/Header";
import AddButton from "../../ui/AddButton";
import PaymentStateCards from "../../features/admin/payments/PaymentStateCards";
import PaymentsTable from "../../features/admin/payments/PaymentsTable";

function Payments() {
  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <Header>Fees & Payments</Header>
        <AddButton>Payment</AddButton>
      </div>
      <PaymentStateCards />

      <PaymentsTable />
    </div>
  );
}

export default Payments;
