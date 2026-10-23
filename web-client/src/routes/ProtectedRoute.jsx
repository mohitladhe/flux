import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ProfileCompletionIndicator } from "../components/ProfileCompletionIndicator";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <Outlet />
      <ProfileCompletionIndicator />
    </>
  );
}
