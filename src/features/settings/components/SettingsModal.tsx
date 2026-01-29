import React, { useState } from 'react';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import { useShallow } from 'zustand/react/shallow';
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
import { toast } from 'sonner';

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
    setOpenRouterKey,
    githubApiKey,
    setGithubApiKey,
    redditApiKey,
    setRedditApiKey
  } = useSettingsStore(useShallow((state) => ({
    vaultStatus: state.vaultStatus,
    handleCreateVault: state.handleCreateVault,
    handleUnlockVault: state.handleUnlockVault,
    handleLockVault: state.handleLockVault,
    openRouterKey: state.openRouterKey,
    setOpenRouterKey: state.setOpenRouterKey,
    githubApiKey: state.githubApiKey,
    setGithubApiKey: state.setGithubApiKey,
    redditApiKey: state.redditApiKey,
    setRedditApiKey: state.setRedditApiKey,
  })));
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleCreate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const result = await handleCreateVault({ 
        password: newPassword, 
        openRouterKey,
        githubApiKey,
        redditApiKey
      });
      if (result.success) {
        toast.success('Vault created successfully');
        onClose();
      } else {
        toast.error(result.error || 'Failed to create vault');
      }
    } catch (error) {
      console.error('Failed to create vault:', error);
      toast.error('Failed to create vault');
    }
  };

  const handleUnlock = async () => {
    try {
      const result = await handleUnlockVault(password);
      if (result.success) {
        toast.success('Vault unlocked successfully');
        onClose();
      } else {
        toast.error(result.error || 'Failed to unlock vault');
      }
    } catch (error) {
      console.error('Failed to unlock vault:', error);
      toast.error('Failed to unlock vault');
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
                  placeholder="sk-or-..."
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">GitHub API Key</Label>
                <Input
                  className="col-span-3"
                  placeholder="ghp_... (optional)"
                  value={githubApiKey}
                  onChange={(e) => setGithubApiKey(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Reddit API Key</Label>
                <Input
                  className="col-span-3"
                  placeholder="Reddit API key (optional)"
                  value={redditApiKey}
                  onChange={(e) => setRedditApiKey(e.target.value)}
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
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Vault is unlocked. Your API keys are securely stored.</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">OpenRouter Key</span>
                  <span className="text-xs text-muted-foreground">{openRouterKey ? '••••••••' : 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">GitHub API Key</span>
                  <span className="text-xs text-muted-foreground">{githubApiKey ? '••••••••' : 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">Reddit API Key</span>
                  <span className="text-xs text-muted-foreground">{redditApiKey ? '••••••••' : 'Not set'}</span>
                </div>
              </div>
            </div>
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
