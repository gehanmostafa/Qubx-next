"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
};

export default AuthenticationProvider;
