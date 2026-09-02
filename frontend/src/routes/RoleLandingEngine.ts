/**
 * RoleLandingEngine.ts
 * Strict Role Precedence Resolver for Post-Login Dynamic Redirection.
 * Enforces immediate routing to designated role dashboards.
 */

export const resolveLandingPath = (userRoles: string[], customLandingPath?: string): string => {
  // 1. If user has an explicit custom dashboard path
  if (customLandingPath && customLandingPath.startsWith('/')) {
    return customLandingPath;
  }

  // 2. Strict Precedence Hierarchy
  if (userRoles.includes('Super Admin') || userRoles.includes('Platform Owner')) {
    return '/admin/platform-overview';
  }
  if (userRoles.some((r) => ['Managing Director', 'CEO', 'Chairman'].includes(r))) {
    return '/commercial/bi/dashboard';
  }
  if (userRoles.some((r) => ['General Manager', 'Plant Head'].includes(r))) {
    return '/planning/dashboard';
  }
  if (userRoles.some((r) => ['Head of QA', 'Quality Manager'].includes(r))) {
    return '/qc/dhu-board';
  }
  if (userRoles.some((r) => ['Fabric Store Manager', 'Warehouse Head'].includes(r))) {
    return '/warehouse/dashboard';
  }
  if (userRoles.some((r) => ['CFO', 'Commercial Manager'].includes(r))) {
    return '/commercial/dashboard';
  }
  if (userRoles.some((r) => ['Planning Manager', 'IE Manager'].includes(r))) {
    return '/planning';
  }
  if (userRoles.includes('IT Admin')) {
    return '/admin/devices';
  }
  if (userRoles.includes('Cutting Master')) {
    return '/cutting/station/bundles';
  }
  if (userRoles.includes('Sewing Supervisor')) {
    return '/sewing/station/line-in';
  }
  if (userRoles.includes('Floor Operator')) {
    return '/sewing/station/line-out';
  }
  if (userRoles.includes('End-Line QC Inspector')) {
    return '/qc/station/end-line';
  }
  if (userRoles.includes('Floor TV Device')) {
    return '/sewing/andon-display';
  }

  // Fallback for Merchandisers and general office staff
  return '/orders';
};
