// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import clsx from "clsx";
// import { useMemo, useState } from "react";
// import { Button } from "../ui/button";

// const cases = [
//   {
//     caseId: "#8453",
//     name: "Joe Doe",
//     services: "Virtual Surgical Planning",
//     anatomy: "Cervical Spine",
//     status: "Awaiting DICOM Upload",
//     date: "8/16/2025",
//     time: "2:38:25 PM",
//     action: "Upload",
//   },
//   {
//     caseId: "#8454",
//     name: "Joe Doe",
//     services: "Virtual Surgical Planning",
//     anatomy: "Cervical Spine",
//     status: "Pending Payment",
//     date: "9/20/2025",
//     time: "4:10:25 PM",
//     action: "Pay $20",
//   },
//   {
//     caseId: "#8455",
//     name: "Joe Doe",
//     services: "Virtual Surgical Planning",
//     anatomy: "Cervical Spine",
//     status: "DICOM Review",
//     date: "10/18/2025",
//     time: "6:22:25 PM",
//     action: "Our team is working on it",
//   },
//   {
//     caseId: "#8456",
//     name: "Joe Doe",
//     services: "Virtual Surgical Planning",
//     anatomy: "Cervical Spine",
//     status: "In Progress",
//     date: "7/25/2025",
//     time: "1:15:00 PM",
//     action: "Our team is working on it",
//   },
//   {
//     caseId: "#8457",
//     name: "Joe Doe",
//     services: "Virtual Surgical Planning",
//     anatomy: "Cervical Spine",
//     status: "Delivered",
//     date: "9/16/2025",
//     time: "1:15:00 PM",
//     action: "view",
//   },
// ];
// // Helper function to get colors by case status
// const getStatusClasses = (status: string) => {
//   switch (status) {
//     case "Awaiting DICOM Upload":
//       return {
//         border: "!border-l-[4px] !border-[#E5E7EB]",
//         hover: "hover:bg-[#E5E7EB]/40",
//         button: "bg-[#E5E7EB] text-[#1E2939]",
//         cardBg: "bg-[#E5E7EB]/30",
//       };
//     case "Pending Payment":
//       return {
//         border: "!border-l-[4px] !border-[#FFD7A8]",
//         hover: "hover:bg-[#FFD7A8]/40",
//         button: "bg-[#FFD7A8] text-[#7E2A0C]",
//         cardBg: "bg-[#FFD7A8]/30",
//       };
//     case "DICOM Review":
//       return {
//         border: "!border-l-[4px] !border-[#FFF085]",
//         hover: "hover:bg-[#FFF085]/40",
//         button: "bg-[#FFF085] text-[#733E0A]",
//         cardBg: "bg-[#FFF085]/30",
//       };
//     case "In Progress":
//       return {
//         border: "!border-l-[4px] !border-[#BEDBFF]",
//         hover: "hover:bg-[#BEDBFF]/40",
//         button: "bg-[#BEDBFF] text-[#1C398E]",
//         cardBg: "bg-[#BEDBFF]/30",
//       };
//     case "Delivered":
//       return {
//         border: "!border-l-[4px] !border-[#B9F8CF]",
//         hover: "hover:bg-[#B9F8CF]/40",
//         button: "bg-[#B9F8CF] text-[#0D542B]",
//         cardBg: "bg-[#B9F8CF]/30",
//       };
//     default:
//       return {
//         border: "!border-l-[4px] !border-[#3399FF]",
//         hover: "hover:bg-[#E5F3FF]",
//       };
//   }
// };

// const RequestsTable = ({ viewMode }: { viewMode: string }) => {
//   const [searchByDate, setSearchByDate] = useState("");
//   const [searchByCaseId, setSearchByCaseId] = useState("");
//   const [sortKey, setSortKey] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 10;
//   // Filter & Sort Logic
//   const filteredCases = useMemo(() => {
//     let data = cases.filter((c) => {
//       const matchDate =
//         !searchByDate ||
//         c.date.toLowerCase().includes(searchByDate.toLowerCase());
//       const matchCaseId =
//         !searchByCaseId ||
//         c.caseId.toLowerCase().includes(searchByCaseId.toLowerCase());

//       return matchDate && matchCaseId;
//     });

//     if (sortKey === "status") {
//       data = [...data].sort((a, b) => a.status.localeCompare(b.status));
//     } else if (sortKey === "case") {
//       data = [...data].sort((a, b) => a.name.localeCompare(b.caseId));
//     } else if (sortKey === "date") {
//       data = [...data].sort(
//         (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//       );
//     }

//     return data;
//   }, [searchByDate, searchByCaseId, sortKey]);
//   // Pagination logic
//   const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
//   const paginatedCases = filteredCases.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   if (viewMode === "grid") {
//     return (
//       <div className="flex flex-col gap-4">
//         <div className="flex flex-col md:flex-row md:justify-between mb-4 items-center">
//           <div>
//             <p className="font-semibold text-xl">Case Dashboard</p>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//             <Input
//               placeholder="Search by Date"
//               className="bg-primary-foreground !h-9"
//               value={searchByDate}
//               onChange={(e) => setSearchByDate(e.target.value)}
//             />
//             <Input
//               placeholder="Search by Case ID"
//               className="bg-primary-foreground !h-9"
//               value={searchByCaseId}
//               onChange={(e) => setSearchByCaseId(e.target.value)}
//             />
//             <Select onValueChange={setSortKey}>
//               <SelectTrigger className="bg-primary-foreground w-full col-span-2 md:col-span-1">
//                 <SelectValue placeholder="Sort by: Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="status">Status</SelectItem>
//                 <SelectItem value="case">Case</SelectItem>
//                 <SelectItem value="services">Services</SelectItem>
//                 <SelectItem value="date">Date</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {paginatedCases.map((caseItem) => {
//             const { cardBg, button, border } = getStatusClasses(
//               caseItem.status
//             );
//             return (
//               <div
//                 key={caseItem.caseId}
//                 className={clsx(
//                   "p-4 rounded-lg shadow-md transition-all duration-200",
//                   cardBg,
//                   border
//                 )}
//               >
//                 <>
//                   <div className="flex justify-between items-center text-sm">
//                     <button className={`${button} px-3 py-1 rounded-sm`}>
//                       {caseItem.status}
//                     </button>

//                     <span>
//                       {caseItem.caseId}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center text-sm">
//                     <span>3D Printing</span>
//                     <div className="text-muted">{caseItem.name}</div>
//                   </div>
//                 </>
//                 <div className="flex justify-between items-center text-muted my-4">
//                   <span className="text-sm mb-2">{caseItem.services}</span>
//                   <span className="text-xs">
//                     {caseItem.date}, {caseItem.time}
//                   </span>
//                 </div>

//                 {/* <div className="text-sm mb-2">{caseItem.anatomy}</div> */}

//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-muted-foreground">
//                     {caseItem.action}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="flex justify-center items-center gap-2 mt-4">
//           <Button
//             variant="outline"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//           >
//             Prev
//           </Button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <Button
//             variant="outline"
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex justify-between mb-4 items-center">
//         <div>
//           <p className="font-semibold text-xl">Case Dashboard</p>
//         </div>
//         <div className="grid grid-cols-3 gap-3">
//           <Input
//             placeholder="Search by Date"
//             className="bg-primary-foreground !h-9"
//             value={searchByDate}
//             onChange={(e) => setSearchByDate(e.target.value)}
//           />
//           <Input
//             placeholder="Search by Case ID"
//             className="bg-primary-foreground !h-9"
//             value={searchByCaseId}
//             onChange={(e) => setSearchByCaseId(e.target.value)}
//           />
//           <Select onValueChange={setSortKey}>
//             <SelectTrigger className="bg-primary-foreground w-full">
//               <SelectValue placeholder="Sort by: Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="status">Status</SelectItem>
//               <SelectItem value="case">Case</SelectItem>
//               <SelectItem value="services">Services</SelectItem>
//               <SelectItem value="date">Date</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Case #</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Services</TableHead>
//             <TableHead>Anatomy</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Updated</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {paginatedCases.map((caseItem) => {
//             const { border, hover, button } = getStatusClasses(caseItem.status);
//             return (
//               <TableRow
//                 key={caseItem.caseId}
//                 className={clsx("transition-all duration-200", border, hover)}
//               >
//                 <TableCell>{caseItem.caseId}</TableCell>
//                 <TableCell>{caseItem.name}</TableCell>
//                 <TableCell>{caseItem.services}</TableCell>
//                 <TableCell>{caseItem.anatomy}</TableCell>
//                 <TableCell>
//                   <button
//                     className={`${button} px-5 py-2 rounded-md block w-full`}
//                   >
//                     {caseItem.status}
//                   </button>
//                 </TableCell>
//                 <TableCell>
//                   <p>{caseItem.date},</p>
//                   <p>{caseItem.time}</p>
//                 </TableCell>
//                 <TableCell>{caseItem.action}</TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//       {/* Pagination Controls */}
//       <div className="flex justify-center items-center gap-2 mt-4">
//         <Button
//           variant="outline"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((p) => p - 1)}
//         >
//           Prev
//         </Button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <Button
//           variant="outline"
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((p) => p + 1)}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default RequestsTable;

// import { useMemo, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import clsx from "clsx";
// import { useGetAllRequests } from "@/store/server/request/useGetAllRequests";

// const RequestsTable = ({ viewMode }: { viewMode: string }) => {

//   const userId = localStorage.getItem("user_id");



//   const doctorId = Number(userId) || 0;


//   const [searchByDate, setSearchByDate] = useState("");
//   const [searchByCaseId, setSearchByCaseId] = useState("");
//   const [sortKey, setSortKey] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const { data: requests = [], isLoading, isError } = useGetAllRequests({
//     doctor_id: doctorId,
//     page: currentPage,
//     page_size: itemsPerPage,
//   });

// console.log(requests);

//   const filteredCases = useMemo(() => {
//     let data = requests.filter((c: any) => {
//       const matchDate =
//         !searchByDate ||
//         c.updated_at?.toLowerCase().includes(searchByDate.toLowerCase());
//       const matchCaseId =
//         !searchByCaseId ||
//         String(c.id).toLowerCase().includes(searchByCaseId.toLowerCase());
//       return matchDate && matchCaseId;
//     });

//     if (sortKey === "status") {
//       data = [...data].sort((a, b) => a.status.localeCompare(b.status));
//     } else if (sortKey === "date") {
//       data = [...data].sort(
//         (a, b) =>
//           new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
//       );
//     }

//     return data;
//   }, [requests, searchByDate, searchByCaseId, sortKey]);


//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error loading data.</p>;


//   const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
//   const paginatedCases = filteredCases.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );


//   return (
//     <div className="flex flex-col gap-4">
//       {/* Header */}
//       <div className="flex justify-between mb-4 items-center">
//         <div>
//           <p className="font-semibold text-xl">Case Dashboard</p>
//         </div>

//         <div className="grid grid-cols-3 gap-3">
//           <Input
//             placeholder="Search by Date"
//             className="bg-primary-foreground !h-9"
//             value={searchByDate}
//             onChange={(e) => setSearchByDate(e.target.value)}
//           />
//           <Input
//             placeholder="Search by Case ID"
//             className="bg-primary-foreground !h-9"
//             value={searchByCaseId}
//             onChange={(e) => setSearchByCaseId(e.target.value)}
//           />
//           <Select onValueChange={setSortKey}>
//             <SelectTrigger className="bg-primary-foreground w-full">
//               <SelectValue placeholder="Sort by: Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="status">Status</SelectItem>
//               <SelectItem value="date">Date</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Table */}
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>ID</TableHead>
//             <TableHead>Patient</TableHead>
//             <TableHead>Service</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Updated</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {paginatedCases.map((item) => (
//             <TableRow key={item.id}>
//               <TableCell>#{item.id}</TableCell>
//               <TableCell>{item.results?.fullname || "Anonymous"}</TableCell>
//               <TableCell>{item.service_name}</TableCell>
//               <TableCell
//                 className={clsx({
//                   "text-green-600 font-medium": item?.results?.statu?.name === "Ready",
//                   "text-yellow-600": item?.results?.statu?.name === "Pending",
//                   "text-gray-600": item?.results?.statu?.name === "Processing",
//                 })}
//               >
//                 {item.status}
//               </TableCell>
//               <TableCell>
//                 {new Date(item.updated_at).toLocaleDateString()}
//               </TableCell>
//               <TableCell>
//                 {item.status === "Ready" ? (
//                   <a
//                     href={item.DICON_File}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="underline text-blue-500"
//                   >
//                     View
//                   </a>
//                 ) : (
//                   "—"
//                 )}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Pagination */}
//       <div className="flex justify-center items-center gap-2 mt-4">
//         <Button
//           variant="outline"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((p) => p - 1)}
//         >
//           Prev
//         </Button>
//         <span>
//           Page {currentPage} of {totalPages || 1}
//         </span>
//         <Button
//           variant="outline"
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((p) => p + 1)}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default RequestsTable;


"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useGetAllRequests } from "@/store/server/request/useGetAllRequests";

const RequestsTable = ({ viewMode }: { viewMode: string }) => {
  const userId = localStorage.getItem("user_id");
  const doctorId = Number(userId) || 0;

  const [searchByDate, setSearchByDate] = useState("");
  const [searchByCaseId, setSearchByCaseId] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError } = useGetAllRequests({
    doctor_id: doctorId,
    page: currentPage,
    page_size: itemsPerPage,
  });

  const filteredCases = useMemo(() => {
    const requests = data?.results ?? [];

    let filtered = requests.filter((req) => {
      const matchDate =
        !searchByDate ||
        req.updatedAtStatus
          ?.toLowerCase()
          .includes(searchByDate.toLowerCase());
      const matchCaseId =
        !searchByCaseId ||
        String(req.id).toLowerCase().includes(searchByCaseId.toLowerCase());
      return matchDate && matchCaseId;
    });

    if (sortKey === "status") {
      filtered = [...filtered].sort((a, b) =>
        a.statu.name.localeCompare(b.statu.name)
      );
    } else if (sortKey === "date") {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.updatedAtStatus || b.created_at).getTime() -
          new Date(a.updatedAtStatus || a.created_at).getTime()
      );
    }

    return filtered;
  }, [data, searchByDate, searchByCaseId, sortKey]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <p className="font-semibold text-xl">Case Dashboard</p>

        <div className="grid grid-cols-3 gap-3">
          <Input
            placeholder="Search by Date"
            className="bg-primary-foreground !h-9"
            value={searchByDate}
            onChange={(e) => setSearchByDate(e.target.value)}
          />
          <Input
            placeholder="Search by Case ID"
            className="bg-primary-foreground !h-9"
            value={searchByCaseId}
            onChange={(e) => setSearchByCaseId(e.target.value)}
          />
          <Select onValueChange={setSortKey}>
            <SelectTrigger className="bg-primary-foreground w-full">
              <SelectValue placeholder="Sort by: Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCases.map((item) => (
            <TableRow key={item.id}>
              <TableCell>#{item.id}</TableCell>
              <TableCell>{item.patient?.fullname || "Anonymous"}</TableCell>
              <TableCell>{item.service?.name || "-"}</TableCell>
              <TableCell
                className={clsx({
                  "text-green-600 font-medium": item.statu?.name === "Ready",
                  "text-yellow-600": item.statu?.name === "Pending",
                  "text-gray-600": item.statu?.name === "Processing",
                })}
              >
                {item.statu?.name || "-"}
              </TableCell>
              <TableCell>
                {new Date(
                  item.updatedAtStatus || item.created_at
                ).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {item.statu?.name === "Ready" && item.DICON_File ? (
                  <a
                    href={item.DICON_File}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-500"
                  >
                    View
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          disabled={!data?.links.previous}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span>
          Page {data?.page_number ?? 1} of {data?.total_pages ?? 1}
        </span>
        <Button
          variant="outline"
          disabled={!data?.links.next}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default RequestsTable;
