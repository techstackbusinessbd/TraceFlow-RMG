import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem('traceflow_theme') as ThemeMode | null;
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  // Default to light mode for crisp daytime corporate use or respect system
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),

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
