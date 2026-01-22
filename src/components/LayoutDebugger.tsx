/**
 * Layout Debugger Component
 * Shows viewport dimensions and grid overlay
 */

import React, { useEffect, useState } from 'react';

export const LayoutDebugger: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [enabled]);

  if (!enabled) return null;

  const getBreakpoint = () => {
    if (dimensions.width < 640) return 'XS (< 640px)';
    if (dimensions.width < 768) return 'SM (640-768px)';
    if (dimensions.width < 1024) return 'MD (768-1024px)';
    if (dimensions.width < 1280) return 'LG (1024-1280px)';
    if (dimensions.width < 1536) return 'XL (1280-1536px)';
    return '2XL (≥ 1536px)';
  };

  return (
    <>
      {/* Debug overlay */}
      <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white p-4 rounded-lg shadow-xl font-mono text-xs">
        <div className="font-bold mb-2 text-primary">Layout Debugger</div>
        <div className="space-y-1">
          <div>Viewport: {dimensions.width}px × {dimensions.height}px</div>
          <div>Breakpoint: {getBreakpoint()}</div>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="mt-2 px-3 py-1 bg-primary text-white rounded text-xs hover:opacity-80"
          >
            {showGrid ? 'Hide' : 'Show'} Grid
          </button>
        </div>
      </div>

      {/* Grid overlay */}
      {showGrid && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="container mx-auto h-full grid grid-cols-12 gap-4 opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-red-500 h-full" />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
