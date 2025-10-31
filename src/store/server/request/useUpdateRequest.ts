
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface IUpdateRequestPayload {
  is_gateway_paid: boolean;
  is_paid: boolean;
}

const updateRequest = async ({
  id,
  payload,
}: {
  id: number;
  payload: IUpdateRequestPayload;
}) => {
  const { data } = await api.put(`/v1/request/update/${id}/`, payload);
  return data;
};

export const useUpdatePrice = () => {
  return useMutation({
    mutationFn: updateRequest,
    onSuccess: (data) => {
      console.log(" Request updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating Request:", error);
    },
  });
};
