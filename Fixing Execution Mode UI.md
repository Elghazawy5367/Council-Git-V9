## **Strategic Repair: Execution Mode Logic & UI**

You have correctly identified two friction points that break the "Touch-First" and "Single Source of Truth" rules.

1. **The "Wormhole" Gear:** Navigating to a different dashboard (/features) for settings disrupts your flow. Settings should be *modal* (pop-up), not spatial (page change).  
2. **The "Mystery" Buttons:** Hiding text behind icons increases cognitive load. You should never have to guess what a button does.

Here is the surgical fix for **src/features/council/components/ControlPanel.tsx**.

### **The Fix**

Open src/features/council/components/ControlPanel.tsx and replace the Execution Mode section with this corrected code block.

**Key Changes:**

* **Gear Icon:** Changed from Maps("/features") to a local settings trigger (I've added a placeholder setIsSettingsOpen – make sure you have a state for this or connect it to your SettingsModal).  
* **Mode Buttons:** Refactored to a grid layout that forces **Icon \+ Text** to sit side-by-side, ensuring readable buttons on your tablet.

TypeScript

import { useState } from "react";  
import { Settings2, Zap, Eye, Moon, Activity } from "lucide-react";  
import { Button } from "@/components/primitives/button";  
// ... preserve your other imports

export function ControlPanel() {  
  // Add this state if you don't have it, to control the settings modal  
  const \[isSettingsOpen, setIsSettingsOpen\] \= useState(false);   
    
  // ... preserve your existing state/logic

  return (  
    \<div className="space-y-4"\>  
      {/\* HEADER: corrected the gear action \*/}  
      \<div className="flex items-center justify-between mb-4"\>  
        \<h2 className="text-lg font-semibold flex items-center gap-2"\>  
          \<Activity className="h-5 w-5 text-primary" /\>  
          Execution Mode  
        \</h2\>  
          
        {/\* FIX 1: THE GEAR ICON \*/}  
        {/\* Now opens settings in-context instead of redirecting \*/}  
        \<Button   
          variant="ghost"   
          size="sm"   
          className="h-8 w-8 p-0"  
          onClick={() \=\> setIsSettingsOpen(true)}   
        \>  
          \<Settings2 className="h-4 w-4 text-muted-foreground hover:text-primary" /\>  
          \<span className="sr-only"\>Configure Mode\</span\>  
        \</Button\>  
      \</div\>

      {/\* FIX 2: THE MODE SELECTORS (Icon \+ Text) \*/}  
      \<div className="grid grid-cols-3 gap-2 bg-muted/30 p-1 rounded-lg"\>  
        {\[  
          { id: 'active', label: 'Active', icon: Zap },  
          { id: 'passive', label: 'Passive', icon: Eye },  
          { id: 'sleep', label: 'Sleep', icon: Moon }  
        \].map((mode) \=\> (  
          \<Button  
            key={mode.id}  
            // Logic: Highlight if selected, ghost if not  
            variant={currentMode \=== mode.id ? "default" : "ghost"}  
            size="sm"  
            onClick={() \=\> handleModeChange(mode.id)}  
            className={\`  
              flex items-center justify-center gap-2   
              ${currentMode \=== mode.id ? 'shadow-md font-semibold' : 'text-muted-foreground'}  
            \`}  
          \>  
            {/\* FORCE RENDER: Icon \+ Label Side-by-Side \*/}  
            \<mode.icon className="h-4 w-4" /\>  
            \<span\>{mode.label}\</span\>   
          \</Button\>  
        ))}  
      \</div\>  
        
      {/\* ... rest of your component \*/}  
        
      {/\* Ensure you render the SettingsModal if it exists \*/}  
      {/\* \<SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} /\> \*/}  
    \</div\>  
  );  
}

### **Action Items**

1. **Paste** this block into ControlPanel.tsx.  
2. **Verify Imports:** Ensure you have Zap, Eye, Moon, Activity, and Settings2 imported from lucide-react.  
3. **Connect Modal:** If you already have a \<SettingsModal /\> imported, uncomment the line at the bottom to ensure the gear icon actually opens it.

This unifies the interface and stops the app from fighting your muscle memory.