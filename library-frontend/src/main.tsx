import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./providers/auth-provider.tsx";

const root = createRoot(document.getElementById("root")!);

// eslint-disable-next-line react-refresh/only-export-components
const App = lazy(async () => {
  const module = await import("./app");
  return { default: module.App };
});

const main = () => {
  root.render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );
};

main();
