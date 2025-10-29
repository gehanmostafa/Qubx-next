import axios from "axios";
import { useMutation } from "@tanstack/react-query";

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

const verifyOtp = async (payload: VerifyOtpPayload) => {
  const { data } = await axios.post(
    "https://py.qubx3d.com/api/v2/verify-otp/",
    payload
  );
  return data;
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};
