import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "https://py.qubx3d.com/api/v1";

export interface IService {
  id: number;
  name: string;
  type: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface IServicesResponse {
  results: IService[];
  count: number;
  next: boolean | string | null;
  previous: boolean | string | null;
  page_number: number;
  total_pages: number;
}

const getServices = async (): Promise<IServicesResponse> => {
  const { data } = await axios.get(`${BASE_URL}/service?type__id=3`);
  return data;
};


export const useGetServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });
};
