import { useSearchParams } from "react-router-dom";

function useFilteredClasses(searchedClasses = []) {
  console.log(searchedClasses);

  const [searchParams] = useSearchParams();

  const isActive = searchParams.get("is_active") ?? "all";
  const gradeLevel = searchParams.get("grade_level") ?? "all";
  const academicYear = searchParams.get("academic_year") ?? "all";
  const sortBy = searchParams.get("sortBy") ?? "all";

  let filtered = [...searchedClasses];

  if (isActive !== "all")
    filtered = filtered.filter((cls) => String(cls.is_active) === isActive);

  if (gradeLevel !== "all")
    filtered = filtered.filter((cls) => cls.grade_level === gradeLevel);

  if (academicYear !== "all")
    filtered = filtered.filter((cls) => cls.academic_year === academicYear);

  const lastDash = sortBy.lastIndexOf("-");
  const field = sortBy.slice(0, lastDash); // "created_at", "name", "capacity"
  const direction = sortBy.slice(lastDash + 1); // "asc" or "desc"

  filtered = filtered.sort((a, b) => {
    let valA = a[field];
    let valB = b[field];

    // Handle dates
    if (field === "created_at") {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    // Handle strings
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
}

export default useFilteredClasses;
