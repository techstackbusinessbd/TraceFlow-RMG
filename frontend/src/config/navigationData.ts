export interface NavLeafItem {
  id: string;
  title: string;
  path: string;
  badge?: string;
}

export interface NavSubmoduleItem {
  id: string;
  title: string;
  children: NavLeafItem[];
}

export interface EnterpriseModule {
  id: string;
  code: string;
  title: string;        // Full name for hover tooltip
  shortTitle: string;   // Short name for horizontal menu bar
  iconName: string;
  defaultPath: string;
  standaloneItems?: NavLeafItem[];
  submodules: NavSubmoduleItem[];
}

export const ALL_SYSTEM_MODULES: EnterpriseModule[] = [
  // 1. MOD-01: System Administration & Security
  {
    id: 'system-admin',
    code: 'MOD-01',
    title: 'System Administration & Security',
    shortTitle: 'Admin',
    iconName: 'Shield',
    defaultPath: '/admin/platform-overview',
    standaloneItems: [
      { id: 'admin-dash', title: 'Dashboard', path: '/admin/platform-overview' },
    ],
    submodules: [
      {
        id: 'admin-access-control',
        title: 'Users & Access',
        children: [
          { id: 'admin-users', title: 'Users', path: '/admin/users' },
          { id: 'admin-roles', title: 'Roles & Permissions', path: '/admin/roles' },
          { id: 'admin-privileges', title: 'User Privileges', path: '/admin/privileges' },
        ],
      },
      {
        id: 'admin-devices',
        title: 'Device Management',
        children: [
          { id: 'admin-tablets', title: 'Tablets & Devices', path: '/admin/devices' },
        ],
      },
      {
        id: 'admin-security',
        title: 'Security & Logs',
        children: [
          { id: 'admin-worm', title: 'Audit Logs', path: '/admin/audit-vault' },
          { id: 'admin-purge', title: 'Archived Accounts', path: '/admin/purge-console' },
        ],
      },
    ],
  },

  // 2. MOD-02: Master Data Configurations
  {
    id: 'master-data',
    code: 'MOD-02',
    title: 'Factory & Partner Master Data',
    shortTitle: 'Master Data',
    iconName: 'Sliders',
    defaultPath: '/master-data/buyers',
    submodules: [
      {
        id: 'master-partners',
        title: 'Business Partners',
        children: [
          { id: 'master-buyers', title: 'Buyer Brands Directory', path: '/master-data/buyers' },
          { id: 'master-suppliers', title: 'Supplier & Mills Directory', path: '/master-data/suppliers' },
        ],
      },
      {
        id: 'master-plant',
        title: 'Plant Infrastructure',
        children: [
          { id: 'master-lines', title: 'Sewing Lines & Tables', path: '/master-data/lines' },
          { id: 'master-sizes', title: 'Size Ranges & Sort Order', path: '/master-data/sizes' },
          { id: 'master-defects', title: 'Defect Taxonomy & Codes', path: '/master-data/defects' },
        ],
      },
    ],
  },

  // 3. MOD-03: Order Management & BOM
  {
    id: 'orders-bom',
    code: 'MOD-03',
    title: 'Order Management & Garment BOM',
    shortTitle: 'Orders',
    iconName: 'FileSpreadsheet',
    defaultPath: '/orders',
    submodules: [
      {
        id: 'orders-po',
        title: 'Purchase Orders',
        children: [
          { id: 'orders-directory', title: 'Buyer PO Directory', path: '/orders' },
          { id: 'orders-create', title: 'Create Purchase Order', path: '/orders/create' },
        ],
      },
      {
        id: 'orders-specs',
        title: 'BOM & Milestones',
        children: [
          { id: 'orders-bom-reg', title: 'Multi-Tier Garment BOM', path: '/orders/bom-registry' },
          { id: 'orders-tna', title: 'Time & Action (T&A) Calendar', path: '/orders/tna-calendar' },
        ],
      },
    ],
  },

  // 4. MOD-04: Production Planning & PPC
  {
    id: 'planning-ppc',
    code: 'MOD-04',
    title: 'Production Planning & PPC',
    shortTitle: 'Planning',
    iconName: 'Calendar',
    defaultPath: '/planning/dashboard',
    submodules: [
      {
        id: 'ppc-core',
        title: 'Capacity Scheduling',
        children: [
          { id: 'plan-dash', title: 'PPC Master Dashboard', path: '/planning/dashboard' },
          { id: 'plan-cut-sew', title: 'Cut-Sew Pipeline Scheduler', path: '/planning/cut-sew' },
          { id: 'plan-gantt', title: 'Line Loading Gantt Chart', path: '/planning/gantt' },
          { id: 'plan-starve', title: 'Line Starvation Radar', path: '/planning/starvation-radar' },
          { id: 'plan-smv', title: 'Operation Breakdown & SMV', path: '/planning/smv-matrix' },
        ],
      },
    ],
  },

  // 5. MOD-05: CAD, Cutting & Bundling
  {
    id: 'cutting-cad',
    code: 'MOD-05',
    title: 'CAD, Cutting & Bundling',
    shortTitle: 'Cutting',
    iconName: 'Scissors',
    defaultPath: '/cutting/markers',
    submodules: [
      {
        id: 'cut-cad',
        title: 'CAD & Spreading',
        children: [
          { id: 'cut-markers', title: 'CAD Marker Optimization', path: '/cutting/markers' },
          { id: 'cut-lays', title: 'Lay Spreading & Ratio Chart', path: '/cutting/lay-sheets' },
        ],
      },
      {
        id: 'cut-bundles',
        title: 'QR Bundle Station',
        children: [
          { id: 'cut-ticket-print', title: 'Bundle Ticket QR Printing', path: '/cutting/station/bundles' },
          { id: 'cut-remnants', title: 'End-Bit Remnant Audit', path: '/cutting/end-bits' },
        ],
      },
    ],
  },

  // 6. MOD-06: Screen & Digital Printing
  {
    id: 'printing',
    code: 'MOD-06',
    title: 'Screen & Digital Printing Plant',
    shortTitle: 'Printing',
    iconName: 'Printer',
    defaultPath: '/printing/batches',
    submodules: [
      {
        id: 'print-plant-ops',
        title: 'Print Plant Execution',
        children: [
          { id: 'print-batches', title: 'Print Batch Work Orders', path: '/printing/batches' },
          { id: 'print-strike', title: 'Strike-Off Approval Log', path: '/printing/strike-offs' },
          { id: 'print-kitchen', title: 'Color Kitchen Formulations', path: '/printing/color-kitchen' },
          { id: 'print-qc', title: '100% Panel Print QC', path: '/printing/panel-qc' },
        ],
      },
    ],
  },

  // 7. MOD-07: Computerized Embroidery
  {
    id: 'embroidery',
    code: 'MOD-07',
    title: 'Computerized Embroidery Plant',
    shortTitle: 'Embroidery',
    iconName: 'Sparkles',
    defaultPath: '/embroidery/orders',
    submodules: [
      {
        id: 'emb-plant-ops',
        title: 'Embroidery Execution',
        children: [
          { id: 'emb-orders', title: 'Embroidery Work Orders', path: '/embroidery/orders' },
          { id: 'emb-machines', title: 'Multi-Head Machine Fleet', path: '/embroidery/machines' },
          { id: 'emb-designs', title: 'DST/EMB Design Library', path: '/embroidery/designs' },
          { id: 'emb-qc', title: 'Needle-Cut Panel QC', path: '/embroidery/panel-qc' },
        ],
      },
    ],
  },

  // 8. MOD-08: Subcontract Operations
  {
    id: 'subcontract',
    code: 'MOD-08',
    title: 'Subcontract Operations & Gate',
    shortTitle: 'Subcontract',
    iconName: 'Truck',
    defaultPath: '/subcontract/challans',
    submodules: [
      {
        id: 'sub-movement',
        title: 'VAT & Gate Movement',
        children: [
          { id: 'sub-challans', title: 'Mushak 6.3 Challan Hub', path: '/subcontract/challans' },
          { id: 'sub-gatepasses', title: 'Returnable Gate Passes', path: '/subcontract/gate-passes' },
          { id: 'sub-vendors', title: 'Approved Vendor Directory', path: '/subcontract/vendors' },
          { id: 'sub-debits', title: 'Reconciliation & Debit Notes', path: '/subcontract/debit-notes' },
        ],
      },
    ],
  },

  // 9. MOD-09: Sewing Floor Tracking
  {
    id: 'sewing',
    code: 'MOD-09',
    title: 'Sewing Floor Tracking & Andon',
    shortTitle: 'Sewing',
    iconName: 'Activity',
    defaultPath: '/sewing/station/line-in',
    submodules: [
      {
        id: 'sew-stations',
        title: 'Line Tracking Stations',
        children: [
          { id: 'sew-in', title: 'Line-In Feeding Station', path: '/sewing/station/line-in' },
          { id: 'sew-out', title: 'Line-Out Output Station', path: '/sewing/station/line-out' },
          { id: 'sew-andon', title: 'Live Sewing Andon TV', path: '/sewing/andon-display' },
          { id: 'sew-wip', title: 'In-Line WIP Bottleneck Radar', path: '/sewing/wip-radar' },
        ],
      },
    ],
  },

  // 10. MOD-10: Quality Control & AQL
  {
    id: 'quality-aql',
    code: 'MOD-10',
    title: 'Quality Control, AQL & DHU',
    shortTitle: 'Quality',
    iconName: 'CheckCheck',
    defaultPath: '/qc/dhu-board',
    submodules: [
      {
        id: 'qc-floor',
        title: 'Floor Quality & Alter',
        children: [
          { id: 'qc-dhu', title: 'DHU Traffic Light Board', path: '/qc/dhu-board' },
          { id: 'qc-endline', title: '100% End-Line QC Station', path: '/qc/station/end-line' },
          { id: 'qc-rework', title: 'Closed-Loop Alter Routing', path: '/qc/alter-routing' },
          { id: 'qc-aql', title: 'ISO 2859-1 AQL Audits', path: '/qc/aql-audits' },
          { id: 'qc-pareto', title: 'Defect Pareto Analytics', path: '/qc/pareto' },
        ],
      },
    ],
  },

  // 11. MOD-11: Industrial Washing Plant
  {
    id: 'washing',
    code: 'MOD-11',
    title: 'Industrial Washing Plant',
    shortTitle: 'Washing',
    iconName: 'Droplet',
    defaultPath: '/washing/batches',
    submodules: [
      {
        id: 'wash-ops',
        title: 'Wet & Dry Processing',
        children: [
          { id: 'wash-batches', title: 'Wash Batch Operations', path: '/washing/batches' },
          { id: 'wash-recipes', title: 'Chemical Recipes (M:L 1:8)', path: '/washing/recipes' },
          { id: 'wash-dryers', title: 'Hydro & Tumbler Logs', path: '/washing/dryers' },
          { id: 'wash-qc', title: 'Post-Wash 100% Garment QC', path: '/washing/post-wash-qc' },
        ],
      },
    ],
  },

  // 12. MOD-12: Finishing & Metal Detection
  {
    id: 'finishing',
    code: 'MOD-12',
    title: 'Finishing & Metal Detection',
    shortTitle: 'Finishing',
    iconName: 'CheckSquare',
    defaultPath: '/finishing/station/metal',
    submodules: [
      {
        id: 'fin-safety',
        title: 'Safety & Quality Checks',
        children: [
          { id: 'fin-metal', title: 'Conveyor Metal Detector', path: '/finishing/station/metal' },
          { id: 'fin-needles', title: 'Broken Needle Log Vault', path: '/finishing/broken-needles' },
          { id: 'fin-pull', title: '90N Button Pull Test Log', path: '/finishing/pull-tests' },
          { id: 'fin-pom', title: 'Digital POM Measurements', path: '/finishing/pom-audit' },
        ],
      },
    ],
  },

  // 13. MOD-13: Carton Packing & PSI
  {
    id: 'packing-psi',
    code: 'MOD-13',
    title: 'Carton Packing, SSCC & PSI',
    shortTitle: 'Packing',
    iconName: 'Package',
    defaultPath: '/packing/station/carton-pack',
    submodules: [
      {
        id: 'pack-dispatch',
        title: 'Cartoning & Shipping',
        children: [
          { id: 'pack-station', title: 'Carton Packing Station', path: '/packing/station/carton-pack' },
          { id: 'pack-sscc', title: 'GS1 SSCC-18 Carton Barcodes', path: '/packing/cartons' },
          { id: 'pack-scale', title: 'Digital Scale Weight Verify', path: '/packing/scale-verify' },
          { id: 'pack-psi', title: 'Buyer Pre-Shipment Inspection', path: '/packing/psi-inspections' },
          { id: 'pack-container', title: 'Container Stuffing Manifest', path: '/packing/container-stuffing' },
        ],
      },
    ],
  },

  // 14. MOD-14: Warehouse & Material Logistics
  {
    id: 'warehouse',
    code: 'MOD-14',
    title: 'Fabric & Trims Warehouse Hub',
    shortTitle: 'Warehouse',
    iconName: 'Layers',
    defaultPath: '/warehouse/dashboard',
    submodules: [
      {
        id: 'wh-fabric',
        title: 'Fabric Receiving (MRR)',
        children: [
          { id: 'wh-dash', title: 'Warehouse Intelligence', path: '/warehouse/dashboard' },
          { id: 'wh-mrr', title: 'Material Receiving Reports', path: '/warehouse/mrr' },
          { id: 'wh-rolls', title: 'Fabric Roll QR Registry', path: '/warehouse/fabric-rolls' },
          { id: 'wh-4pt', title: 'ASTM 4-Point Inspection', path: '/warehouse/inspection-4pt' },
          { id: 'wh-relax', title: 'Relaxation Chamber Matrix', path: '/warehouse/relaxation-chamber' },
        ],
      },
      {
        id: 'wh-trims',
        title: 'Trims Inventory',
        children: [
          { id: 'wh-inventory', title: 'Trims Stock Ledger', path: '/warehouse/trims-inventory' },
          { id: 'wh-putaway', title: '2-Step Bin Putaway', path: '/warehouse/putaway' },
        ],
      },
    ],
  },

  // 15. MOD-15: Commercial Export & Logistics
  {
    id: 'commercial',
    code: 'MOD-15',
    title: 'Commercial Export & BI Analytics',
    shortTitle: 'Commercial',
    iconName: 'TrendingUp',
    defaultPath: '/commercial/dashboard',
    submodules: [
      {
        id: 'comm-docs',
        title: 'Export Documentation',
        children: [
          { id: 'comm-dash', title: 'Export Shipment Ledger', path: '/commercial/dashboard' },
          { id: 'comm-ci', title: 'Commercial Invoice (CI)', path: '/commercial/invoices' },
          { id: 'comm-pl', title: 'Master Packing List (PL)', path: '/commercial/packing-lists' },
          { id: 'comm-bl', title: 'Bill of Lading (B/L)', path: '/commercial/bill-of-lading' },
        ],
      },
      {
        id: 'comm-bi',
        title: 'Executive BI Analytics',
        children: [
          { id: 'comm-csuite', title: 'C-Suite Strategy Board', path: '/commercial/bi/dashboard' },
          { id: 'comm-cost', title: 'Cost Variance Analytics', path: '/commercial/cost-variance' },
          { id: 'comm-otd', title: 'On-Time Delivery (OTD %)', path: '/commercial/otd-analytics' },
        ],
      },
    ],
  },
];
