import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const validateFullPhone = async (phone: string) => {
  const res = await axios.post(`https://py.qubx3d.com/api/v2/validate/full-phone/`, { phone });
  return res.data;
};


export const useValidateFullPhone = () => {
  return useMutation({
    mutationFn: validateFullPhone,
    
  });
};
