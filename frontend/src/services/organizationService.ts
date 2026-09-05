import apiClient from './apiClient';
import type { Building, Company, FactoryUnit, Floor, Organization, PaginatedResponse, ProductionLine } from '../types/organization';

export const organizationService = {
  // 1. Group Organization
  async getOrganization(): Promise<Organization> {
    const res = await apiClient.get('/v1/master/organization');
    return res.data.data;
  },

  async updateOrganization(payload: Partial<Organization>): Promise<Organization> {
    const res = await apiClient.put('/v1/master/organization', payload);
    return res.data.data;
  },

  // 2. Sister Companies
  async getCompanies(params?: { search?: string; is_active?: boolean | string; page?: number; per_page?: number }): Promise<PaginatedResponse<Company>['data']> {
    const res = await apiClient.get('/v1/master/companies', { params });
    return res.data.data;
  },

  async getActiveCompanies(): Promise<{ id: string; name: string; code: string; currency: string }[]> {
    const res = await apiClient.get('/v1/master/companies/active');
    return res.data.data;
  },

  async getCompany(id: string): Promise<Company> {
    const res = await apiClient.get(`/v1/master/companies/${id}`);
    return res.data.data;
  },

  async createCompany(payload: Partial<Company>): Promise<Company> {
    const res = await apiClient.post('/v1/master/companies', payload);
    return res.data.data;
  },

  async updateCompany(id: string, payload: Partial<Company>): Promise<Company> {
    const res = await apiClient.put(`/v1/master/companies/${id}`, payload);
    return res.data.data;
  },

  async deleteCompany(id: string): Promise<void> {
    await apiClient.delete(`/v1/master/companies/${id}`);
  },

  // 3. Factory Plants / Units
  async getFactoryUnits(params?: { company_id?: string; premises_type?: string; search?: string; is_active?: boolean | string; page?: number; per_page?: number }): Promise<PaginatedResponse<FactoryUnit>['data']> {
    const res = await apiClient.get('/v1/master/units', { params });
    return res.data.data;
  },

  async getActiveUnits(companyId?: string): Promise<{ id: string; company_id: string; name: string; code: string; premises_type: string }[]> {
    const res = await apiClient.get('/v1/master/units/active', { params: { company_id: companyId } });
    return res.data.data;
  },

  async getFactoryUnit(id: string): Promise<FactoryUnit> {
    const res = await apiClient.get(`/v1/master/units/${id}`);
    return res.data.data;
  },

  async createFactoryUnit(payload: Partial<FactoryUnit>): Promise<FactoryUnit> {
    const res = await apiClient.post('/v1/master/units', payload);
    return res.data.data;
  },

  async updateFactoryUnit(id: string, payload: Partial<FactoryUnit>): Promise<FactoryUnit> {
    const res = await apiClient.put(`/v1/master/units/${id}`, payload);
    return res.data.data;
  },

  async deleteFactoryUnit(id: string): Promise<void> {
    await apiClient.delete(`/v1/master/units/${id}`);
  },

  // 4. Factory Buildings
  async getBuildings(params?: { factory_unit_id?: string; search?: string; is_active?: boolean | string; page?: number; per_page?: number }): Promise<PaginatedResponse<Building>['data']> {
    const res = await apiClient.get('/v1/master/buildings', { params });
    return res.data.data;
  },

  async getActiveBuildings(factoryUnitId?: string): Promise<Building[]> {
    const res = await apiClient.get('/v1/master/buildings/active', { params: { factory_unit_id: factoryUnitId } });
    return res.data.data;
  },

  async getBuilding(id: string): Promise<Building> {
    const res = await apiClient.get(`/v1/master/buildings/${id}`);
    return res.data.data;
  },

  async getNextBuildingCode(factoryUnitId?: string): Promise<string> {
    const res = await apiClient.get('/v1/master/buildings/next-code', { params: { factory_unit_id: factoryUnitId } });
    return res.data.data.code;
  },

  async createBuilding(payload: Partial<Building>): Promise<Building> {
    const res = await apiClient.post('/v1/master/buildings', payload);
    return res.data.data;
  },

  async updateBuilding(id: string, payload: Partial<Building>): Promise<Building> {
    const res = await apiClient.put(`/v1/master/buildings/${id}`, payload);
    return res.data.data;
  },

  async deleteBuilding(id: string): Promise<void> {
    await apiClient.delete(`/v1/master/buildings/${id}`);
  },

  // 5. Building Floors (strictly ordered by sort_order)
  async getFloors(params?: { building_id?: string; factory_unit_id?: string; search?: string; is_active?: boolean | string; page?: number; per_page?: number }): Promise<PaginatedResponse<Floor>['data']> {
    const res = await apiClient.get('/v1/master/floors', { params });
    return res.data.data;
  },

  async getActiveFloors(params?: { building_id?: string; factory_unit_id?: string }): Promise<Floor[]> {
    const res = await apiClient.get('/v1/master/floors/active', { params });
    return res.data.data;
  },

  async getFloor(id: string): Promise<Floor> {
    const res = await apiClient.get(`/v1/master/floors/${id}`);
    return res.data.data;
  },

  async getNextFloorCode(buildingId?: string): Promise<string> {
    const res = await apiClient.get('/v1/master/floors/next-code', { params: { building_id: buildingId } });
    return res.data.data.code;
  },

  async createFloor(payload: Partial<Floor>): Promise<Floor> {
    const res = await apiClient.post('/v1/master/floors', payload);
    return res.data.data;
  },

  async updateFloor(id: string, payload: Partial<Floor>): Promise<Floor> {
    const res = await apiClient.put(`/v1/master/floors/${id}`, payload);
    return res.data.data;
  },

  async deleteFloor(id: string): Promise<void> {
    await apiClient.delete(`/v1/master/floors/${id}`);
  },

  // 6. Production Lines & Sections
  async getProductionLines(params?: { factory_unit_id?: string; building_id?: string; floor_id?: string; section_type?: string; search?: string; is_active?: boolean | string; page?: number; per_page?: number }): Promise<PaginatedResponse<ProductionLine>['data']> {
    const res = await apiClient.get('/v1/master/lines', { params });
    return res.data.data;
  },

  async getActiveLines(params?: { factory_unit_id?: string; section_type?: string }): Promise<ProductionLine[]> {
    const res = await apiClient.get('/v1/master/lines/active', { params });
    return res.data.data;
  },

  async getProductionLine(id: string): Promise<ProductionLine> {
    const res = await apiClient.get(`/v1/master/lines/${id}`);
    return res.data.data;
  },

  async getNextLineCode(params?: { factory_unit_id?: string; section_type?: string }): Promise<string> {
    const res = await apiClient.get('/v1/master/lines/next-code', { params });
    return res.data.data.code;
  },

  async createProductionLine(payload: Partial<ProductionLine>): Promise<ProductionLine> {
    const res = await apiClient.post('/v1/master/lines', payload);
    return res.data.data;
  },

  async updateProductionLine(id: string, payload: Partial<ProductionLine>): Promise<ProductionLine> {
    const res = await apiClient.put(`/v1/master/lines/${id}`, payload);
    return res.data.data;
  },

  async deleteProductionLine(id: string): Promise<void> {
    await apiClient.delete(`/v1/master/lines/${id}`);
  },
};
