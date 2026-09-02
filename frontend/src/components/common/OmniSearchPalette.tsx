import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, CornerDownLeft, X, Shield, Factory, ShoppingBag, Layers } from 'lucide-react';
import { ENTERPRISE_NAV_SECTIONS } from '../../config/navigationData';

interface OmniSearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OmniSearchPalette: React.FC<OmniSearchPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten all navigable items across all 4 departments
  const allItems = useMemo(() => {
    const list: {
      id: string;
      title: string;
      path: string;
      sectionTitle: string;
      sectionId: string;
      moduleTitle: string;
    }[] = [];

    ENTERPRISE_NAV_SECTIONS.forEach((sec) => {
      sec.modules.forEach((mod) => {
        mod.submodules.forEach((sub) => {
          sub.children.forEach((leaf) => {
            list.push({
              id: leaf.id,
              title: leaf.title,
              path: leaf.path,
              sectionTitle: sec.title,
              sectionId: sec.id,
              moduleTitle: mod.title,
            });
          });
        });
      });
    });

    return list;
  }, []);

  // Filter items based on user search query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return allItems.slice(0, 8); // Top default suggestions
    }
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.sectionTitle.toLowerCase().includes(q) ||
          item.moduleTitle.toLowerCase().includes(q) ||
          item.path.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [allItems, query]);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          navigate(filteredItems[selectedIndex].path);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  const getSectionIcon = (secId: string) => {
    switch (secId) {
      case 'merchandising-commercial':
        return <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />;
      case 'supply-chain-warehouse':
        return <Layers className="w-3.5 h-3.5 text-emerald-500" />;
      case 'production-execution':
        return <Factory className="w-3.5 h-3.5 text-amber-500" />;
      case 'quality-governance':
      default:
        return <Shield className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm transition-all">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search POs, styles, bundles, rolls, or screens..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching pages found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`p-1.5 rounded-md ${
                        isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {getSectionIcon(item.sectionId)}
                    </span>
                    <div className="truncate">
                      <div className="font-semibold truncate">{item.title}</div>
                      <div
                        className={`text-[11px] truncate ${
                          isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {item.sectionTitle} &rsaquo; {item.moduleTitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[10px] bg-blue-700 px-1.5 py-0.5 rounded font-mono">
                        <span>Press Enter</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Palette Footer Help Bar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">
                &uarr; &darr;
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">
                Enter
              </kbd>{' '}
              Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">
                Esc
              </kbd>{' '}
              Close
            </span>
          </div>
          <span className="font-medium text-blue-600 dark:text-blue-400">Omni-Search</span>
        </div>
      </div>
    </div>
  );
};
