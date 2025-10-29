import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import type { TLoginData } from "@/types";
import { useRouter } from "next/navigation";

export const loginUser = async (data: TLoginData) => {
  const res = await axios.post("https://py.qubx3d.com/api/v2/login/", data);
  return res.data;
};

export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    },
  });
};
