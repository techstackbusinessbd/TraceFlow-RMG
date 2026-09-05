export interface Organization {
  id: string;
  name: string;
  code: string;
  registration_no?: string;
  logo_path?: string;
  address?: string;
  country: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  settings?: {
    fiscal_year_start?: string;
    timezone?: string;
    currency?: string;
    [key: string]: any;
  };
  companies_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Company {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  bin_number?: string;
  tin_number?: string;
  trade_license?: string;
  registered_address?: string;
  contact_email?: string;
  contact_phone?: string;
  currency: string;
  is_active: boolean;
  factory_units_count?: number;
  organization?: Organization;
  created_at?: string;
  updated_at?: string;
}

export interface FactoryUnit {
  id: string;
  company_id: string;
  name: string;
  code: string;
  premises_type: 'Woven' | 'Knit' | 'Denim' | 'Washing' | 'Composite' | 'Warehouse' | 'Printing' | 'Embroidery' | 'Central Warehouse';
  address?: string;
  city?: string;
  total_floors: number;
  compliance_grade?: string;
  is_active: boolean;
  production_lines_count?: number;
  company?: Company;
  created_at?: string;
  updated_at?: string;
}

export interface Building {
  id: string;
  factory_unit_id: string;
  name: string;
  code: string;
  total_floors: number;
  description?: string;
  is_active: boolean;
  floors_count?: number;
  production_lines_count?: number;
  factory_unit?: FactoryUnit;
  created_at?: string;
  updated_at?: string;
}

export interface Floor {
  id: string;
  building_id: string;
  name: string;
  floor_number: string;
  code: string;
  sort_order: number;
  area_sqft?: number;
  is_active: boolean;
  production_lines_count?: number;
  building?: Building;
  created_at?: string;
  updated_at?: string;
}

export interface ProductionLine {
  id: string;
  factory_unit_id: string;
  building_id?: string | null;
  floor_id?: string | null;
  name: string;
  code: string;
  section_type: 'Cutting' | 'Sewing' | 'Embroidery' | 'Printing' | 'Finishing' | 'Washing' | 'QC' | 'Packing';
  floor_no: string;
  operator_capacity: number;
  target_efficiency_percentage: number | string;
  is_active: boolean;
  factory_unit?: FactoryUnit;
  building?: Building;
  floor?: Floor;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  status: string;
  data: {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
