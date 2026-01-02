import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import '@/lib/types';
import { DEFAULT_SYNTHESIS_CONFIG } from '@/lib/synthesis-engine';
import { initializeVault, getVaultStatus, createVault, unlockVault, lockVault } from '@/features/council/lib/vault';
import { SynthesisConfig } from "@/features/council/lib/types";

interface VaultCreationResult {
  success: boolean;
  error?: string;
}

interface VaultUnlockResult {
  success: boolean;
  error?: string;
  keys: {
    openRouterKey: string;
    serperKey?: string;
  };
}

interface SettingsState {
  apiKey: string;
  setApiKey: (key: string) => void;
  openRouterKey: string;
  setOpenRouterKey: (key: string) => void;
  model: string;
  setModel: (model: string) => void;
  synthesisConfig: SynthesisConfig;
  setSynthesisConfig: (config: SynthesisConfig) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  showMemory: boolean;
  setShowMemory: (show: boolean) => void;
  vaultStatus: VaultStatus;
  handleCreateVault: (data: { password: string; openRouterKey: string; serperKey?: string }) => Promise<VaultCreationResult>;
  handleUnlockVault: (password: string) => Promise<VaultUnlockResult>;
  handleLockVault: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      openRouterKey: '',
      setOpenRouterKey: (key) => set({ openRouterKey: key }),
      model: 'gpt-4-turbo-preview',
      setModel: (model) => set({ model }),
      synthesisConfig: DEFAULT_SYNTHESIS_CONFIG,
      setSynthesisConfig: (config) => set({ synthesisConfig: config }),
      showSettings: false,
      setShowSettings: (show) => set({ showSettings: show }),
      showHistory: false,
      setShowHistory: (show) => set({ showHistory: show }),
      showMemory: false,
      setShowMemory: (show) => set({ showMemory: show }),
      vaultStatus: initializeVault(),
      handleCreateVault: async (data) => {
        const result = await createVault(data);
        if (result.success) {
          set({ vaultStatus: getVaultStatus() });
          toast.success('Vault Created');
        } else {
          toast.error('Vault Creation Failed', { description: result.error });
        }
        return result;
      },
      handleUnlockVault: async (password) => {
        const result = await unlockVault(password);
        if (result.success) {
          set({ vaultStatus: getVaultStatus(), openRouterKey: result.keys.openRouterKey });
          toast.success('Vault Unlocked');
        } else {
          toast.error('Unlock Failed');
        }
        return result;
      },
      handleLockVault: () => {
        lockVault();
        set({ vaultStatus: getVaultStatus(), openRouterKey: '' });
        toast.info('Vault Locked');
      },
    }),
    {
      name: 'council-settings-storage', // unique name
    }
  )
);