import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  Mail,
  MessageCircle,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import { loginUser, verifyToken } from "../services/authService";
import { validateLoginForm } from "../utils/validators";
import { LoadingPage } from "../components/LoadingPage";
import { useAuthStore } from "../store/authStore";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [formSubmitError, setFormSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // useEffect(() => {
  //   (async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       return;
  //     }

  //     try {
  //       const data = await verifyToken();
  //       console.log(data);
  //       if (data.loggedIn) {
  //         navigate("/chat", {
  //           replace: true,
  //         });
  //       }
  //     } catch (error) {
  //       const errorMessage = error.response?.data?.message;
  //       console.log(errorMessage);
  //       localStorage.removeItem("token");
  //       navigate("/");
  //     }
  //   })();
  // }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormSubmitError("");
    setErrors({
      email: "",
      password: "",
    });

    try {
      const validateErrors = validateLoginForm({
        email,
        password,
      });

      setErrors(validateErrors);

      if (validateErrors.email || validateErrors.password) {
        setFormSubmitError("");
        setIsSubmitting(false);
        return;
      }

      const data = await loginUser({
        email,
        password,
      });
      console.log(data);
      if (data.loggedIn) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/chat", {
          replace: true,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setFormSubmitError(errorMessage);
      console.error(error);
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
                Everyday conversations, kept private.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 app-muted">
                Flux keeps the interface calm and familiar while preserving
                encrypted rooms, verified devices, and private attachments.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                ["Clean inbox", "Start with conversations, not clutter."],
                [
                  "Verified sessions",
                  "Trust signals are visible when they matter.",
                ],
                ["Simple theme", "Change app colors from one place in CSS."],
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
              <div className="mb-8">
                <p className="text-sm font-bold app-accent-text">
                  Flux Messenger
                </p>
                <h2 className="mt-2 text-3xl font-bold app-text">
                  Welcome back
                </h2>
                <p className="mt-3 text-sm leading-6 app-muted">
                  Log in with email and password, or continue with Google.
                </p>
              </div>

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2 text-sm font-semibold app-text">
                  Email
                  <span
                    className={` flex items-center gap-3 rounded-xl border px-4 py-3 app-input-shell ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  >
                    <Mail size={18} className="app-faint" />
                    <input
                      type="email"
                      disabled={isSubmitting}
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none app-input"
                    />
                  </span>
                  {errors.email && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.email}
                    </p>
                  )}
                </label>

                <label className="grid gap-2 text-sm font-semibold app-text">
                  Password
                  <span
                    className={` flex items-center gap-3 rounded-xl border px-4 py-3 app-input-shell ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  >
                    <LockKeyhole size={18} className="app-faint" />
                    <input
                      type={showPassword ? "text" : "password"}
                      disabled={isSubmitting}
                      required
                      minLength={6}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none app-input"
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="app-muted hover:app-text"
                      aria-label={
                        showPassword ? "Hide Password" : "Show Password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </span>
                  {errors.password && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.password}
                    </p>
                  )}
                </label>

                {formSubmitError && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm font-medium text-red-500">
                    <Info size={18} color="ff0000" />
                    <span>{formSubmitError}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm app-accent-text"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 rounded-xl px-4 py-3 text-sm font-bold transition app-accent-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
                </button>
              </form>

              <button
                type="button"
                disabled={isSubmitting}
                className="mt-4 flex items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold transition app-ghost-button"
              >
                <span className="grid size-6 place-items-center rounded-full app-panel text-sm font-black app-text">
                  G
                </span>
                Continue with Google
              </button>

              <div className="mt-8 text-center text-sm app-muted">
                New to Flux?
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-bold app-accent-text"
                >
                  Create account
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
