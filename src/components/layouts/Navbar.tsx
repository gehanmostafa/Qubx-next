"use client";
import { useAuthStore } from "@/store/client/useAuthStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const Navbar = () => {
  // const storedUser = localStorage.getItem("user");
  // const user = storedUser ? JSON.parse(storedUser) : null;
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [setUser]);

  return (
    <header className="bg-primary text-background">
      <nav className="px-4 md:px-15 py-5 flex justify-between md:items-center">
        <div className="h-12 md:w-40 w-20 relative">
          <Image src="/images/logo2.png" fill alt="QUBX3D Logo" />
        </div>
        <div>
          {user ? <p>{user.fullname}</p> : <Link href="/login">Login</Link>}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
