import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import type { TLoginData, User } from "@/types";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/client/useAuthStore";

export interface LoginResponse {
  refresh: string;
  access: string;
  user: User;
}

export const loginUser = async (data: TLoginData): Promise<LoginResponse> => {
  const res = await axios.post("https://py.qubx3d.com/api/v2/login/", data);
  return res.data;
};

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      router.push("/");
    },
  });
};
