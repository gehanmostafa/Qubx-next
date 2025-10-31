import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const fetchPaymentSuccess = async (token: string) => {
  const res = await api.get(`/v1/payments/paypal/success/token=${token}`);
  return res.data;
};

export const usePaypalSuccess = (token: string | null) => {
  return useQuery({
    queryKey: ["PaypalSuccess", token],
    queryFn: () => fetchPaymentSuccess(token!),
    enabled: !!token,
    retry: false,
  });
};
