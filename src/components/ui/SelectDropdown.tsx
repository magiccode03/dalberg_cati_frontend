'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectDropdownProps {
  options: SelectOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  label?: string;
  required?: boolean;
  clearable?: boolean;
  maxHeight?: number;
  groupBy?: string;
}

export default function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchable = false,
  multiple = false,
  disabled = false,
  error,
  className,
  label,
  required = false,
  clearable = false,
  maxHeight = 200,
  groupBy,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group options if groupBy is specified
  const groupedOptions = groupBy
    ? filteredOptions.reduce((groups, option) => {
        const group = option.group || 'Other';
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(option);
        return groups;
      }, {} as Record<string, SelectOption[]>)
    : { 'All': filteredOptions };

  // Get selected options
  const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
  const selectedOptions = options.filter(option => selectedValues.includes(option.value));

  // Handle option selection
  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const newValue = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      onChange(newValue);
    } else {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiple ? [] : '');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        if (searchable && searchRef.current) {
          searchRef.current.focus();
        }
      }
      return;
    }

    const flatOptions = Object.values(groupedOptions).flat();
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < flatOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : flatOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < flatOptions.length) {
          handleSelect(flatOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Reset focused index when options change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [searchTerm]);

  const displayValue = multiple
    ? selectedOptions.length > 0
      ? `${selectedOptions.length} selected`
      : placeholder
    : selectedOptions[0]?.label || placeholder;

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        ref={selectRef}
        className={cn(
          'relative w-full cursor-pointer rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'transition-colors duration-200',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          isOpen && 'ring-2 ring-blue-500 border-blue-500'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex-1 min-w-0">
            {multiple && selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map(option => (
                  <span
                    key={option.value}
                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option);
                      }}
                      className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className={cn(
                'block truncate',
                !selectedOptions[0] && 'text-gray-500 dark:text-gray-400'
              )}>
                {displayValue}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {clearable && selectedValues.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 text-gray-400 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search options..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            )}
            
            <div
              className="overflow-y-auto"
              style={{ maxHeight: `${maxHeight}px` }}
              role="listbox"
            >
              {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                <div key={groupName}>
                  {groupBy && groupName !== 'All' && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 uppercase tracking-wide">
                      {groupName}
                    </div>
                  )}
                  {groupOptions.map((option, index) => {
                    const flatIndex = Object.values(groupedOptions)
                      .flat()
                      .findIndex(opt => opt.value === option.value);
                    const isSelected = selectedValues.includes(option.value);
                    const isFocused = flatIndex === focusedIndex;
                    
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          'px-3 py-2 cursor-pointer text-sm flex items-center justify-between',
                          'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                          isSelected && 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100',
                          isFocused && 'bg-gray-100 dark:bg-gray-700',
                          option.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                        onClick={() => handleSelect(option)}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span className="flex-1 truncate">{option.label}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              
              {filteredOptions.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
