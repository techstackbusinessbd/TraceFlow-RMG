# Module 09: UI/UX Specifications (Wash Scanner App)
**Role:** Frontend Developer
**Status:** Approved

## 1. High-Speed Scanner UI
- **The Challenge:** Operators will scan thousands of pieces continuously. The UI cannot freeze, and network delays shouldn't slow them down.
- **Solution:** 
  - Use React state to hold the array of scanned UUIDs locally.
  - The UI only pushes to the Backend API when the operator explicitly clicks "Submit Batch".
  - **Duplicate Prevention:** Before adding a scanned UUID to the local array, check if it already exists. If yes, play a loud `Error Beep` and flash the screen red. 
  - **Counter:** Display a massive, highly visible counter (e.g., `Scanned: 1,452`) so the operator knows their progress.

## 2. Reject Toggle (Receive Flow)
- By default, scanning a piece during receive marks it as `Good`.
- Provide a physical-looking "Defect Mode" toggle button. When turned on, the screen background changes to a dark red warning color. Any piece scanned in this mode is marked as `is_rejected: true`.
