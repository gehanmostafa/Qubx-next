import type { ICountry } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCountries = async (): Promise<ICountry[]> => {
  const res = await axios.get("https://py.qubx3d.com/api/v2/countries/");
  return res.data.results;
};

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    retry: false,
  });
};