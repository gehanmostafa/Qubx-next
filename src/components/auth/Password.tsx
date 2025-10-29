"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setPasswordSchema, type TPasswordValues } from "@/schemas";
import Authwrapper from "@/components/auth/Authwrapper";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDoctorRegister } from "@/store/server/auth/useDoctorRegister";

const Password = () => {
  const { mutate: registerDoctor, isPending } = useDoctorRegister();
  const form = useForm<TPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "" },
  });
  const router = useRouter();

  const onSubmit = async (values: TPasswordValues) => {
    console.log(values);
    const signupData = JSON.parse(localStorage.getItem("signup_data") || "{}");
    const otp = localStorage.getItem("signup_otp") || "";

    if (!signupData.email || !otp) {
      console.error("Missing signup data or OTP");
      return;
    }
    const payload = {
      user: {
        fullname: `${signupData.firstName} ${signupData.lastName}`,
        email: signupData.email,
        password: values.password,
        confirm_password: values.password,
        mobile: `${signupData.phoneCode}${signupData.phoneNumber}`,
      },
      country: signupData.country,
      speciality: signupData.specialty || "",
      otp,
    };
    registerDoctor(payload, {
      onSuccess: (res) => {
        console.log("Registered successfully:", res);
        localStorage.removeItem("signup_email")
        localStorage.removeItem("signup_data");
        localStorage.removeItem("signup_otp");
        router.push("/");
      },
      onError: (err) => {
        console.error("Register error:", err);
      },
    });
  };

  return (
    <Authwrapper title="Enter Password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="ُEnter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full font-semibold py-6 rounded-md disabled:bg-muted disabled:text-ring"
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
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

export default Password;
