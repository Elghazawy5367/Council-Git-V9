/**
 * UI Store
 * Manages global UI state (modals, panels, sidebars)
 */

import { create } from 'zustand';

interface UIState {
  // Modal visibility
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  showMemory: boolean;
  setShowMemory: (show: boolean) => void;
  
  // Other UI state can be added here
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showSettings: false,
  setShowSettings: (show) => set({ showSettings: show }),
  showHistory: false,
  setShowHistory: (show) => set({ showHistory: show }),
  showMemory: false,
  setShowMemory: (show) => set({ showMemory: show }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
