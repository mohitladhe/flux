import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { OtpVerificationPage } from "./pages/OtpVerificationPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { MessagingShell } from "./pages/MessagingShell";
import { LoadingPage } from "./components/LoadingPage";
import { ProctectedRoute } from "./pages/ProtectedRoute";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => window.clearTimeout(loadingTimer);
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<OtpVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route element={<ProctectedRoute />}>
        <Route path="/chat" element={<MessagingShell />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
