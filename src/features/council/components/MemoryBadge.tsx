import React from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { formatCount } from '@/lib/format';

interface MemoryBadgeProps {
  count: number;
  onClick: () => void;
}

export const MemoryBadge: React.FC<MemoryBadgeProps> = ({ count, onClick }) => {
  return (
    <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5 text-sm" onClick={onClick}>
      <Brain className="h-4 w-4 text-primary" />
      <span className="hidden sm:inline">{formatCount(count)} memories</span>
      <Badge variant="secondary" className="text-[10px] ml-1 sm:hidden">{formatCount(count)}</Badge>
    </Button>
  );
};
