import { useSearchParams } from "react-router-dom";

function useFilterSubjects(searchedSubjects) {
  const [searchParams] = useSearchParams();
  const isActive = searchParams.get("is_active") ?? "all";
  const type = searchParams.get("type") ?? "all";
  const credits = searchParams.get("credits") ?? "all";
  const sortBy = searchParams.get("sortBy") || "name-asc";

  let filtered = [...searchedSubjects];

  if (isActive !== "all")
    filtered = filtered.filter((sub) => String(sub.is_active) === isActive);

  if (type !== "all") filtered = filtered.filter((sub) => sub.type === type);

  if (credits !== "all")
    filtered = filtered.filter((sub) => sub.credits === Number(credits));

  const [field, direction] = sortBy.split("-");

  filtered = filtered.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];

    if (field === "created_at") {
      aVal = new Date(a[field]).getTime();
      bVal = new Date(b[field]).getTime();
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === "string")
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);

    return direction === "asc" ? aVal - bVal : bVal - aVal;
  });

  return filtered;
}

export default useFilterSubjects;
