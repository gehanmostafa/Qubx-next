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
import { otpSchema, type TOtpValues } from "@/schemas";
import Authwrapper from "@/components/auth/Authwrapper";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const VerifyOTP = () => {
  const form = useForm<TOtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });
  const router = useRouter();
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timeLeft, setTimeLeft] = useState(120);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    form.setValue("otp", newOtp.join(""));

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const handleResend = () => {
    if (timeLeft > 0) return;
    setTimeLeft(120);
    console.log("Resent OTP");
  };

  const onSubmit = async (values: TOtpValues) => {
    console.log(values);
    router.push("/");
  };

  return (
    <Authwrapper title="OTP Verification">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-2">
            {timeLeft > 0 ? (
              <span className="text-right text-secondary-foreground pr-2">
                Resend in {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-secondary-foreground text-right font-medium hover:underline"
              >
                Resend OTP
              </button>
            )}

            {/* OTP Inputs */}
            <FormField
              control={form.control}
              name="otp"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {otpDigits.map((digit, index) => (
                        <Input
                          key={index}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          className="w-10 h-10 sm:w-14 sm:h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full font-semibold py-6 rounded-md disabled:bg-muted disabled:text-ring"
            disabled={form.watch("otp").length < 6}
          >
            Continue
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

export default VerifyOTP;
