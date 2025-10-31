import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import AuthenticationProvider from "@/providers/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticationProvider>
      <Navbar />
      {children}
      <Footer />
    </AuthenticationProvider>
  );
}
