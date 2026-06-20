import toast from "react-hot-toast";

export const formatDateWithAge = (dateStr) => {
  const date = new Date(dateStr);
  const age = new Date().getFullYear() - date.getFullYear();

  return `${date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })} (Age ${age})`;
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateInISO = (dateStr) => dateStr?.split("T")[0] ?? "";

export const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function getErrorMessage(err, fallback = "Something went wrong") {
  const data = err?.response?.data;

  if (!data) return err.message || fallback;

  // 1. direct message
  if (data.message && data.message !== "Validation error") {
    return data.message;
  }

  // 2. validation errors object
  if (data.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const firstError = data.errors[firstKey];

    if (Array.isArray(firstError)) {
      return firstError[0];
    }

    return firstError;
  }

  return fallback;
}
