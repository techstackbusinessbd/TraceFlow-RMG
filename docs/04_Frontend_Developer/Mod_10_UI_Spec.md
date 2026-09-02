# Module 10: UI/UX Specifications (Packing App)
**Role:** Frontend Developer
**Status:** Approved

## 1. Packing Progress UI (Visual Feedback)
- **The Challenge:** The operator needs to know exactly how many pieces are left to fill the box without constantly looking closely at the screen.
- **Solution:** 
  - Display a massive circular or linear **Progress Bar** in the center of the screen (e.g., `15 / 20`).
  - As each piece is scanned, the bar fills up.
  - When the bar hits 100% (20/20), the screen flashes Green, plays a "Tada" success sound, and automatically triggers the browser's print dialog to print the Master Carton QR sticker.

## 2. Invalid Scan Alert
- If the backend returns a 422 Mismatch Error (wrong color/size), the screen must turn bright Red, and play a loud, distinct "Buzzer" sound to stop the operator from dropping the wrong piece into the box.
