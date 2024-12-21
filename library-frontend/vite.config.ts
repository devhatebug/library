import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
export default defineConfig(() => {
  const envDir = "./env";
  return {
    plugins: [react(), TanStackRouterVite()],
    envDir: envDir,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
