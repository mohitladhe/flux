import { useState } from "react";
import { AuthPage } from "./components/AuthPage";
import { MessagingShell } from "./components/MessagingShell";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  if (!authenticated) {
    return (
      <AuthPage
        mode={authMode}
        onChangeMode={setAuthMode}
        onAuthenticated={() => setAuthenticated(true)}
      />
    );
  }

  return <MessagingShell />;
}

export default App;
