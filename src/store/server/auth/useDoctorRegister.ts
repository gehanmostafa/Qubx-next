import axios from "axios";
import { useMutation } from "@tanstack/react-query";

interface DoctorRegisterPayload {
  user: {
    fullname: string;
    email: string;
    password: string;
    confirm_password: string;
    mobile?: string;
  };
  country: string;
  speciality?: string;
  otp: string;
}

interface DoctorRegisterResponse {
  success: boolean;
  message: string;
  // مثلاً data: { … }
}

const registerDoctor = async (payload: DoctorRegisterPayload): Promise<DoctorRegisterResponse> => {
  const { data } = await axios.post("https://py.qubx3d.com/api/v2/doctors/register/",payload);
  return data;
};

export const useDoctorRegister = () => {
  return useMutation<DoctorRegisterResponse, unknown, DoctorRegisterPayload>({
    mutationFn: registerDoctor,
    onSuccess: (data, variables, context) => {
      console.log("Doctor registered:", data);
    },
    onError: (error, variables, context) => {
      console.error("Registration error:", error);
    },
  });
};
