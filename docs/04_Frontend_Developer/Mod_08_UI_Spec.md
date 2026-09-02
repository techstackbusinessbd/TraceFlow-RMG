# Module 08: UI/UX Specifications (QC Tablet App)
**Role:** Frontend Developer
**Status:** Approved

## 1. The Visual Body Map (Grid)
- **The Challenge:** Inspectors need to log *where* the defect is very quickly. Dropdowns are too slow.
- **Solution:** 
  - The tablet UI must display a vector image (SVG) of a generic T-shirt or Pant (based on the PO type).
  - The SVG is divided into clickable zones (Left Sleeve, Right Sleeve, Front Body, Back Body, Collar, Hem).
  - When the inspector taps "Alter", the Body Map pops up. They tap the exact zone (e.g., Left Sleeve), which highlights in Red, and then they tap the defect type from a quick-list (e.g., "Hole").

## 2. Rapid "Pass" Flow
- 90% of garments will pass. 
- The UI MUST be optimized for this: Scanning a QR code should immediately log it as `Pass` without requiring any extra button clicks, *unless* the user toggles a "Defect Mode" button first.
- Success beep (high pitch) for Pass. Error beep (low buzz) if it's already scanned.
