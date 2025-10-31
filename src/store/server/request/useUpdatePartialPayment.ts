import authApi from "@/lib/authApi";
import { useMutation } from "@tanstack/react-query";

interface IUpdatePartialPayment {
  paid_amount: number;
  partial_paid: boolean;
}

const updatePartialPayment = async ({
  id,
  payload,
}: {
  id: number;
  payload: IUpdatePartialPayment;
}) => {
  const { data } = await authApi.patch(
    `/v2/requests/${id}/update-partial-payment/`,
    payload
  );
  return data;
};

export const useUpdatePartialPayment = () => {
  return useMutation({
    mutationFn: updatePartialPayment,
    onSuccess: (data) => {
      console.log("Payment updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating payment:", error);
    },
  });
};
