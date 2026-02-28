import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/primitives/command';
import {
  Brain,
  Shield,
  Zap,
  LayoutGrid,
  Settings,
  History,
  Database,
  BarChart3,
  Search,
  Github,
} from 'lucide-react';
import { useFeatureConfigStore } from '@/features/council/store/feature-config-store';

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { scout, redditSniper, githubTrending, marketGap } = useFeatureConfigStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <Brain className="mr-2 h-4 w-4" />
            <span>Council Home</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/automation'))}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Intelligence Center</span>
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/quality'))}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Quality Dashboard</span>
            <CommandShortcut>⌘Q</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Intelligence Features">
          <CommandItem onSelect={() => runCommand(() => navigate('/automation?tab=features'))}>
            <Github className="mr-2 h-4 w-4" />
            <span>Phantom Scout</span>
            {scout.enabled && <span className="ml-2 text-[10px] text-green-500 font-mono">ACTIVE</span>}
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/automation?tab=features'))}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Market Gap Identifier</span>
            {marketGap.enabled && <span className="ml-2 text-[10px] text-green-500 font-mono">ACTIVE</span>}
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/automation?tab=analytics'))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Council Metrics</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/automation?tab=reports'))}>
            <Database className="mr-2 h-4 w-4" />
            <span>Intelligence Feed</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Global Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <History className="mr-2 h-4 w-4" />
            <span>Decision History</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
