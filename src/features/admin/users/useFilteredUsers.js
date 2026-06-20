import { useSearchParams } from "react-router-dom";

export default function useFilteredUsers(searchedUsers) {
  const [searchParams] = useSearchParams();

  const role = searchParams.get("role") ?? "all";
  const emailVerified = searchParams.get("email_verified") ?? "all";
  const sortBy = searchParams.get("sortBy") ?? "name-asc";

  let filtered = [...searchedUsers];

  // Filter by role
  if (role !== "all") filtered = filtered.filter((u) => u.role === role);

  // Filter by email verified
  if (emailVerified !== "all")
    filtered = filtered.filter((u) =>
      emailVerified === "verified"
        ? u.email_verified_at !== null
        : u.email_verified_at === null,
    );

  // Sort
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  filtered.sort((a, b) => {
    if (field === "name") {
      return (a.name ?? "").localeCompare(b.name ?? "") * modifier;
    }
    // date fields (created_at)
    return (new Date(a[field]) - new Date(b[field])) * modifier;
  });

  return filtered;
}
