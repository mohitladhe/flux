import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { OtpVerificationPage } from "./pages/OtpVerificationPage"
import { MessagingShell } from "./pages/MessagingShell";
import { LoadingPage } from "./components/LoadingPage";

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

  return(
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<OtpVerificationPage />} />
      <Route path="/chat" element={<MessagingShell />} />
    </Routes>
  );
}

export default App;
