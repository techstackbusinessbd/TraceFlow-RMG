# Module 08: Backend Rules (Quality Control)
**Role:** Backend Developer
**Status:** Approved

## 1. Single Piece State Machine
You must strictly manage the `status` column in the `single_piece_qrs` table.
- **Initial State:** `Sewn` (Comes from Module 06 Line Out).
- **If marked Pass:** Update status to `QC_Pass`.
- **If marked Alter/Spot:** Update status to `QC_Alter`.
- **If marked Reject:** Update status to `QC_Reject`.
- **Rework Logic:** If a piece is currently `QC_Alter`, it CAN be scanned again. If the new scan is `Pass`, update the status to `QC_Pass`.

## 2. Dashboard Event Broadcasting
- Every time a QC log is created, fire a Laravel Event (e.g., `PieceInspected`).
- A Listener should calculate the current DHU for that line for the current hour.
- If DHU > 5%, dispatch a WebSocket/Pusher event to immediately turn the TV Dashboard RED without requiring a page refresh.
