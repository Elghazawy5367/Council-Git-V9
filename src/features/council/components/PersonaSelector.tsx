import React, { useState } from 'react';
import { useControlPanelStore } from '@/features/council/store/control-panel-store';
import { useExpertStore } from '@/features/council/store/expert-store';
import { EXPERT_POSITIONS, PERSONA_LIBRARY } from '@/lib/persona-library';
import { getPersonaSelectorOptions, getTeamSelectorOptions } from '@/lib/persona-library';
import { Card, CardContent } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/primitives/collapsible';
import { ChevronDown, ChevronRight, Users, User, RotateCcw, Check } from 'lucide-react';
import { Expert } from '@/lib/types';

export const PersonaSelector: React.FC = () => {
  const {
    activeExpertCount,
    loadPersona,
    loadTeam,
    clearPersona,
    resetToDefault,
  } = useControlPanelStore();
  const { experts } = useExpertStore();

  const [showIndividual, setShowIndividual] = useState(false);
  const teams = getTeamSelectorOptions();
  const personas = getPersonaSelectorOptions();

  const handleTeamSelect = (teamId: string) => {
    if (teamId) {
      loadTeam(teamId);
    }
  };

  const handlePersonaSelect = (expertIndex: number, personaId: string) => {
    if (personaId === 'clear') {
      clearPersona(expertIndex);
    } else if (personaId) {
      loadPersona(expertIndex, personaId);
    }
  };

  const getExpertPersonaId = (expert: Expert): string | undefined => {
    return expert.personaId;
  };

  const getPositionInfo = (index: number) => {
    return EXPERT_POSITIONS[index] || EXPERT_POSITIONS[0];
  };

  return (
    <Card className="glass-panel border-primary/20">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Quick Start: Load Preset Team
            </label>
          </div>
          
          <Select onValueChange={handleTeamSelect}>
            <SelectTrigger className="w-full bg-muted/50 border-border/50">
              <SelectValue placeholder="Select a preset team..." />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center gap-2">
                    <span>{team.icon}</span>
                    <span>{team.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <p className="text-xs text-muted-foreground">
            Loads 5 personas at once with recommended mode
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <Collapsible open={showIndividual} onOpenChange={setShowIndividual}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors w-full">
            {showIndividual ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <User className="h-4 w-4" />
            <span>Load Individual Personas</span>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 pt-3">
            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              {Array.from({ length: activeExpertCount }).map((_, idx) => {
                const expert = experts[idx];
                const personaId = expert ? getExpertPersonaId(expert) : undefined;
                const persona = personaId ? PERSONA_LIBRARY[personaId] : null;
                const position = getPositionInfo(idx);
                
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        Expert {idx + 1}:
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {position.position}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 pl-4">
                      <Select
                        value={personaId || ''}
                        onValueChange={(value) => handlePersonaSelect(idx + 1, value)}
                      >
                        <SelectTrigger className="flex-1 h-8 text-xs bg-muted/30 border-border/30">
                          <SelectValue placeholder="Select persona...">
                            {persona ? (
                              <span className="flex items-center gap-1">
                                {persona.icon} {persona.name}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Default ({position.specialty})</span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clear">
                            <span className="text-muted-foreground">⟳ Reset to Default</span>
                          </SelectItem>
                          {Object.entries(personas).map(([category, personaList]) => (
                            <SelectGroup key={category}>
                              <SelectLabel className="text-xs text-muted-foreground">
                                {category}
                              </SelectLabel>
                              {personaList.map(p => (
                                <SelectItem key={p.id} value={p.id}>
                                  <span className="flex items-center gap-2">
                                    <span>{p.icon}</span>
                                    <span>{p.name}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={resetToDefault}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset All
          </Button>
        </div>

        {experts.slice(0, activeExpertCount).some(e => getExpertPersonaId(e)) && (
          <div className="pt-2 border-t border-border/30">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {activeExpertCount} experts configured:
            </p>
            <div className="space-y-1">
              {experts.slice(0, activeExpertCount).map((expert, idx) => {
                const personaId = getExpertPersonaId(expert);
                const persona = personaId ? PERSONA_LIBRARY[personaId] : null;
                const position = getPositionInfo(idx);
                
                return (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 text-xs"
                  >
                    <Check className="h-3 w-3 text-green-500" />
                    <span className="text-muted-foreground">{position.position}</span>
                    <span className="text-foreground">+</span>
                    {persona ? (
                      <Badge 
                        variant="secondary" 
                        className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20"
                      >
                        {persona.icon} {persona.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic">default</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
