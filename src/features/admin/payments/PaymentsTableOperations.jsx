import { Filter } from "lucide-react";
import SortBy from "../../../ui/SortBy";

const paymentFilters = {
  status: ["All", "Paid", "Pending", "Failed", "Refunded"],
  type: ["All", "Tuition", "Bus", "Exam", "Activity"],
  method: ["All", "Card", "Cash", "Bank Transfer"],
  grades: ["All", "Grade 1", "Grade 2", "Grade 3"],
};

function PaymentsTableOperations() {
  return (
    <div className="flex items-center gap-[1.6rem]">
      {/* Filter by grade letter */}
      <Filter
        filterField="grade"
        options={[
          { value: "all", label: "All" },
          { value: "A", label: "A" },
          { value: "B", label: "B" },
          { value: "C", label: "C" },
          { value: "D", label: "D" },
          { value: "F", label: "F" },
        ]}
      />

      {/* Filter by exam type */}
      <Filter
        filterField="type"
        options={[
          { value: "all", label: "All" },
          { value: "midterm", label: "Midterm" },
          { value: "final", label: "Final" },
          { value: "other", label: "Other" },
        ]}
      />

      <SortBy
        options={[
          { value: "score-desc", label: "Highest score" },
          { value: "score-asc", label: "Lowest score" },
          { value: "created_at-desc", label: "Newest" },
          { value: "created_at-asc", label: "Oldest" },
        ]}
      />
    </div>
  );
}

export default PaymentsTableOperations;
