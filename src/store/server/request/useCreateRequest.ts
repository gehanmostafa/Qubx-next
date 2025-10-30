import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "https://py.qubx3d.com/api/v2";

interface CreateRequestPayload {
  service_id: number;
  anatomy_id: number;
  doctor_id: number;
}
const createRequest = async (payload: CreateRequestPayload) => {
  const { data } = await axios.post(
    `${BASE_URL}/requests/doctor-requests/create/`,
    payload
  );
  return data;
};

export const useCreateRequest = () => {
  return useMutation({
    mutationFn: createRequest,
  });
};
