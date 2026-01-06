import React, { useState } from 'react';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/primitives/dialog';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    vaultStatus, 
    handleCreateVault, 
    handleUnlockVault, 
    handleLockVault, 
    openRouterKey, 
    setOpenRouterKey 
  } = useSettingsStore();
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleCreate = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const result = await handleCreateVault({ password: newPassword, openRouterKey });
    if (result.success) {
      onClose();
    }
  };

  const handleUnlock = async () => {
    const result = await handleUnlockVault(password);
    if (result.success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-panel">
        <DialogHeader>
          <DialogTitle>{vaultStatus.hasVault ? 'Vault Settings' : 'Create Vault'}</DialogTitle>
          <DialogDescription>
            {vaultStatus.hasVault
              ? 'Manage your vault settings below.'
              : 'Create a new vault to store your API keys.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!vaultStatus.hasVault ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">OpenRouter Key</Label>
                <Input
                  className="col-span-3"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">New Password</Label>
                <Input
                  type="password"
                  className="col-span-3"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Confirm Password</Label>
                <Input
                  type="password"
                  className="col-span-3"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          ) : vaultStatus.isLocked ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Password</Label>
              <Input
                type="password"
                className="col-span-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          ) : (
            <p>Vault is unlocked.</p>
          )}
        </div>
        <DialogFooter>
          {!vaultStatus.hasVault ? (
            <Button onClick={handleCreate}>Create Vault</Button>
          ) : vaultStatus.isLocked ? (
            <Button onClick={handleUnlock}>Unlock</Button>
          ) : (
            <Button onClick={handleLockVault}>Lock Vault</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
