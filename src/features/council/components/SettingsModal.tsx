import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/primitives/dialog';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/card';
import { Lock, Unlock, Key, Shield, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasVault: boolean;
  isVaultLocked: boolean;
  onCreateVault: (data: { password: string; openRouterKey: string; serperKey?: string }) => Promise<{ success: boolean; error?: string }>;
  onUnlockVault: (password: string) => Promise<{ success: boolean; error?: string }>;
  onLockVault: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  hasVault,
  isVaultLocked,
  onCreateVault,
  onUnlockVault,
  onLockVault,
}) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [openRouterKey, setOpenRouterKey] = useState<string>('');
  const [serperKey, setSerperKey] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreateVault = async () => {
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!openRouterKey.trim()) {
      toast.error('OpenRouter API key is required');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onCreateVault({
        password,
        openRouterKey: openRouterKey.trim(),
        serperKey: serperKey.trim() || undefined,
      });

      if (result.success) {
        toast.success('Vault created successfully');
        resetForm();
      } else {
        toast.error(result.error || 'Failed to create vault');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onUnlockVault(password);
      if (result.success) {
        toast.success('Vault unlocked');
        resetForm();
        onClose();
      } else {
        toast.error(result.error || 'Invalid password');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLock = (): void => {
    onLockVault();
    toast.success('Vault locked');
  };

  const resetForm = (): void => {
    setPassword('');
    setConfirmPassword('');
    setOpenRouterKey('');
    setSerperKey('');
    setShowPassword(false);
    setShowApiKey(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel-elevated sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Secure Vault
          </DialogTitle>
          <DialogDescription>
            Your API keys are encrypted and stored securely in your browser.
          </DialogDescription>
        </DialogHeader>

        {!hasVault ? (
          /* Create Vault Form */
          <div className="space-y-6 py-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  Create New Vault
                </CardTitle>
                <CardDescription>
                  Set up a password to encrypt your API keys
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Master Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                  />
                </div>

                {/* OpenRouter Key */}
                <div className="space-y-2">
                  <Label htmlFor="openRouterKey">
                    OpenRouter API Key <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="openRouterKey"
                      type={showApiKey ? 'text' : 'password'}
                      value={openRouterKey}
                      onChange={(e) => setOpenRouterKey(e.target.value)}
                      placeholder="sk-or-..."
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get your key at{' '}
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      openrouter.ai/keys
                    </a>
                  </p>
                </div>

                {/* Serper Key (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="serperKey">Serper API Key (Optional)</Label>
                  <Input
                    id="serperKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={serperKey}
                    onChange={(e) => setSerperKey(e.target.value)}
                    placeholder="For web search (optional)"
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                  onClick={handleCreateVault}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Vault'}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : isVaultLocked ? (
          /* Unlock Vault Form */
          <div className="space-y-6 py-4">
            <Card className="border-amber-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-500" />
                  Unlock Vault
                </CardTitle>
                <CardDescription>Enter your password to access API keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unlockPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="unlockPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter master password"
                      className="pr-10"
                      onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
                  onClick={handleUnlock}
                  disabled={isLoading}
                >
                  {isLoading ? 'Unlocking...' : 'Unlock Vault'}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Vault Unlocked */
          <div className="space-y-6 py-4">
            <Card className="border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Vault Unlocked
                </CardTitle>
                <CardDescription>Your API keys are ready to use</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Unlock className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Session Active</p>
                    <p className="text-xs text-muted-foreground">
                      Keys will auto-lock after 1 hour of inactivity
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLock}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock Vault
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
