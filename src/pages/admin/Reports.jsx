import Header from "../../ui/Header";
import { Outlet } from "react-router-dom";
import Actions from "../../features/admin/reports/Actions";
import Tabs from "../../features/admin/reports/Tabs";

function Reports() {
  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-7">
        <Header>Reports</Header>
        <Actions />
      </div>

      <Tabs />

      <Outlet />
    </div>
  );
}

export default Reports;
