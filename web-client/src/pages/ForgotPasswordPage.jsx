import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { OtpInput } from "../components/OtpInput";
import { LoadingPage } from "../components/LoadingPage";
import {
  requestPasswordReset,
  verifyPasswordReset,
  setNewPassword,
} from "../services/authService";
import { validateEmail, validatePassword } from "../utils/validators";

const OTP_LENGTH = 6;
const stepOrder = ["email", "otp", "password"];

export function ForgotPasswordPage() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetRequestId, setResetRequestId] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    form: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const activeStepIndex =
    step === "complete" ? stepOrder.length : stepOrder.indexOf(step);

  const clearError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
      form: "",
    }));
  };

  const handleBack = () => {
    setErrors({
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
      form: "",
    });

    if (step === "email" || step === "complete") {
      navigate("/");
      return;
    }

    if (step === "otp") {
      setStep("email");
      return;
    }

    setStep("otp");
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const emailError = validateEmail(email);

      if (emailError) {
        setErrors((prev) => ({
          ...prev,
          email: emailError,
        }));
        setIsSubmitting(false);
        return;
      }

      const data = await requestPasswordReset({
        email,
      });
      console.log(data);

      if (data) {
        setOtp("");
        setResetRequestId(data.resetRequestId);
        setStep("otp");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrors((prev) => ({
        ...prev,
        form: errorMessage,
      }));
      console.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (otp.length !== OTP_LENGTH) {
        setErrors((prev) => ({
          ...prev,
          otp: "Please enter the complete verification code.",
        }));
        setIsSubmitting(false);
        return;
      }

      setErrors((prev) => ({
        ...prev,
        otp: "",
      }));

      const data = await verifyPasswordReset({
        resetRequestId,
        otp,
      });
      console.log(data);

      if (data) {
        setPassword("");
        setConfirmPassword("");
        setResetRequestId(data.resetRequestId);
        setStep("password");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrors((prev) => ({
        ...prev,
        form: errorMessage,
      }));
      console.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const passwordError = validatePassword(password);
      const confirmPasswordError = !confirmPassword
        ? "Confirm password is required."
        : password !== confirmPassword
          ? "Passwords do not match."
          : "";

      setErrors((prev) => ({
        ...prev,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      }));

      if (passwordError || confirmPasswordError) {
        return;
      }

      const data = await setNewPassword({
        resetRequestId,
        password,
      });
      console.log(data);

      if (data) {
        setStep("complete");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrors((prev) => ({
        ...prev,
        form: errorMessage,
      }));
      console.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepContent = {
    email: {
      title: "Reset password",
      description: "Enter your account email and continue to OTP verification.",
    },
    otp: {
      title: "Verify OTP",
      description: `Enter the 6-digit code sent to ${email}.`,
    },
    password: {
      title: "Create new password",
      description: "Choose a strong password and confirm it below.",
    },
    complete: {
      title: "Password updated",
      description: "You can now log in with your new password.",
    },
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
                Recover access securely.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 app-muted">
                Verify your email, confirm the OTP, then set a fresh password
                for your Flux account.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                ["Email check", "Start with the email linked to your account."],
                ["OTP confirmation", "Use the code sent to your inbox."],
                ["New password", "Finish with a fresh secure password."],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-xl border app-card p-4">
                  <p className="text-sm font-bold app-text">{title}</p>
                  <p className="mt-1 text-xs leading-5 app-muted">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="app-panel p-5 sm:p-8">
            <div className="mx-auto flex min-h-136 w-full max-w-md flex-col justify-center">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="mb-8 flex w-fit items-center gap-2 text-sm font-bold app-accent-text disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft size={18} />
                {step === "email" || step === "complete"
                  ? "Back to login"
                  : "Back"}
              </button>

              <div className="mb-7">
                <p className="text-sm font-bold app-accent-text">
                  Flux Messenger
                </p>
                <h2 className="mt-2 text-3xl font-bold app-text">
                  {stepContent[step].title}
                </h2>
                <p className="mt-3 text-sm leading-6 app-muted">
                  {stepContent[step].description}
                </p>
              </div>

              <div className="mb-8 grid grid-cols-3 gap-2">
                {stepOrder.map((item, index) => {
                  const isActive = activeStepIndex === index;
                  const isComplete = activeStepIndex > index;
                  const label =
                    item === "email"
                      ? "Email"
                      : item === "otp"
                        ? "OTP"
                        : "Password";

                  return (
                    <div
                      key={item}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-2 py-2 text-xs font-bold ${
                        isActive || isComplete
                          ? "app-selected app-selected-muted"
                          : "app-input-shell app-muted"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>

              {step === "email" && (
                <form className="grid gap-4" onSubmit={handleEmailSubmit}>
                  <label className="grid gap-2 text-sm font-semibold app-text">
                    Email
                    <span
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 app-input-shell ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    >
                      <Mail size={18} className="app-faint" />
                      <input
                        type="email"
                        required
                        disabled={isSubmitting}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          clearError("email");
                        }}
                        className="w-full bg-transparent text-sm outline-none app-input"
                      />
                    </span>
                    {errors.email && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </label>

                  {errors.form && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm font-medium text-red-500">
                      <Info size={18} />
                      <span>{errors.form}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition app-accent-button disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={18} />
                    {isSubmitting ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              )}

              {step === "otp" && (
                <form className="grid gap-5" onSubmit={handleOtpSubmit}>
                  <OtpInput
                    value={otp}
                    disabled={isSubmitting}
                    onChange={(nextOtp) => {
                      setOtp(nextOtp);
                      clearError("otp");
                    }}
                    length={OTP_LENGTH}
                    ariaLabel="Password reset code"
                  />

                  {errors.otp && (
                    <p className="rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm font-medium text-red-500">
                      {errors.otp}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl px-4 py-3 text-sm font-bold transition app-accent-button"
                  >
                    Verify OTP
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setOtp("");
                      setStep("email");
                    }}
                    className="text-sm font-bold app-accent-text"
                  >
                    Use different email
                  </button>
                </form>
              )}

              {step === "password" && (
                <form className="grid gap-4" onSubmit={handlePasswordSubmit}>
                  <label className="grid gap-2 text-sm font-semibold app-text">
                    New password
                    <span
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 app-input-shell ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    >
                      <LockKeyhole size={18} className="app-faint" />
                      <input
                        type={showPassword ? "text" : "password"}
                        disabled={isSubmitting}
                        required
                        placeholder="Enter new password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          clearError("password");
                        }}
                        className="w-full bg-transparent text-sm outline-none app-input"
                      />
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="app-muted hover:app-text"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </span>
                    {errors.password && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </label>

                  <label className="grid gap-2 text-sm font-semibold app-text">
                    Confirm password
                    <span
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 app-input-shell ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                    >
                      <LockKeyhole size={18} className="app-faint" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        disabled={isSubmitting}
                        required
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          clearError("confirmPassword");
                        }}
                        className="w-full bg-transparent text-sm outline-none app-input"
                      />
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="app-muted hover:app-text"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </span>
                    {errors.confirmPassword && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 rounded-xl px-4 py-3 text-sm font-bold transition app-accent-button"
                  >
                    Update password
                  </button>
                </form>
              )}

              {step === "complete" && (
                <div className="grid gap-5">
                  <div className="flex items-start gap-3 rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-sm font-medium text-green-500">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                    <span>Your password has been reset successfully.</span>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => navigate("/")}
                    className="rounded-xl px-4 py-3 text-sm font-bold transition app-accent-button"
                  >
                    Go to login
                  </button>
                </div>
              )}

              <div className="mt-8 flex items-start gap-3 rounded-xl border app-card p-4">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 app-accent-text"
                />
                <p className="text-sm leading-6 app-muted">
                  Password recovery stays private by verifying ownership before
                  a new password is accepted.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
