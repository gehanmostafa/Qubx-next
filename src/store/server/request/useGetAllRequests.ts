// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// interface IFetchParams {
//   doctor_id: number;
//   page?: number;
//   page_size?: number;
// }

// const fetchAllRequests = async ({
//   doctor_id,
//   page = 1,
//   page_size = 20,
// }: IFetchParams) => {
//   const res = await axios.get(
//     `https://py.qubx3d.com/api/v1/request?doctor__id=${doctor_id}&page=${page}&page_size=${page_size}`
//   );
//   return res.data.results;
// };

// export const useGetAllRequests = (
//   doctor_id: number | null,
//   page = 1,
//   page_size = 20
// ) => {
//   return useQuery({
//     queryKey: ["requests", doctor_id, page],
//     queryFn: () =>
//       fetchAllRequests({ doctor_id: doctor_id as number, page, page_size }),
//     enabled: !!doctor_id,
//     retry: false,
//   });
// };

export const useGetAllRequests = ({
  doctor_id,
  page = 1,
  page_size = 20,
  status,
  startDate,
  endDate,
  searchItem,
  searchByName,
}: {
  doctor_id: number;
  page?: number;
  page_size?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  searchItem?: string;
  searchByName?: string;
}) => {
  return useQuery({
    queryKey: [
      "requests",
      doctor_id,
      page,
      status,
      startDate,
      endDate,
      searchItem,
      searchByName,
    ],
    queryFn: async () => {
      if (!doctor_id) return [];
      console.log(doctor_id);

      const token = localStorage.getItem("access_token");

      const params = new URLSearchParams({
        doctor__id: doctor_id.toString(),
        page: page.toString(),
        page_size: page_size.toString(),
      });

      if (status) params.append("statusView", status);
      if (startDate) params.append("created_at__date__gte", startDate);
      if (endDate) params.append("created_at__date__lte", endDate);
      if (searchItem) params.append("patient__mobile__contains", searchItem);
      if (searchByName)
        params.append("patient__fullname__icontains", searchByName);

      const res = await axios.get(
        `https://py.qubx3d.com/api/v1/request?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.results;
    },
    enabled: !!doctor_id,
    retry: false,
  });
};
