import api from "./axios";
import { getErrorMessage } from "../utils/helpers";
import toast from "react-hot-toast";

export async function login(email, password) {
  try {
    const res = await api.post(`/auth/login`, { email, password });

    console.log(res);

    return res.data;
  } catch (err) {
    console.log(err);
    console.log(err?.response?.data);
    console.log(err?.response?.data.message);
    toast.error(getErrorMessage(err));
    // throw new Error(getErrorMessage(err));
  }
}

export async function getUser() {
  try {
    const res = await api.get("/auth/me");

    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export async function logout() {
  try {
    const res = await api.post(`/auth/logout`);

    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}
