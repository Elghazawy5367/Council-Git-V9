Based on a forensic analysis of your file structure, I have calculated the **Untracked and Unused** markdown files.

Your repository is currently carrying a significant amount of "Project Management Weight"—files created by AI (or you) to track progress, bugs, and plans, but which are **not** used by the actual application code (.tsx/.ts).

### **The Calculation Summary**

| Category | Status | File Count | Recommendation |
| :---- | :---- | :---- | :---- |
| **Root Directory Artifacts** | 🔴 **Unused / Clutter** | **33 Files** | **Move to docs/archive** |
| **Attached Assets** | 🔴 **Unused / Clutter** | **14 Files** | **Delete or Archive** |
| **docs/ Folder** | 🟡 **Reference Only** | **12 Files** | Keep for reading (Dev Manual) |
| **src/lib/knowledge-base/** | 🟢 **Active / Used** | **4 Files** | **KEEP** (App "Brain" Data) |
| **data/intelligence/** | 🟢 **Active / Used** | **4 Files** | **KEEP** (App Output Data) |
| **knowledge/** | 🟢 **Active / Used** | **1 File** | **KEEP** (App Input Data) |

### ---

**1\. The "Root Clutter" (33 Files)**

These files are sitting in the root directory. They are "Status Updates" or "Guides" that do not affect the app's functionality. They should be moved to a folder like docs/project-history to clean up your root.

1. BLUE\_OCEAN\_SCANNER.md  
2. COMMIT\_READY.md  
3. CORRECTIONS\_SUMMARY.md  
4. DEPLOYMENT.md  
5. DEPLOYMENT\_COMPLETE.md  
6. DEPLOYMENT\_INTEGRATION.md  
7. DEPLOYMENT\_STATUS.md  
8. DEPLOYMENT\_VERIFIED.md  
9. DEPLOY\_QUICK\_REF.md  
10. FEATURES\_AUTOMATION\_COMPLETE.md  
11. GITHUB\_PAGES\_FIX.md  
12. MINING\_DRILL\_GUIDE.md  
13. PHANTOM\_GUIDE.md  
14. PHANTOM\_SUMMARY.md  
15. PRE-COMMIT\_CHECKLIST.md  
16. QUALITY\_WORKFLOW\_GUIDE.md  
17. replit.md  
18. REVISION\_COMPLETE.md  
19. REVISION\_PLAN.md  
20. ROOT\_CAUSE\_FIXES\_APPLIED.md  
21. STATE\_MANAGEMENT\_PATTERNS.md  
22. STRUCTURED\_OUTPUT\_COMPARISON.md  
23. STRUCTURED\_OUTPUT\_GUIDE.md  
24. synthesis-comparison-analysis.md  
25. synthesis-engine-ruthless-audit.md  
26. WEB\_CONSOLE\_PROTECTION.md  
27. WEIGHTED\_VOTING\_GUIDE.md  
28. architecture\_analysis.md  
29. 🎨 COMPREHENSIVE UI ANALYSIS & ENHANCEMENT PLAN.md  
30. 📊 Synthesis Engine Analysis...Overview.md  
31. 🚀 GitHub Pages & Vercel Deployment Setup.md  
32. 🚨 CRITICAL RECOVERY...md  
33. 🛫GitHub Boosting The Council.md

### **2\. The "Attached Assets" (14 Files)**

The attached\_assets/ folder contains exports from chat sessions. These are static text dumps and are **not** linked to the app.

* *Examples:* Fixing\_Broken\_Dashboard...md, Mirror-Report-7...md, Refactoring\_Safety...md.

### **3\. The "Active" Files (Do Not Delete)**

These files are likely read by your knowledge-loader.ts or are the output of your "Mining Drill".

* knowledge/marketing/blue-ocean-strategy.md (Context for the AI)  
* src/lib/knowledge-base/architecture.md (Self-Knowledge for the AI)  
* src/lib/knowledge-base/features.md  
* src/lib/knowledge-base/positioning.md  
* src/lib/knowledge-base/pricing.md  
* data/intelligence/\*.md (Your daily reports)

### **Actionable Cleanup Plan**

Run this command in your terminal to instantly clean up the project structure without deleting history:

Bash

\# 1\. Create an archive folder  
mkdir \-p docs/project-history  
mkdir \-p docs/chat-exports

\# 2\. Move Root MD files (keeping README)  
mv \*.md docs/project-history/  
mv docs/project-history/README.md . \# Bring README back

\# 3\. Move Attached Assets  
mv attached\_assets/\* docs/chat-exports/  
rmdir attached\_assets

\# 4\. Git add (to track the move)  
git add .  
git commit \-m "🧹 Cleanup: Archived 47 unused documentation and asset files"  
