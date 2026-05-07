import { useState } from "react";
import { ArrowLeft, LockKeyhole, Mail, MessageCircle, ShieldCheck } from "lucide-react";

export function AuthPage({ mode, onChangeMode, onAuthenticated }) {
  const [signupStep, setSignupStep] = useState("details");
  const isSignup = mode === "signup";
  const isOtpStep = isSignup && signupStep === "otp";

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSignup && signupStep === "details") {
      setSignupStep("otp");
      return;
    }

    onAuthenticated();
  };

  const switchMode = (nextMode) => {
    setSignupStep("details");
    onChangeMode(nextMode);
  };

  return (
    <main className="app-auth-background grid min-h-dvh place-items-center px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border app-border app-card-strong lg:grid-cols-[1fr_1.08fr]">
        <div className="app-panel-muted hidden min-h-[38rem] flex-col justify-between p-8 lg:flex">
          <div>
            <div className="grid size-14 place-items-center rounded-2xl app-accent-button">
              <MessageCircle size={26} />
            </div>
            <h1 className="mt-8 max-w-sm text-4xl font-bold leading-tight app-text">
              Everyday conversations, kept private.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 app-muted">
              Flux keeps the interface calm and familiar while preserving encrypted rooms,
              verified devices, and private attachments.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              ["Clean inbox", "Start with conversations, not clutter."],
              ["Verified sessions", "Trust signals are visible when they matter."],
              ["Simple theme", "Change app colors from one place in CSS."],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-2xl border app-card p-4">
                <p className="text-sm font-bold app-text">{title}</p>
                <p className="mt-1 text-xs leading-5 app-muted">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="app-panel p-5 sm:p-8">
          <div className="mx-auto flex min-h-[34rem] w-full max-w-md flex-col justify-center">
            <div className="mb-8">
              {isOtpStep && (
                <button
                  type="button"
                  onClick={() => setSignupStep("details")}
                  className="mb-5 inline-flex items-center gap-2 text-sm font-semibold app-muted transition hover:opacity-80"
                >
                  <ArrowLeft size={17} />
                  Back
                </button>
              )}
              <p className="text-sm font-bold app-accent-text">Flux Messenger</p>
              <h2 className="mt-2 text-3xl font-bold app-text">
                {isOtpStep ? "Enter the OTP" : isSignup ? "Create your account" : "Welcome back"}
              </h2>
              <p className="mt-3 text-sm leading-6 app-muted">
                {isOtpStep
                  ? "Use the one-time code sent to your email to finish sign up."
                  : isSignup
                    ? "Sign up with your email and password. OTP verification comes next."
                    : "Log in with email and password, or continue with Google."}
              </p>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              {!isOtpStep ? (
                <>
                  <label className="grid gap-2 text-sm font-semibold app-text">
                    Email
                    <span className="flex items-center gap-3 rounded-2xl border px-4 py-3 app-input-shell">
                      <Mail size={18} className="app-faint" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full bg-transparent text-sm outline-none app-input"
                      />
                    </span>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold app-text">
                    Password
                    <span className="flex items-center gap-3 rounded-2xl border px-4 py-3 app-input-shell">
                      <LockKeyhole size={18} className="app-faint" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Enter password"
                        className="w-full bg-transparent text-sm outline-none app-input"
                      />
                    </span>
                  </label>
                </>
              ) : (
                <label className="grid gap-2 text-sm font-semibold app-text">
                  OTP
                  <span className="flex items-center gap-3 rounded-2xl border px-4 py-3 app-input-shell">
                    <ShieldCheck size={18} className="app-faint" />
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6 digit code"
                      className="w-full bg-transparent text-sm tracking-[0.25em] outline-none app-input"
                    />
                  </span>
                </label>
              )}

              <button type="submit" className="mt-2 rounded-2xl px-4 py-3 text-sm font-bold transition app-accent-button">
                {isOtpStep ? "Verify and continue" : isSignup ? "Continue to OTP" : "Log in"}
              </button>
            </form>

            {!isSignup && (
              <button
                type="button"
                onClick={onAuthenticated}
                className="mt-4 flex items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition app-ghost-button"
              >
                <span className="grid size-6 place-items-center rounded-full app-panel text-sm font-black app-text">
                  G
                </span>
                Continue with Google
              </button>
            )}

            <div className="mt-8 text-center text-sm app-muted">
              {isSignup ? "Already have an account?" : "New to Flux?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(isSignup ? "login" : "signup")}
                className="font-bold app-accent-text"
              >
                {isSignup ? "Log in" : "Create account"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
