import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Detect if running in GitHub Codespaces or similar HTTPS environment
  const isCodespaces = process.env.CODESPACES === 'true' || process.env.GITHUB_CODESPACE_TOKEN;
  
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
        clientPort: isCodespaces ? 443 : 8000,
      },
      watch: {
        // Reduce file watching overhead
        ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      },
    },
  plugins: [
    react(), 
    tsconfigPaths(),
    // Check TypeScript and ESLint errors in real-time during dev
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
      overlay: {
        initialIsOpen: false,
      },
    }),
  ].filter(Boolean),
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
