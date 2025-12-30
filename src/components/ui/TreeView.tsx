'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  data?: any;
}

export interface TreeViewProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  onExpand?: (node: TreeNode) => void;
  onCollapse?: (node: TreeNode) => void;
  className?: string;
  nodeClassName?: string;
  selectedClassName?: string;
  expandedClassName?: string;
  disabledClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'auto';
  showIcons?: boolean;
  showExpandIcons?: boolean;
  allowMultipleSelection?: boolean;
  selectedNodes?: string[];
  onSelectionChange?: (selectedNodes: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  filterable?: boolean;
  onFilter?: (query: string) => void;
  sortable?: boolean;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  draggable?: boolean;
  onDragStart?: (node: TreeNode) => void;
  onDragEnd?: (node: TreeNode) => void;
  onDrop?: (node: TreeNode, target: TreeNode) => void;
  virtual?: boolean;
  height?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
  compact?: boolean;
  responsive?: boolean;
  sticky?: boolean;
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
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export default function TreeView({
  data,
  onSelect,
  onExpand,
  onCollapse,
  className,
  nodeClassName,
  selectedClassName,
  expandedClassName,
  disabledClassName,
  size = 'md',
  theme = 'auto',
  showIcons = true,
  showExpandIcons = true,
  allowMultipleSelection = false,
  selectedNodes = [],
  onSelectionChange,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  filterable = false,
  onFilter,
  sortable = false,
  onSort,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDrop,
  virtual = false,
  height,
  maxHeight,
  minHeight,
  compact = false,
  responsive = true,
  sticky = false,
  loading = false,
  error,
  emptyState,
}: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const handleNodeClick = (node: TreeNode) => {
    if (node.disabled) return;

    if (allowMultipleSelection) {
      const newSelected = selectedNodes.includes(node.id)
        ? selectedNodes.filter(id => id !== node.id)
        : [...selectedNodes, node.id];
      onSelectionChange?.(newSelected);
    } else {
      onSelectionChange?.([node.id]);
    }

    onSelect?.(node);
  };

  const handleExpandClick = (node: TreeNode, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (expandedNodes.has(node.id)) {
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(node.id);
        return newSet;
      });
      onCollapse?.(node);
    } else {
      setExpandedNodes(prev => new Set([...prev, node.id]));
      onExpand?.(node);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodes.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            'flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer',
            isSelected && 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
            node.disabled && 'opacity-50 cursor-not-allowed',
            compact && 'py-0.5',
            sizeClasses[size],
            nodeClassName,
            isSelected && selectedClassName,
            isExpanded && expandedClassName,
            node.disabled && disabledClassName
          )}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => handleNodeClick(node)}
        >
          {hasChildren && showExpandIcons && (
            <button
              className="mr-1 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              onClick={(e) => handleExpandClick(node, e)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          
          {showIcons && (
            <div className="mr-2 flex-shrink-0">
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4" />
                ) : (
                  <Folder className="h-4 w-4" />
                )
              ) : (
                node.icon || <File className="h-4 w-4" />
              )}
            </div>
          )}
          
          <span className="flex-1 truncate">{node.label}</span>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children?.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSearch = () => {
    if (!searchable) return null;

    return (
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">Error</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="p-4 text-center">
          <p className="font-medium text-gray-900 dark:text-white">
            {emptyState?.title || 'No data'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {emptyState?.description || 'No items found'}
          </p>
          {emptyState?.action && (
            <button
              onClick={emptyState.action.onClick}
              className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {emptyState.action.label}
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="py-1">
        {data.map(node => renderNode(node))}
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
      style={{
        height,
        maxHeight,
        minHeight,
      }}
    >
      {renderSearch()}
      {renderContent()}
    </div>
  );
}
