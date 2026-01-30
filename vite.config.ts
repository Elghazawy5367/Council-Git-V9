import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Detect deployment target
  const isVercel = process.env.VERCEL === '1';
  
  return {
    // Conditional base path for dual deployment support
    // GitHub Pages needs: /Council-Git-V9/
    // Vercel needs: /
    base: isVercel ? '/' : '/Council-Git-V9/',
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
    // NO vite-tsconfig-paths - causes Vercel conflicts
    // Use manual path aliases in resolve.alias instead
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
