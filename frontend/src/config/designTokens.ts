/**
 * TraceFlow RMG Enterprise Design Tokens
 * Single Source of Truth for Global Color, Geometry, and Typography Standards.
 * Strictly adheres to Flat Solid Colors (No Gradients) and Clean Enterprise Aesthetics.
 */

export const UI_TOKENS = {
  // Geometry
  radius: {
    base: 'rounded-md',    // Standard 4px-6px enterprise corner radius
    sm: 'rounded-sm',
    full: 'rounded-full',
  },

  // Buttons (Action Controls)
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 border border-blue-600 rounded-md transition-colors shadow-2xs select-none disabled:opacity-50 disabled:cursor-not-allowed',
    primarySm:
      'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 border border-blue-600 rounded-md transition-colors shadow-2xs select-none disabled:opacity-50 disabled:cursor-not-allowed',
    
    secondary:
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-md transition-colors shadow-2xs select-none disabled:opacity-50 disabled:cursor-not-allowed',
    secondarySm:
      'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-md transition-colors shadow-2xs select-none disabled:opacity-50 disabled:cursor-not-allowed',
    
    danger:
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 border border-rose-600 rounded-md transition-colors shadow-2xs select-none disabled:opacity-50 disabled:cursor-not-allowed',
    dangerSm:
      'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 border border-rose-600 rounded-md transition-colors shadow-2xs select-none disabled:opacity-50 disabled:cursor-not-allowed',
    
    subtle:
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 rounded-md transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed',
    subtleSm:
      'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 rounded-md transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed',
  },

  // Data Table Row Actions (32x32px Fixed Proportions)
  tableAction: {
    base:
      'w-8 h-8 inline-flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-md transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed',
    primary:
      'w-8 h-8 inline-flex items-center justify-center border border-blue-200 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-md transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed',
    purple:
      'w-8 h-8 inline-flex items-center justify-center border border-purple-200 bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white rounded-md transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed',
    warning:
      'w-8 h-8 inline-flex items-center justify-center border border-amber-300 bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white rounded-md transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed',
    danger:
      'w-8 h-8 inline-flex items-center justify-center border border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-md transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed',
  },

  // Badges & Status Pills (Consistent Padding & Font)
  badge: {
    success:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-md tracking-wide select-none',
    danger:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-300 rounded-md tracking-wide select-none',
    warning:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-300 rounded-md tracking-wide select-none',
    info:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-300 rounded-md tracking-wide select-none',
    neutral:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded-md tracking-wide select-none',
    root:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-purple-800 bg-purple-50 border border-purple-300 rounded-md tracking-wide select-none',
  },

  // Form Controls
  input: {
    base:
      'w-full px-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 rounded-md focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400',
    select:
      'w-full px-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 rounded-md focus:outline-none focus:border-blue-600 transition-colors font-medium',
  },

  // Cards & Panels
  card: {
    base: 'bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden',
    header: 'bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between',
    body: 'p-5',
  },

  // Table Shell
  table: {
    wrapper: 'bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden',
    headerRow: 'bg-slate-50 border-b border-slate-200',
    th: 'py-3.5 px-4 font-semibold text-xs text-slate-700 uppercase tracking-wider',
    tr: 'hover:bg-slate-50/90 transition-colors group',
    td: 'py-3.5 px-4 align-middle text-sm text-slate-700',
  },

  // Alert & Feedback Banners
  alert: {
    success:
      'p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-medium rounded-md flex items-center justify-between shadow-2xs transition-all',
    error:
      'p-3.5 bg-rose-50 border border-rose-300 text-rose-900 text-sm font-medium rounded-md flex items-center justify-between shadow-2xs transition-all',
    warning:
      'p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-sm font-medium rounded-md flex items-center justify-between shadow-2xs transition-all',
    info:
      'p-3.5 bg-blue-50 border border-blue-300 text-blue-900 text-sm font-medium rounded-md flex items-center justify-between shadow-2xs transition-all',
  },
} as const;
