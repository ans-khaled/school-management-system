import { useSearchParams } from "react-router-dom";

export default function useFilterGrades(searchedGrades) {
  const [searchParams] = useSearchParams();

  const grade = searchParams.get("grade") || "all";
  const type = searchParams.get("type") || "all";
  const sortBy = searchParams.get("sortBy") || "score-desc";

  let filtered = [...searchedGrades];

  if (grade !== "all") filtered = filtered.filter((g) => g.grade === grade);

  if (type !== "all") filtered = filtered.filter((g) => g.exam?.type === type);

  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  filtered.sort((a, b) => {
    if (field === "score") {
      return ((a.score ?? 0) - (b.score ?? 0)) * modifier;
    }
    return (new Date(a[field]) - new Date(b[field])) * modifier;
  });

  return filtered;
}
