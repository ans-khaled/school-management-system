import { getErrorMessage } from "../utils/helpers";
import api from "./axios";

// =================== Subjects ===================

export async function assignSubject(reqBody) {
  try {
    const res = await api.post(
      "/classroom-relationships/assign-subject",
      reqBody,
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Assigning subject failed");
  }
}

export async function removeSubject(reqBody) {
  try {
    const res = await api.delete("/classroom-relationships/remove-subject", {
      data: reqBody,
    });
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Removing subject failed");
  }
}

export async function updateSubjectTeacher(reqBody) {
  try {
    const res = await api.put(
      "/classroom-relationships/change-subject-teacher",
      reqBody,
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Updating subject teacher failed");
  }
}

export async function updateSubjectHours(reqBody) {
  try {
    const res = await api.put(
      "/classroom-relationships/update-subject-hours",
      reqBody,
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Updating subject hours failed");
  }
}

// =================== Students ===================

export async function assignStudent(reqBody) {
  try {
    const res = await api.post(
      "/classroom-relationships/enroll-student",
      reqBody,
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Enrolling student failed");
  }
}

export async function removeStudent(reqBody) {
  try {
    const res = await api.delete("/classroom-relationships/remove-student", {
      data: reqBody,
    });
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Removing student failed");
  }
}
// =================== Teachers ===================

export async function assignTeacher(reqBody) {
  try {
    const res = await api.post(
      "/classroom-relationships/assign-teacher",
      reqBody,
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Assigning teacher failed");
  }
}

export async function removeTeacher(reqBody) {
  try {
    const res = await api.delete("/classroom-relationships/remove-teacher", {
      data: reqBody,
    });
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Removing teacher failed");
  }
}

export async function updateTeacherRole(reqBody) {
  try {
    const res = await api.put(
      "/classroom-relationships/update-teacher-role",
      reqBody,
    );
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Updating teacher role failed");
  }
}

/*
//=================== Subjects
export async function assignSubject(reqBody) {
  const res = await fetch(`${BASE}/classroom-relationships/assign-subject`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(reqBody),
  });

  const data = await res.json();

  console.log(data);

  if (!res.ok) throw new Error(data?.message || "Assignment subject failed");

  return data;
}

export async function removeSubject(reqBody) {
  const res = await fetch(`${BASE}/classroom-relationships/remove-subject`, {
    method: "DELETE",
    headers: HEADERS,
    body: JSON.stringify(reqBody),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data?.message || "Removing subject failed");

  return data;
}

export async function updateSubjectTeacher(reqBody) {
  const res = await fetch(
    `${BASE}/classroom-relationships/change-subject-teacher`,
    {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(reqBody),
    },
  );

  const data = await res.json();

  console.log(data);

  if (!res.ok)
    throw new Error(data?.message || "Updating subject teacher failed");

  return data;
}

export async function updateSubjectHours(reqBody) {
  const res = await fetch(
    `${BASE}/classroom-relationships/update-subject-hours`,
    {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(reqBody),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Updating weekly hours is faild");
  }

  return data;
}

//=================== Students

export async function assignStudent(reqBody) {
  const res = await fetch(`${BASE}/classroom-relationships/enroll-student`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(reqBody),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data?.message || "Enrolled student failed");

  return data;
}

export async function removeStudent(reqBody) {
  console.log(reqBody);

  const res = await fetch(`${BASE}/classroom-relationships/remove-student`, {
    method: "DELETE",
    headers: HEADERS,
    body: JSON.stringify(reqBody),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data?.message || "Removing student failed");

  return data;
}

//=================== Teachers

export async function assignTeacher(reqBody) {
  const res = await fetch(`${BASE}/classroom-relationships/assign-teacher`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(reqBody),
  });

  const data = await res.json();

  console.log(data);

  if (!res.ok) throw new Error(data?.message || "Assignment teacher failed");

  return data;
}

export async function removeTeacher(reqBody) {
  console.log(reqBody);

  const res = await fetch(`${BASE}/classroom-relationships/remove-teacher`, {
    method: "DELETE",
    headers: HEADERS,
    body: JSON.stringify(reqBody),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data?.message || "Removing teacher failed");

  return data;
}

export async function updateTeacherRole(reqBody) {
  const res = await fetch(
    `${BASE}/classroom-relationships/update-teacher-role`,
    {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(reqBody),
    },
  );

  const data = await res.json();

  console.log(data);

  if (!res.ok) throw new Error(data?.message || "Updating teacher role failed");

  return data;
}

*/
