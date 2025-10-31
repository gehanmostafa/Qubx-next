"use client";
import RequestsTable from "@/components/requests/RequestsTable";
import { Button } from "@/components/ui/button";
import { FaListUl } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import { LuPlus, LuArrowRight } from "react-icons/lu";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useGetServices } from "@/store/server/request/useGetServices";
import { useAuthStore } from "@/store/client/useAuthStore";
import { useGetAnatomies } from "@/store/server/request/useGetAnatomies";
import { useForm } from "react-hook-form";
import { newRequestSchema, NewRequestValues } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRequest } from "@/store/server/request/useCreateRequest";
import { toast } from "sonner";
import { FaCircleCheck } from "react-icons/fa6";

const Requests = () => {
  const [viewMode, setViewMode] = useState("list");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [uploadMethod, setUploadMethod] = useState<"direct" | "url">("direct");

  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [setUser]);

  const doctorId = Number(user?.id) || 0;

  // APIs
  const { data: servicesData, isLoading: loadingServices } = useGetServices();
  const { data: anatomyData, isLoading: loadingAnatomy } = useGetAnatomies();
  const { mutate: createRequest, isPending } = useCreateRequest();

  const form = useForm<NewRequestValues>({
    resolver: zodResolver(newRequestSchema),
    mode: "onChange",
    defaultValues: {
      serviceId: undefined,
      anatomyId: undefined,
      // message: "",
      files: undefined,
    },
  });
  const { handleSubmit, setValue, watch, formState } = form;
  const { errors } = formState;
  const selectedServiceId = watch("serviceId");
  const selectedAnatomy = watch("anatomyId");

  const nextStep = async () => {
    if (step === 1 && !selectedServiceId) {
      toast.error("Please select a service first");
      return;
    }
    if (step === 2) {
      if (!selectedAnatomy) {
        toast.error("Please select an anatomy first");
        return;
      }

      if (!selectedAnatomy) {
        toast.error("Invalid anatomy selected");
        return;
      }

      const payload = {
        service_id: selectedServiceId,
        anatomy_id: selectedAnatomy,
        doctor_id: doctorId,
      };

      try {
        await createRequest(payload, {
          onSuccess: () => {
            toast.success("Request created successfully!");
            setStep(3);
          },
          onError: () => {
            toast.error("Failed to create request");
          },
        });
      } catch (error) {
        console.error(error);
      }

      return;
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const closeDialog = () => {
    setIsDialogOpen(false);
    setStep(1);
    form.reset();
  };

  const onSubmit = (data: NewRequestValues) => {
    console.log("Final Form Data:", {
      ...data,
      doctorId,
    });
    closeDialog();
  };

  return (
    <div className="bg-primary-foreground min-h-[88vh]">
      <div className="md:w-11/12 mx-auto py-4">
        <div className="bg-background rounded-lg flex justify-between flex-col md:flex-row gap-y-2 md:gap-y-0 items-center px-8 py-2">
          <div className="space-x-2 flex text-muted-foreground">
            <Button
              variant={viewMode === "list" ? "secondary" : "outline"}
              className="rounded-full w-24 h-12 text-sm font-semibold"
              onClick={() => setViewMode("list")}
            >
              <FaListUl /> List
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "outline"}
              className="rounded-full w-24 h-12 text-sm font-semibold"
              onClick={() => setViewMode("grid")}
            >
              <IoGrid /> Grid
            </Button>
          </div>

          <Button
            variant={"secondary"}
            className="rounded-full w-38 h-12 font-semibold flex items-center gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <LuPlus /> New Request
          </Button>

          {isDialogOpen && (
            <div
              className="fixed inset-0 bg-black/30 flex items-center justify-center p-2 z-50 overflow-y-auto"
              onClick={closeDialog}
            >
              <div
                className="bg-white rounded-lg w-full max-w-7xl shadow-xl p-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Dialog Header */}
                <div className="">
                  <h2 className="text-2xl font-semibold">New Request</h2>
                </div>

                {/* Steps Indicator */}
                <div className="flex gap-4 border p-2 rounded-md mb-2">
                  {["Select Service", "Select Anatomy", "Upload Imaging"].map(
                    (label, index) => {
                      const isServiceStep = index === 0;
                      const isAnatomyStep = index === 1;

                      const serviceName = servicesData?.results?.find(
                        (s) => s.id === selectedServiceId
                      )?.name;
                      const anatomyName = anatomyData?.results?.find(
                        (a) => a.id === selectedAnatomy
                      )?.name;

                      const stepCompleted =
                        (isServiceStep && selectedServiceId) ||
                        (isAnatomyStep && selectedAnatomy);

                      return (
                        <div
                          key={index}
                          className={`flex-1 rounded-lg px-6 py-4 flex items-center gap-3 cursor-pointer transition-all ${
                            step === index + 1
                              ? "bg-secondary text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          onClick={() => {
                            if (index === 1 && !selectedServiceId) {
                              toast.error("Please select a service first");
                              return;
                            }
                            if (index === 2 && !selectedAnatomy) {
                              toast.error("Please select an anatomy first");
                              return;
                            }
                            setStep(index + 1);
                          }}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                              stepCompleted
                                ? "bg-white text-green-600"
                                : step === index + 1
                                ? "bg-white text-secondary"
                                : "bg-white text-gray-400"
                            }`}
                          >
                            {stepCompleted ? (
                              <FaCircleCheck />
                            ) : (
                              `0${index + 1}`
                            )}
                          </div>

                          <div>
                            <div className="font-semibold">
                              {stepCompleted
                                ? isServiceStep
                                  ? serviceName || "Service"
                                  : isAnatomyStep
                                  ? anatomyName || "Anatomy"
                                  : `Step 3`
                                : `Step ${index + 1}`}
                            </div>
                            <div className="text-sm">
                              {stepCompleted
                                ? isServiceStep
                                  ? "Service Selected"
                                  : isAnatomyStep
                                  ? "Anatomy Selected"
                                  : "Upload Imaging"
                                : label}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="px-8">
                    {/* STEP 1 */}
                    {step === 1 && (
                      <div className="grid grid-cols-5 gap-8">
                        <div className="col-span-2 text-gray-500"></div>
                        <div className="grid grid-cols-2 col-span-3 gap-6">
                          {loadingServices ? (
                            <p>Loading...</p>
                          ) : (
                            servicesData?.results?.map((service) => {
                              const isSelected =
                                selectedServiceId === service.id;
                              return (
                                <button
                                  type="button"
                                  key={service.id}
                                  onClick={() =>
                                    setValue("serviceId", service.id, {
                                      shouldValidate: true,
                                    })
                                  }
                                  className={`p-6 rounded-lg border-2 relative overflow-hidden text-lg font-semibold transition-all ${
                                    selectedServiceId === service.id
                                      ? "border-secondary bg-blue-50 text-secondary"
                                      : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                                  }`}
                                >
                                  <span>{service.name}</span>
                                  {isSelected && (
                                    <span className="text-xs font-normal flex items-center gap-1 absolute top-0 right-0 bg-secondary py-1 px-2 rounded-bl-lg text-background">
                                      <FaCircleCheck /> Selected
                                    </span>
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>
                        {errors.serviceId && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.serviceId.message}
                          </p>
                        )}
                      </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <div className="grid grid-cols-5 gap-6">
                        <div className="col-span-1 text-gray-500"></div>
                        <div className="col-span-4 grid grid-cols-4 gap-2">
                          {loadingAnatomy ? (
                            <p>Loading anatomies...</p>
                          ) : (
                            anatomyData?.results.map((anatomy) => {
                              const isSelected = selectedAnatomy === anatomy.id;
                              return (
                                <button
                                  type="button"
                                  key={anatomy.id}
                                  onClick={() =>
                                    setValue("anatomyId", anatomy.id, {
                                      shouldValidate: true,
                                    })
                                  }
                                  className={`p-5 rounded-lg border-2 relative overflow-hidden text-lg font-semibold transition-all ${
                                    isSelected
                                      ? "border-secondary bg-blue-50 text-secondary"
                                      : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                                  }`}
                                >
                                  <span>{anatomy.name}</span>
                                  {isSelected && (
                                    <span className="text-xs font-normal flex items-center gap-1 absolute top-0 right-0 bg-secondary py-1 px-2 rounded-bl-lg text-background">
                                      <FaCircleCheck /> Selected
                                    </span>
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>
                        {errors.anatomyId && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.anatomyId.message}
                          </p>
                        )}
                        {/* <textarea
                          placeholder="message"
                          {...form.register("message")}
                          className="w-full border rounded resize-none mt-2 p-3"
                          rows={3}
                        /> */}
                      </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                      <div className=" mt-6 space-y-6">
                        {/* Tabs */}
                        <div className="flex border w-fit rounded-md overflow-hidden border-gray-300">
                          <button
                            type="button"
                            onClick={() => setUploadMethod("direct")}
                            className={`px-6 py-3 text-sm font-medium transition-all ${
                              uploadMethod === "direct"
                                ? "bg-secondary text-background"
                                : ""
                            }`}
                          >
                            Direct Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => setUploadMethod("url")}
                            className={`px-6 py-3 text-sm font-medium  transition-all ${
                              uploadMethod === "url"
                                ? "bg-secondary text-background"
                                : ""
                            }`}
                          >
                            From URL
                          </button>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border flex border-blue-100 text-gray-700 text-sm rounded-md p-3">
                          <strong className="text-gray-800 w-38">
                            Privacy & Security:
                          </strong>{" "}
                          <span className="">
                            Files and links are encrypted in transit. QubX
                            anonymizes DICOM headers when possible and uses your
                            imaging only to fulfill this request. Avoid patient
                            names/identifiers in filenames or notes.
                          </span>
                        </div>

                        {/* Upload Options */}
                        {uploadMethod === "direct" ? (
                          <>
                            {/* File Upload Section */}
                            <div className="border-2 border-gray-300 rounded-lg p-4">
                              <label
                                htmlFor="fileUpload"
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <div className="flex items-center gap-2 text-secondary border border-secondary rounded-md p-2 px-4 text-lg">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                                    />
                                  </svg>
                                  Upload File
                                </div>
                                <span className="text-gray-500 text-sm">
                                  No File Chosen
                                </span>
                                <input
                                  type="file"
                                  multiple
                                  id="fileUpload"
                                  {...form.register("files")}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Upload Later Checkbox */}
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                id="uploadLater"
                                type="checkbox"
                                className="w-4 h-4 accent-secondary"
                              />
                              <label
                                htmlFor="uploadLater"
                                className="text-gray-700 text-sm font-medium"
                              >
                                I will upload imaging later
                              </label>
                            </div>

                            <p className="text-xs text-gray-500">
                              You must either upload a file, provide a URL, or
                              select “upload later” to continue.
                            </p>
                          </>
                        ) : (
                          <>
                            {/* URL Upload Section */}
                            <div className="space-y-3">
                              <input
                                type="text"
                                id="imagingUrl"
                                placeholder="https://example.com/imaging-link"
                                {...form.register("imagingUrl")}
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
                              />
                            </div>

                            {/* Upload Later Checkbox */}
                            <div className="flex items-center gap-2 mt-3">
                              <input
                                id="uploadLaterUrl"
                                type="checkbox"
                                className="w-4 h-4 accent-secondary"
                              />
                              <label
                                htmlFor="uploadLaterUrl"
                                className="text-gray-700 text-sm font-medium"
                              >
                                I will upload imaging later
                              </label>
                            </div>

                            <p className="text-xs text-gray-500">
                              You must either enter a URL or select “upload
                              later” to continue.
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="px-8 py-6 flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeDialog}
                      >
                        Cancel
                      </Button>
                      {step > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                      )}
                    </div>

                    <Button
                      type={step === 3 ? "submit" : "button"}
                      onClick={step === 3 ? undefined : nextStep}
                      variant={"secondary"}
                      disabled={
                        isPending ||
                        (step === 1 && !selectedServiceId) ||
                        (step === 2 && !selectedAnatomy)
                      }
                    >
                      {isPending
                        ? "Submitting..."
                        : step === 3
                        ? "Submit"
                        : "Next"}
                      <LuArrowRight />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className="bg-background rounded-lg px-2 md:px-8 py-4 mt-5">
          <RequestsTable viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
};

export default Requests;
