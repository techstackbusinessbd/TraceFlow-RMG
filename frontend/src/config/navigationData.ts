export interface NavLeafItem {
  id: string;
  title: string;
  path: string;
  badge?: string;
}

export interface NavGroupItem {
  id: string;
  title: string;
  children: NavLeafItem[];
}

export interface MainModuleItem {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  iconName: string;
  defaultPath: string;
  submodules: NavGroupItem[];
}

export const MAIN_MODULES_CONFIG: MainModuleItem[] = [
  {
    id: 'admin',
    code: 'MOD-01',
    title: 'System Admin & Auth',
    shortTitle: 'Admin',
    iconName: 'Shield',
    defaultPath: '/admin/platform-overview',
    submodules: [
      {
        id: 'admin-platform',
        title: 'Platform Management',
        children: [
          { id: 'admin-dash', title: 'Platform Command Center', path: '/admin/platform-overview' },
          { id: 'admin-users', title: 'Users & Roles Management', path: '/admin/users' },
          { id: 'admin-devices', title: 'Tablet Fleet & Hardware', path: '/admin/devices' },
        ],
      },
      {
        id: 'admin-audit',
        title: 'Security & Governance',
        children: [
          { id: 'admin-worm', title: 'WORM Immutable Audit Vault', path: '/admin/audit-vault' },
          { id: 'admin-purge', title: 'Two-Tier Purge Console', path: '/admin/purge-console' },
        ],
      },
    ],
  },
  {
    id: 'master-data',
    code: 'MOD-02',
    title: 'Master Data Management',
    shortTitle: 'Master Data',
    iconName: 'Database',
    defaultPath: '/master-data/buyers',
    submodules: [
      {
        id: 'master-partners',
        title: 'Business Partners',
        children: [
          { id: 'master-buyers', title: 'Buyers & Brands', path: '/master-data/buyers' },
          { id: 'master-suppliers', title: 'Suppliers & Mills', path: '/master-data/suppliers' },
        ],
      },
      {
        id: 'master-plant',
        title: 'Factory Library',
        children: [
          { id: 'master-lines', title: 'Sewing Lines & Tables', path: '/master-data/lines' },
          { id: 'master-sizes', title: 'Size Range & Sort Order', path: '/master-data/sizes' },
          { id: 'master-defects', title: 'Defect Taxonomy & Codes', path: '/master-data/defects' },
        ],
      },
    ],
  },
  {
    id: 'orders',
    code: 'MOD-03',
    title: 'Order Management & Merchandising',
    shortTitle: 'Orders',
    iconName: 'ShoppingBag',
    defaultPath: '/orders',
    submodules: [
      {
        id: 'orders-commercial',
        title: 'Purchase Orders',
        children: [
          { id: 'orders-all', title: 'Commercial PO Header List', path: '/orders' },
          { id: 'orders-create', title: 'Create Commercial Order', path: '/orders/create' },
        ],
      },
      {
        id: 'orders-specs',
        title: 'BOM & T&A Tracking',
        children: [
          { id: 'orders-bom', title: 'Multi-Tier Garment BOM', path: '/orders/bom-registry' },
          { id: 'orders-tna', title: 'Time & Action (T&A) Calendar', path: '/orders/tna-calendar' },
        ],
      },
    ],
  },
  {
    id: 'planning',
    code: 'MOD-04',
    title: 'Production Planning & IE',
    shortTitle: 'Planning',
    iconName: 'CalendarRange',
    defaultPath: '/planning/dashboard',
    submodules: [
      {
        id: 'planning-core',
        title: 'Capacity & Scheduling',
        children: [
          { id: 'plan-dash', title: 'PPC Master Dashboard', path: '/planning/dashboard' },
          { id: 'plan-cut-sew', title: 'Unified Cut-Sew Pipeline', path: '/planning/cut-sew' },
          { id: 'plan-gantt', title: 'Line Loading Gantt Chart', path: '/planning/gantt' },
        ],
      },
      {
        id: 'planning-radar',
        title: 'IE & Line Balancing',
        children: [
          { id: 'plan-starve', title: 'Line Starvation Radar', path: '/planning/starvation-radar' },
          { id: 'plan-smv', title: 'Operation Breakdown & SMV', path: '/planning/smv-matrix' },
        ],
      },
    ],
  },
  {
    id: 'cutting',
    code: 'MOD-05',
    title: 'Pre-Cut CAD, Marker & QR Bundling',
    shortTitle: 'Cutting',
    iconName: 'Scissors',
    defaultPath: '/cutting/station/bundles',
    submodules: [
      {
        id: 'cut-markers',
        title: 'CAD & Lay Planning',
        children: [
          { id: 'cut-cad', title: 'CAD Marker Optimization', path: '/cutting/markers' },
          { id: 'cut-lay', title: 'Lay Spreading & Ratio Chart', path: '/cutting/lay-sheets' },
        ],
      },
      {
        id: 'cut-station',
        title: 'Floor Data Capture',
        children: [
          { id: 'cut-qr-print', title: 'Dual-Tier QR Generation', path: '/cutting/station/bundles' },
          { id: 'cut-remnant', title: 'End-Bit Remnant Audit', path: '/cutting/end-bits' },
        ],
      },
    ],
  },
  {
    id: 'printing',
    code: 'MOD-06',
    title: 'Screen & Digital Printing Engine',
    shortTitle: 'Printing',
    iconName: 'Palette',
    defaultPath: '/printing/batches',
    submodules: [
      {
        id: 'print-batches',
        title: 'Print Floor Operations',
        children: [
          { id: 'print-orders', title: 'Print Batch Orders', path: '/printing/batches' },
          { id: 'print-strike', title: 'Strike-Off Approval Log', path: '/printing/strike-offs' },
        ],
      },
      {
        id: 'print-quality',
        title: 'Ink & Quality Control',
        children: [
          { id: 'print-recipe', title: 'Color Kitchen Formulations', path: '/printing/color-kitchen' },
          { id: 'print-qc', title: '100% Panel Print QC', path: '/printing/panel-qc' },
        ],
      },
    ],
  },
  {
    id: 'embroidery',
    code: 'MOD-07',
    title: 'Computerized Embroidery Engine',
    shortTitle: 'Embroidery',
    iconName: 'Sparkles',
    defaultPath: '/embroidery/orders',
    submodules: [
      {
        id: 'emb-machines',
        title: 'Embroidery Production',
        children: [
          { id: 'emb-workorders', title: 'Embroidery Work Orders', path: '/embroidery/orders' },
          { id: 'emb-multihead', title: 'Multi-Head Machine Fleet', path: '/embroidery/machines' },
        ],
      },
      {
        id: 'emb-qc',
        title: 'Design & Inspection',
        children: [
          { id: 'emb-files', title: 'DST/EMB Design Registry', path: '/embroidery/designs' },
          { id: 'emb-inspect', title: 'Needle-Cut 100% Panel QC', path: '/embroidery/panel-qc' },
        ],
      },
    ],
  },
  {
    id: 'subcontract',
    code: 'MOD-08',
    title: 'Subcontracting & Job-Work Governance',
    shortTitle: 'Subcontract',
    iconName: 'Truck',
    defaultPath: '/subcontract/challans',
    submodules: [
      {
        id: 'sub-governance',
        title: 'NBR VAT & Gate Movement',
        children: [
          { id: 'sub-challan', title: 'Mushak 6.3 Challans', path: '/subcontract/challans' },
          { id: 'sub-gatepass', title: 'Returnable Gate Passes', path: '/subcontract/gate-passes' },
        ],
      },
      {
        id: 'sub-vendors',
        title: 'Vendors & Debit Notes',
        children: [
          { id: 'sub-list', title: 'Approved Vendor Directory', path: '/subcontract/vendors' },
          { id: 'sub-reconcile', title: 'Reconciliation & Debit Notes', path: '/subcontract/debit-notes' },
        ],
      },
    ],
  },
  {
    id: 'sewing',
    code: 'MOD-09',
    title: 'Sewing Floor Tracking & Station Assembly',
    shortTitle: 'Sewing',
    iconName: 'Layers',
    defaultPath: '/sewing/station/line-out',
    submodules: [
      {
        id: 'sew-stations',
        title: 'Floor Data Capture',
        children: [
          { id: 'sew-in', title: 'Line-In Bundle Feeding Station', path: '/sewing/station/line-in' },
          { id: 'sew-out', title: 'Line-Out Garment Station', path: '/sewing/station/line-out' },
        ],
      },
      {
        id: 'sew-andon',
        title: 'Telemetry & Displays',
        children: [
          { id: 'sew-tv', title: 'Live Sewing Floor Andon TV', path: '/sewing/andon-display' },
          { id: 'sew-wip', title: 'In-Line WIP Bottleneck Radar', path: '/sewing/wip-radar' },
        ],
      },
    ],
  },
  {
    id: 'qc',
    code: 'MOD-10',
    title: 'Quality Control, AQL & Defect Mapping',
    shortTitle: 'QC',
    iconName: 'CheckCircle2',
    defaultPath: '/qc/dhu-board',
    submodules: [
      {
        id: 'qc-inspect',
        title: 'Floor Inspection',
        children: [
          { id: 'qc-endline', title: '100% End-Line QC Station', path: '/qc/station/end-line' },
          { id: 'qc-rework', title: 'Closed-Loop Alter Routing', path: '/qc/alter-routing' },
          { id: 'qc-aql', title: 'ISO 2859-1 AQL Audits', path: '/qc/aql-audits' },
        ],
      },
      {
        id: 'qc-intel',
        title: 'Defect Intelligence',
        children: [
          { id: 'qc-dhu', title: 'DHU Traffic Light Dashboard', path: '/qc/dhu-board' },
          { id: 'qc-pareto', title: 'Chronic Defect Pareto Analytics', path: '/qc/pareto' },
        ],
      },
    ],
  },
  {
    id: 'washing',
    code: 'MOD-11',
    title: 'Industrial Garment Washing Plant',
    shortTitle: 'Washing',
    iconName: 'Droplets',
    defaultPath: '/washing/batches',
    submodules: [
      {
        id: 'wash-batches',
        title: 'Wet & Dry Batches',
        children: [
          { id: 'wash-runs', title: 'Wash Batch Operations', path: '/washing/batches' },
          { id: 'wash-recipes', title: 'Chemical Recipes (M:L 1:8)', path: '/washing/recipes' },
        ],
      },
      {
        id: 'wash-process',
        title: 'Shrinkage & Inspection',
        children: [
          { id: 'wash-dryer', title: 'Hydro & Tumbler Thermal Logs', path: '/washing/dryers' },
          { id: 'wash-qc', title: 'Post-Wash 100% QC Station', path: '/washing/post-wash-qc' },
        ],
      },
    ],
  },
  {
    id: 'finishing',
    code: 'MOD-12',
    title: 'Garment Finishing & Safety Engine',
    shortTitle: 'Finishing',
    iconName: 'CheckSquare',
    defaultPath: '/finishing/station/metal',
    submodules: [
      {
        id: 'fin-safety',
        title: 'Metal & Needle Safety',
        children: [
          { id: 'fin-metal', title: 'Conveyor Metal Detector Station', path: '/finishing/station/metal' },
          { id: 'fin-needle', title: 'Broken Needle Incident Vault', path: '/finishing/broken-needles' },
        ],
      },
      {
        id: 'fin-audit',
        title: 'Pull Tests & POM Spec',
        children: [
          { id: 'fin-pull', title: '90N Button Pull Test Log', path: '/finishing/pull-tests' },
          { id: 'fin-pom', title: 'Digital POM Measurement Audit', path: '/finishing/pom-audit' },
        ],
      },
    ],
  },
  {
    id: 'packing',
    code: 'MOD-13',
    title: 'Packing, Carton QR & Pre-Shipment',
    shortTitle: 'Packing',
    iconName: 'Package',
    defaultPath: '/packing/station/carton-pack',
    submodules: [
      {
        id: 'pack-floor',
        title: 'Carton Floor Packing',
        children: [
          { id: 'pack-station', title: 'Carton Packing Station', path: '/packing/station/carton-pack' },
          { id: 'pack-sscc', title: 'GS1 SSCC-18 Carton Manager', path: '/packing/cartons' },
        ],
      },
      {
        id: 'pack-ship',
        title: 'Weighing & Stuffing',
        children: [
          { id: 'pack-scale', title: 'Digital Scale Weight Verification', path: '/packing/scale-verify' },
          { id: 'pack-psi', title: 'Buyer Final PSI Inspection', path: '/packing/psi-inspections' },
          { id: 'pack-stuffing', title: 'Container Stuffing Manifest', path: '/packing/container-stuffing' },
        ],
      },
    ],
  },
  {
    id: 'warehouse',
    code: 'MOD-14',
    title: 'Fabric & Trims Warehouse',
    shortTitle: 'Warehouse',
    iconName: 'Archive',
    defaultPath: '/warehouse/dashboard',
    submodules: [
      {
        id: 'wh-fabric',
        title: 'Fabric Inward & Relaxation',
        children: [
          { id: 'wh-dash', title: 'Warehouse Intelligence Dashboard', path: '/warehouse/dashboard' },
          { id: 'wh-mrr', title: 'Material Receiving Reports (MRR)', path: '/warehouse/mrr' },
          { id: 'wh-rolls', title: 'Unique Roll Barcode Registry', path: '/warehouse/fabric-rolls' },
          { id: 'wh-4pt', title: 'ASTM D5430 4-Point Inspection', path: '/warehouse/inspection-4pt' },
          { id: 'wh-relax', title: 'Relaxation Chamber Matrix', path: '/warehouse/relaxation-chamber' },
        ],
      },
      {
        id: 'wh-trims',
        title: 'Trims & Putaway',
        children: [
          { id: 'wh-inventory', title: 'Trims Stock Ledger & Bins', path: '/warehouse/trims-inventory' },
          { id: 'wh-putaway', title: '2-Step Bin Putaway Manager', path: '/warehouse/putaway' },
        ],
      },
    ],
  },
  {
    id: 'commercial',
    code: 'MOD-15',
    title: 'Commercial Export & BI Analytics',
    shortTitle: 'Commercial & BI',
    iconName: 'BarChart3',
    defaultPath: '/commercial/bi/dashboard',
    submodules: [
      {
        id: 'comm-export',
        title: 'Commercial Governance',
        children: [
          { id: 'comm-dash', title: 'Commercial Export Dashboard', path: '/commercial/dashboard' },
          { id: 'comm-ci', title: 'Commercial Invoice (CI) Builder', path: '/commercial/invoices' },
          { id: 'comm-pl', title: 'Master Packing List (PL)', path: '/commercial/packing-lists' },
          { id: 'comm-bl', title: 'Bill of Lading (B/L) Tracking', path: '/commercial/bill-of-lading' },
        ],
      },
      {
        id: 'comm-bi',
        title: 'Executive C-Suite BI',
        children: [
          { id: 'comm-csuite', title: 'C-Suite Strategy Dashboard', path: '/commercial/bi/dashboard' },
          { id: 'comm-cost', title: 'Cost-Per-Garment BOM Variance', path: '/commercial/cost-variance' },
          { id: 'comm-otd', title: 'On-Time Delivery (OTD %) Ledger', path: '/commercial/otd-analytics' },
        ],
      },
    ],
  },
];
