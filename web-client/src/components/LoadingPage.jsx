import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

export function LoadingPage() {
  return (
    <main className="app-loading-page" aria-live="polite">
      <section
        className="app-loading-container"
        aria-label="Flux loading"
      >
        <Grid
          size={90}
          speed={1.5}
          color="white"
        />

        <div className="app-loading-brand">
          <img
            src="/flux_logo.png"
            alt="Flux Logo"
            className="app-loading-logo"
          />

          <span className="app-loading-title">
            FLUX
          </span>
        </div>
      </section>
    </main>
  );
}