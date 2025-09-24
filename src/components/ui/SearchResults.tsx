'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  X,
  RefreshCw
} from 'lucide-react';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url?: string;
  type?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  score?: number;
  highlighted?: {
    title?: string;
    description?: string;
  };
}

export interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onResultClick?: (result: SearchResult) => void;
  onQueryChange?: (query: string) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onViewChange?: (view: 'grid' | 'list') => void;
  className?: string;
  resultClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  loading?: boolean;
  error?: string;
  emptyState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  filters?: {
    categories: string[];
    types: string[];
    tags: string[];
  };
  sortOptions?: {
    field: string;
    label: string;
  }[];
  viewOptions?: ('grid' | 'list')[];
  showFilters?: boolean;
  showSort?: boolean;
  showViewToggle?: boolean;
  showPagination?: boolean;
  showStats?: boolean;
  showHighlights?: boolean;
  showCategories?: boolean;
  showTypes?: boolean;
  showTags?: boolean;
  showMetadata?: boolean;
  showScores?: boolean;
  compact?: boolean;
  responsive?: boolean;
  sticky?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  maxResults?: number;
  highlightColor?: string;
  highlightBackground?: string;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onClear?: () => void;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const viewClasses = {
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
  list: 'space-y-4',
};

export default function SearchResults({
  results,
  query,
  onResultClick,
  onQueryChange,
  onFilterChange,
  onSortChange,
  onViewChange,
  className,
  resultClassName,
  headerClassName,
  footerClassName,
  loading = false,
  error,
  emptyState,
  pagination,
  filters,
  sortOptions = [
    { field: 'relevance', label: 'Relevance' },
    { field: 'title', label: 'Title' },
    { field: 'date', label: 'Date' },
  ],
  viewOptions = ['grid', 'list'],
  showFilters = true,
  showSort = true,
  showViewToggle = true,
  showPagination = true,
  showStats = true,
  showHighlights = true,
  showCategories = true,
  showTypes = true,
  showTags = true,
  showMetadata = false,
  showScores = false,
  compact = false,
  responsive = true,
  sticky = false,
  theme = 'auto',
  size = 'md',
  maxResults = 100,
  highlightColor = 'yellow',
  highlightBackground = 'bg-yellow-100 dark:bg-yellow-900/20',
  onLoadMore,
  onRefresh,
  onClear,
}: SearchResultsProps) {
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState(query);

  const filteredResults = useMemo(() => {
    let filtered = [...results];

    // Apply filters
    if (selectedFilters.categories && selectedFilters.categories.length > 0) {
      filtered = filtered.filter(result => 
        selectedFilters.categories.includes(result.category)
      );
    }

    if (selectedFilters.types && selectedFilters.types.length > 0) {
      filtered = filtered.filter(result => 
        selectedFilters.types.includes(result.type)
      );
    }

    if (selectedFilters.tags && selectedFilters.tags.length > 0) {
      filtered = filtered.filter(result => 
        result.tags?.some(tag => selectedFilters.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = a.metadata?.date || 0;
          bValue = b.metadata?.date || 0;
          break;
        case 'score':
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
        default:
          aValue = a.score || 0;
          bValue = b.score || 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered.slice(0, maxResults);
  }, [results, selectedFilters, sortBy, sortOrder, maxResults]);

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
  };

  const handleQueryChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    onQueryChange?.(newQuery);
  };

  const handleSortChange = (newSortBy: string) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    onSortChange?.(newSortBy, newSortOrder);
  };

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
    onViewChange?.(newView);
  };

  const handleFilterChange = (filterType: string, value: any) => {
    const newFilters = { ...selectedFilters, [filterType]: value };
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const highlightText = (text: string, query: string) => {
    if (!showHighlights || !query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark
          key={index}
          className={cn(
            'px-1 rounded',
            highlightBackground,
            `text-${highlightColor}-800 dark:text-${highlightColor}-200`
          )}
        >
          {part}
        </mark>
      ) : part
    );
  };

  const renderHeader = () => {
    return (
      <div className={cn('p-4 border-b border-gray-200 dark:border-gray-700', headerClassName)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full px-3 py-2 pl-8 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {showViewToggle && (
              <div className="flex items-center space-x-1">
                <Button
                  variant={view === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleViewChange('list')}
                  className="p-2"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleViewChange('grid')}
                  className="p-2"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {showSort && (
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {sortOptions.map(option => (
                  <option key={option.field} value={option.field}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="p-2"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {showStats && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredResults.length} results for "{query}"
          </div>
        )}
      </div>
    );
  };

  const renderResult = (result: SearchResult) => {
    return (
      <div
        key={result.id}
        className={cn(
          'p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer',
          compact && 'p-3',
          resultClassName
        )}
        onClick={() => handleResultClick(result)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-semibold text-gray-900 dark:text-white mb-2',
              sizeClasses[size]
            )}>
              {showHighlights && result.highlighted?.title
                ? highlightText(result.highlighted.title, query)
                : result.title
              }
            </h3>
            
            {result.description && (
              <p className={cn(
                'text-gray-600 dark:text-gray-400 mb-2',
                sizeClasses[size]
              )}>
                {showHighlights && result.highlighted?.description
                  ? highlightText(result.highlighted.description, query)
                  : result.description
                }
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              {showCategories && result.category && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                  {result.category}
                </span>
              )}
              
              {showTypes && result.type && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded">
                  {result.type}
                </span>
              )}
              
              {showScores && result.score && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded">
                  {Math.round(result.score * 100)}% match
                </span>
              )}
            </div>
            
            {showTags && result.tags && result.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {result.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {showMetadata && result.metadata && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {Object.entries(result.metadata).map(([key, value]) => (
                  <span key={key} className="mr-4">
                    {key}: {value}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {result.url && (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              onClick={(e) => e.stopPropagation()}
            >
              <ChevronRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Searching...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">Error</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      );
    }

    if (filteredResults.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {emptyState?.title || 'No results found'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {emptyState?.description || 'Try adjusting your search terms or filters'}
          </p>
          {emptyState?.action && (
            <Button
              variant="outline"
              onClick={emptyState.action.onClick}
            >
              {emptyState.action.label}
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className={cn('p-4', viewClasses[view])}>
        {filteredResults.map(renderResult)}
      </div>
    );
  };

  const renderPagination = () => {
    if (!showPagination || !pagination) return null;

    const { current, pageSize, total } = pagination;
    const totalPages = Math.ceil(total / pageSize);

    return (
      <div className={cn('p-4 border-t border-gray-200 dark:border-gray-700', footerClassName)}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((current - 1) * pageSize) + 1} to {Math.min(current * pageSize, total)} of {total} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onChange(current - 1, pageSize)}
              disabled={current <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="px-3 py-1 text-sm">
              Page {current} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onChange(current + 1, pageSize)}
              disabled={current >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
        compact && 'text-sm',
        responsive && 'w-full',
        sticky && 'sticky top-0',
        className
      )}
    >
      {renderHeader()}
      {renderContent()}
      {renderPagination()}
    </div>
  );
}
