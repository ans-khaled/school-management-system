import { useState } from "react";
import { NavLink } from "react-router-dom";

function Tabs() {
  const [tab, setTab] = useState("overview"); // student | finance

  return (
    <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1 mb-6 w-fit">
      <NavLink
        onClick={() => setTab("overview")}
        className={`cursor-pointer px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "overview" ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}
        to="."
      >
        Overview{" "}
      </NavLink>
      <NavLink
        onClick={() => setTab("student")}
        className={`cursor-pointer px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "student" ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}
        to="students"
      >
        Student Reports{" "}
      </NavLink>
      <NavLink
        onClick={() => setTab("finance")}
        className={`cursor-pointer px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "finance" ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}
        to="finance"
      >
        Finance Reports{" "}
      </NavLink>
    </div>
  );
}

export default Tabs;
