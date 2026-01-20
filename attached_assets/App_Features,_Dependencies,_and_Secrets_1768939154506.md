Based on a deep forensic audit of your codebase, I have mapped your entire application's "Nervous System." Below is the breakdown of your features, their dependencies (GitHub, Reddit, AI), and the specific credentials required to make them alive.

### **🚨 Critical Alert: The "Ghost" Components**

Before we analyze the features, you must know that the following core files are currently **EMPTY (0 bytes)**. This is why your workflows are failing:

1. **The Sonar Script:** scripts/scan-blue-ocean.ts  
2. **The Vault:** src/features/council/lib/vault.ts  
3. **The Workflows:** .github/workflows/daily-scout.yml, reddit-radar.yml, viral-radar.yml

### ---

**1\. The GitHub Engine (The Mining Drill)**

This system digs into repositories to find "Pain Points" (User issues) and "Gold" (Code patterns).

* **Primary Tool:** **The Mining Drill** (src/lib/mining-drill.ts)  
* **Secondary Tool:** **Fork Evolution** (src/lib/fork-evolution.ts)  
* **Required Credential:**  
  * GITHUB\_TOKEN: This is automatically provided by GitHub Actions (free). You do **not** need a personal access token unless you are scanning private repos outside your control.  
* **How it works:** It uses the Octokit library to fetch Issues, Pull Requests, and Comments. It looks for keywords like "bug," "slow," "broken," and "feature request."

### **2\. The Reddit Engine (The Sniper)**

This system monitors social conversations to find "Buying Intent" (people asking for solutions).

* **Primary Tool:** **The Sniper** (src/lib/reddit-sniper.ts)  
* **Underlying API:** src/features/automation/lib/api/reddit-client.ts  
* **Required Credentials:**  
  * REDDIT\_CLIENT\_ID  
  * REDDIT\_CLIENT\_SECRET  
  * REDDIT\_USERNAME  
  * REDDIT\_PASSWORD  
* **How it works:** It connects to the Reddit API (likely via snoowrap or direct fetch). It scans specific subreddits (defined in your config) for keywords like "how to," "recommend," "alternative to."  
* **Current Status:** The code exists, but the workflow to run it is empty.

### **3\. The Intelligence Engine (OpenRouter / LLM)**

This is the "Brain" that reads the data from GitHub and Reddit and synthesizes it into reports.

* **Primary Tool:** **The Council** (Synthesis Engine)  
* **Client File:** src/features/council/api/ai-client.ts  
* **Required Credential:**  
  * OPENROUTER\_API\_KEY: The single master key for all AI models.  
* **Model Selector:**  
  * Your code uses a configuration likely named MAGNIFICENT\_7\_FLEET (imported in ai-client.ts).  
  * **How to Select Models:** Currently, the model seems to be defined in code. To add a "Model Selector" in the UI, you would need to expose this MAGNIFICENT\_7\_FLEET constant to a dropdown in the ControlPanel.tsx or SettingsModal.tsx and pass the selected string to the ai-client.

### ---

**Summary of Required "Secrets"**

To make your app 100% functional, your **GitHub Repository Secrets** (Settings \-\> Secrets \-\> Actions) must contain:

| Secret Name | Required By | Status |
| :---- | :---- | :---- |
| OPENROUTER\_API\_KEY | **AI Client** (The Brain) | 🟢 Critical |
| REDDIT\_CLIENT\_ID | **The Sniper** | 🟠 High |
| REDDIT\_CLIENT\_SECRET | **The Sniper** | 🟠 High |
| REDDIT\_USERNAME | **The Sniper** | 🟠 High |
| REDDIT\_PASSWORD | **The Sniper** | 🟠 High |
| SERPER\_API\_KEY | **The Sonar** (Google Search) | 🟡 Medium |
| GITHUB\_TOKEN | **The Mining Drill** | ✅ Built-in (No action needed) |

### **Action Plan**

1. **Fill the Empty Files:** You must regenerate the code for scan-blue-ocean.ts and vault.ts.  
2. **Populate Workflows:** Copy the YAML code I provided in the previous turn into the empty .github/workflows/ files.  
3. **Add Secrets:** Go to GitHub and add the Reddit and OpenRouter keys.