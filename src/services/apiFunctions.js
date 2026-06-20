import { getErrorMessage } from "../utils/helpers";
import api from "./axios";

export async function getItems(category) {
  try {
    const res = await api.get(`/${category}`);
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), `Faild to fetch ${category} data`);
  }
}

export async function getItem({ category, id }) {
  try {
    const res = await api.get(`/${category}/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(
      getErrorMessage(err),
      `Faild to fetch ${category.slice(0, category.length - 1)} data`,
    );
  }
}

export async function create({ category, newItem }) {
  try {
    const res = await api.post(`/${category}`, newItem);

    console.log(res);

    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Creating failed");
  }
}

export async function update({ category, id, item }) {
  try {
    const res = await api.put(`/${category}/${id}`, item);
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Updating failed");
  }
}

export async function deleteItem({ category, id }) {
  try {
    const res = await api.delete(`/${category}/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(getErrorMessage(err), "Deleting failed");
  }
}
