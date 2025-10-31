import authApi from "@/lib/authApi";
import { useMutation } from "@tanstack/react-query";

interface IUpdatePriceDiscount {
  price: number;
  special_discount: number;
}

const updatePriceDiscount = async ({
  id,
  payload,
}: {
  id: number;
  payload: IUpdatePriceDiscount;
}) => {
  const { data } = await authApi.patch(
    `/v2/requests/${id}/update-price-discount/`,
    payload
  );
  return data;
};

export const useUpdatePriceDiscount = () => {
  return useMutation({
    mutationFn: updatePriceDiscount,
    onSuccess: (data) => {
      console.log("Price & discount updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating price or discount:", error);
    },
  });
};
