/**
 * TraceFlow RMG Enterprise Design Tokens
 * Single Source of Truth for Global Color, Geometry, and Typography Standards.
 * Strictly adheres to Flat Solid Colors (No Gradients) and Clean Enterprise Aesthetics.
 * Fully supports Dual Mode: Crisp Light & Deep Slate Dark Mode.
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
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 border border-slate-300 dark:border-slate-700 rounded-md transition-colors shadow-2xs select-none disabled:opacity-50 disabled:cursor-not-allowed',
    secondarySm:
      'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 border border-slate-300 dark:border-slate-700 rounded-md transition-colors shadow-2xs select-none disabled:opacity-50 disabled:cursor-not-allowed',
    
    danger:
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 border border-rose-600 rounded-md transition-colors shadow-2xs select-none disabled:opacity-50 disabled:cursor-not-allowed',
    dangerSm:
      'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 border border-rose-600 rounded-md transition-colors shadow-2xs select-none disabled:opacity-50 disabled:cursor-not-allowed',
    
    subtle:
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 border border-slate-200 dark:border-slate-700 rounded-md transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed',
    subtleSm:
      'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 border border-slate-200 dark:border-slate-700 rounded-md transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed',
  },

  // Data Table Row Actions (32x32px Fixed Proportions)
  tableAction: {
    base:
      'w-8 h-8 inline-flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed',
    primary:
      'w-8 h-8 inline-flex items-center justify-center border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white rounded-md transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed',
    purple:
      'w-8 h-8 inline-flex items-center justify-center border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-600 text-purple-700 dark:text-purple-300 hover:text-white rounded-md transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed',
    warning:
      'w-8 h-8 inline-flex items-center justify-center border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-600 text-amber-800 dark:text-amber-300 hover:text-white rounded-md transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed',
    danger:
      'w-8 h-8 inline-flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-300 rounded-md transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed',
  },

  // Badges & Status Pills (Consistent Padding & Font with Dark Mode Support)
  badge: {
    success:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-md tracking-wide select-none',
    danger:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-md tracking-wide select-none',
    warning:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-md tracking-wide select-none',
    info:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 rounded-md tracking-wide select-none',
    neutral:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md tracking-wide select-none',
    root:
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 rounded-md tracking-wide select-none',
  },

  // Form Controls
  input: {
    base:
      'w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500',
    select:
      'w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors font-medium',
  },

  // Cards & Panels
  card: {
    base: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-2xs overflow-hidden',
    header: 'bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 flex items-center justify-between text-slate-900 dark:text-slate-100',
    body: 'p-5',
  },

  // Table Shell
  table: {
    wrapper: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-2xs overflow-hidden',
    headerRow: 'bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800',
    th: 'py-3.5 px-4 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider',
    tr: 'hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors group',
    td: 'py-3.5 px-4 align-middle text-sm text-slate-700 dark:text-slate-300',
  },

  // Page Header (Ultra-Compact Enterprise Standard)
  pageHeader: {
    wrapper:
      'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1',
    iconWrapper:
      'w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0',
    title:
      'text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5',
    titleSm:
      'text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2',
    description:
      'text-xs text-slate-500 dark:text-slate-400 mt-0.5',
    actions:
      'flex items-center gap-2.5 shrink-0',
  },

  // Breadcrumbs
  breadcrumb: {
    wrapper:
      'flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5',
    link:
      'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors',
    separator:
      'text-slate-400 dark:text-slate-600 select-none',
    current:
      'text-slate-800 dark:text-slate-200 font-semibold',
  },

  // Filter Bar Shell
  filter: {
    container:
      'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-2xs p-4 space-y-3',
    row:
      'flex flex-col sm:flex-row items-stretch sm:items-center gap-3',
    subline:
      'flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 gap-3',
  },

  // Alert & Feedback Banners
  alert: {
    success:
      'p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm font-medium rounded-md flex items-center justify-between shadow-2xs transition-all',
    error:
      'p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-sm font-medium rounded-md flex items-center justify-between shadow-2xs transition-all',
    warning:
      'p-3.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm font-medium rounded-md flex items-center justify-between shadow-2xs transition-all',
    info:
      'p-3.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-sm font-medium rounded-md flex items-center justify-between shadow-2xs transition-all',
  },

  // Enterprise Tab Navigation
  tab: {
    container:
      'flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-px overflow-x-auto select-none',
    itemActive:
      'inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/40 dark:bg-blue-950/30 rounded-t-md transition-all',
    itemInactive:
      'inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-md transition-all border-b-2 border-transparent',
  },

  // Enterprise Vertical Navigation List (Modules/Sections)
  navList: {
    itemActive:
      'w-full text-left px-4 py-3.5 transition-colors flex items-center justify-between gap-3 bg-blue-50/80 dark:bg-blue-950/50 border-l-4 border-blue-600 text-blue-700 dark:text-blue-300 font-bold',
    itemInactive:
      'w-full text-left px-4 py-3.5 transition-colors flex items-center justify-between gap-3 border-l-4 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium',
  },
} as const;
