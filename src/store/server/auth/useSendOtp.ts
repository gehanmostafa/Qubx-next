import axios from "axios";
import { useMutation } from "@tanstack/react-query";

interface SendOtpPayload {
  email: string;
}

const sendOtp = async (payload: SendOtpPayload): Promise<{detail: string;}> => {
  const { data } = await axios.post(
    "https://py.qubx3d.com/api/v2/doctors/otp/send/",
    payload
  );
  return data;
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      console.log(data);
    }
  });
};
