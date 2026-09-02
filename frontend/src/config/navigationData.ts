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

export interface NavModuleItem {
  id: string;
  code: string;
  title: string;
  iconName: string;
  submodules: NavSubmoduleItem[];
}

export interface NavSection {
  id: string;
  title: string;
  modules: NavModuleItem[];
}

export const ENTERPRISE_NAV_SECTIONS: NavSection[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. MERCHANDISING & COMMERCIAL
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'merchandising-commercial',
    title: 'Merchandising & Commercial',
    modules: [
      {
        id: 'order-management',
        code: 'MOD-03',
        title: 'Order Management & BOM',
        iconName: 'FileSpreadsheet',
        submodules: [
          {
            id: 'orders-po-group',
            title: 'Purchase Orders',
            children: [
              { id: 'orders-directory', title: 'Buyer PO Directory', path: '/orders' },
              { id: 'orders-create', title: 'Create Purchase Order', path: '/orders/create' },
            ],
          },
          {
            id: 'orders-specs-group',
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
        title: 'Commercial Export & Logistics',
        iconName: 'TrendingUp',
        submodules: [
          {
            id: 'comm-docs-group',
            title: 'Export Documentation',
            children: [
              { id: 'comm-dash', title: 'Export Shipment Ledger', path: '/commercial/dashboard' },
              { id: 'comm-ci', title: 'Commercial Invoice (CI)', path: '/commercial/invoices' },
              { id: 'comm-pl', title: 'Master Packing List (PL)', path: '/commercial/packing-lists' },
              { id: 'comm-bl', title: 'Bill of Lading (B/L)', path: '/commercial/bill-of-lading' },
            ],
          },
          {
            id: 'comm-bi-group',
            title: 'Executive BI Analytics',
            children: [
              { id: 'comm-csuite', title: 'C-Suite Strategy Board', path: '/commercial/bi/dashboard' },
              { id: 'comm-cost', title: 'Cost Variance Analytics', path: '/commercial/cost-variance' },
              { id: 'comm-otd', title: 'On-Time Delivery (OTD %)', path: '/commercial/otd-analytics' },
            ],
          },
        ],
      },
      {
        id: 'partners-master',
        code: 'MOD-02',
        title: 'Business Partners Registry',
        iconName: 'Building2',
        submodules: [
          {
            id: 'partners-directory-group',
            title: 'Partners Directory',
            children: [
              { id: 'buyers-list', title: 'Buyer Brands Directory', path: '/master-data/buyers' },
              { id: 'suppliers-list', title: 'Supplier & Mills Directory', path: '/master-data/suppliers' },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. SUPPLY CHAIN & WAREHOUSE
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'supply-chain-warehouse',
    title: 'Supply Chain & Warehouse',
    modules: [
      {
        id: 'fabric-warehouse',
        code: 'MOD-14',
        title: 'Fabric Warehouse & MRR',
        iconName: 'Layers',
        submodules: [
          {
            id: 'wh-inward-group',
            title: 'Material Receiving (MRR)',
            children: [
              { id: 'wh-dashboard', title: 'Warehouse Intelligence', path: '/warehouse/dashboard' },
              { id: 'wh-mrr', title: 'Material Receiving Reports', path: '/warehouse/mrr' },
              { id: 'wh-rolls', title: 'Fabric Roll QR Registry', path: '/warehouse/fabric-rolls' },
            ],
          },
          {
            id: 'wh-qc-relax-group',
            title: 'Quality & Relaxation',
            children: [
              { id: 'wh-4pt', title: 'ASTM 4-Point Inspection', path: '/warehouse/inspection-4pt' },
              { id: 'wh-relax', title: 'Relaxation Chamber Matrix', path: '/warehouse/relaxation-chamber' },
            ],
          },
        ],
      },
      {
        id: 'trims-warehouse',
        code: 'MOD-14B',
        title: 'Trims & Accessories Store',
        iconName: 'Archive',
        submodules: [
          {
            id: 'trims-store-group',
            title: 'Trims Management',
            children: [
              { id: 'trims-inventory', title: 'Trims Stock Ledger', path: '/warehouse/trims-inventory' },
              { id: 'trims-putaway', title: '2-Step Bin Putaway', path: '/warehouse/putaway' },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. PRODUCTION FLOOR EXECUTION
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'production-execution',
    title: 'Production Floor Execution',
    modules: [
      {
        id: 'production-planning',
        code: 'MOD-04',
        title: 'Production Planning & PPC',
        iconName: 'Calendar',
        submodules: [
          {
            id: 'ppc-core-group',
            title: 'Capacity Scheduling',
            children: [
              { id: 'plan-dashboard', title: 'PPC Master Dashboard', path: '/planning/dashboard' },
              { id: 'plan-cut-sew', title: 'Cut-Sew Pipeline Scheduler', path: '/planning/cut-sew' },
              { id: 'plan-gantt', title: 'Line Loading Gantt Chart', path: '/planning/gantt' },
              { id: 'plan-starve', title: 'Line Starvation Radar', path: '/planning/starvation-radar' },
              { id: 'plan-smv', title: 'Operation Breakdown & SMV', path: '/planning/smv-matrix' },
            ],
          },
        ],
      },
      {
        id: 'cutting-bundling',
        code: 'MOD-05',
        title: 'CAD, Cutting & Bundling',
        iconName: 'Scissors',
        submodules: [
          {
            id: 'cut-cad-group',
            title: 'CAD & Lay Operations',
            children: [
              { id: 'cut-markers', title: 'CAD Marker Optimization', path: '/cutting/markers' },
              { id: 'cut-lays', title: 'Lay Spreading & Ratio Chart', path: '/cutting/lay-sheets' },
            ],
          },
          {
            id: 'cut-bundles-group',
            title: 'QR Bundle Station',
            children: [
              { id: 'cut-bundles', title: 'Bundle Ticket QR Printing', path: '/cutting/station/bundles' },
              { id: 'cut-remnants', title: 'End-Bit Remnant Audit', path: '/cutting/end-bits' },
            ],
          },
        ],
      },
      {
        id: 'printing-plant',
        code: 'MOD-06',
        title: 'Screen & Digital Printing',
        iconName: 'Printer',
        submodules: [
          {
            id: 'print-ops-group',
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
      {
        id: 'embroidery-plant',
        code: 'MOD-07',
        title: 'Computerized Embroidery',
        iconName: 'Sparkles',
        submodules: [
          {
            id: 'emb-ops-group',
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
      {
        id: 'subcontract-ops',
        code: 'MOD-08',
        title: 'Subcontract Operations',
        iconName: 'Truck',
        submodules: [
          {
            id: 'sub-challan-group',
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
      {
        id: 'sewing-floor',
        code: 'MOD-09',
        title: 'Sewing Floor & Andon',
        iconName: 'Activity',
        submodules: [
          {
            id: 'sew-stations-group',
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
      {
        id: 'washing-plant',
        code: 'MOD-11',
        title: 'Industrial Washing Plant',
        iconName: 'Droplet',
        submodules: [
          {
            id: 'wash-ops-group',
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
      {
        id: 'finishing-safety',
        code: 'MOD-12',
        title: 'Finishing & Metal Detection',
        iconName: 'CheckSquare',
        submodules: [
          {
            id: 'fin-safety-group',
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
      {
        id: 'packing-shipping',
        code: 'MOD-13',
        title: 'Carton Packing & PSI',
        iconName: 'Package',
        submodules: [
          {
            id: 'pack-dispatch-group',
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
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. QUALITY ASSURANCE & SYSTEM GOVERNANCE
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'quality-governance',
    title: 'Quality Assurance & Governance',
    modules: [
      {
        id: 'quality-control',
        code: 'MOD-10',
        title: 'Quality Control & AQL',
        iconName: 'CheckCheck',
        submodules: [
          {
            id: 'qc-floor-group',
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
      {
        id: 'factory-configurations',
        code: 'MOD-02',
        title: 'Factory Configurations',
        iconName: 'Sliders',
        submodules: [
          {
            id: 'factory-master-group',
            title: 'Factory Setup',
            children: [
              { id: 'master-lines', title: 'Sewing Lines & Tables', path: '/master-data/lines' },
              { id: 'master-sizes', title: 'Size Ranges & Sort Order', path: '/master-data/sizes' },
              { id: 'master-defects', title: 'Defect Taxonomy & Codes', path: '/master-data/defects' },
            ],
          },
        ],
      },
      {
        id: 'system-administration',
        code: 'MOD-01',
        title: 'System Administration & RBAC',
        iconName: 'Shield',
        submodules: [
          {
            id: 'admin-mgmt-group',
            title: 'Platform Management',
            children: [
              { id: 'admin-dash', title: 'Platform Command Center', path: '/admin/platform-overview' },
              { id: 'admin-users', title: 'Users & Roles Management', path: '/admin/users' },
              { id: 'admin-devices', title: 'Tablet Fleet & Hardware', path: '/admin/devices' },
            ],
          },
        ],
      },
      {
        id: 'audit-security-vault',
        code: 'MOD-01B',
        title: 'WORM Audit Vault & Security',
        iconName: 'Lock',
        submodules: [
          {
            id: 'security-compliance-group',
            title: 'Security & Compliance',
            children: [
              { id: 'admin-worm', title: 'WORM Immutable Audit Vault', path: '/admin/audit-vault' },
              { id: 'admin-purge', title: 'Two-Tier Purge Console', path: '/admin/purge-console' },
            ],
          },
        ],
      },
    ],
  },
];
