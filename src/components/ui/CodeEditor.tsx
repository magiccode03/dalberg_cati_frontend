'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { 
  Copy, 
  Download, 
  Settings, 
  Play, 
  Pause, 
  RotateCw, 
  Maximize, 
  Minimize,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'light' | 'dark' | 'auto';
  fontSize?: number;
  lineHeight?: number;
  tabSize?: number;
  readOnly?: boolean;
  placeholder?: string;
  showLineNumbers?: boolean;
  showMinimap?: boolean;
  showFolding?: boolean;
  showWordWrap?: boolean;
  showIndentGuides?: boolean;
  showRulers?: boolean;
  showBreadcrumbs?: boolean;
  showStatusBar?: boolean;
  showToolbar?: boolean;
  showLanguageSelector?: boolean;
  showThemeSelector?: boolean;
  showFontSizeSelector?: boolean;
  showTabSizeSelector?: boolean;
  showSettings?: boolean;
  showCopy?: boolean;
  showDownload?: boolean;
  showRun?: boolean;
  showFormat?: boolean;
  showMinimize?: boolean;
  showMaximize?: boolean;
  allowFullscreen?: boolean;
  allowDownload?: boolean;
  allowCopy?: boolean;
  allowRun?: boolean;
  allowFormat?: boolean;
  allowSettings?: boolean;
  onRun?: (code: string) => void;
  onFormat?: (code: string) => void;
  onCopy?: (code: string) => void;
  onDownload?: (code: string) => void;
  onSettings?: () => void;
  onLanguageChange?: (language: string) => void;
  onThemeChange?: (theme: string) => void;
  onFontSizeChange?: (fontSize: number) => void;
  onTabSizeChange?: (tabSize: number) => void;
  className?: string;
  editorClassName?: string;
  toolbarClassName?: string;
  statusBarClassName?: string;
  loading?: boolean;
  error?: string;
  warning?: string;
  info?: string;
  success?: string;
  compact?: boolean;
  responsive?: boolean;
  sticky?: boolean;
  height?: string | number;
  width?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
}

const languages = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp', 'php',
  'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r', 'sql', 'html',
  'css', 'scss', 'sass', 'less', 'json', 'xml', 'yaml', 'toml', 'ini',
  'markdown', 'dockerfile', 'bash', 'powershell', 'shell', 'plaintext'
];

const themes = [
  'light', 'dark', 'auto'
];

const fontSizes = [12, 14, 16, 18, 20, 22, 24];
const tabSizes = [2, 4, 6, 8];

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  theme = 'auto',
  fontSize = 14,
  lineHeight = 1.5,
  tabSize = 2,
  readOnly = false,
  placeholder = 'Enter your code here...',
  showLineNumbers = true,
  showMinimap = false,
  showFolding = true,
  showWordWrap = false,
  showIndentGuides = true,
  showRulers = false,
  showBreadcrumbs = true,
  showStatusBar = true,
  showToolbar = true,
  showLanguageSelector = true,
  showThemeSelector = true,
  showFontSizeSelector = true,
  showTabSizeSelector = true,
  showSettings = true,
  showCopy = true,
  showDownload = true,
  showRun = false,
  showFormat = false,
  showMinimize = false,
  showMaximize = true,
  allowFullscreen = true,
  allowDownload = false,
  allowCopy = true,
  allowRun = false,
  allowFormat = false,
  allowSettings = true,
  onRun,
  onFormat,
  onCopy,
  onDownload,
  onSettings,
  onLanguageChange,
  onThemeChange,
  onFontSizeChange,
  onTabSizeChange,
  className,
  editorClassName,
  toolbarClassName,
  statusBarClassName,
  loading = false,
  error,
  warning,
  info,
  success,
  compact = false,
  responsive = true,
  sticky = false,
  height = '400px',
  width = '100%',
  minHeight = '200px',
  maxHeight = '800px',
  minWidth = '300px',
  maxWidth = '100%',
}: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showTabSizeDropdown, setShowTabSizeDropdown] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isModified, setIsModified] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleInput = () => {
      setIsModified(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const newValue = value.substring(0, start) + ' '.repeat(tabSize) + value.substring(end);
        onChange(newValue);
        editor.selectionStart = editor.selectionEnd = start + tabSize;
      }
    };

    editor.addEventListener('input', handleInput);
    editor.addEventListener('keydown', handleKeyDown);

    return () => {
      editor.removeEventListener('input', handleInput);
      editor.removeEventListener('keydown', handleKeyDown);
    };
  }, [value, onChange, tabSize]);

  const handleRun = async () => {
    if (!allowRun || !onRun) return;

    setIsRunning(true);
    try {
      await onRun(value);
    } finally {
      setIsRunning(false);
    }
  };

  const handleFormat = async () => {
    if (!allowFormat || !onFormat) return;

    setIsFormatting(true);
    try {
      const formatted = await onFormat(value);
      onChange(formatted);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleCopy = () => {
    if (!allowCopy || !onCopy) return;

    navigator.clipboard.writeText(value);
    onCopy(value);
  };

  const handleDownload = () => {
    if (!allowDownload || !onDownload) return;

    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
    onDownload(value);
  };

  const handleFullscreenToggle = () => {
    if (!allowFullscreen) return;

    if (!document.fullscreenElement) {
      editorRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
  };

  const getLineNumbers = () => {
    const lines = value.split('\n');
    return lines.map((_, index) => index + 1);
  };

  const renderToolbar = () => {
    if (!showToolbar) return null;

    return (
      <div className={cn(
        'flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800',
        toolbarClassName
      )}>
        <div className="flex items-center space-x-2">
          {showLanguageSelector && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-1"
              >
                <span>{language}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              {showLanguageDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onLanguageChange?.(lang);
                        setShowLanguageDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {showThemeSelector && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className="flex items-center space-x-1"
              >
                <span>{theme}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              {showThemeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  {themes.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        onThemeChange?.(t);
                        setShowThemeDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {showFontSizeSelector && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
                className="flex items-center space-x-1"
              >
                <span>{fontSize}px</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              {showFontSizeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  {fontSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        onFontSizeChange?.(size);
                        setShowFontSizeDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {showTabSizeSelector && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTabSizeDropdown(!showTabSizeDropdown)}
                className="flex items-center space-x-1"
              >
                <span>{tabSize}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              {showTabSizeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  {tabSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        onTabSizeChange?.(size);
                        setShowTabSizeDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {showRun && allowRun && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              loading={isRunning}
              className="flex items-center space-x-1"
            >
              <Play className="h-3 w-3" />
              <span>Run</span>
            </Button>
          )}

          {showFormat && allowFormat && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleFormat}
              loading={isFormatting}
              className="flex items-center space-x-1"
            >
              <RotateCw className="h-3 w-3" />
              <span>Format</span>
            </Button>
          )}

          {showCopy && allowCopy && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center space-x-1"
            >
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </Button>
          )}

          {showDownload && allowDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center space-x-1"
            >
              <Download className="h-3 w-3" />
              <span>Download</span>
            </Button>
          )}

          {showSettings && allowSettings && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSettings}
              className="flex items-center space-x-1"
            >
              <Settings className="h-3 w-3" />
              <span>Settings</span>
            </Button>
          )}

          {showMinimize && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMinimizeToggle}
              className="flex items-center space-x-1"
            >
              {isMinimized ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          )}

          {showMaximize && allowFullscreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreenToggle}
              className="flex items-center space-x-1"
            >
              {isFullscreen ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderStatusBar = () => {
    if (!showStatusBar) return null;

    return (
      <div className={cn(
        'flex items-center justify-between p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400',
        statusBarClassName
      )}>
        <div className="flex items-center space-x-4">
          <span>Line {cursorPosition.line}, Column {cursorPosition.column}</span>
          <span>{language}</span>
          {isModified && <span className="text-yellow-600">Modified</span>}
        </div>
        <div className="flex items-center space-x-4">
          <span>{value.length} characters</span>
          <span>{value.split('\n').length} lines</span>
        </div>
      </div>
    );
  };

  const renderEditor = () => {
    if (isMinimized) return null;

    return (
      <div className="relative flex">
        {showLineNumbers && (
          <div
            ref={lineNumbersRef}
            className="flex-shrink-0 w-12 bg-gray-100 dark:bg-gray-800 text-right text-sm text-gray-500 dark:text-gray-400 select-none"
            style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
          >
            {getLineNumbers().map((lineNumber) => (
              <div key={lineNumber} className="px-2 py-0.5">
                {lineNumber}
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={editorRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            'flex-1 resize-none border-0 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
            editorClassName
          )}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            tabSize: tabSize,
          }}
        />
      </div>
    );
  };

  return (
    <div
      className={cn(
        'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900',
        compact && 'rounded-md',
        sticky && 'sticky top-4',
        className
      )}
      style={{
        height: isMinimized ? 'auto' : height,
        width: width,
        minHeight: isMinimized ? 'auto' : minHeight,
        maxHeight: isMinimized ? 'auto' : maxHeight,
        minWidth: minWidth,
        maxWidth: maxWidth,
      }}
    >
      {renderToolbar()}
      {renderEditor()}
      {renderStatusBar()}
    </div>
  );
}
