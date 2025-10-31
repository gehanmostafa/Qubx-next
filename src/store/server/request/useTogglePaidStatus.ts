import authApi from "@/lib/authApi";
import { useMutation } from "@tanstack/react-query";

export const useTogglePaidStatus = () => {
  const updateTogglePaid = async ({ id }: { id: number }) => {
    const { data } = await authApi.patch(`/v2/requests/${id}/toggle-paid/`);
    return data;
  };

  return useMutation({
    mutationFn: updateTogglePaid,
    onSuccess: (data) => {
      console.log("Payment status toggled successfully:", data);
    },
    onError: (error) => {
      console.error("Error toggling payment status:", error);
    },
  });
};
