import { defineConfig } from "vite";   //auto-completion for Vite configuration
import react from "@vitejs/plugin-react-swc";   //use swc for convert js
import path from "path";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",   // Listen on all addresses
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),   //help imports from src folder with @ symbol
    },
  },
}));
