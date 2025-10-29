// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

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

// export const useGetAllRequests = ({
//   doctor_id,
//   page = 1,
//   page_size = 20,
//   status,
//   startDate,
//   endDate,
//   searchItem,
//   searchByName,
// }: {
//   doctor_id: number;
//   page?: number;
//   page_size?: number;
//   status?: string;
//   startDate?: string;
//   endDate?: string;
//   searchItem?: string;
//   searchByName?: string;
// }) => {
//   return useQuery({
//     queryKey: [
//       "requests",
//       doctor_id,
//       page,
//       status,
//       startDate,
//       endDate,
//       searchItem,
//       searchByName,
//     ],
//     queryFn: async () => {
//       if (!doctor_id) return [];
//       console.log(doctor_id);

//       const token = localStorage.getItem("access_token");

//       const params = new URLSearchParams({
//         doctor__id: doctor_id.toString(),
//         page: page.toString(),
//         page_size: page_size.toString(),
//       });

//       if (status) params.append("statusView", status);
//       if (startDate) params.append("created_at__date__gte", startDate);
//       if (endDate) params.append("created_at__date__lte", endDate);
//       if (searchItem) params.append("patient__mobile__contains", searchItem);
//       if (searchByName)
//         params.append("patient__fullname__icontains", searchByName);

//       const res = await axios.get(
//         `https://py.qubx3d.com/api/v1/request?${params.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       return res.data.results;
//     },
//     enabled: !!doctor_id,
//     retry: false,
//   });
// };

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface RequestStatus {
  id: number;
  name: string;
  descraption: string;
  SLA: number;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: number;
  fullname: string;
  mobile: string | null;
  phone: string | null;
  DOB: string | null;
  national_id: string | null;
  address: string | null;
  created_at: string;
}

export interface Anatomy {
  id: number;
  name: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceType {
  id: number;
  name: string;
}

export interface Service {
  id: number;
  type: ServiceType;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface DICONSource {
  id: number;
  name: string;
}

export interface Doctor {
  id: number;
  fullname: string;
  mobile: string;
}

export interface CreatedBy {
  id: number;
  last_login: string | null;
  is_superuser: boolean;
  created_at: string;
  fullname: string;
  mobile: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  groups: number[];
  user_permissions: number[];
}

export interface AssignTo {
  id: number;
  fullname: string;
  mobile: string;
}

export interface RequestItem {
  id: number;
  statu: RequestStatus;
  patient: Patient;
  pathology: string | null;
  anatomy: Anatomy;
  service: Service;
  DICON_source: DICONSource;
  doctor: Doctor;
  created_by: CreatedBy;
  assign_to: AssignTo | null;
  branchName: string;
  note: string | null;
  attach: string | null;
  DICON_File: string | null;
  statusView: string;
  total_in_usd: string;
  created_at: string;
  price: number;
  special_discount: number;
  descraption: string | null;
  DICON_URL: string | null;
  result_URL: string | null;
  quality_assurence: boolean;
  updatedAtStatus: string | null;
  sketchfab: boolean;
  code: string;
  DICOM_3D_File: string | null;
  is_pending: boolean;
  is_paid: boolean;
  partial_paid: boolean;
  remaining_amount: number;
  is_gateway_paid: boolean;
}

export interface RequestsResponse {
  next: boolean;
  previous: boolean;
  links: {
    next: string | null;
    previous: string | null;
  };
  from: number;
  to: number;
  page_number: number;
  count: number;
  per_page: number;
  total_pages: number;
  results: RequestItem[];
}

interface UseGetAllRequestsParams {
  doctor_id: number;
  page?: number;
  page_size?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  searchItem?: string;
  searchByName?: string;
}

export const useGetAllRequests = ({
  doctor_id,
  page = 1,
  page_size = 20,
  status,
  startDate,
  endDate,
  searchItem,
  searchByName,
}: UseGetAllRequestsParams) => {
  return useQuery<RequestsResponse>({
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
      if (!doctor_id) throw new Error("Doctor ID is required");

      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

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

      const { data } = await axios.get<RequestsResponse>(
        `https://py.qubx3d.com/api/v1/request?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data;
    },
    enabled: !!doctor_id,
    retry: false,
  });
};
