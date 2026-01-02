// Shared Generic Type Definitions

export interface ModelInfo {
  id: string;
  name: string;
  specialty: string;
  costPer1k: number;
  contextWindow: number;
  recommended: string;
}

export interface VaultStatus {
  hasVault: boolean;
  isLocked: boolean;
  lastUnlock?: Date;
}

export interface FileUploadResult {
  success: boolean;
  content?: string;
  error?: string;
  name?: string;
  size?: string;
  type?: string;
}
