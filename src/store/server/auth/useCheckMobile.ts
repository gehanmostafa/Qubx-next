import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const checkMobile = async (mobile: string) => {
  const res = await axios.post(`https://py.qubx3d.com/api/v2/check-mobile/`, { mobile });
  return res.data;
};

export const useCheckMobile = () => {
  return useMutation({
    mutationFn: checkMobile,
    
  });
};
