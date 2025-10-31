import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const fetchPaypalCancel = async (token: string) => {
  const res = await api.get(`/v1/payments/paypal/cancel/token=${token}`);
  return res.data;
};

export const usePaypalCancel = (token: string | null) => {
  return useQuery({
    queryKey: ["PaypalCancel", token],
    queryFn: () => fetchPaypalCancel(token!),
    enabled: !!token,
    retry: false,
  });
};
