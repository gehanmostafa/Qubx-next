import { useEffect, useMemo, useState } from "react";
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
import { useAuthStore } from "@/store/client/useAuthStore";
import { Download, Upload } from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import { IoEye } from "react-icons/io5";

// Helper function to get colors by case status
const getStatusClasses = (status: string) => {
  switch (status) {
    case "Awaiting DICOM Upload":
      return {
        border: "!border-l-[4px] !border-[#E5E7EB]",
        hover: "hover:bg-[#E5E7EB]/40",
        button: "bg-[#E5E7EB] text-[#1E2939]",
        cardBg: "bg-[#E5E7EB]/30",
      };
    case "Pending Payment":
      return {
        border: "!border-l-[4px] !border-[#FFD7A8]",
        hover: "hover:bg-[#FFD7A8]/40",
        button: "bg-[#FFD7A8] text-[#7E2A0C]",
        cardBg: "bg-[#FFD7A8]/30",
      };
    case "DICOM Review":
      return {
        border: "!border-l-[4px] !border-[#FFF085]",
        hover: "hover:bg-[#FFF085]/40",
        button: "bg-[#FFF085] text-[#733E0A]",
        cardBg: "bg-[#FFF085]/30",
      };
    case "In Progress":
      return {
        border: "!border-l-[4px] !border-[#BEDBFF]",
        hover: "hover:bg-[#BEDBFF]/40",
        button: "bg-[#BEDBFF] text-[#1C398E]",
        cardBg: "bg-[#BEDBFF]/30",
      };
    case "Delivered":
      return {
        border: "!border-l-[4px] !border-[#B9F8CF]",
        hover: "hover:bg-[#B9F8CF]/40",
        button: "bg-[#B9F8CF] text-[#0D542B]",
        cardBg: "bg-[#B9F8CF]/30",
      };
    case "Reupload DICOM":
      return {
        border: "!border-l-[4px] !border-[#FFCDD2]",
        hover: "hover:bg-[#FFEBEE]/40",
        button: "bg-[#FFEBEE] text-[#C62828]",
        cardBg: "bg-[#FFEBEE]/30",
      };
    default:
      return {
        border: "!border-l-[4px] !border-[#3399FF]",
        hover: "hover:bg-[#E5F3FF]",
        button: "bg-[#E5F3FF] text-[#1E3A8A]",
        cardBg: "bg-[#E5F3FF]/30",
      };
  }
};
// const statusStyles: Record<string, any> = {
//   "Pending Payment": {
//     base: "bg-[#FFF4E5]",
//     text: "text-[#B87333]",
//     border: "border border-[#FFE0B2]",
//   },
//   "DICOM Review": {
//     base: "bg-[#FFFBEA]",
//     text: "text-[#C6A700]",
//     border: "border border-[#FFF59D]",
//   },
//   "In Progress": {
//     base: "bg-[#E3F2FD]",
//     text: "text-[#1565C0]",
//     border: "border border-[#90CAF9]",
//   },
//   Delivered: {
//     base: "bg-[#E8F5E9]",
//     text: "text-[#2E7D32]",
//     border: "border border-[#A5D6A7]",
//   },
//   "Awaiting DICOM Upload": {
//     base: "bg-gray-300",
//     text: "text-accent",
//     border: "border border-[#FFE0B2]",
//   },
//   //! Backend — need to ask him/her
//   "Reupload DICOM": {
//     base: "bg-[#FFEBEE]",
//     text: "text-[#C62828]",
//     border: "border border-[#FFCDD2]",
//   },
// };

const mapStatus = (oldStatus: string, isPaid: boolean): string => {
  switch (oldStatus?.toLowerCase()) {
    case "pending":
      return "Awaiting DICOM Upload";
    case "ready":
      return "DICOM Review";
    case "in progress":
      return isPaid ? "In Progress" : "Pending Payment";
    case "delivered to patient":
      return "Delivered";
    case "returned":
      return "Reupload DICOM";
    default:
      return oldStatus || "-";
  }
};

const RequestsTable = ({ viewMode }: { viewMode: string }) => {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [setUser]);

  const doctorId = Number(user?.id) || 0;

  const [searchByDate, setSearchByDate] = useState("");
  const [searchByCaseId, setSearchByCaseId] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { data, isLoading, isError } = useGetAllRequests({
    doctor_id: doctorId,
    page: currentPage,
    page_size: itemsPerPage,
  });

  const requests = data?.results ?? [];

  const filteredCases = useMemo(() => {
    let filtered = requests.filter((req) => {
      const matchDate =
        !searchByDate ||
        req.updatedAtStatus?.toLowerCase().includes(searchByDate.toLowerCase());
      const matchCaseId =
        !searchByCaseId ||
        String(req.id).toLowerCase().includes(searchByCaseId.toLowerCase());
      return matchDate && matchCaseId;
    });

    filtered = [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "status":
          return a.statu?.name?.localeCompare(b.statu?.name || "") || 0;
        case "updated":
          return (
            new Date(b.updatedAtStatus || b.created_at).getTime() -
            new Date(a.updatedAtStatus || a.created_at).getTime()
          );
        case "service":
          return (a.service?.name || "").localeCompare(b.service?.name || "");
        case "anatomy":
          return (a.anatomy?.name || "").localeCompare(b.anatomy?.name || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [requests, searchByDate, searchByCaseId, sortKey]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;
  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <p className="font-semibold text-xl">Case Dashboard</p>

          <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-auto">
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
              <SelectContent className="">
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="anatomy">Anatomy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Case#</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Service</TableHead>
              <TableHead className="text-center">Anatomy</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Updated</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-center">
            {filteredCases.map((item) => {
              const oldStatus = item.statu?.name || "-";
              const statusName = mapStatus(oldStatus, item.is_paid);
              // const colorSet = statusStyles[statusName] || {
              //   base: "bg-gray-100",
              //   text: "text-gray-800",
              //   border: "border border-gray-300",
              //   hoverRow: "hover:bg-gray-200",
              // };
              const { button, border, hover } = getStatusClasses(statusName);

              return (
                <TableRow
                  key={item.id}
                  // className={clsx(
                  //   "transition-colors cursor-pointer duration-200",
                  //   colorSet.hoverRow
                  // )}
                  className={clsx("transition-all duration-200", border, hover)}
                >
                  <TableCell>#{item.id}</TableCell>
                  <TableCell>{item.patient?.fullname || "Anonymous"}</TableCell>
                  <TableCell>{item.service?.name || "-"}</TableCell>
                  <TableCell>{item.anatomy?.name || "-"}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      {/* Badge */}
                      {/* <span
                        className={clsx(
                          "px-3 py-1 w-full  text-center rounded-t-sm text-sm font-medium inline-block",
                          colorSet.base,
                          colorSet.text,
                          colorSet.border
                        )}
                      >
                        {statusName}
                      </span> */}
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-md text-xs font-medium",
                          button
                        )}
                      >
                        {statusName}
                      </span>

                      {/* Steps Bar */}
                      <div className="w-full mt-1 flex gap-1">
                        {Array.from({ length: 4 }).map((_, index) => {
                          const stepOrder = [
                            "DICOM Review",
                            "Pending Payment",
                            "inProgress",
                            "Delivered",
                          ];
                          const currentIndex = stepOrder.indexOf(statusName);
                          const isActive = index <= currentIndex;

                          return (
                            <div
                              key={index}
                              className={clsx(
                                "w-full h-1 rounded-md transition-colors duration-300",
                                isActive ? "bg-blue-500" : "bg-gray-200"
                              )}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {new Date(
                      item.updatedAtStatus || item.created_at
                    ).toLocaleDateString()}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="flex justify-center items-center">
                    {statusName === "Pending Payment" ? (
                      <Button className="bg-primary  text-white px-4 py-1 text-sm rounded-full">
                        <FaPaypal /> Pay
                      </Button>
                    ) : statusName === "Awaiting DICOM Upload" ? (
                      <Button className="bg-secondary  text-white px-4 py-1 text-sm rounded-full">
                        <Upload />
                      </Button>
                    ) : statusName === "DICOM Review" ? (
                      <span className=" text-gray-400 px-4 py-1 text-sm ">
                        Our team is working on it
                      </span>
                    ) : statusName === "Delivered" ? (
                      <div>
                        <Button className="bg-transparent border text-white px-4 py-1 text-sm rounded-full">
                          <IoEye /> 3D
                        </Button>
                        <Button className="bg-secondary  text-white px-4 py-1 text-sm rounded-full">
                          <Download />
                        </Button>
                      </div>
                    ) : statusName === "Reupload DICOM" ? (
                      <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 text-sm rounded-full">
                        Reupload
                      </Button>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            disabled={!data?.links?.previous}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <span>
            Page {data?.page_number ?? 1} of {data?.total_pages ?? 1}
          </span>
          <Button
            variant="outline"
            disabled={!data?.links?.next}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
  if (viewMode === "grid") {
    return (
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <p className="font-semibold text-xl">Case Dashboard</p>

          <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-auto">
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
              <SelectContent className="">
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="anatomy">Anatomy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* GRID Layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((item) => {
            const oldStatus = item.statu?.name || "-";
            const statusName = mapStatus(oldStatus, item.is_paid);
            // const colorSet = statusStyles[statusName] || {
            //   base: "bg-gray-100",
            //   text: "text-gray-700",
            //   border: "border border-gray-300",
            // };
            const { border, hover, button, cardBg } =
              getStatusClasses(statusName);

            return (
              <div
                key={item.id}
                className={clsx(
                  "relative p-6 rounded-2xl shadow-sm flex flex-col justify-between min-h-[210px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                  // colorSet.base,
                  // colorSet.border
                  cardBg,
                  border,
                  hover
                )}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-[16px]">
                      {item.service?.name || "-"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.anatomy?.name || "-"}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-400">
                    #{item.id}
                  </p>
                </div>

                {/* Status & Steps */}
                <div className="mt-3">
                  <div
                    className={clsx(
                      "inline-block px-3 py-1 rounded-md text-xs font-medium mb-2",
                      // colorSet.text,
                      // colorSet.border,
                      // "bg-white/60"
                      button
                    )}
                  >
                    {statusName}
                  </div>

                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 4 }).map((_, index) => {
                      const stepOrder = [
                        "DICOM Review",
                        "Pending Payment",
                        "inProgress",
                        "Delivered",
                      ];
                      const currentIndex = stepOrder.indexOf(statusName);
                      const isActive = index <= currentIndex;
                      return (
                        <div
                          key={index}
                          className={clsx(
                            "flex-1 h-1 rounded-md",
                            isActive ? "bg-blue-500" : "bg-gray-200"
                          )}
                        ></div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {new Date(
                      item.updatedAtStatus || item.created_at
                    ).toLocaleDateString()}
                  </p>

                  {statusName === "Pending Payment" ? (
                    <Button className="bg-secondary text-white px-4 py-1 text-sm rounded-full flex items-center gap-2">
                      <FaPaypal /> Pay 20$
                    </Button>
                  ) : statusName === "Awaiting DICOM Upload" ? (
                    <Button className="bg-secondary text-white px-4 py-1 text-sm rounded-full flex items-center gap-2">
                      <Upload /> Upload
                    </Button>
                  ) : statusName === "DICOM Review" ? (
                    <span className="text-gray-600 text-sm italic">
                      Our team is working on it
                    </span>
                  ) : statusName === "Delivered" ? (
                    <div className="flex gap-2">
                      <Button className="bg-transparent border border-gray-400 text-gray-600 px-3 py-1 text-sm rounded-full flex items-center gap-1">
                        <IoEye /> 3D
                      </Button>
                      <Button className="bg-[#0D542B] text-white px-3 py-1 text-sm rounded-full flex items-center gap-1">
                        <Download />
                      </Button>
                    </div>
                  ) : statusName === "Reupload DICOM" ? (
                    <Button className="bg-[#C62828] text-white px-4 py-1 text-sm rounded-full">
                      Reupload
                    </Button>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <Button
            variant="outline"
            disabled={!data?.links?.previous}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <span className="text-sm text-gray-500">
            Page {data?.page_number ?? 1} of {data?.total_pages ?? 1}
          </span>
          <Button
            variant="outline"
            disabled={!data?.links?.next}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
};

export default RequestsTable;



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