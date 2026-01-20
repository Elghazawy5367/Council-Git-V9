Based on your audit request, you are absolutely correct. Your app suffers from **"Interface Drift"**—where the same underlying tool has two different names depending on where you look (Dashboard vs. Dropdown). This increases cognitive load and makes the app feel "heavy."

Here is the investigation of the redundancies and a streamlined plan to add the missing "Strategy Document" features without over-engineering.

### **Part 1: The Redundancy Investigation**

The Diagnosis:  
You have a "Command Center" (Features Dashboard) and a "Status Board" (Main Dashboard) that are fighting for attention.

| Feature / Action | Name in Dashboard | Name in Dropdown / Feed | Verdict |
| :---- | :---- | :---- | :---- |
| **Viewing Reports** | LATEST RESULTS | INTELLIGENCE FEED | 🛑 **DUPLICATE** (Merge to "Daily Intelligence") |
| **Market Scan** | Blue Ocean Scanner | The Sonar | 🛑 **CONFUSING** (Pick "The Sonar") |
| **Pain Finding** | Pain Hunter | The Mining Drill | 🛑 **CONFUSING** (Pick "The Mining Drill") |
| **Reddit Search** | Intent Scout | Reddit Sniper | 🛑 **CONFUSING** (Pick "The Sniper") |

The Fix:  
You do not need a "Features Dropdown" and a "Features Dashboard" if they just do the same thing.

* **Action:** Convert the **Features Dropdown** into a simple "Jump To" menu that anchors you to the specific card on the **Features Dashboard**. Do not let the dropdown run actions directly.  
* **Action:** Rename all instances to the "Brand Names" from your strategy doc: **The Sonar, The Drill, The Sniper**.

### ---

**Part 2: Missing "Strategy Doc" Features (Integration Plan)**

Your "GitHub Boosting" strategy lists powerful exploits that are currently missing from the UI. We will add them **where they fit** into existing dashboards, rather than creating new pages.

#### **1\. The Competitor Spy (Missing)**

* **What it is:** *Release Decoder, PR Sentiment, CI/CD Spy, Sponsor Pricing.*  
* **Where it fits:** Don't make a new page. Add a new Card to the **Features Dashboard** titled **"The Spyglass"**.  
* **Action:** It takes a Repo URL and runs all 4 checks at once, returning a single "Competitor Profile" card.

#### **2\. The Debt Meter (Missing)**

* **What it is:** *Code quality scanner, TODO counter, Complexity check.*  
* **Where it fits:** You already have a QualityDashboard.tsx. It belongs there.  
* **Action:** Add a "Project Health" gauge at the top of the **Quality Dashboard**.

#### **3\. Stargazer Analysis (Missing)**

* **What it is:** *Finding influencers/leads from GitHub stars.*  
* **Where it fits:** This is a filter for "The Sonar."  
* **Action:** Add a toggle inside the **Sonar Card** (Features Dashboard) called "Analyze Stargazers". Do not make it a separate tool.

### ---

**Part 3: The Execution Plan (Step-by-Step)**

Use these prompts with Project IDX to clean up the mess and add the power.

#### **Step A: Unify the Naming (The Cleanup)**

"Refactor src/features/automation/constants/feature-definitions.ts. Ensure all features use their 'Strategy Names': 'The Sonar', 'The Mining Drill', 'The Sniper'. Update FeaturesDashboard.tsx and Dashboard.tsx to use these exact names and labels. Remove 'Latest Results' button and replace it with a direct link to the 'Daily Intelligence' report view."

#### **Step B: Implement "The Spyglass" (New Feature)**

"I need to implement the 'Competitor Spy' from my strategy. Update src/features/automation/components/FeaturesDashboard.tsx.

1. Add a new Card titled **'The Spyglass'**.  
2. It should have one input: Target Repo URL.  
3. It should have one button: Infiltrate.  
4. When clicked, it should mock-run the following (we will connect logic later): 'Decoding Releases', 'Scanning CI/CD', 'Analyzing PR Sentiment', 'Checking Sponsor Pricing'.  
5. Display the results in a simple 2x2 grid inside the card."

#### **Step C: Implement "The Debt Meter" (New Feature)**

"Update src/pages/QualityDashboard.tsx. Add a **'Debt Meter'** section at the very top. It should display:

1. **Health Score:** (e.g., 85/100).  
2. **Rot Count:** (Number of TODOs/FIXMEs).  
3. **Complexity Risk:** (Number of large files).  
4. Keep it visual and simple using the existing MetricCard component."

### **Summary of the Result**

1. **Redundancy:** Gone. You now have **"The Sonar"** everywhere.  
2. **Navigation:** Simplified. Dropdown jumps to Dashboard; Dashboard runs the tool.  
3. **New Power:** You gain **Competitor Spying** and **Health Monitoring** without adding a single new page to your app.