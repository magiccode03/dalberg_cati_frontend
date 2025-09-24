'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Search, X, Loader2 } from 'lucide-react';

export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
  showSearchButton?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  maxSuggestions?: number;
  autoFocus?: boolean;
  name?: string;
  id?: string;
}

const sizeClasses = {
  sm: {
    container: 'h-8',
    input: 'text-sm px-3',
    icon: 'h-4 w-4',
    button: 'h-6 w-6',
  },
  md: {
    container: 'h-10',
    input: 'text-sm px-4',
    icon: 'h-4 w-4',
    button: 'h-8 w-8',
  },
  lg: {
    container: 'h-12',
    input: 'text-base px-4',
    icon: 'h-5 w-5',
    button: 'h-10 w-10',
  },
};

export default function SearchInput({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  onClear,
  debounceMs = 300,
  loading = false,
  disabled = false,
  className,
  size = 'md',
  showClearButton = true,
  showSearchButton = false,
  suggestions = [],
  onSuggestionSelect,
  maxSuggestions = 5,
  autoFocus = false,
  name,
  id,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const sizeConfig = sizeClasses[size];

  // Debounced search
  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        onSearch?.(query);
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
    
    if (newValue.length > 0) {
      setShowSuggestions(true);
      debouncedSearch(newValue);
    } else {
      setShowSuggestions(false);
      onClear?.();
    }
  };

  // Handle search
  const handleSearch = () => {
    onSearch?.(internalValue);
    setShowSuggestions(false);
  };

  // Handle clear
  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    onClear?.();
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle suggestion select
  const handleSuggestionSelect = (suggestion: string) => {
    setInternalValue(suggestion);
    onChange?.(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update internal value when external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const filteredSuggestions = suggestions.slice(0, maxSuggestions);

  return (
    <div className="relative">
      <div className={cn(
        'relative flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm',
        sizeConfig.container,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}>
        {/* Search Icon */}
        <div className="absolute left-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className={cn('animate-spin text-gray-400', sizeConfig.icon)} />
          ) : (
            <Search className={cn('text-gray-400', sizeConfig.icon)} />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={internalValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (internalValue.length > 0 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
            sizeConfig.input,
            'pl-10',
            (showClearButton && internalValue) || showSearchButton ? 'pr-20' : 'pr-10'
          )}
        />

        {/* Clear Button */}
        {showClearButton && internalValue && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className={cn(
              'absolute right-2 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors',
              sizeConfig.button
            )}
          >
            <X className={cn(sizeConfig.icon)} />
          </button>
        )}

        {/* Search Button */}
        {showSearchButton && !internalValue && (
          <button
            type="button"
            onClick={handleSearch}
            disabled={disabled}
            className={cn(
              'absolute right-2 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors',
              sizeConfig.button
            )}
          >
            <Search className={cn(sizeConfig.icon)} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionSelect(suggestion)}
              className={cn(
                'w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                index === selectedSuggestionIndex && 'bg-gray-100 dark:bg-gray-700'
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Search Input with Results
export interface SearchInputWithResultsProps extends Omit<SearchInputProps, 'suggestions' | 'onSuggestionSelect'> {
  results?: Array<{
    id: string;
    title: string;
    description?: string;
    category?: string;
  }>;
  onResultSelect?: (result: any) => void;
  renderResult?: (result: any) => React.ReactNode;
  maxResults?: number;
}

export function SearchInputWithResults({
  results = [],
  onResultSelect,
  renderResult,
  maxResults = 5,
  ...props
}: SearchInputWithResultsProps) {
  const [showResults, setShowResults] = useState(false);

  const handleResultSelect = (result: any) => {
    onResultSelect?.(result);
    setShowResults(false);
  };

  const filteredResults = results.slice(0, maxResults);

  return (
    <div className="relative">
      <SearchInput
        {...props}
        onSearch={() => setShowResults(true)}
        onClear={() => setShowResults(false)}
      />
      
      {showResults && filteredResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredResults.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() => handleResultSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              {renderResult ? (
                renderResult(result)
              ) : (
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {result.title}
                  </div>
                  {result.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {result.description}
                    </div>
                  )}
                  {result.category && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {result.category}
                    </div>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
