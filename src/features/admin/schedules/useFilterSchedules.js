import { useSearchParams } from "react-router-dom";

export default function useFilterSchedules(searchedSchedules) {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status") || "all";
  const day = searchParams.get("day") || "all";
  const classroom = searchParams.get("classroom") || "all";
  const subject = searchParams.get("subject") || "all";

  let filtered = [...searchedSchedules];

  // Status
  if (status !== "all") {
    filtered = filtered.filter((schedule) =>
      status === "active" ? schedule.is_active : !schedule.is_active,
    );
  }

  // Day
  if (day !== "all") {
    filtered = filtered.filter((schedule) => schedule.day_of_week === day);
  }

  // Classroom
  if (classroom !== "all") {
    filtered = filtered.filter(
      (schedule) => String(schedule.classroom?.name) === classroom,
    );
  }

  // Subject
  if (subject !== "all") {
    filtered = filtered.filter(
      (schedule) => String(schedule.subject?.name) === subject,
    );
  }

  return filtered;
}
