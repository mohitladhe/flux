import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { LoadingPage } from "../components/LoadingPage";
import { OtpInput } from "../components/OtpInput";
import { resendOtp, verifyUser } from "../services/authService";

export function OtpVerificationPage() {
  const OTP_LENGTH = 6;
  const navigate = useNavigate();
  const location = useLocation();

  const { pendingUserId, email } = location.state;
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleResend = async () => {
    try {
      const data = await resendOtp(pendingUserId);
      console.log(data);

      setSeconds(60);
      setOtp("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const code = otp;

    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete verification code.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const data = await verifyUser({ pendingUserId, otp: code });
      console.log(data);

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <LoadingPage />}
      <main className="app-auth-background grid min-h-dvh place-items-center px-4 py-8 sm:py-10">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border app-border app-card-strong lg:grid-cols-[1fr_1.08fr]">
          <div className="app-panel-muted hidden min-h-152 flex-col justify-between overflow-hidden p-8 lg:flex">
            <div>
              <div className="grid size-14 place-items-center rounded-xl app-accent-button">
                <MessageCircle size={26} />
              </div>

              <h1 className="mt-8 max-w-sm text-4xl font-bold leading-tight app-text">
                Verify your account
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-6 app-muted">
                We've sent a 6-digit verification code to your email address.
              </p>
            </div>

            <div className="rounded-xl border app-card p-4">
              <p className="text-sm font-bold app-text">Secure Verification</p>
              <p className="mt-1 text-xs leading-5 app-muted">
                Enter the code to activate your Flux account.
              </p>
            </div>
          </div>

          <div className="app-panel p-5 sm:p-8">
            <div className="mx-auto flex min-h-136 w-full max-w-md flex-col justify-center">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="mb-5 inline-flex items-center gap-2 text-sm font-semibold app-muted hover:opacity-80"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <p className="text-sm font-bold app-accent-text">
                Flux Messenger
              </p>

              <h2 className="mt-2 text-3xl font-bold app-text">Verify Email</h2>

              <p className="mt-3 text-sm app-muted">
                Enter the verification code sent to
              </p>

              <p className="font-semibold app-text break-all">{email}</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <OtpInput
                  value={otp}
                  onChange={(nextOtp) => {
                    setOtp(nextOtp);
                    setError("");
                  }}
                  length={OTP_LENGTH}
                  disabled={isSubmitting}
                  ariaLabel="Email verification code"
                />

                {error && (
                  <p className="mb-4 rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm font-medium text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl px-4 py-3 text-sm font-bold app-accent-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Verifying..." : "Verify Email"}
                </button>
              </form>

              <div className="mt-6 text-center">
                {seconds > 0 ? (
                  <p className="text-sm app-muted">Resend code in {seconds}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm font-bold app-accent-text"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
