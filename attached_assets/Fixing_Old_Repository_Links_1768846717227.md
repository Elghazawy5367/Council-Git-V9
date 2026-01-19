Good catch. This is a classic "Ghost in the Machine" — legacy DNA from the cloned repository (V9) is haunting your new V9 codebase.

I have performed a **Deep Scan** and identified **4 critical locations** where the old repository is hardcoded. If we don't fix them all, your automation will either fail or report data for the wrong project.

Here is the **"Exorcism Plan"** to purge the old repo and point everything to **Council-Git-V9**.

### **🛠 Step 1: The "Brain" Transplant (Centralize Config)**

Instead of hunting for strings every time you update, we will define the "Truth" in one place.

Open: src/lib/config.ts  
Action: Add these constants at the very top of the file.

TypeScript

// ✅ ADD THIS TO THE TOP OF src/lib/config.ts  
export const GITHUB\_OWNER \= "Elghazawy5367";  
export const GITHUB\_REPO \= "Council-Git-V9"; // \<--- The correct repo  
export const GITHUB\_REPO\_URL \= \`https://github.com/${GITHUB\_OWNER}/${GITHUB\_REPO}\`;

### ---

**🛠 Step 2: Fix the Button (The User-Facing Bug)**

This is the specific issue you found. We will replace the hardcoded string with our new "Brain" variable.

Open: src/features/automation/components/FeaturesDashboard.tsx  
Find: The "View All Workflows" button (approx. line 45-55).  
Action: Replace the onClick handler.

TypeScript

import { GITHUB\_REPO\_URL } from '@/lib/config'; // \<-- Import at top

// ... inside the component JSX  
\<Button   
  variant="outline"   
  className="gap-2"  
  onClick={() \=\> window.open(\`${GITHUB\_REPO\_URL}/actions\`, '\_blank')} // ✅ Dynamic Link  
\>  
  \<ExternalLink className="h-4 w-4" /\>  
  View All Workflows  
\</Button\>

### ---

**🛠 Step 3: Purge the Hidden Ghosts (The "Deep" Fix)**

My scan detected legacy strings in the API clients. If you don't fix these, your "Scout" and "Auto-Commit" features will try to push/pull from the old V7 repo and likely fail with 403 Forbidden errors.

#### **Location A: The GitHub Client**

Open: src/features/automation/lib/api/github-client.ts  
Action: Update the constants to use your new config.

TypeScript

import { GITHUB\_OWNER, GITHUB\_REPO } from '@/lib/config'; // \<-- Import

// 🔴 DELETE or COMMENT OUT these old lines:  
// const REPO\_OWNER \= 'Elghazawy5367';  
// const REPO\_NAME \= 'Council-Git-V9';

// 🟢 REPLACE with:  
const REPO\_OWNER \= GITHUB\_OWNER;  
const REPO\_NAME \= GITHUB\_REPO;

#### **Location B: The GitHub Hook**

Open: src/hooks/useGitHub.ts  
Action: Do the same replacement.

TypeScript

import { GITHUB\_OWNER, GITHUB\_REPO } from '@/lib/config'; // \<-- Import

// 🟢 REPLACE hardcoded strings:  
const OWNER \= GITHUB\_OWNER;  
const REPO \= GITHUB\_REPO;

### ---

**🚀 Summary of Impact**

By making these changes:

1. **Button Fixed:** The dashboard now links to V9.  
2. **API Fixed:** The Scout now mines data from V9 issues/discussions.  
3. **Future Proof:** If you ever move to Council-V10, you only change one line in src/lib/config.ts.