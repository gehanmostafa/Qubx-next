"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signupSchema, type TSignupValues } from "@/schemas";
import Authwrapper from "@/components/auth/Authwrapper";
import { CountrySelector } from "@/components/common/CountrySelector";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { useSendOtp } from "@/store/server/auth/useSendOtp";
import { useValidateFullPhone } from "@/store/server/auth/useValidatePhone";
import { useCheckMobile } from "@/store/server/auth/useCheckMobile";

const Signup = () => {
  const { mutate: validatePhone } = useValidateFullPhone();
  const { mutate: checkMobile } = useCheckMobile();
  const { mutate: sendOtp, isPending } = useSendOtp();

  const form = useForm<TSignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneCode: "",
      phoneNumber: "",
      specialty: "",
      country: "",
    },
  });
  const router = useRouter();
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch("https://py.qubx3d.com/api/v2/ip-info/");
        const data = await res.json();
        if (data?.country_code) {
          form.setValue("phoneCode", data.country_code);
        }
      } catch (error) {
        console.error("Failed to fetch country code", error);
      }
    };

    fetchCountry();
  }, [form]);

  const onSubmit = (values: TSignupValues) => {
    const fullPhone = `${values.phoneCode}${values.phoneNumber}`;

    validatePhone(fullPhone, {
      onSuccess: (validateRes) => {
        console.log("Phone validated:", validateRes);

        checkMobile(fullPhone, {
          onSuccess: (checkRes) => {
            console.log("Mobile available:", checkRes);
            sendOtp(
              { email: values.email },
              {
                onSuccess: (otpRes) => {
                  console.log("OTP sent:", otpRes);
                  localStorage.setItem("signup_email", values.email)
                  localStorage.setItem("signup_data", JSON.stringify(values));
                  router.push("/otp");
                },
                onError: (otpErr) => {
                  console.error("Failed to send OTP:", otpErr);
                  form.setError("email", {
                    type: "manual",
                    message: "This email is already registered",
                  });
                },
              }
            );
          },
          onError: (checkErr) => {
            console.error("Mobile already exists:", checkErr);
            form.setError("phoneNumber", {
              type: "manual",
              message: "This phone number is already registered",
            });
          },
        });
      },
      onError: (validateErr) => {
        console.error("Invalid phone:", validateErr);
        form.setError("phoneNumber", {
          type: "manual",
          message: "Invalid phone number",
        });
      },
    });
  };

  return (
    <Authwrapper title="Sign up">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="ُFirst Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="ُEnter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone (Code + Number) */}
            <div className="grid grid-cols-5 gap-2">
              <FormField
                control={form.control}
                name="phoneCode"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <CountrySelector
                        value={field.value}
                        onChange={(countryName, phoneCode) => {
                          form.setValue("phoneCode", phoneCode);
                          form.setValue("country", countryName);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Specialty Buttons */}
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <div className="flex gap-3 flex-wrap">
                      {["Surgeon", "Biomedical Engineer", "Other"].map(
                        (option) => (
                          <Button
                            key={option}
                            type="button"
                            variant={
                              field.value === option ? "default" : "outline"
                            }
                            onClick={() => field.onChange(option)}
                            className="flex-1 !h-12"
                          >
                            {option}
                          </Button>
                        )
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full font-semibold py-6 rounded-md disabled:bg-muted disabled:text-foreground disabled:opacity-60"
              disabled={!form.formState.isValid}
            >
              Next
            </Button>
          </div>
          <p className="text-sm text-center text-muted-foreground ">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-secondary-foreground font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </Form>
    </Authwrapper>
  );
};

export default Signup;
