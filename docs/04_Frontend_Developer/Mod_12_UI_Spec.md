# Module 12: UI/UX Specifications (Export Scanner App)
**Role:** Frontend Developer
**Status:** Approved

## 1. Loading Dock UI (High Contrast)
- **The Challenge:** Loading happens at the warehouse dock, often under bright sunlight or dim lighting, and operators need to scan hundreds of boxes quickly.
- **Solution:** 
  - The tablet UI must have a dedicated "Dark Mode / High Contrast" theme.
  - Display the `Container No` and `Destination` in massive, bold font at the top.
  - Success scans flash a brief, non-blinding green border.
  - Critical Mismatch Error (wrong buyer) turns the entire screen solid RED, flashes, and plays an aggressive siren sound. The operator must physically tap an "Acknowledge" button to dismiss the red screen.

## 2. Real-time Packing List Preview
- On the web dashboard for the Commercial Manager, the Packing List should generate in real-time as the dock operator scans cartons.
