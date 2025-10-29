
import AuthenticationProvider from "@/providers/ProtectedRoute";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticationProvider>{children}</AuthenticationProvider>;
}