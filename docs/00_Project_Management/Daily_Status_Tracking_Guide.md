# Daily Status Tracking & Monitoring Guide
**Role:** Project Manager / Tech Lead
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
To successfully deliver the 12 modules of the RMG Traceability Software across 5 Sprints, we must maintain strict visibility over the **"Last Working Status"** of every developer. This guide establishes the daily routines for tracking progress, identifying blockers, and updating task boards.

---

## 2. Daily Scrum / Stand-up Meeting
**Time:** 10:00 AM (Sharp)
**Duration:** 15 Minutes Max
**Format:** All developers, QA, and the Tech Lead must attend (Virtual or In-person).

Each team member MUST answer these 3 questions:
1. **Yesterday:** What task did I complete yesterday? *(Provide the specific Jira/Trello ticket number)*.
2. **Today:** What is my goal for today?
3. **Blockers:** Am I stuck on anything? *(e.g., "I need clarification on the Module 06 Single Piece payload from the Solution Architect").*

---

## 3. Kanban / Jira Board Rules (Live Status Tracking)
The project management board is the single source of truth for the project's status. Developers MUST keep their tickets updated in real-time.

### Column Workflow:
- **`To Do`**: Tasks assigned for the current Sprint but not yet started.
- **`In Progress`**: The developer is actively writing code for this. *(Rule: A developer can only have ONE ticket in 'In Progress' at a time).*
- **`Code Review`**: The developer has opened a GitHub Pull Request (PR) and is waiting for the Tech Lead to review it.
- **`QA Testing`**: The code is merged to `develop` and QA is currently testing it.
- **`Done`**: Passed QA and ready for production.

---

## 4. End of Day (EOD) Reporting
At the end of every workday (e.g., 6:00 PM), each developer must post a short status update in the team's Slack/Discord/WhatsApp group.

**EOD Template:**
```text
Date: 28-Aug-2026
Name: [Developer Name]
Completed Today: 
- Finished API for QC Defect Scan (Ticket: RMG-102)
- Fixed N+1 query issue in Carton packing.

Last Working Status (Pending): 
- Working on the WebSocket event trigger for DHU alert.

GitHub Branch: feature/qc-defect-scan
Blockers: None.
```

---

## 5. Sprint Monitoring (For Project Manager)
- **Burndown Chart:** The PM must check the sprint burndown chart daily. If the line is flat (no tasks moving to `Done`), the PM must intervene.
- **Stalled Tasks:** If a task remains in `In Progress` for more than 2 days without a valid reason, the PM must schedule a quick sync with the developer and the Tech Lead to resolve the bottleneck.

---
*(End of Tracking Guide)*
