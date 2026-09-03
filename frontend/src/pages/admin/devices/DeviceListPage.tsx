import React, { useEffect, useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import {
  Tablet,
  Search,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  ShieldCheck,
  ShieldAlert,
  X,
  ScanBarcode,
  Radio,
  Monitor
} from 'lucide-react';
import { deviceService, type DeviceItem, type DevicePayload } from '../../../services/deviceService';
import { Button } from '../../../components/common/Button';
import { Badge, type BadgeVariant } from '../../../components/common/Badge';
import { alertService } from '../../../services/alertService';
import { UI_TOKENS } from '../../../config/designTokens';

export const DeviceListPage: React.FC = () => {
  const [, startTransition] = useTransition();

  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [perPage, setPerPage] = useState<number>(15);
  const [page, setPage] = useState<number>(1);

  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });

  const [metrics, setMetrics] = useState({
    total_devices: 0,
    online_devices: 0,
    tablet_devices: 0,
    revoked_devices: 0,
  });

  // Drawer Form State (No Modals Rule)
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [editingDevice, setEditingDevice] = useState<DeviceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<DevicePayload>({
    device_code: '',
    device_name: '',
    device_type: 'TABLET',
    assigned_location: '',
    mac_address: '',
    ip_address: '',
    pairing_status: 'PAIRED',
    is_active: true,
  });

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const res = await deviceService.getDevices({
        search: searchTerm.trim() || undefined,
        device_type: selectedType || undefined,
        pairing_status: selectedStatus || undefined,
        page,
        per_page: perPage,
      });

      setDevices(res.data);
      setPagination({
        total: res.pagination.total,
        per_page: res.pagination.per_page,
        current_page: res.pagination.current_page,
        last_page: res.pagination.last_page,
        from: res.pagination.from ?? 0,
        to: res.pagination.to ?? 0,
      });
      setMetrics(res.metrics);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      alertService.error('Hardware Registry Error', errorObj.response?.data?.detail || 'Failed to query factory devices.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [page, perPage, selectedType, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDevices();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedStatus('');
    setPerPage(15);
    setPage(1);
    startTransition(() => {
      fetchDevices();
    });
  };

  const handleOpenCreateDrawer = () => {
    setEditingDevice(null);
    setFormData({
      device_code: '',
      device_name: '',
      device_type: 'TABLET',
      assigned_location: '',
      mac_address: '',
      ip_address: '',
      pairing_status: 'PAIRED',
      is_active: true,
    });
    setFormErrors({});
    setShowDrawer(true);
  };

  const handleOpenEditDrawer = (device: DeviceItem) => {
    setEditingDevice(device);
    setFormData({
      device_code: device.device_code,
      device_name: device.device_name,
      device_type: device.device_type,
      assigned_location: device.assigned_location,
      mac_address: device.mac_address || '',
      ip_address: device.ip_address || '',
      pairing_status: device.pairing_status,
      is_active: device.is_active,
    });
    setFormErrors({});
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingDevice(null);
    setFormErrors({});
  };

  const handleSubmitDrawer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      if (editingDevice) {
        await deviceService.updateDevice(editingDevice.id, formData);
        alertService.success('Device Updated', `Configuration for [${formData.device_code}] has been saved.`);
      } else {
        await deviceService.createDevice(formData);
        alertService.success('Device Enrolled', `Hardware [${formData.device_code}] enrolled successfully.`);
      }
      handleCloseDrawer();
      fetchDevices();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
      if (errorObj.response?.data?.errors) {
        setFormErrors(errorObj.response.data.errors);
      }
      alertService.error('Validation Error', errorObj.response?.data?.message || 'Failed to save device profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePairing = async (device: DeviceItem) => {
    try {
      const res = await deviceService.togglePairing(device.id);
      alertService.success('Authorization Updated', res.message);
      fetchDevices();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alertService.error('Action Failed', errorObj.response?.data?.message || 'Could not update pairing status.');
    }
  };

  const handleDeleteDevice = async (device: DeviceItem) => {
    if (!window.confirm(`Are you sure you want to decommission device [${device.device_code}]?`)) {
      return;
    }
    try {
      const res = await deviceService.deleteDevice(device.id);
      alertService.success('Device Decommissioned', res.message);
      fetchDevices();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alertService.error('Decommission Failed', errorObj.response?.data?.message || 'Failed to remove device.');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'TABLET':
        return <Tablet className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'BARCODE_TERMINAL':
        return <ScanBarcode className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'RFID_SCANNER':
        return <Radio className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'PAIRED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REVOKED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <Link to="/admin/platform-overview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Platform</Link>
            <span>/</span>
            <span className="text-slate-500 dark:text-slate-400">Device Management</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Tablets & Devices</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Tablet className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              <span>Factory Tablets & Terminals Registry</span>
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md">
              Hardware Access Control
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage, authorize, and monitor ruggedized Android tablets, QC barcode terminals, and warehouse RFID guns.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreateDrawer}
          >
            Enroll New Device
          </Button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Total Enrolled Devices</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{metrics.total_devices}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Authorized factory hardware</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Live Active Terminals</div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{metrics.online_devices}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Heartbeat within 15 minutes</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">Floor Tablets</div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-1">{metrics.tablet_devices}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cutting & Sewing units</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400">Revoked / Suspended</div>
          <div className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-1">{metrics.revoked_devices}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Blocked hardware access</div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* INLINE ENROLLMENT / EDIT DRAWER (No Modals Rule) */}
      {/* ==================================================================== */}
      {showDrawer && (
        <div className="bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-md shadow-lg p-6 space-y-4 text-slate-900 dark:text-slate-100 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Tablet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingDevice ? `Edit Device Configuration [${editingDevice.device_code}]` : 'Enroll New Factory Device'}
              </h3>
            </div>
            <Button variant="secondary" size="sm" icon={<X className="w-4 h-4" />} onClick={handleCloseDrawer}>
              Cancel
            </Button>
          </div>

          <form noValidate onSubmit={handleSubmitDrawer} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Device Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Device Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.device_code}
                  onChange={(e) => setFormData({ ...formData, device_code: e.target.value })}
                  placeholder="e.g. DEV-CUT-01"
                  className={UI_TOKENS.input.base}
                />
                {formErrors.device_code && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{formErrors.device_code[0]}</p>
                )}
              </div>

              {/* Device Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Device Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.device_name}
                  onChange={(e) => setFormData({ ...formData, device_name: e.target.value })}
                  placeholder="e.g. Cutting Marker Tablet #1"
                  className={UI_TOKENS.input.base}
                />
                {formErrors.device_name && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{formErrors.device_name[0]}</p>
                )}
              </div>

              {/* Device Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hardware Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.device_type}
                  onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                  className={UI_TOKENS.input.select}
                >
                  <option value="TABLET">Tablet (Android Ruggedized)</option>
                  <option value="BARCODE_TERMINAL">Barcode Scanner Terminal</option>
                  <option value="RFID_SCANNER">RFID Handheld Gun</option>
                  <option value="WORKSTATION">Fixed Workstation Desktop</option>
                </select>
                {formErrors.device_type && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{formErrors.device_type[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Assigned Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Factory Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.assigned_location}
                  onChange={(e) => setFormData({ ...formData, assigned_location: e.target.value })}
                  placeholder="e.g. Floor 2 - Sewing Line 03"
                  className={UI_TOKENS.input.base}
                />
                {formErrors.assigned_location && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{formErrors.assigned_location[0]}</p>
                )}
              </div>

              {/* IP Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Fixed IP Address (Optional)
                </label>
                <input
                  type="text"
                  value={formData.ip_address || ''}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  placeholder="e.g. 192.168.10.101"
                  className={UI_TOKENS.input.base}
                />
                {formErrors.ip_address && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{formErrors.ip_address[0]}</p>
                )}
              </div>

              {/* Pairing Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Pairing Status
                </label>
                <select
                  value={formData.pairing_status}
                  onChange={(e) => setFormData({ ...formData, pairing_status: e.target.value })}
                  className={UI_TOKENS.input.select}
                >
                  <option value="PAIRED">Authorized & Paired</option>
                  <option value="PENDING">Pending Authorization</option>
                  <option value="REVOKED">Revoked / Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="secondary" onClick={handleCloseDrawer}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {editingDevice ? 'Update Device Profile' : 'Enroll Device'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FILTER TOOLBAR */}
      {/* ==================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Universal Text Search */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Device Code, Name, Location, or IP..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-medium"
            >
              <option value="">All Hardware Types</option>
              <option value="TABLET">Tablets</option>
              <option value="BARCODE_TERMINAL">Barcode Terminals</option>
              <option value="RFID_SCANNER">RFID Scanners</option>
              <option value="WORKSTATION">Workstations</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-medium"
            >
              <option value="">All Pairing Statuses</option>
              <option value="PAIRED">Paired & Authorized</option>
              <option value="PENDING">Pending</option>
              <option value="REVOKED">Revoked / Suspended</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="md:col-span-1 flex items-center gap-1.5">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Filter
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleResetFilters}
              title="Reset all filters"
              icon={<RotateCcw className="w-4 h-4" />}
            />
          </div>
        </form>

        {/* Subline */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Sorted by: <strong>DEVICE CODE (ASC)</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span>Show per page:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* DEVICES DATA TABLE */}
      {/* ==================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4 w-44 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Device Code
                </th>
                <th className="py-3.5 px-4 w-60 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Designation & Hardware Type
                </th>
                <th className="py-3.5 px-4 w-52 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Assigned Factory Location
                </th>
                <th className="py-3.5 px-4 w-36 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Heartbeat
                </th>
                <th className="py-3.5 px-4 w-36 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Pairing Status
                </th>
                <th className="py-3.5 px-4 w-44 text-right font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 dark:text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                      <span className="text-xs font-medium">Loading hardware terminals registry...</span>
                    </div>
                  </td>
                </tr>
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500 dark:text-slate-400">
                    <Tablet className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-800 dark:text-slate-200">No factory devices found.</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Enroll your first tablet or barcode scanner terminal.</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleOpenCreateDrawer}
                      className="mt-3"
                    >
                      Enroll Device
                    </Button>
                  </td>
                </tr>
              ) : (
                devices.map((device) => {
                  const isPaired = device.pairing_status === 'PAIRED';

                  return (
                    <tr key={device.id} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors group">
                      {/* Device Code */}
                      <td className="py-3.5 px-4 align-middle">
                        <Badge variant="neutral" className="font-mono text-xs font-bold">
                          {device.device_code}
                        </Badge>
                      </td>

                      {/* Designation & Hardware Type */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded">
                            {getTypeIcon(device.device_type)}
                          </div>
                          <div className="truncate">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block truncate">
                              {device.device_name}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              {device.device_type} • {device.ip_address || 'DHCP'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Factory Location */}
                      <td className="py-3.5 px-4 align-middle text-xs font-medium text-slate-800 dark:text-slate-200">
                        {device.assigned_location}
                      </td>

                      {/* Heartbeat Ping */}
                      <td className="py-3.5 px-4 align-middle">
                        {device.last_ping_at ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                            <Wifi className="w-3.5 h-3.5" />
                            <span className="font-mono text-[11px]">Online</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                            <WifiOff className="w-3.5 h-3.5" />
                            <span className="font-mono text-[11px]">No Signal</span>
                          </div>
                        )}
                      </td>

                      {/* Pairing Status */}
                      <td className="py-3.5 px-4 align-middle">
                        <Badge variant={getStatusBadgeVariant(device.pairing_status)}>
                          {device.pairing_status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="secondary"
                            size="sm"
                            title={isPaired ? 'Revoke Authorization' : 'Authorize Pairing'}
                            icon={isPaired ? <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                            onClick={() => handleTogglePairing(device)}
                          />

                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Edit2 className="w-3.5 h-3.5" />}
                            onClick={() => handleOpenEditDrawer(device)}
                          />

                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
                            onClick={() => handleDeleteDevice(device)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 gap-3 select-none">
          <div>
            Showing{' '}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">
              {pagination.total > 0 ? (page - 1) * perPage + 1 : 0}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">
              {Math.min(page * perPage, pagination.total)}
            </strong>{' '}
            of <strong className="text-slate-900 dark:text-slate-100 font-semibold">{pagination.total}</strong> registered devices
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(page - 1)}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>

            <span className="px-3 py-1.5 font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md">
              Page {page} of {Math.max(pagination.last_page, 1)}
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={page >= pagination.last_page || isLoading}
              onClick={() => setPage(page + 1)}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
