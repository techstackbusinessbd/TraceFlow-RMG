# Module 05: UI/UX Specifications (Cutting)
**Role:** Frontend Developer
**Status:** Approved

## 1. QR Code Sticker Printable View
- **The Challenge:** QR codes must fit exactly on a Thermal Barcode Printer sticker (e.g., Zebra printers, usually 2x1 inches).
- **Solution:** 
  - Create a dedicated React route: `/cutting/print/{cut_register_id}`.
  - Hide all sidebars, headers, and navigation menus using CSS `@media print { .no-print { display: none; } }`.
  - Use a library like `qrcode.react` to render the `bundles.id` UUID as a QR image.
  - Layout: Flexbox grid. Each sticker `div` must have strict `width` and `height` matching physical sticker dimensions (e.g., `width: 50mm; height: 25mm`).
  - Below the QR code, print human-readable metadata: "PO: 1234, Size: M, Bundle: 12".

## 2. Generate Bundles Loader
- Generating thousands of bundles takes 2-4 seconds.
- The UI MUST show a non-dismissible full-screen overlay loader: "Generating Bundles... Please do not close this window."
