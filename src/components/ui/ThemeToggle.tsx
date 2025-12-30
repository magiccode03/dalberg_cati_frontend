'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';

export interface ThemeToggleProps {
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  showLabel?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
  showSystemOption?: boolean;
  showThemeSelector?: boolean;
  themes?: Array<{
    value: 'light' | 'dark' | 'system';
    label: string;
    icon: React.ReactNode;
    description?: string;
  }>;
}

const defaultThemes = [
  {
    value: 'light' as const,
    label: 'Light',
    icon: <Sun className="h-4 w-4" />,
    description: 'Light theme',
  },
  {
    value: 'dark' as const,
    label: 'Dark',
    icon: <Moon className="h-4 w-4" />,
    description: 'Dark theme',
  },
  {
    value: 'system' as const,
    label: 'System',
    icon: <Monitor className="h-4 w-4" />,
    description: 'Follow system preference',
  },
];

export default function ThemeToggle({
  theme: controlledTheme,
  onThemeChange,
  showLabel = false,
  showIcon = true,
  size = 'md',
  variant = 'outline',
  className,
  disabled = false,
  showSystemOption = true,
  showThemeSelector = false,
  themes = defaultThemes,
}: ThemeToggleProps) {
  const [internalTheme, setInternalTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [mounted, setMounted] = useState(false);

  const currentTheme = controlledTheme || internalTheme;

  // Get theme from localStorage or system preference
  useEffect(() => {
    const getStoredTheme = (): 'light' | 'dark' | 'system' => {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
      
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'system';
      }
      return 'light';
    };

    const storedTheme = getStoredTheme();
    setInternalTheme(storedTheme);
    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const applyTheme = (theme: 'light' | 'dark' | 'system') => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        if (systemTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme(currentTheme);
  }, [currentTheme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || currentTheme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (currentTheme === 'system') {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme, mounted]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (disabled) return;

    if (!controlledTheme) {
      setInternalTheme(newTheme);
    }
    
    localStorage.setItem('theme', newTheme);
    onThemeChange?.(newTheme);
  };

  const toggleTheme = () => {
    if (currentTheme === 'light') {
      handleThemeChange('dark');
    } else if (currentTheme === 'dark') {
      handleThemeChange(showSystemOption ? 'system' : 'light');
    } else {
      handleThemeChange('light');
    }
  };

  const getCurrentThemeInfo = () => {
    return themes.find(t => t.value === currentTheme) || themes[0];
  };

  const getNextThemeInfo = () => {
    if (currentTheme === 'light') {
      return themes.find(t => t.value === 'dark') || themes[1];
    } else if (currentTheme === 'dark') {
      return showSystemOption 
        ? themes.find(t => t.value === 'system') || themes[2]
        : themes.find(t => t.value === 'light') || themes[0];
    } else {
      return themes.find(t => t.value === 'light') || themes[0];
    }
  };

  if (showThemeSelector) {
    return (
      <div className={cn('relative', className)}>
        <div className="flex items-center space-x-2">
          {themes.map((theme) => (
            <Button
              key={theme.value}
              onClick={() => handleThemeChange(theme.value)}
              disabled={disabled}
              size={size}
              variant={currentTheme === theme.value ? 'primary' : 'outline'}
              className="flex items-center space-x-2"
            >
              {showIcon && theme.icon}
              {showLabel && <span>{theme.label}</span>}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const nextTheme = getNextThemeInfo();

  return (
    <Button
      onClick={toggleTheme}
      disabled={disabled}
      size={size}
      variant={variant}
      className={cn('flex items-center space-x-2', className)}
      title={`Switch to ${nextTheme.label} theme`}
    >
      {showIcon && nextTheme.icon}
      {showLabel && <span>{nextTheme.label}</span>}
    </Button>
  );
}

// Simple Theme Toggle (just icon)
export function SimpleThemeToggle({
  theme,
  onThemeChange,
  size = 'sm',
  variant = 'ghost',
  className,
  disabled,
}: Omit<ThemeToggleProps, 'showLabel' | 'showIcon' | 'showSystemOption' | 'showThemeSelector'>) {
  return (
    <ThemeToggle
      theme={theme}
      onThemeChange={onThemeChange}
      showLabel={false}
      showIcon={true}
      showSystemOption={false}
      size={size}
      variant={variant}
      className={className}
      disabled={disabled}
    />
  );
}

// Theme Toggle with Label
export function ThemeToggleWithLabel({
  theme,
  onThemeChange,
  size = 'md',
  variant = 'outline',
  className,
  disabled,
}: Omit<ThemeToggleProps, 'showLabel' | 'showIcon' | 'showSystemOption' | 'showThemeSelector'>) {
  return (
    <ThemeToggle
      theme={theme}
      onThemeChange={onThemeChange}
      showLabel={true}
      showIcon={true}
      showSystemOption={true}
      size={size}
      variant={variant}
      className={className}
      disabled={disabled}
    />
  );
}

// Theme Selector Dropdown
export interface ThemeSelectorProps extends Omit<ThemeToggleProps, 'showThemeSelector'> {
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  showCurrentTheme?: boolean;
  showDescriptions?: boolean;
}

export function ThemeSelector({
  theme,
  onThemeChange,
  showCurrentTheme = true,
  showDescriptions = false,
  themes = defaultThemes,
  className,
  disabled,
}: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = theme || 'system';
  const currentThemeInfo = themes.find(t => t.value === currentTheme) || themes[0];

  const handleThemeSelect = (selectedTheme: 'light' | 'dark' | 'system') => {
    onThemeChange?.(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        variant="outline"
        className="flex items-center space-x-2"
      >
        {currentThemeInfo.icon}
        <span>{currentThemeInfo.label}</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeSelect(theme.value)}
                className={cn(
                  'w-full flex items-center space-x-3 px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                  currentTheme === theme.value && 'bg-gray-100 dark:bg-gray-700'
                )}
              >
                {theme.icon}
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {theme.label}
                  </div>
                  {showDescriptions && theme.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {theme.description}
                    </div>
                  )}
                </div>
                {currentTheme === theme.value && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Theme Toggle with Custom Themes
export interface CustomThemeToggleProps extends ThemeToggleProps {
  customThemes?: Array<{
    value: string;
    label: string;
    icon: React.ReactNode;
    description?: string;
    applyTheme: () => void;
  }>;
}

export function CustomThemeToggle({
  customThemes = [],
  ...props
}: CustomThemeToggleProps) {
  const allThemes = [
    ...defaultThemes,
    ...customThemes.map(theme => ({
      ...theme,
      value: theme.value as 'light' | 'dark' | 'system',
    })),
  ];

  return (
    <ThemeToggle
      {...props}
      themes={allThemes}
    />
  );
}
