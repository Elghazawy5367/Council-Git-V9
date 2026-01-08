import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Detect if running in GitHub Codespaces or similar HTTPS environment
  const isCodespaces = process.env.CODESPACES === 'true' || process.env.GITHUB_CODESPACE_TOKEN;
  const isHttps = process.env.VITE_HMR_PROTOCOL === 'wss' || isCodespaces;

  return {
    server: {
      host: "0.0.0.0",
      port: 8000,
      strictPort: false,
      allowedHosts: true,
      cors: true,
      middlewareMode: false,
      hmr: {
        overlay: true, // Show errors as overlay instead of crashing
        timeout: 30000, // Increase timeout for slower connections
        protocol: isHttps ? 'wss' : 'ws', // Auto-detect secure WebSocket
        host: process.env.CODESPACE_NAME 
          ? `${process.env.CODESPACE_NAME}-8000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
          : undefined,
      },
      watch: {
        // Reduce file watching overhead
        ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      },
    },
  plugins: [react(), tsconfigPaths()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Better error reporting
    sourcemap: mode === 'development',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress certain warnings
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      },
    },
  },
  // Optimize dependency pre-bundling
    optimizeDeps: {
      include: ['react', 'react-dom', 'zustand', 'react-error-boundary'],
      exclude: ['@vite/client', '@vite/env'],
    },
  };
});
