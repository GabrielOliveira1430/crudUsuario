import { api } from "../api/client";

export const createCheckout = async () => {
  const { data } = await api.post("/stripe/checkout");
  return data;
};