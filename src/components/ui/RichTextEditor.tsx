'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link, 
  Image, 
  Table, 
  Undo, 
  Redo, 
  Save, 
  Download, 
  Copy, 
  Settings, 
  Maximize, 
  Minimize,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  showStatusBar?: boolean;
  showMinimap?: boolean;
  showWordCount?: boolean;
  showCharCount?: boolean;
  showLineCount?: boolean;
  showSave?: boolean;
  showDownload?: boolean;
  showCopy?: boolean;
  showSettings?: boolean;
  showMinimize?: boolean;
  showMaximize?: boolean;
  allowFullscreen?: boolean;
  allowDownload?: boolean;
  allowCopy?: boolean;
  allowSave?: boolean;
  allowSettings?: boolean;
  onSave?: (content: string) => void;
  onDownload?: (content: string) => void;
  onCopy?: (content: string) => void;
  onSettings?: () => void;
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
  theme?: 'light' | 'dark' | 'auto';
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: string;
  showFormatting?: boolean;
  showAlignment?: boolean;
  showLists?: boolean;
  showLinks?: boolean;
  showImages?: boolean;
  showTables?: boolean;
  showCode?: boolean;
  showQuotes?: boolean;
  showUndoRedo?: boolean;
  showHistory?: boolean;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  readOnly = false,
  showToolbar = true,
  showStatusBar = true,
  showMinimap = false,
  showWordCount = true,
  showCharCount = true,
  showLineCount = true,
  showSave = true,
  showDownload = true,
  showCopy = true,
  showSettings = true,
  showMinimize = false,
  showMaximize = true,
  allowFullscreen = true,
  allowDownload = false,
  allowCopy = true,
  allowSave = false,
  allowSettings = true,
  onSave,
  onDownload,
  onCopy,
  onSettings,
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
  theme = 'auto',
  fontSize = 14,
  lineHeight = 1.5,
  fontFamily = 'Inter, system-ui, sans-serif',
  showFormatting = true,
  showAlignment = true,
  showLists = true,
  showLinks = true,
  showImages = true,
  showTables = true,
  showCode = true,
  showQuotes = true,
  showUndoRedo = true,
  showHistory = true,
  maxLength,
  minLength,
  required = false,
  validation,
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleInput = () => {
      setIsModified(true);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(value);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            handleUndo();
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 'b':
            e.preventDefault();
            handleBold();
            break;
          case 'i':
            e.preventDefault();
            handleItalic();
            break;
          case 'u':
            e.preventDefault();
            handleUnderline();
            break;
        }
      }
    };

    editor.addEventListener('input', handleInput);
    editor.addEventListener('keydown', handleKeyDown);

    return () => {
      editor.removeEventListener('input', handleInput);
      editor.removeEventListener('keydown', handleKeyDown);
    };
  }, [value, history, historyIndex]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleStrikethrough = () => execCommand('strikeThrough');
  const handleAlignLeft = () => execCommand('justifyLeft');
  const handleAlignCenter = () => execCommand('justifyCenter');
  const handleAlignRight = () => execCommand('justifyRight');
  const handleAlignJustify = () => execCommand('justifyFull');
  const handleInsertUnorderedList = () => execCommand('insertUnorderedList');
  const handleInsertOrderedList = () => execCommand('insertOrderedList');
  const handleInsertQuote = () => execCommand('formatBlock', 'blockquote');
  const handleInsertCode = () => execCommand('formatBlock', 'pre');
  const handleUndo = () => execCommand('undo');
  const handleRedo = () => execCommand('redo');

  const handleInsertLink = () => {
    if (linkUrl && linkText) {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      execCommand('insertHTML', link);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleInsertImage = () => {
    if (imageUrl) {
      const img = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto;" />`;
      execCommand('insertHTML', img);
      setShowImageDialog(false);
      setImageUrl('');
      setImageAlt('');
    }
  };

  const handleInsertTable = () => {
    let table = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    for (let i = 0; i < tableRows; i++) {
      table += '<tr>';
      for (let j = 0; j < tableCols; j++) {
        table += '<td style="padding: 8px; border: 1px solid #ccc;">&nbsp;</td>';
      }
      table += '</tr>';
    }
    table += '</table>';
    execCommand('insertHTML', table);
    setShowTableDialog(false);
  };

  const handleSave = () => {
    if (!allowSave || !onSave) return;
    onSave(value);
    setIsModified(false);
  };

  const handleDownload = () => {
    if (!allowDownload || !onDownload) return;
    onDownload(value);
  };

  const handleCopy = () => {
    if (!allowCopy || !onCopy) return;
    navigator.clipboard.writeText(value);
    onCopy(value);
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

  const getWordCount = () => {
    const text = value.replace(/<[^>]*>/g, '');
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharCount = () => {
    return value.length;
  };

  const getLineCount = () => {
    return value.split('\n').length;
  };

  const renderToolbar = () => {
    if (!showToolbar) return null;

    return (
      <div
        ref={toolbarRef}
        className={cn(
          'flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800',
          toolbarClassName
        )}
      >
        <div className="flex items-center space-x-1">
          {showFormatting && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBold}
                className="p-2"
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleItalic}
                className="p-2"
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUnderline}
                className="p-2"
                title="Underline (Ctrl+U)"
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStrikethrough}
                className="p-2"
                title="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
            </>
          )}

          {showAlignment && (
            <>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAlignLeft}
                className="p-2"
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAlignCenter}
                className="p-2"
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAlignRight}
                className="p-2"
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAlignJustify}
                className="p-2"
                title="Justify"
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </>
          )}

          {showLists && (
            <>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInsertUnorderedList}
                className="p-2"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInsertOrderedList}
                className="p-2"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </>
          )}

          {showQuotes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleInsertQuote}
              className="p-2"
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>
          )}

          {showCode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleInsertCode}
              className="p-2"
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </Button>
          )}

          {showLinks && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLinkDialog(true)}
              className="p-2"
              title="Insert Link"
            >
              <Link className="h-4 w-4" />
            </Button>
          )}

          {showImages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImageDialog(true)}
              className="p-2"
              title="Insert Image"
            >
              <Image className="h-4 w-4" />
            </Button>
          )}

          {showTables && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTableDialog(true)}
              className="p-2"
              title="Insert Table"
            >
              <Table className="h-4 w-4" />
            </Button>
          )}

          {showUndoRedo && (
            <>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                className="p-2"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                className="p-2"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {showSave && allowSave && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex items-center space-x-1"
            >
              <Save className="h-3 w-3" />
              <span>Save</span>
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
          {showWordCount && <span>{getWordCount()} words</span>}
          {showCharCount && <span>{getCharCount()} characters</span>}
          {showLineCount && <span>{getLineCount()} lines</span>}
          {isModified && <span className="text-yellow-600">Modified</span>}
        </div>
        <div className="flex items-center space-x-4">
          <span>Line {cursorPosition.line}, Column {cursorPosition.column}</span>
          {maxLength && (
            <span className={cn(
              getCharCount() > maxLength * 0.9 && 'text-yellow-600',
              getCharCount() >= maxLength && 'text-red-600'
            )}>
              {getCharCount()}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderEditor = () => {
    if (isMinimized) return null;

    return (
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className={cn(
          'flex-1 p-4 outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
          editorClassName
        )}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
          fontFamily: fontFamily,
          minHeight: '200px',
        }}
        placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    );
  };

  const renderDialogs = () => {
    return (
      <>
        {showLinkDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">URL</label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Text</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Link text"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowLinkDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInsertLink}
                    disabled={!linkUrl || !linkText}
                  >
                    Insert
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showImageDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Alt Text</label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Image description"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowImageDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInsertImage}
                    disabled={!imageUrl}
                  >
                    Insert
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showTableDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Insert Table</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rows</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={tableRows}
                      onChange={(e) => setTableRows(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Columns</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={tableCols}
                      onChange={(e) => setTableCols(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowTableDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInsertTable}
                  >
                    Insert
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
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
      {renderDialogs()}
    </div>
  );
}
