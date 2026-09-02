import React from 'react';
import { useThemeStore, type SidebarTheme } from '../../store/themeStore';
import { Check } from 'lucide-react';

export const SidebarThemeSelector: React.FC<{ isCollapsed?: boolean }> = ({ isCollapsed = false }) => {
  const { sidebarTheme, setSidebarTheme } = useThemeStore();

  const themes: { id: SidebarTheme; label: string; colorClass: string; bgBadge: string }[] = [
    {
      id: 'indigo',
      label: 'Royal Indigo',
      colorClass: 'bg-[#1e1b4b] border-indigo-400',
      bgBadge: 'text-indigo-400',
    },
    {
      id: 'navy',
      label: 'Midnight Slate',
      colorClass: 'bg-[#0f172a] border-slate-400',
      bgBadge: 'text-slate-400',
    },
    {
      id: 'gray',
      label: 'Steel Gray',
      colorClass: 'bg-slate-300 dark:bg-zinc-700 border-slate-500',
      bgBadge: 'text-slate-600',
    },
  ];

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-1.5 py-1">
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSidebarTheme(t.id)}
            title={`Sidebar Theme: ${t.label}`}
            className={`w-4 h-4 rounded-full border transition-all ${t.colorClass} ${
              sidebarTheme === t.id ? 'ring-2 ring-blue-500 scale-110' : 'opacity-60 hover:opacity-100'
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
        Theme:
      </span>
      <div className="flex items-center gap-1.5 bg-black/20 dark:bg-black/40 p-1 rounded-md">
        {themes.map((t) => {
          const isSelected = sidebarTheme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSidebarTheme(t.id)}
              title={t.label}
              className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${
                t.colorClass
              } ${
                isSelected
                  ? 'ring-2 ring-blue-500 scale-110 shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
