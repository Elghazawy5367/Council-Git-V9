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
    // Base path for deployment
    base: './',
    server: {
      host: "0.0.0.0",
      port: 5000,
      strictPort: true,
      allowedHosts: true,
      cors: true,
      middlewareMode: false,
      hmr: {
        overlay: true,
        timeout: 30000,
      },
      watch: {
        // Reduce file watching overhead
        ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      },
    },
  plugins: [
    react(), 
    tsconfigPaths(),
    // Check TypeScript errors in real-time during dev
    // ESLint checker disabled due to configuration incompatibility
    mode === 'development' && checker({
      typescript: true,
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
