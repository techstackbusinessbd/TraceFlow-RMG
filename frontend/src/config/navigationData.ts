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
  // 1. Orders & Commercial Business
  {
    id: 'commercial',
    code: 'DOM-01',
    title: 'Orders & Commercial',
    shortTitle: 'Orders & Sales',
    description: 'Buyer Orders, Production Bills, Order Schedules, Invoices & Management Reports',
    iconName: 'ShoppingBag',
    defaultPath: '/orders',
    modules: [
      {
        id: 'orders',
        code: 'MOD-03',
        title: 'Buyer Orders',
        iconName: 'FileSpreadsheet',
        submodules: [
          {
            id: 'orders-commercial',
            title: 'Customer Orders',
            children: [
              { id: 'orders-all', title: 'Orders Directory', path: '/orders' },
              { id: 'orders-create', title: 'Create Order', path: '/orders/create' },
            ],
          },
          {
            id: 'orders-specs',
            title: 'Bill of Materials & Schedules',
            children: [
              { id: 'orders-bom', title: 'Garment Materials Bill', path: '/orders/bom-registry' },
              { id: 'orders-tna', title: 'Delivery Deadlines', path: '/orders/tna-calendar' },
            ],
          },
        ],
      },
      {
        id: 'commercial-export',
        code: 'MOD-15',
        title: 'Shipping & Reports',
        iconName: 'TrendingUp',
        submodules: [
          {
            id: 'comm-bi',
            title: 'Management Reports',
            children: [
              { id: 'comm-csuite', title: 'Executive Dashboard', path: '/commercial/bi/dashboard' },
              { id: 'comm-cost', title: 'Production Costs', path: '/commercial/cost-variance' },
              { id: 'comm-otd', title: 'On-Time Delivery Rate', path: '/commercial/otd-analytics' },
            ],
          },
          {
            id: 'comm-export-docs',
            title: 'Export Shipping Papers',
            children: [
              { id: 'comm-dash', title: 'Export History', path: '/commercial/dashboard' },
              { id: 'comm-ci', title: 'Commercial Invoices', path: '/commercial/invoices' },
              { id: 'comm-pl', title: 'Packing Lists', path: '/commercial/packing-lists' },
              { id: 'comm-bl', title: 'Shipping Bills (BL)', path: '/commercial/bill-of-lading' },
            ],
          },
        ],
      },
      {
        id: 'master-partners',
        code: 'MOD-02',
        title: 'Buyers & Suppliers',
        iconName: 'Building2',
        submodules: [
          {
            id: 'master-partners-group',
            title: 'Business Contacts',
            children: [
              { id: 'master-buyers', title: 'Buyer Brands List', path: '/master-data/buyers' },
              { id: 'master-suppliers', title: 'Supplier Mills List', path: '/master-data/suppliers' },
            ],
          },
        ],
      },
    ],
  },

  // 2. Factory Production Floor
  {
    id: 'manufacturing',
    code: 'DOM-02',
    title: 'Factory Production',
    shortTitle: 'Production',
    description: 'Planning, Cutting, Printing, Embroidery, Sewing Lines, Washing, Finishing & Packing',
    iconName: 'Factory',
    defaultPath: '/planning/dashboard',
    modules: [
      {
        id: 'planning',
        code: 'MOD-04',
        title: 'Line Planning',
        iconName: 'Calendar',
        submodules: [
          {
            id: 'planning-core',
            title: 'Capacity & Scheduling',
            children: [
              { id: 'plan-dash', title: 'Planning Overview', path: '/planning/dashboard' },
              { id: 'plan-cut-sew', title: 'Cut to Sew Schedule', path: '/planning/cut-sew' },
              { id: 'plan-gantt', title: 'Line Timeline Schedule', path: '/planning/gantt' },
              { id: 'plan-starve', title: 'Line Delay Alerts', path: '/planning/starvation-radar' },
              { id: 'plan-smv', title: 'Operation Times', path: '/planning/smv-matrix' },
            ],
          },
        ],
      },
      {
        id: 'cutting',
        code: 'MOD-05',
        title: 'Fabric Cutting',
        iconName: 'Scissors',
        submodules: [
          {
            id: 'cut-cad-group',
            title: 'Pattern & Lay',
            children: [
              { id: 'cut-cad', title: 'Pattern Marker Layout', path: '/cutting/markers' },
              { id: 'cut-lay', title: 'Fabric Lay Spread', path: '/cutting/lay-sheets' },
            ],
          },
          {
            id: 'cut-station-group',
            title: 'Cut Bundles',
            children: [
              { id: 'cut-qr-print', title: 'Print Bundle QR Tickets', path: '/cutting/station/bundles' },
              { id: 'cut-remnant', title: 'Leftover Fabric Roll Log', path: '/cutting/end-bits' },
            ],
          },
        ],
      },
      {
        id: 'printing',
        code: 'MOD-06',
        title: 'Fabric Printing',
        iconName: 'Printer',
        submodules: [
          {
            id: 'print-floor',
            title: 'Printing Operations',
            children: [
              { id: 'print-orders', title: 'Printing Work Orders', path: '/printing/batches' },
              { id: 'print-strike', title: 'Sample Print Approvals', path: '/printing/strike-offs' },
              { id: 'print-recipe', title: 'Color Ink Formulas', path: '/printing/color-kitchen' },
              { id: 'print-qc', title: 'Check Printed Panels', path: '/printing/panel-qc' },
            ],
          },
        ],
      },
      {
        id: 'embroidery',
        code: 'MOD-07',
        title: 'Embroidery Work',
        iconName: 'Sparkles',
        submodules: [
          {
            id: 'emb-floor',
            title: 'Embroidery Operations',
            children: [
              { id: 'emb-workorders', title: 'Embroidery Orders', path: '/embroidery/orders' },
              { id: 'emb-multihead', title: 'Machine Fleet', path: '/embroidery/machines' },
              { id: 'emb-files', title: 'Embroidery Designs', path: '/embroidery/designs' },
              { id: 'emb-inspect', title: 'Check Embroidery Panels', path: '/embroidery/panel-qc' },
            ],
          },
        ],
      },
      {
        id: 'subcontract',
        code: 'MOD-08',
        title: 'Outside Factories',
        iconName: 'Truck',
        submodules: [
          {
            id: 'sub-gov',
            title: 'Factory Gate & Passes',
            children: [
              { id: 'sub-challan', title: 'Government VAT Challans', path: '/subcontract/challans' },
              { id: 'sub-gatepass', title: 'Gate Pass Records', path: '/subcontract/gate-passes' },
              { id: 'sub-list', title: 'Approved Outside Vendors', path: '/subcontract/vendors' },
              { id: 'sub-reconcile', title: 'Cost Adjustments', path: '/subcontract/debit-notes' },
            ],
          },
        ],
      },
      {
        id: 'sewing',
        code: 'MOD-09',
        title: 'Sewing Lines',
        iconName: 'Activity',
        submodules: [
          {
            id: 'sew-floor-stations',
            title: 'Sewing Tracking',
            children: [
              { id: 'sew-in', title: 'Feed Bundles to Line', path: '/sewing/station/line-in' },
              { id: 'sew-out', title: 'Receive Finished Pieces', path: '/sewing/station/line-out' },
              { id: 'sew-tv', title: 'Live Factory Screen (TV)', path: '/sewing/andon-display' },
              { id: 'sew-wip', title: 'Work In Progress (WIP)', path: '/sewing/wip-radar' },
            ],
          },
        ],
      },
      {
        id: 'washing',
        code: 'MOD-11',
        title: 'Garment Washing',
        iconName: 'Droplet',
        submodules: [
          {
            id: 'wash-plant-ops',
            title: 'Washing Operations',
            children: [
              { id: 'wash-runs', title: 'Wash Batch Batches', path: '/washing/batches' },
              { id: 'wash-recipes', title: 'Washing Chemical Mix', path: '/washing/recipes' },
              { id: 'wash-dryer', title: 'Dryer Temperature Logs', path: '/washing/dryers' },
              { id: 'wash-qc', title: 'Post-Wash Quality Check', path: '/washing/post-wash-qc' },
            ],
          },
        ],
      },
      {
        id: 'finishing',
        code: 'MOD-12',
        title: 'Iron & Finishing',
        iconName: 'CheckSquare',
        submodules: [
          {
            id: 'fin-safety-group',
            title: 'Safety & Quality',
            children: [
              { id: 'fin-metal', title: 'Metal & Needle Detector', path: '/finishing/station/metal' },
              { id: 'fin-needle', title: 'Broken Needle Record', path: '/finishing/broken-needles' },
              { id: 'fin-pull', title: 'Button Pull Strength Test', path: '/finishing/pull-tests' },
              { id: 'fin-pom', title: 'Garment Measurements', path: '/finishing/pom-audit' },
            ],
          },
        ],
      },
      {
        id: 'packing',
        code: 'MOD-13',
        title: 'Packing & Shipping',
        iconName: 'Package',
        submodules: [
          {
            id: 'pack-floor-group',
            title: 'Carton Boxing',
            children: [
              { id: 'pack-station', title: 'Carton Packing Station', path: '/packing/station/carton-pack' },
              { id: 'pack-sscc', title: 'Box Barcode Numbers', path: '/packing/cartons' },
              { id: 'pack-scale', title: 'Check Box Weight', path: '/packing/scale-verify' },
              { id: 'pack-psi', title: 'Final Inspection', path: '/packing/psi-inspections' },
              { id: 'pack-stuffing', title: 'Container Loading', path: '/packing/container-stuffing' },
            ],
          },
        ],
      },
    ],
  },

  // 3. Storage & Inventory Domain
  {
    id: 'warehouse',
    code: 'DOM-03',
    title: 'Storage & Inventory',
    shortTitle: 'Inventory',
    description: 'Fabric Receiving, Fabric Rolls, Defect Checks, Resting Hours & Buttons Stock',
    iconName: 'Archive',
    defaultPath: '/warehouse/dashboard',
    modules: [
      {
        id: 'fabric-warehouse',
        code: 'MOD-14',
        title: 'Fabric & Materials',
        iconName: 'Layers',
        submodules: [
          {
            id: 'wh-fabric-ops',
            title: 'Fabric Rolls Store',
            children: [
              { id: 'wh-dash', title: 'Warehouse Overview', path: '/warehouse/dashboard' },
              { id: 'wh-mrr', title: 'Fabric Delivery Receipts', path: '/warehouse/mrr' },
              { id: 'wh-rolls', title: 'Fabric Rolls In Stock', path: '/warehouse/fabric-rolls' },
              { id: 'wh-4pt', title: 'Fabric Quality Inspection', path: '/warehouse/inspection-4pt' },
              { id: 'wh-relax', title: 'Fabric Resting Hours', path: '/warehouse/relaxation-chamber' },
            ],
          },
          {
            id: 'wh-trims-ops',
            title: 'Buttons & Trims',
            children: [
              { id: 'wh-inventory', title: 'Thread & Button Stock', path: '/warehouse/trims-inventory' },
              { id: 'wh-putaway', title: 'Shelf & Bin Storage', path: '/warehouse/putaway' },
            ],
          },
        ],
      },
    ],
  },

  // 4. Admin & Quality Control Domain
  {
    id: 'governance',
    code: 'DOM-04',
    title: 'Admin & Quality',
    shortTitle: 'Admin',
    description: 'User Accounts, Roles, Floor Devices, Security Audit Log & Garment Quality Control',
    iconName: 'ShieldCheck',
    defaultPath: '/admin/platform-overview',
    modules: [
      {
        id: 'system-admin',
        code: 'MOD-01',
        title: 'User & System Admin',
        iconName: 'Shield',
        submodules: [
          {
            id: 'admin-platform',
            title: 'User Management',
            children: [
              { id: 'admin-dash', title: 'System Status', path: '/admin/platform-overview' },
              { id: 'admin-users', title: 'Users & Permissions', path: '/admin/users' },
              { id: 'admin-devices', title: 'Floor Tablets & Scanners', path: '/admin/devices' },
            ],
          },
          {
            id: 'admin-audit',
            title: 'Security & Safety',
            children: [
              { id: 'admin-worm', title: 'Security Audit Log', path: '/admin/audit-vault' },
              { id: 'admin-purge', title: 'Data Cleanup Console', path: '/admin/purge-console' },
            ],
          },
        ],
      },
      {
        id: 'quality-control',
        code: 'MOD-10',
        title: 'Quality Inspection',
        iconName: 'CheckCheck',
        submodules: [
          {
            id: 'qc-ops',
            title: 'Floor Quality',
            children: [
              { id: 'qc-dhu', title: 'Live Defect Rates Board', path: '/qc/dhu-board' },
              { id: 'qc-endline', title: 'End-Line Inspection', path: '/qc/station/end-line' },
              { id: 'qc-rework', title: 'Defect Repair Routing', path: '/qc/alter-routing' },
              { id: 'qc-aql', title: 'Buyer Quality Check', path: '/qc/aql-audits' },
              { id: 'qc-pareto', title: 'Top Defect Reports', path: '/qc/pareto' },
            ],
          },
        ],
      },
      {
        id: 'plant-master',
        code: 'MOD-02',
        title: 'Factory Settings',
        iconName: 'Sliders',
        submodules: [
          {
            id: 'master-plant-group',
            title: 'Factory Master Data',
            children: [
              { id: 'master-lines', title: 'Sewing Lines & Tables', path: '/master-data/lines' },
              { id: 'master-sizes', title: 'Garment Sizes List', path: '/master-data/sizes' },
              { id: 'master-defects', title: 'Defect Types List', path: '/master-data/defects' },
            ],
          },
        ],
      },
    ],
  },
];
