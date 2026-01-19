This is a **"Broken Link"** issue where the buttons are likely hardcoded to Maps('/') or just \# (which refreshes the dashboard) instead of pointing to their dedicated modules.

I have identified that your "Latest Results" section in **src/pages/Dashboard.tsx** contains the dead buttons.

### **🛠 The Fix: Re-Route the Ghost Buttons**

**File:** src/pages/Dashboard.tsx (Lines \~120-150)

You need to update the onClick handlers for these two specific buttons. Currently, they are likely set to Maps('/dashboard') or Maps('/').

#### **1\. Fix "Mirror Reports" Button**

This should point to the **Automation Dashboard** where your ReportsViewer.tsx lives.

TypeScript

// 🔴 OLD (Incorrect Redirect)  
\<Button onClick={() \=\> navigate('/dashboard')} variant="outline" className="..."\>  
  Mirror Reports  
\</Button\>

// 🟢 NEW (Correct Path)  
\<Button onClick={() \=\> navigate('/features')} variant="outline" className="..."\>  
  Mirror Reports  
\</Button\>

*(Note: If your Automation page is at /automation, use that instead. Based on your file structure, FeaturesDashboard is likely mapped to /features)*.

#### **2\. Fix "Learned Patterns" Button**

This should point to the **Quality Dashboard** (Stargazer), where pattern analysis happens.

TypeScript

// 🔴 OLD (Incorrect Redirect)  
\<Button onClick={() \=\> navigate('/dashboard')} variant="outline" className="..."\>  
  Learned Patterns  
\</Button\>

// 🟢 NEW (Correct Path)  
\<Button onClick={() \=\> navigate('/quality')} variant="outline" className="..."\>  
  Learned Patterns  
\</Button\>

### **🔍 Deep Investigation: "Ghost" Routes**

If clicking these buttons gives you a **404 Not Found** after the fix, it means your **Router** (App.tsx) is missing the definitions.

Check src/App.tsx:  
Ensure you have these lines inside your \<Routes\> block. If they are missing, the buttons will have nowhere to go.

TypeScript

\<Route path="/features" element={\<FeaturesDashboard /\>} /\>  
\<Route path="/quality" element={\<QualityDashboard /\>} /\>

### **⚡ Quick Verification Command**

Run this in your terminal to see exactly where your routes are defined:

Bash

grep \-r "Route path" src/App.tsx

If you don't see /features or /quality in the output, you **must** add them to App.tsx for the buttons to work.