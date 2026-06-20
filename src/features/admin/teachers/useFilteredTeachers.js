import { useSearchParams } from "react-router-dom";

export default function useFilteredTeachers(searchedTeachers) {
  const [searchParams] = useSearchParams();

  const gender = searchParams.get("gender") ?? "all";
  const sortBy = searchParams.get("sortBy") ?? "name-asc";

  let filtered = [...searchedTeachers];

  // Filter by gender
  if (gender !== "all") filtered = filtered.filter((s) => s.gender === gender);

  // Sort
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  filtered.sort((a, b) => {
    if (field === "name") {
      return (a.user?.name ?? "").localeCompare(b.user?.name ?? "") * modifier;
    }
    // date fields
    return (new Date(a[field]) - new Date(b[field])) * modifier;
  });

  return filtered;
}
