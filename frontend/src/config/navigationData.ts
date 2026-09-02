export interface NavLeafItem {
  id: string;
  title: string;
  path: string;
  badge?: string;
  iconName?: string;
}

export interface NavGroupItem {
  id: string;
  title: string;
  children: NavLeafItem[];
}

export interface EnterpriseDomain {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  defaultPath: string;
  modules: {
    id: string;
    code: string;
    title: string;
    submodules: NavGroupItem[];
  }[];
}

export const ENTERPRISE_DOMAINS_CONFIG: EnterpriseDomain[] = [
  // 1. Commercial & Merchandising Domain
  {
    id: 'commercial',
    code: 'DOM-01',
    title: 'Commercial & Merchandising',
    shortTitle: 'Commercial',
    description: 'Buyer Orders, Multi-Tier BOMs, T&A Calendar, Commercial Invoices & C-Suite BI',
    iconName: 'ShoppingBag',
    defaultPath: '/orders',
    modules: [
      {
        id: 'orders',
        code: 'MOD-03',
        title: 'Order Management & Merchandising',
        submodules: [
          {
            id: 'orders-commercial',
            title: 'Purchase Orders',
            children: [
              { id: 'orders-all', title: 'Commercial PO Directory', path: '/orders' },
              { id: 'orders-create', title: 'Create Commercial Order', path: '/orders/create' },
            ],
          },
          {
            id: 'orders-specs',
            title: 'BOM & Costing',
            children: [
              { id: 'orders-bom', title: 'Multi-Tier Garment BOM', path: '/orders/bom-registry' },
              { id: 'orders-tna', title: 'Time & Action (T&A) Calendar', path: '/orders/tna-calendar' },
            ],
          },
        ],
      },
      {
        id: 'commercial-export',
        code: 'MOD-15',
        title: 'Commercial Export & BI Analytics',
        submodules: [
          {
            id: 'comm-bi',
            title: 'Executive BI & Strategy',
            children: [
              { id: 'comm-csuite', title: 'C-Suite Strategy Dashboard', path: '/commercial/bi/dashboard' },
              { id: 'comm-cost', title: 'Cost-Per-Garment Variance', path: '/commercial/cost-variance' },
              { id: 'comm-otd', title: 'On-Time Delivery (OTD %)', path: '/commercial/otd-analytics' },
            ],
          },
          {
            id: 'comm-export-docs',
            title: 'Export Documentation',
            children: [
              { id: 'comm-dash', title: 'Commercial Export Ledger', path: '/commercial/dashboard' },
              { id: 'comm-ci', title: 'Commercial Invoice (CI) Builder', path: '/commercial/invoices' },
              { id: 'comm-pl', title: 'Master Packing List (PL)', path: '/commercial/packing-lists' },
              { id: 'comm-bl', title: 'Bill of Lading (B/L) Tracker', path: '/commercial/bill-of-lading' },
            ],
          },
        ],
      },
      {
        id: 'master-partners',
        code: 'MOD-02',
        title: 'Master Data Partners',
        submodules: [
          {
            id: 'master-partners-group',
            title: 'Business Directory',
            children: [
              { id: 'master-buyers', title: 'Buyers & Brands Registry', path: '/master-data/buyers' },
              { id: 'master-suppliers', title: 'Suppliers & Mills Directory', path: '/master-data/suppliers' },
            ],
          },
        ],
      },
    ],
  },

  // 2. Manufacturing & Production Floor Domain
  {
    id: 'manufacturing',
    code: 'DOM-02',
    title: 'Manufacturing & Floor Execution',
    shortTitle: 'Manufacturing',
    description: 'Planning, Cutting, Printing, Embroidery, Subcontract, Sewing, Washing, Finishing & Packing',
    iconName: 'Factory',
    defaultPath: '/planning/dashboard',
    modules: [
      {
        id: 'planning',
        code: 'MOD-04',
        title: 'Production Planning & IE',
        submodules: [
          {
            id: 'planning-core',
            title: 'PPC Capacity Scheduling',
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
      {
        id: 'cutting',
        code: 'MOD-05',
        title: 'CAD, Lay Planning & QR Bundling',
        submodules: [
          {
            id: 'cut-cad-group',
            title: 'CAD & Lay Operations',
            children: [
              { id: 'cut-cad', title: 'CAD Marker Optimization', path: '/cutting/markers' },
              { id: 'cut-lay', title: 'Lay Spreading & Ratio Chart', path: '/cutting/lay-sheets' },
            ],
          },
          {
            id: 'cut-station-group',
            title: 'Floor Data Capture',
            children: [
              { id: 'cut-qr-print', title: 'Bundle Ticket QR Station', path: '/cutting/station/bundles' },
              { id: 'cut-remnant', title: 'End-Bit Remnant Audit', path: '/cutting/end-bits' },
            ],
          },
        ],
      },
      {
        id: 'printing',
        code: 'MOD-06',
        title: 'Screen & Digital Printing',
        submodules: [
          {
            id: 'print-floor',
            title: 'Print Plant Execution',
            children: [
              { id: 'print-orders', title: 'Print Batch Work Orders', path: '/printing/batches' },
              { id: 'print-strike', title: 'Strike-Off Approval Log', path: '/printing/strike-offs' },
              { id: 'print-recipe', title: 'Color Kitchen Formulations', path: '/printing/color-kitchen' },
              { id: 'print-qc', title: '100% Panel Print QC', path: '/printing/panel-qc' },
            ],
          },
        ],
      },
      {
        id: 'embroidery',
        code: 'MOD-07',
        title: 'Computerized Embroidery',
        submodules: [
          {
            id: 'emb-floor',
            title: 'Embroidery Plant Execution',
            children: [
              { id: 'emb-workorders', title: 'Embroidery Orders Registry', path: '/embroidery/orders' },
              { id: 'emb-multihead', title: 'Multi-Head Machine Fleet', path: '/embroidery/machines' },
              { id: 'emb-files', title: 'DST/EMB Design Library', path: '/embroidery/designs' },
              { id: 'emb-inspect', title: 'Needle-Cut 100% Panel QC', path: '/embroidery/panel-qc' },
            ],
          },
        ],
      },
      {
        id: 'subcontract',
        code: 'MOD-08',
        title: 'Subcontracting & Job-Work',
        submodules: [
          {
            id: 'sub-gov',
            title: 'NBR VAT & Gate Movement',
            children: [
              { id: 'sub-challan', title: 'Mushak 6.3 Challan Hub', path: '/subcontract/challans' },
              { id: 'sub-gatepass', title: 'Returnable Gate Passes', path: '/subcontract/gate-passes' },
              { id: 'sub-list', title: 'Approved Vendor Directory', path: '/subcontract/vendors' },
              { id: 'sub-reconcile', title: 'Reconciliation & Debit Notes', path: '/subcontract/debit-notes' },
            ],
          },
        ],
      },
      {
        id: 'sewing',
        code: 'MOD-09',
        title: 'Sewing Floor Tracking & Andon',
        submodules: [
          {
            id: 'sew-floor-stations',
            title: 'Floor Data Capture',
            children: [
              { id: 'sew-in', title: 'Line-In Bundle Feeding Station', path: '/sewing/station/line-in' },
              { id: 'sew-out', title: 'Line-Out Garment Station', path: '/sewing/station/line-out' },
              { id: 'sew-tv', title: 'Live Sewing Floor Andon TV', path: '/sewing/andon-display' },
              { id: 'sew-wip', title: 'In-Line WIP Bottleneck Radar', path: '/sewing/wip-radar' },
            ],
          },
        ],
      },
      {
        id: 'washing',
        code: 'MOD-11',
        title: 'Industrial Garment Washing',
        submodules: [
          {
            id: 'wash-plant-ops',
            title: 'Wet & Dry Plant Operations',
            children: [
              { id: 'wash-runs', title: 'Wash Batch Operations', path: '/washing/batches' },
              { id: 'wash-recipes', title: 'Chemical Recipes (M:L 1:8)', path: '/washing/recipes' },
              { id: 'wash-dryer', title: 'Hydro & Tumbler Thermal Logs', path: '/washing/dryers' },
              { id: 'wash-qc', title: 'Post-Wash 100% QC Station', path: '/washing/post-wash-qc' },
            ],
          },
        ],
      },
      {
        id: 'finishing',
        code: 'MOD-12',
        title: 'Garment Finishing & Safety',
        submodules: [
          {
            id: 'fin-safety-group',
            title: 'Safety & Quality Audits',
            children: [
              { id: 'fin-metal', title: 'Conveyor Metal Detector Station', path: '/finishing/station/metal' },
              { id: 'fin-needle', title: 'Broken Needle Incident Vault', path: '/finishing/broken-needles' },
              { id: 'fin-pull', title: '90N Button Pull Test Log', path: '/finishing/pull-tests' },
              { id: 'fin-pom', title: 'Digital POM Measurement Audit', path: '/finishing/pom-audit' },
            ],
          },
        ],
      },
      {
        id: 'packing',
        code: 'MOD-13',
        title: 'Packing, Carton SSCC & PSI',
        submodules: [
          {
            id: 'pack-floor-group',
            title: 'Carton Packing & Dispatch',
            children: [
              { id: 'pack-station', title: 'Carton Packing Station', path: '/packing/station/carton-pack' },
              { id: 'pack-sscc', title: 'GS1 SSCC-18 Carton Manager', path: '/packing/cartons' },
              { id: 'pack-scale', title: 'Digital Scale Weight Verify', path: '/packing/scale-verify' },
              { id: 'pack-psi', title: 'Buyer Final PSI Inspection', path: '/packing/psi-inspections' },
              { id: 'pack-stuffing', title: 'Container Stuffing Manifest', path: '/packing/container-stuffing' },
            ],
          },
        ],
      },
    ],
  },

  // 3. Supply Chain & Warehouse Domain
  {
    id: 'warehouse',
    code: 'DOM-03',
    title: 'Supply Chain & Warehouse',
    shortTitle: 'Warehouse',
    description: 'Fabric Inward, Roll Barcode Registry, ASTM 4-Point QC, Relaxation Chamber & Trims Inventory',
    iconName: 'Archive',
    defaultPath: '/warehouse/dashboard',
    modules: [
      {
        id: 'fabric-warehouse',
        code: 'MOD-14',
        title: 'Fabric & Trims Warehouse Hub',
        submodules: [
          {
            id: 'wh-fabric-ops',
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
            id: 'wh-trims-ops',
            title: 'Trims Stock & Bin Putaway',
            children: [
              { id: 'wh-inventory', title: 'Trims Stock Ledger & Bins', path: '/warehouse/trims-inventory' },
              { id: 'wh-putaway', title: '2-Step Bin Putaway Manager', path: '/warehouse/putaway' },
            ],
          },
        ],
      },
    ],
  },

  // 4. Governance, QA & Administration Domain
  {
    id: 'governance',
    code: 'DOM-04',
    title: 'Governance, QA & Administration',
    shortTitle: 'Governance',
    description: 'System Administration, Users, Roles & Permissions, Fleet Devices, WORM Audit Vault & Quality Control',
    iconName: 'ShieldCheck',
    defaultPath: '/admin/platform-overview',
    modules: [
      {
        id: 'system-admin',
        code: 'MOD-01',
        title: 'System Administration & Security',
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
            title: 'Security & Compliance',
            children: [
              { id: 'admin-worm', title: 'WORM Immutable Audit Vault', path: '/admin/audit-vault' },
              { id: 'admin-purge', title: 'Two-Tier Purge Console', path: '/admin/purge-console' },
            ],
          },
        ],
      },
      {
        id: 'quality-control',
        code: 'MOD-10',
        title: 'Quality Control, AQL & DHU',
        submodules: [
          {
            id: 'qc-ops',
            title: 'Floor Quality & Alter Routing',
            children: [
              { id: 'qc-dhu', title: 'DHU Traffic Light Board', path: '/qc/dhu-board' },
              { id: 'qc-endline', title: '100% End-Line QC Station', path: '/qc/station/end-line' },
              { id: 'qc-rework', title: 'Closed-Loop Alter Routing', path: '/qc/alter-routing' },
              { id: 'qc-aql', title: 'ISO 2859-1 AQL Audits', path: '/qc/aql-audits' },
              { id: 'qc-pareto', title: 'Chronic Defect Pareto Analytics', path: '/qc/pareto' },
            ],
          },
        ],
      },
      {
        id: 'plant-master',
        code: 'MOD-02',
        title: 'Factory Library Master Data',
        submodules: [
          {
            id: 'master-plant-group',
            title: 'Factory Configurations',
            children: [
              { id: 'master-lines', title: 'Sewing Lines & Tables', path: '/master-data/lines' },
              { id: 'master-sizes', title: 'Size Ranges & Sort Order', path: '/master-data/sizes' },
              { id: 'master-defects', title: 'Defect Taxonomy & Codes', path: '/master-data/defects' },
            ],
          },
        ],
      },
    ],
  },
];
