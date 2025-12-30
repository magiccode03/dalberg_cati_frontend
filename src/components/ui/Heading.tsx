'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'white' | 'black' | 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'current';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify';
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
  decoration?: 'underline' | 'line-through' | 'no-underline';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p';
  truncate?: boolean;
  noWrap?: boolean;
  breakWords?: boolean;
  breakAll?: boolean;
  hyphens?: 'none' | 'manual' | 'auto';
  lineHeight?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  letterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
  fontFamily?: 'sans' | 'serif' | 'mono';
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  highlight?: boolean;
  gradient?: boolean;
  gradientColors?: string;
  style?: React.CSSProperties;
}

const levelSizeMap = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'base',
} as const;

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl',
};

const colorClasses = {
  primary: 'text-gray-900 dark:text-white',
  secondary: 'text-gray-600 dark:text-gray-400',
  muted: 'text-gray-500 dark:text-gray-400',
  accent: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
  white: 'text-white',
  black: 'text-black dark:text-white',
  gray: 'text-gray-600 dark:text-gray-400',
  blue: 'text-blue-600 dark:text-blue-400',
  red: 'text-red-600 dark:text-red-400',
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  purple: 'text-purple-600 dark:text-purple-400',
  pink: 'text-pink-600 dark:text-pink-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
  current: 'text-current',
};

const weightClasses = {
  thin: 'font-thin',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

const transformClasses = {
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  'normal-case': 'normal-case',
};

const decorationClasses = {
  underline: 'underline',
  'line-through': 'line-through',
  'no-underline': 'no-underline',
};

const lineHeightClasses = {
  none: 'leading-none',
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
};

const letterSpacingClasses = {
  tighter: 'tracking-tighter',
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
};

const fontFamilyClasses = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
};

const defaultWeightMap = {
  1: 'bold',
  2: 'bold',
  3: 'semibold',
  4: 'semibold',
  5: 'medium',
  6: 'medium',
} as const;

export default function Heading({
  children,
  level = 1,
  size,
  color = 'primary',
  weight,
  align,
  transform,
  decoration,
  className,
  as,
  truncate = false,
  noWrap = false,
  breakWords = false,
  breakAll = false,
  hyphens,
  lineHeight,
  letterSpacing,
  fontFamily,
  italic = false,
  underline = false,
  strikethrough = false,
  highlight = false,
  gradient = false,
  gradientColors = 'from-blue-600 to-purple-600',
  style,
}: HeadingProps) {
  const Component = as || `h${level}` as keyof JSX.IntrinsicElements;
  const effectiveSize = size || levelSizeMap[level];
  const effectiveWeight = weight || defaultWeightMap[level];

  const getSizeClass = () => {
    return sizeClasses[effectiveSize];
  };

  const getColorClass = () => {
    if (gradient) {
      return `bg-gradient-to-r ${gradientColors} bg-clip-text text-transparent`;
    }
    return colorClasses[color];
  };

  const getWeightClass = () => {
    return weightClasses[effectiveWeight];
  };

  const getDecorationClass = () => {
    if (decoration) return decorationClasses[decoration];
    if (underline) return decorationClasses.underline;
    if (strikethrough) return decorationClasses['line-through'];
    return '';
  };

  const getHyphensClass = () => {
    if (hyphens === 'none') return 'hyphens-none';
    if (hyphens === 'manual') return 'hyphens-manual';
    if (hyphens === 'auto') return 'hyphens-auto';
    return '';
  };

  return (
    <Component
      className={cn(
        getSizeClass(),
        getColorClass(),
        getWeightClass(),
        align && alignClasses[align],
        transform && transformClasses[transform],
        getDecorationClass(),
        lineHeight && lineHeightClasses[lineHeight],
        letterSpacing && letterSpacingClasses[letterSpacing],
        fontFamily && fontFamilyClasses[fontFamily],
        italic && 'italic',
        highlight && 'bg-yellow-200 dark:bg-yellow-800 px-1 py-0.5 rounded',
        truncate && 'truncate',
        noWrap && 'whitespace-nowrap',
        breakWords && 'break-words',
        breakAll && 'break-all',
        getHyphensClass(),
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
}

// Preset Heading Components
export function H1({ children, className, ...props }: Omit<HeadingProps, 'level'>) {
  return (
    <Heading level={1} className={className} {...props}>
      {children}
    </Heading>
  );
}

export function H2({ children, className, ...props }: Omit<HeadingProps, 'level'>) {
  return (
    <Heading level={2} className={className} {...props}>
      {children}
    </Heading>
  );
}

export function H3({ children, className, ...props }: Omit<HeadingProps, 'level'>) {
  return (
    <Heading level={3} className={className} {...props}>
      {children}
    </Heading>
  );
}

export function H4({ children, className, ...props }: Omit<HeadingProps, 'level'>) {
  return (
    <Heading level={4} className={className} {...props}>
      {children}
    </Heading>
  );
}

export function H5({ children, className, ...props }: Omit<HeadingProps, 'level'>) {
  return (
    <Heading level={5} className={className} {...props}>
      {children}
    </Heading>
  );
}

export function H6({ children, className, ...props }: Omit<HeadingProps, 'level'>) {
  return (
    <Heading level={6} className={className} {...props}>
      {children}
    </Heading>
  );
}

// Size Variants
export function HeadingXs({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="xs" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingSm({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="sm" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingBase({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="base" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingLg({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="lg" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingXl({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="xl" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function Heading2xl({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="2xl" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function Heading3xl({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="3xl" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function Heading4xl({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="4xl" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function Heading5xl({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="5xl" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function Heading6xl({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="6xl" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function Heading7xl({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="7xl" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function Heading8xl({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="8xl" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function Heading9xl({ children, className, ...props }: Omit<HeadingProps, 'size'>) {
  return (
    <Heading size="9xl" className={className} {...props}>
      {children}
    </Heading>
  );
}

// Color Variants
export function HeadingPrimary({ children, className, ...props }: Omit<HeadingProps, 'color'>) {
  return (
    <Heading color="primary" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingSecondary({ children, className, ...props }: Omit<HeadingProps, 'color'>) {
  return (
    <Heading color="secondary" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingMuted({ children, className, ...props }: Omit<HeadingProps, 'color'>) {
  return (
    <Heading color="muted" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingAccent({ children, className, ...props }: Omit<HeadingProps, 'color'>) {
  return (
    <Heading color="accent" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingSuccess({ children, className, ...props }: Omit<HeadingProps, 'color'>) {
  return (
    <Heading color="success" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingWarning({ children, className, ...props }: Omit<HeadingProps, 'color'>) {
  return (
    <Heading color="warning" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingError({ children, className, ...props }: Omit<HeadingProps, 'color'>) {
  return (
    <Heading color="error" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingInfo({ children, className, ...props }: Omit<HeadingProps, 'color'>) {
  return (
    <Heading color="info" className={className} {...props}>
      {children}
    </Heading>
  );
}

// Weight Variants
export function HeadingThin({ children, className, ...props }: Omit<HeadingProps, 'weight'>) {
  return (
    <Heading weight="thin" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingLight({ children, className, ...props }: Omit<HeadingProps, 'weight'>) {
  return (
    <Heading weight="light" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingNormal({ children, className, ...props }: Omit<HeadingProps, 'weight'>) {
  return (
    <Heading weight="normal" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingMedium({ children, className, ...props }: Omit<HeadingProps, 'weight'>) {
  return (
    <Heading weight="medium" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingSemibold({ children, className, ...props }: Omit<HeadingProps, 'weight'>) {
  return (
    <Heading weight="semibold" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingBold({ children, className, ...props }: Omit<HeadingProps, 'weight'>) {
  return (
    <Heading weight="bold" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingExtrabold({ children, className, ...props }: Omit<HeadingProps, 'weight'>) {
  return (
    <Heading weight="extrabold" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingBlack({ children, className, ...props }: Omit<HeadingProps, 'weight'>) {
  return (
    <Heading weight="black" className={className} {...props}>
      {children}
    </Heading>
  );
}

// Alignment Variants
export function HeadingLeft({ children, className, ...props }: Omit<HeadingProps, 'align'>) {
  return (
    <Heading align="left" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingCenter({ children, className, ...props }: Omit<HeadingProps, 'align'>) {
  return (
    <Heading align="center" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingRight({ children, className, ...props }: Omit<HeadingProps, 'align'>) {
  return (
    <Heading align="right" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingJustify({ children, className, ...props }: Omit<HeadingProps, 'align'>) {
  return (
    <Heading align="justify" className={className} {...props}>
      {children}
    </Heading>
  );
}

// Transform Variants
export function HeadingUppercase({ children, className, ...props }: Omit<HeadingProps, 'transform'>) {
  return (
    <Heading transform="uppercase" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingLowercase({ children, className, ...props }: Omit<HeadingProps, 'transform'>) {
  return (
    <Heading transform="lowercase" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingCapitalize({ children, className, ...props }: Omit<HeadingProps, 'transform'>) {
  return (
    <Heading transform="capitalize" className={className} {...props}>
      {children}
    </Heading>
  );
}

// Decoration Variants
export function HeadingUnderline({ children, className, ...props }: Omit<HeadingProps, 'decoration' | 'underline'>) {
  return (
    <Heading decoration="underline" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingLineThrough({ children, className, ...props }: Omit<HeadingProps, 'decoration' | 'strikethrough'>) {
  return (
    <Heading decoration="line-through" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingNoUnderline({ children, className, ...props }: Omit<HeadingProps, 'decoration'>) {
  return (
    <Heading decoration="no-underline" className={className} {...props}>
      {children}
    </Heading>
  );
}

// Line Height Variants
export function HeadingLeadingNone({ children, className, ...props }: Omit<HeadingProps, 'lineHeight'>) {
  return (
    <Heading lineHeight="none" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingLeadingTight({ children, className, ...props }: Omit<HeadingProps, 'lineHeight'>) {
  return (
    <Heading lineHeight="tight" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingLeadingSnug({ children, className, ...props }: Omit<HeadingProps, 'lineHeight'>) {
  return (
    <Heading lineHeight="snug" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingLeadingNormal({ children, className, ...props }: Omit<HeadingProps, 'lineHeight'>) {
  return (
    <Heading lineHeight="normal" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingLeadingRelaxed({ children, className, ...props }: Omit<HeadingProps, 'lineHeight'>) {
  return (
    <Heading lineHeight="relaxed" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingLeadingLoose({ children, className, ...props }: Omit<HeadingProps, 'lineHeight'>) {
  return (
    <Heading lineHeight="loose" className={className} {...props}>
      {children}
    </Heading>
  );
}

// Letter Spacing Variants
export function HeadingTrackingTighter({ children, className, ...props }: Omit<HeadingProps, 'letterSpacing'>) {
  return (
    <Heading letterSpacing="tighter" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingTrackingTight({ children, className, ...props }: Omit<HeadingProps, 'letterSpacing'>) {
  return (
    <Heading letterSpacing="tight" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingTrackingNormal({ children, className, ...props }: Omit<HeadingProps, 'letterSpacing'>) {
  return (
    <Heading letterSpacing="normal" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingTrackingWide({ children, className, ...props }: Omit<HeadingProps, 'letterSpacing'>) {
  return (
    <Heading letterSpacing="wide" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingTrackingWider({ children, className, ...props }: Omit<HeadingProps, 'letterSpacing'>) {
  return (
    <Heading letterSpacing="wider" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingTrackingWidest({ children, className, ...props }: Omit<HeadingProps, 'letterSpacing'>) {
  return (
    <Heading letterSpacing="widest" className={className} {...props}>
      {children}
    </Heading>
  );
}

// Font Family Variants
export function HeadingSans({ children, className, ...props }: Omit<HeadingProps, 'fontFamily'>) {
  return (
    <Heading fontFamily="sans" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingSerif({ children, className, ...props }: Omit<HeadingProps, 'fontFamily'>) {
  return (
    <Heading fontFamily="serif" className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingMono({ children, className, ...props }: Omit<HeadingProps, 'fontFamily'>) {
  return (
    <Heading fontFamily="mono" className={className} {...props}>
      {children}
    </Heading>
  );
}

// Special Variants
export function HeadingGradient({ children, className, ...props }: Omit<HeadingProps, 'gradient' | 'gradientColors'>) {
  return (
    <Heading gradient={true} className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingHighlight({ children, className, ...props }: Omit<HeadingProps, 'highlight'>) {
  return (
    <Heading highlight={true} className={className} {...props}>
      {children}
    </Heading>
  );
}

export function HeadingItalic({ children, className, ...props }: Omit<HeadingProps, 'italic'>) {
  return (
    <Heading italic={true} className={className} {...props}>
      {children}
    </Heading>
  );
}
