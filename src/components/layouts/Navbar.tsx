"use client";
import { useAuthStore } from "@/store/client/useAuthStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

const Navbar = () => {
  const { user, setUser, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [setUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <header className="bg-primary text-background">
      <nav className="px-4 md:px-15 py-5 flex justify-between md:items-center relative">
        <div className="h-12 md:w-40 w-20 relative">
          <Image src="/images/logo2.png" fill alt="QUBX3D Logo" />
        </div>

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 font-medium hover:opacity-80 transition"
            >
              {user.fullname}
              <span
                className={`inline-block transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <IoMdArrowDropdown />
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg border z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
