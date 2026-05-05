import { useMutation } from "@tanstack/react-query";
import { createCheckout } from "../services/stripe.service";

export const useCheckout = () => {
  return useMutation({
    mutationFn: createCheckout,

    onSuccess: (data) => {
      if (data?.url) {
        // 🔥 REDIRECIONA PRO STRIPE
        window.location.href = data.url;
      }
    },
  });
};