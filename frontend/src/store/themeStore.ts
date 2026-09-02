import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';
export type SidebarTheme = 'indigo' | 'navy' | 'gray';

interface ThemeState {
  theme: ThemeMode;
  sidebarTheme: SidebarTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setSidebarTheme: (sidebarTheme: SidebarTheme) => void;
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem('traceflow_theme') as ThemeMode | null;
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const getInitialSidebarTheme = (): SidebarTheme => {
  const saved = localStorage.getItem('traceflow_sidebar_theme') as SidebarTheme | null;
  if (saved === 'indigo' || saved === 'navy' || saved === 'gray') {
    return saved;
  }
  return 'indigo'; // Default to Royal RMG Indigo
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  sidebarTheme: getInitialSidebarTheme(),

  setTheme: (theme: ThemeMode) => {
    localStorage.setItem('traceflow_theme', theme);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },

  setSidebarTheme: (sidebarTheme: SidebarTheme) => {
    localStorage.setItem('traceflow_sidebar_theme', sidebarTheme);
    set({ sidebarTheme });
  },
}));

// Initialize theme on app load
const initialTheme = getInitialTheme();
document.documentElement.style.colorScheme = initialTheme;
document.documentElement.setAttribute('data-theme', initialTheme);
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
} else {
  document.documentElement.classList.add('light');
  document.documentElement.classList.remove('dark');
}
