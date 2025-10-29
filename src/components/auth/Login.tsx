"use client";
import { useState } from "react";
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
import { loginSchema, type TLoginValues } from "@/schemas";
import { IoEye, IoEyeOffSharp } from "react-icons/io5";
import Authwrapper from "@/components/auth/Authwrapper";
import { useLogin } from "@/store/server/auth/useLogin";
import Link from "next/link";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, isError, error, isSuccess } = useLogin();

  const ShowPassWordHandler = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm<TLoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: TLoginValues) => {
    console.log(values);
    login({
      identifier: values.email,
      password: values.password,
    });
  };

  return (
    <Authwrapper title="Log in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="ُEnter Email or Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={ShowPassWordHandler}
                    className="absolute top-2 right-0 text-muted-foreground text-xl"
                  >
                    {showPassword ? <IoEyeOffSharp /> : <IoEye />}
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center text-sm">
              <Link
                href="/forgot-password"
                className="text-secondary-foreground hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full font-semibold py-6 rounded-md disabled:bg-muted disabled:text-foreground disabled:opacity-60"
              disabled={!form.formState.isValid || isPending}
            >
              {isPending ? "Logging in..." : "Sign in"}
            </Button>
          </div>
          {isError && (
            <p className="text-destructive text-sm text-center mt-2">
              {error instanceof Error
                ? error.message
                : "Invalid credentials. Please try again."}
            </p>
          )}
          {isSuccess && (
            <p className="text-success text-sm text-center mt-2">
              Login Successfully
            </p>
          )}

          <p className="text-sm text-center text-muted-foreground ">
            Don’t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-secondary-foreground font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </Form>
    </Authwrapper>
  );
};

export default Login;
