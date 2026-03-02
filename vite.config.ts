import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";

export default defineConfig(({ mode, command }) => {
  const base = command === 'build' ? '/Council-Git-V9/' : '/';
  
  return {
    base,
    server: {
      host: "0.0.0.0",
      port: 5000,
      strictPort: true,
      allowedHosts: true,
      cors: true,
      hmr: { overlay: true },
    },
    plugins: [
      react(),
      mode === 'development' && checker({ typescript: true, overlay: { initialIsOpen: false } }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-mermaid': ['mermaid'],
            'vendor-charts': ['recharts'],
            'vendor-ui': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-tabs',
              '@radix-ui/react-select',
              '@radix-ui/react-tooltip',
              '@radix-ui/react-avatar'
            ],
            'vendor-react': ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
            'vendor-utils': ['zustand', 'lucide-react', 'date-fns', 'clsx', 'tailwind-merge'],
          },
        },
      },
      minify: 'esbuild', // Using default esbuild since terser is missing
    },
    esbuild: {
      // Stripping console and debugger via esbuild instead of terser
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'zustand', 'react-error-boundary'],
    },
  };
});
