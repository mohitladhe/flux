import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { OtpVerificationPage } from "./pages/OtpVerificationPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { MessagingShell } from "./pages/MessagingShell";
import { LoadingPage } from "./components/LoadingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AuthInitializer from "./routes/AuthInitializer";

function AppContent() {
  const { isLoading } = useAuthStore();
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<OtpVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<MessagingShell />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthInitializer>
      <AppContent />
    </AuthInitializer>
  );
}
