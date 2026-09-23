"use client";

import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface SearchableSelectOption {
  value: string;
  label: string;
  bnLabel?: string;
  subLabel?: string;
}

export interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: SearchableSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
  emptyText?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder = "সিলেক্ট করুন",
  searchPlaceholder = "খুঁজুন...",
  options = [],
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  className,
  emptyText = "কোন ফলাফল পাওয়া যায়নি",
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const selectedOption = React.useMemo(() => {
    return options.find(
      (opt) =>
        opt.value?.toLowerCase() === value?.toLowerCase() ||
        opt.label?.toLowerCase() === value?.toLowerCase()
    );
  }, [options, value]);

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase().trim();
    return options.filter((opt) => {
      const matchLabel = opt.label?.toLowerCase().includes(term);
      const matchBn = opt.bnLabel?.toLowerCase().includes(term);
      const matchSub = opt.subLabel?.toLowerCase().includes(term);
      const matchVal = opt.value?.toLowerCase().includes(term);
      return matchLabel || matchBn || matchSub || matchVal;
    });
  }, [options, searchTerm]);

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              "w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all duration-200 outline-none cursor-pointer",
              "bg-white dark:bg-[#121320] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white",
              "hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#003820] focus:ring-2 focus:ring-[#003820]/10",
              disabled && "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900",
              error && "border-red-400 focus:border-red-500 focus:ring-red-100",
              open && "border-[#003820] ring-2 ring-[#003820]/10"
            )}
          >
            <div className="flex-1 truncate">
              {selectedOption ? (
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {selectedOption.label}
                  {selectedOption.bnLabel && ` (${selectedOption.bnLabel})`}
                  {selectedOption.subLabel && (
                    <span className="text-xs font-normal text-slate-500 ml-1.5">
                      {selectedOption.subLabel}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-xs sm:text-sm text-slate-400 font-normal">
                  {placeholder}
                </span>
              )}
            </div>

            <ChevronDown
              size={16}
              className={cn(
                "text-slate-400 shrink-0 transition-transform duration-200",
                open && "rotate-180 text-[#003820] dark:text-[#95d4ac]"
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-(--radix-popover-trigger-width) min-w-[240px] max-w-[360px] p-0 rounded-xl bg-white dark:bg-[#121320] border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden"
        >
          {/* Search Input Box */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/70 dark:bg-[#0c0d15]">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white outline-none placeholder:text-slate-400 placeholder:font-normal"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 font-medium">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected =
                  option.value?.toLowerCase() === value?.toLowerCase() ||
                  option.label?.toLowerCase() === value?.toLowerCase();

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setSearchTerm("");
                    }}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg text-left text-xs sm:text-sm flex items-center justify-between gap-2 transition-all cursor-pointer",
                      isSelected
                        ? "bg-[#003820]/10 dark:bg-[#95d4ac]/10 text-[#003820] dark:text-[#95d4ac] font-bold"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-medium"
                    )}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">
                        {option.label}
                        {option.bnLabel && ` (${option.bnLabel})`}
                      </span>
                      {option.subLabel && (
                        <span className="text-[11px] text-slate-400 font-normal">
                          {option.subLabel}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check size={15} className="shrink-0 text-[#003820] dark:text-[#95d4ac]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-[11px] text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default SearchableSelect;
