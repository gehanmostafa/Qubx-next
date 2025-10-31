import authApi from "@/lib/authApi";
import { useMutation } from "@tanstack/react-query";

interface IAddPaypalPayments {
  request_id: number;
}

const addPaypalPayments = async (payload: IAddPaypalPayments) => {
  const { data } = await authApi.post(`/v1/payments/paypal/create/`, payload);
  return data;
};

export const useAddPaypalPayments = () => {
  return useMutation({
    mutationFn: addPaypalPayments,
    onSuccess: (data) => {
      console.log("Payment added successfully:", data);
    },
    onError: (error) => {
      console.error("Error adding payment:", error);
    },
  });
};
