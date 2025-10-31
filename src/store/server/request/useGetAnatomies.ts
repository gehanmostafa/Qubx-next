import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "https://py.qubx3d.com/api/v1";

export interface Anatomy {
  id: number;
  name: string;
}

interface AnatomyResponse {
  results: Anatomy[];
}

const getAnatomies = async (): Promise<AnatomyResponse> => {
  const { data } = await axios.get(`${BASE_URL}/anatomy?&page_size=1000`);
  return data;
};

export const useGetAnatomies = () =>
  useQuery({
    queryKey: ["anatomy"],
    queryFn: getAnatomies,
  });
