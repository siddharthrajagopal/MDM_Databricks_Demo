# Product Requirement Document (PRD)

## Project Title: "Harmonizing the Foundation" Interactive Pitch App
**Document Version:** 2.0 (Multi-Domain Update)  
**Target Audience:** Cement Manufacturing Executives (C-Suite, VP of Supply Chain, VP of Reliability, Procurement Directors) & Enterprise Data Architects  

---

## 1. Product Overview & Vision

### 1.1 Objective
To build an interactive, high-fidelity web-based pitch presentation that demonstrates the strategic coexistence of Master Data Management (MDM) and Databricks. The application must visually articulate how combining these platforms solves systemic cross-regional fragmentation across three foundational domains: Materials/MRO Spares, Heavy Capital Assets, and Global Vendor Procurement.

### 1.2 Core Value Proposition
* **For Business Leaders:** Proves how data harmonization reduces duplicate working capital, eliminates catastrophic unplanned plant downtime, and recovers procurement pricing power.
* **For Technical Leaders:** Validates Databricks as the premier analytical and machine learning engine while offloading the heavy compliance, lineage, and manual data-stewardship workflows to a dedicated MDM platform.

---

## 2. Technical Stack & Design System

### 2.1 Technology Stack
* **Framework:** React.js (Vite template for fast rendering and local development)
* **Styling:** Tailwind CSS (utility-first, responsive grid systems)
* **Icons:** `lucide-react`
* **Animation Engine:** Framer Motion (for smooth slide transitions and step-by-step pipeline animations)

### 2.2 Design System (Industrial Modern)
The interface features an industrial, manufacturing-forward aesthetic balanced with high-contrast, scannable enterprise typography.

| Element | Specification | Tailwind Class |
| :--- | :--- | :--- |
| **Primary Background** | Dark Industrial Slate | `bg-slate-900` / `#0f172a` |
| **Card Background** | Charcoal Gray | `bg-slate-800` / `#1e293b` |
| **Accent 1 (Tech/Engine)** | Safety Orange | `text-orange-500` / `#f97316` |
| **Accent 2 (Business/Rule)**| Clean Lifecycle Teal | `text-teal-400` / `#2dd4bf` |
| **Typography** | Sans-serif, High Contrast | `font-sans antialiased` |

---

## 3. Detailed Component & Feature Specifications

### Slide 1: The Title & Hook (`TitleSlide`)
* **Functional Requirements:** 
  * Displays a striking, clean hero screen setting up the presentation.
  * Features a subtle, looping CSS background animation mimicking raw, jagged industrial blocks entering a geometric funnel and emerging as uniform data streams.
* **Interactive Elements:** 
  * A primary call-to-action (CTA) button: `Start Narrative Journey`.

---

### Slide 2: The Multi-Domain Problem Simulator (`ExpandedSimulator`)
* **Functional Requirements:**
  * Allows the user to toggle through three distinct real-world heavy manufacturing data crises using a top navigation bar.
  * Displays a side-by-side comparison of **Region A (US Plant)** and **Region B (EU Plant)** to illustrate system blindness.
* **State Engine Logic:**
  * `activeDomain: 'mro' | 'assets' | 'vendors'`
  * `simulationStatus: 'idle' | 'searching' | 'completed'`

#### Dynamic Scenario Sub-Components:

*   **Scenario A: MRO Spares & Materials (The Ghost Inventory)**
    *   *Region A Text:* `Part: BRG-6205-X | Stock: 0` (Flashes Red border on complete)
    *   *Region B Text:* `Part: Roller-Bearing-6205 | Stock: 3` (Flashes Green border on complete)
    *   *Global Impact Banner:* `Alert: System blind spot. Procurement ordered a duplicate part from the vendor with an 8-week lead time. Hidden Capital Trapped: $15,000 + avoidable downtime.`
*   **Scenario B: Capital Assets & Lifecycles (The Blind Kiln)**
    *   *Region A Text:* `Telemetry ID: K-101-Drive | Status: High Temp Spike` 
    *   *Region B Text:* `SAP Ledger ID: EQUIP-9908 | Status: Last Maintenance Unknown`
    *   *Global Impact Banner:* `Alert: Unanchored IoT Data. Databricks cannot tie real-time sensor streams to financial repair logs. Result: Sudden rotary kiln shell cracking during peak production week. Lost Revenue: $450,000.`
*   **Scenario C: Global Procurement (The Segmented Vendor)**
    *   *Region A Text:* `Vendor Name: FLSmidth Inc. | Spend Tier: Base Rate`
    *   *Region B Text:* `Vendor Name: FLS-Group GmbH | Spend Tier: Preferred Rate`
    *   *Global Impact Banner:* `Alert: Spend Leakage. Corporate sourcing is blind to unified global purchasing volume. Result: Lost contract negotiation leverage. Realized Loss: 8% premium paid on a $2M equipment upgrade contract.`

---

### Slide 3: The Capabilities Debate (`DebateView`)
* **Functional Requirements:**
  * Directly addresses the pushback: *"Can't we just write code in Databricks to clean this up?"*
* **Component Layout:** Two equal-width columns.
  * **Left Column (The Technical Debt Engine):** A stylized scrolling code terminal window running a fictional, highly complex 800-line PySpark string-manipulation and fuzzy-matching regex script.
  * **Right Column (The Business Ownership Deficit):** A clean vertical timeline showing the systemic business questions code cannot resolve:
    1. *Who formally signs off when fuzzy-matching links two different parts?*
    2. *What happens when a supplier unilaterally alters their catalog naming convention?*
    3. *How do we push this unified data back into regional ERPs so procurement can actually use it?*

---

### Slide 4: The Analogy Interface (`AnalogyCard`)
* **Functional Requirements:**
  * Uses a high-impact conceptual comparison to clearly define software roles.
* **Component Layout:** Two large, interactive cards using hover transformations.

Slide 4: The Analogy Interface (AnalogyCard)
Functional Requirements:

Uses a high-impact conceptual comparison to clearly define software roles.

Component Layout: Two large, interactive cards using hover transformations.

+------------------------------------+  +------------------------------------+
|       THE GLOBAL DICTIONARY        |  |        THE POWERFUL MEGAPHONE      |
|               (MDM)                |  |            (DATABRICKS)            |
|                                    |  |                                    |
| * Establishes the Golden Record    |  | * Ingests millions of rows/sec     |
| * Designed for human data stewards |  | * Drives AI & predictive modeling  |
| * Syndicates data back to ERPs     |  | * Requires clean raw ingredients   |
+------------------------------------+  +------------------------------------+
Slide 5: The Coexistence Pipeline (InteractivePipeline)
Functional Requirements:

An interactive visual data map displaying how data cycles between the platforms.

State Engine Logic:

activeStep: 1 | 2 | 3 | 4

The 4-Step Animated Build:

Ingest (Bronze Layer): Messy, unharmonized ERP records from all global locations stream into Databricks.

Flag & Route: Databricks identifies duplicates, variations, and missing units of measure, passing anomalies directly to the MDM hub.

Govern & Master: Plant managers and data stewards use a visual MDM portal to resolve naming conflicts, creating an immutable "Golden Record."

Syndicate & Power (Gold Layer): The clean "Golden Record" maps directly back into Databricks (Gold layer) for predictive modeling, while simultaneously syncing back to local SAP/Maximo instances.

Slide 6: The Executive Dashboard Value (RoiDashboard)
Functional Requirements:

Concludes the presentation with a concise summary grid of concrete wins for both halves of the room.

Layout Structure:

Tech Team Wins Column: Eliminates brittle data-janitor script maintenance; tracks out-of-the-box data ancestry via the golden pipeline; frees engineers to build advanced predictive maintenance models.

Business Team Wins Column: Global BOMs built in minutes; massive reduction in safety-stock storage overhead; complete spend transparency across all corporate suppliers.