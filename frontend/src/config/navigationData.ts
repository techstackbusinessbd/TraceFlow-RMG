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
  iconName?: string;
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
    iconName?: string;
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
        title: 'Orders & BOM',
        iconName: 'FileSpreadsheet',
        submodules: [
          {
            id: 'orders-commercial',
            title: 'Purchase Orders',
            children: [
              { id: 'orders-all', title: 'PO Directory', path: '/orders' },
              { id: 'orders-create', title: 'Create Order', path: '/orders/create' },
            ],
          },
          {
            id: 'orders-specs',
            title: 'BOM & T&A',
            children: [
              { id: 'orders-bom', title: 'Garment BOM', path: '/orders/bom-registry' },
              { id: 'orders-tna', title: 'T&A Calendar', path: '/orders/tna-calendar' },
            ],
          },
        ],
      },
      {
        id: 'commercial-export',
        code: 'MOD-15',
        title: 'Commercial & BI',
        iconName: 'TrendingUp',
        submodules: [
          {
            id: 'comm-bi',
            title: 'Executive BI',
            children: [
              { id: 'comm-csuite', title: 'C-Suite Strategy', path: '/commercial/bi/dashboard' },
              { id: 'comm-cost', title: 'Cost Variance', path: '/commercial/cost-variance' },
              { id: 'comm-otd', title: 'OTD Analytics', path: '/commercial/otd-analytics' },
            ],
          },
          {
            id: 'comm-export-docs',
            title: 'Export Docs',
            children: [
              { id: 'comm-dash', title: 'Export Ledger', path: '/commercial/dashboard' },
              { id: 'comm-ci', title: 'Invoices (CI)', path: '/commercial/invoices' },
              { id: 'comm-pl', title: 'Packing List (PL)', path: '/commercial/packing-lists' },
              { id: 'comm-bl', title: 'Bill of Lading', path: '/commercial/bill-of-lading' },
            ],
          },
        ],
      },
      {
        id: 'master-partners',
        code: 'MOD-02',
        title: 'Buyer & Supplier',
        iconName: 'Building2',
        submodules: [
          {
            id: 'master-partners-group',
            title: 'Partners',
            children: [
              { id: 'master-buyers', title: 'Buyers Directory', path: '/master-data/buyers' },
              { id: 'master-suppliers', title: 'Suppliers Directory', path: '/master-data/suppliers' },
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
    title: 'Manufacturing Floor',
    shortTitle: 'Manufacturing',
    description: 'Planning, Cutting, Printing, Embroidery, Subcontract, Sewing, Washing, Finishing & Packing',
    iconName: 'Factory',
    defaultPath: '/planning/dashboard',
    modules: [
      {
        id: 'planning',
        code: 'MOD-04',
        title: 'PPC Planning',
        iconName: 'Calendar',
        submodules: [
          {
            id: 'planning-core',
            title: 'Capacity Planning',
            children: [
              { id: 'plan-dash', title: 'PPC Dashboard', path: '/planning/dashboard' },
              { id: 'plan-cut-sew', title: 'Cut-Sew Scheduler', path: '/planning/cut-sew' },
              { id: 'plan-gantt', title: 'Loading Gantt', path: '/planning/gantt' },
              { id: 'plan-starve', title: 'Starvation Radar', path: '/planning/starvation-radar' },
              { id: 'plan-smv', title: 'SMV Matrix', path: '/planning/smv-matrix' },
            ],
          },
        ],
      },
      {
        id: 'cutting',
        code: 'MOD-05',
        title: 'Cutting & CAD',
        iconName: 'Scissors',
        submodules: [
          {
            id: 'cut-cad-group',
            title: 'CAD & Lay',
            children: [
              { id: 'cut-cad', title: 'Marker Optimization', path: '/cutting/markers' },
              { id: 'cut-lay', title: 'Lay Spreading', path: '/cutting/lay-sheets' },
            ],
          },
          {
            id: 'cut-station-group',
            title: 'Bundles & QR',
            children: [
              { id: 'cut-qr-print', title: 'Bundle Station', path: '/cutting/station/bundles' },
              { id: 'cut-remnant', title: 'End-Bit Remnants', path: '/cutting/end-bits' },
            ],
          },
        ],
      },
      {
        id: 'printing',
        code: 'MOD-06',
        title: 'Printing',
        iconName: 'Printer',
        submodules: [
          {
            id: 'print-floor',
            title: 'Print Execution',
            children: [
              { id: 'print-orders', title: 'Batch Work Orders', path: '/printing/batches' },
              { id: 'print-strike', title: 'Strike-Off Approvals', path: '/printing/strike-offs' },
              { id: 'print-recipe', title: 'Color Kitchen', path: '/printing/color-kitchen' },
              { id: 'print-qc', title: 'Panel Print QC', path: '/printing/panel-qc' },
            ],
          },
        ],
      },
      {
        id: 'embroidery',
        code: 'MOD-07',
        title: 'Embroidery',
        iconName: 'Sparkles',
        submodules: [
          {
            id: 'emb-floor',
            title: 'Embroidery Plant',
            children: [
              { id: 'emb-workorders', title: 'Work Orders', path: '/embroidery/orders' },
              { id: 'emb-multihead', title: 'Machine Fleet', path: '/embroidery/machines' },
              { id: 'emb-files', title: 'Design Library', path: '/embroidery/designs' },
              { id: 'emb-inspect', title: 'Panel Inspection', path: '/embroidery/panel-qc' },
            ],
          },
        ],
      },
      {
        id: 'subcontract',
        code: 'MOD-08',
        title: 'Subcontract',
        iconName: 'Truck',
        submodules: [
          {
            id: 'sub-gov',
            title: 'Gate & Challans',
            children: [
              { id: 'sub-challan', title: 'Mushak 6.3 Challans', path: '/subcontract/challans' },
              { id: 'sub-gatepass', title: 'Returnable Passes', path: '/subcontract/gate-passes' },
              { id: 'sub-list', title: 'Vendor Directory', path: '/subcontract/vendors' },
              { id: 'sub-reconcile', title: 'Debit Notes', path: '/subcontract/debit-notes' },
            ],
          },
        ],
      },
      {
        id: 'sewing',
        code: 'MOD-09',
        title: 'Sewing Floor',
        iconName: 'Activity',
        submodules: [
          {
            id: 'sew-floor-stations',
            title: 'Line Tracking',
            children: [
              { id: 'sew-in', title: 'Line-In Feeding', path: '/sewing/station/line-in' },
              { id: 'sew-out', title: 'Line-Out Station', path: '/sewing/station/line-out' },
              { id: 'sew-tv', title: 'Floor Andon TV', path: '/sewing/andon-display' },
              { id: 'sew-wip', title: 'WIP Radar', path: '/sewing/wip-radar' },
            ],
          },
        ],
      },
      {
        id: 'washing',
        code: 'MOD-11',
        title: 'Washing',
        iconName: 'Droplet',
        submodules: [
          {
            id: 'wash-plant-ops',
            title: 'Plant Operations',
            children: [
              { id: 'wash-runs', title: 'Batch Operations', path: '/washing/batches' },
              { id: 'wash-recipes', title: 'Chemical Recipes', path: '/washing/recipes' },
              { id: 'wash-dryer', title: 'Dryer Logs', path: '/washing/dryers' },
              { id: 'wash-qc', title: 'Post-Wash QC', path: '/washing/post-wash-qc' },
            ],
          },
        ],
      },
      {
        id: 'finishing',
        code: 'MOD-12',
        title: 'Finishing',
        iconName: 'CheckSquare',
        submodules: [
          {
            id: 'fin-safety-group',
            title: 'Safety & Quality',
            children: [
              { id: 'fin-metal', title: 'Metal Detection', path: '/finishing/station/metal' },
              { id: 'fin-needle', title: 'Needle Incident Vault', path: '/finishing/broken-needles' },
              { id: 'fin-pull', title: 'Pull Test Log', path: '/finishing/pull-tests' },
              { id: 'fin-pom', title: 'POM Measurements', path: '/finishing/pom-audit' },
            ],
          },
        ],
      },
      {
        id: 'packing',
        code: 'MOD-13',
        title: 'Packing & PSI',
        iconName: 'Package',
        submodules: [
          {
            id: 'pack-floor-group',
            title: 'Cartons & Dispatch',
            children: [
              { id: 'pack-station', title: 'Carton Packing', path: '/packing/station/carton-pack' },
              { id: 'pack-sscc', title: 'SSCC Cartons', path: '/packing/cartons' },
              { id: 'pack-scale', title: 'Weight Verify', path: '/packing/scale-verify' },
              { id: 'pack-psi', title: 'Final PSI Inspection', path: '/packing/psi-inspections' },
              { id: 'pack-stuffing', title: 'Container Stuffing', path: '/packing/container-stuffing' },
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
        title: 'Fabric & Trims',
        iconName: 'Layers',
        submodules: [
          {
            id: 'wh-fabric-ops',
            title: 'Fabric Rolls',
            children: [
              { id: 'wh-dash', title: 'Warehouse Intelligence', path: '/warehouse/dashboard' },
              { id: 'wh-mrr', title: 'Receiving Reports (MRR)', path: '/warehouse/mrr' },
              { id: 'wh-rolls', title: 'Roll Barcodes', path: '/warehouse/fabric-rolls' },
              { id: 'wh-4pt', title: 'ASTM 4-Point QC', path: '/warehouse/inspection-4pt' },
              { id: 'wh-relax', title: 'Relaxation Chamber', path: '/warehouse/relaxation-chamber' },
            ],
          },
          {
            id: 'wh-trims-ops',
            title: 'Trims Inventory',
            children: [
              { id: 'wh-inventory', title: 'Stock Ledger', path: '/warehouse/trims-inventory' },
              { id: 'wh-putaway', title: 'Bin Putaway', path: '/warehouse/putaway' },
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
    title: 'Governance & Admin',
    shortTitle: 'Governance',
    description: 'System Administration, Users, Roles & Permissions, Fleet Devices, WORM Audit Vault & Quality Control',
    iconName: 'ShieldCheck',
    defaultPath: '/admin/platform-overview',
    modules: [
      {
        id: 'system-admin',
        code: 'MOD-01',
        title: 'System Admin',
        iconName: 'Shield',
        submodules: [
          {
            id: 'admin-platform',
            title: 'Platform Management',
            children: [
              { id: 'admin-dash', title: 'Command Center', path: '/admin/platform-overview' },
              { id: 'admin-users', title: 'Users & Roles', path: '/admin/users' },
              { id: 'admin-devices', title: 'Tablet Fleet', path: '/admin/devices' },
            ],
          },
          {
            id: 'admin-audit',
            title: 'Security & Audit',
            children: [
              { id: 'admin-worm', title: 'WORM Audit Vault', path: '/admin/audit-vault' },
              { id: 'admin-purge', title: 'Purge Console', path: '/admin/purge-console' },
            ],
          },
        ],
      },
      {
        id: 'quality-control',
        code: 'MOD-10',
        title: 'Quality & AQL',
        iconName: 'CheckCheck',
        submodules: [
          {
            id: 'qc-ops',
            title: 'Floor Quality',
            children: [
              { id: 'qc-dhu', title: 'DHU Traffic Light', path: '/qc/dhu-board' },
              { id: 'qc-endline', title: 'End-Line QC Station', path: '/qc/station/end-line' },
              { id: 'qc-rework', title: 'Alter Routing', path: '/qc/alter-routing' },
              { id: 'qc-aql', title: 'AQL Audits', path: '/qc/aql-audits' },
              { id: 'qc-pareto', title: 'Defect Pareto', path: '/qc/pareto' },
            ],
          },
        ],
      },
      {
        id: 'plant-master',
        code: 'MOD-02',
        title: 'Factory Master',
        iconName: 'Sliders',
        submodules: [
          {
            id: 'master-plant-group',
            title: 'Plant Master',
            children: [
              { id: 'master-lines', title: 'Sewing Lines', path: '/master-data/lines' },
              { id: 'master-sizes', title: 'Size Ranges', path: '/master-data/sizes' },
              { id: 'master-defects', title: 'Defect Codes', path: '/master-data/defects' },
            ],
          },
        ],
      },
    ],
  },
];
