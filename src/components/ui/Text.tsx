'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'body' | 'caption' | 'small' | 'tiny' | 'lead' | 'muted' | 'strong' | 'code' | 'kbd' | 'mark' | 'del' | 'ins' | 'sub' | 'sup';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'white' | 'black' | 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'current';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify';
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
  decoration?: 'underline' | 'line-through' | 'no-underline';
  className?: string;
  as?: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small' | 'mark' | 'del' | 'ins' | 'sub' | 'sup' | 'code' | 'kbd' | 'samp' | 'var' | 'cite' | 'q' | 'abbr' | 'time' | 'data';
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
  code?: boolean;
  keyboard?: boolean;
  mark?: boolean;
  deleted?: boolean;
  inserted?: boolean;
  subscript?: boolean;
  superscript?: boolean;
  style?: React.CSSProperties;
}

const variantClasses = {
  body: 'text-base',
  caption: 'text-sm text-gray-600 dark:text-gray-400',
  small: 'text-sm',
  tiny: 'text-xs',
  lead: 'text-lg text-gray-700 dark:text-gray-300',
  muted: 'text-gray-500 dark:text-gray-400',
  strong: 'font-semibold',
  code: 'font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded',
  kbd: 'font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded border border-gray-300 dark:border-gray-600',
  mark: 'bg-yellow-200 dark:bg-yellow-800 px-1 py-0.5 rounded',
  del: 'line-through text-gray-500 dark:text-gray-400',
  ins: 'underline text-green-600 dark:text-green-400',
  sub: 'text-xs align-sub',
  sup: 'text-xs align-super',
};

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

export default function Text({
  children,
  variant = 'body',
  size,
  color = 'primary',
  weight,
  align,
  transform,
  decoration,
  className,
  as: Component = 'p',
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
  code = false,
  keyboard = false,
  mark = false,
  deleted = false,
  inserted = false,
  subscript = false,
  superscript = false,
  style,
}: TextProps) {
  const getVariantClass = () => {
    if (code) return variantClasses.code;
    if (keyboard) return variantClasses.kbd;
    if (mark) return variantClasses.mark;
    if (deleted) return variantClasses.del;
    if (inserted) return variantClasses.ins;
    if (subscript) return variantClasses.sub;
    if (superscript) return variantClasses.sup;
    return variantClasses[variant];
  };

  const getSizeClass = () => {
    if (size) return sizeClasses[size];
    if (variant === 'tiny') return sizeClasses.xs;
    if (variant === 'small' || variant === 'caption') return sizeClasses.sm;
    if (variant === 'lead') return sizeClasses.lg;
    return sizeClasses.base;
  };

  const getColorClass = () => {
    if (color === 'primary' && variant === 'muted') return colorClasses.muted;
    if (color === 'primary' && variant === 'caption') return colorClasses.secondary;
    return colorClasses[color];
  };

  const getWeightClass = () => {
    if (weight) return weightClasses[weight];
    if (variant === 'strong') return weightClasses.semibold;
    if (variant === 'lead') return weightClasses.medium;
    return weightClasses.normal;
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
        getVariantClass(),
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

// Preset Text Components
export function TextBody({ children, className, ...props }: Omit<TextProps, 'variant'>) {
  return (
    <Text variant="body" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextCaption({ children, className, ...props }: Omit<TextProps, 'variant'>) {
  return (
    <Text variant="caption" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextSmall({ children, className, ...props }: Omit<TextProps, 'variant'>) {
  return (
    <Text variant="small" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextTiny({ children, className, ...props }: Omit<TextProps, 'variant'>) {
  return (
    <Text variant="tiny" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextLead({ children, className, ...props }: Omit<TextProps, 'variant'>) {
  return (
    <Text variant="lead" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextMuted({ children, className, ...props }: Omit<TextProps, 'variant'>) {
  return (
    <Text variant="muted" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextStrong({ children, className, ...props }: Omit<TextProps, 'variant'>) {
  return (
    <Text variant="strong" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextCode({ children, className, ...props }: Omit<TextProps, 'variant' | 'code'>) {
  return (
    <Text variant="code" code={true} className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextKbd({ children, className, ...props }: Omit<TextProps, 'variant' | 'keyboard'>) {
  return (
    <Text variant="kbd" keyboard={true} className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextMark({ children, className, ...props }: Omit<TextProps, 'variant' | 'mark'>) {
  return (
    <Text variant="mark" mark={true} className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextDel({ children, className, ...props }: Omit<TextProps, 'variant' | 'deleted'>) {
  return (
    <Text variant="del" deleted={true} className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextIns({ children, className, ...props }: Omit<TextProps, 'variant' | 'inserted'>) {
  return (
    <Text variant="ins" inserted={true} className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextSub({ children, className, ...props }: Omit<TextProps, 'variant' | 'subscript'>) {
  return (
    <Text variant="sub" subscript={true} className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextSup({ children, className, ...props }: Omit<TextProps, 'variant' | 'superscript'>) {
  return (
    <Text variant="sup" superscript={true} className={className} {...props}>
      {children}
    </Text>
  );
}

// Size Variants
export function TextXs({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="xs" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextSm({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="sm" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextBase({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="base" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextLg({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="lg" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextXl({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="xl" className={className} {...props}>
      {children}
    </Text>
  );
}

export function Text2xl({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="2xl" className={className} {...props}>
      {children}
    </Text>
  );
}

export function Text3xl({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="3xl" className={className} {...props}>
      {children}
    </Text>
  );
}

export function Text4xl({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="4xl" className={className} {...props}>
      {children}
    </Text>
  );
}

export function Text5xl({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="5xl" className={className} {...props}>
      {children}
    </Text>
  );
}

export function Text6xl({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="6xl" className={className} {...props}>
      {children}
    </Text>
  );
}

export function Text7xl({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="7xl" className={className} {...props}>
      {children}
    </Text>
  );
}

export function Text8xl({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="8xl" className={className} {...props}>
      {children}
    </Text>
  );
}

export function Text9xl({ children, className, ...props }: Omit<TextProps, 'size'>) {
  return (
    <Text size="9xl" className={className} {...props}>
      {children}
    </Text>
  );
}

// Color Variants
export function TextPrimary({ children, className, ...props }: Omit<TextProps, 'color'>) {
  return (
    <Text color="primary" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextSecondary({ children, className, ...props }: Omit<TextProps, 'color'>) {
  return (
    <Text color="secondary" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextMuted({ children, className, ...props }: Omit<TextProps, 'color'>) {
  return (
    <Text color="muted" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextAccent({ children, className, ...props }: Omit<TextProps, 'color'>) {
  return (
    <Text color="accent" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextSuccess({ children, className, ...props }: Omit<TextProps, 'color'>) {
  return (
    <Text color="success" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextWarning({ children, className, ...props }: Omit<TextProps, 'color'>) {
  return (
    <Text color="warning" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextError({ children, className, ...props }: Omit<TextProps, 'color'>) {
  return (
    <Text color="error" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextInfo({ children, className, ...props }: Omit<TextProps, 'color'>) {
  return (
    <Text color="info" className={className} {...props}>
      {children}
    </Text>
  );
}

// Weight Variants
export function TextThin({ children, className, ...props }: Omit<TextProps, 'weight'>) {
  return (
    <Text weight="thin" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextLight({ children, className, ...props }: Omit<TextProps, 'weight'>) {
  return (
    <Text weight="light" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextNormal({ children, className, ...props }: Omit<TextProps, 'weight'>) {
  return (
    <Text weight="normal" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextMedium({ children, className, ...props }: Omit<TextProps, 'weight'>) {
  return (
    <Text weight="medium" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextSemibold({ children, className, ...props }: Omit<TextProps, 'weight'>) {
  return (
    <Text weight="semibold" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextBold({ children, className, ...props }: Omit<TextProps, 'weight'>) {
  return (
    <Text weight="bold" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextExtrabold({ children, className, ...props }: Omit<TextProps, 'weight'>) {
  return (
    <Text weight="extrabold" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextBlack({ children, className, ...props }: Omit<TextProps, 'weight'>) {
  return (
    <Text weight="black" className={className} {...props}>
      {children}
    </Text>
  );
}

// Alignment Variants
export function TextLeft({ children, className, ...props }: Omit<TextProps, 'align'>) {
  return (
    <Text align="left" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextCenter({ children, className, ...props }: Omit<TextProps, 'align'>) {
  return (
    <Text align="center" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextRight({ children, className, ...props }: Omit<TextProps, 'align'>) {
  return (
    <Text align="right" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextJustify({ children, className, ...props }: Omit<TextProps, 'align'>) {
  return (
    <Text align="justify" className={className} {...props}>
      {children}
    </Text>
  );
}

// Transform Variants
export function TextUppercase({ children, className, ...props }: Omit<TextProps, 'transform'>) {
  return (
    <Text transform="uppercase" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextLowercase({ children, className, ...props }: Omit<TextProps, 'transform'>) {
  return (
    <Text transform="lowercase" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextCapitalize({ children, className, ...props }: Omit<TextProps, 'transform'>) {
  return (
    <Text transform="capitalize" className={className} {...props}>
      {children}
    </Text>
  );
}

// Decoration Variants
export function TextUnderline({ children, className, ...props }: Omit<TextProps, 'decoration' | 'underline'>) {
  return (
    <Text decoration="underline" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextLineThrough({ children, className, ...props }: Omit<TextProps, 'decoration' | 'strikethrough'>) {
  return (
    <Text decoration="line-through" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextNoUnderline({ children, className, ...props }: Omit<TextProps, 'decoration'>) {
  return (
    <Text decoration="no-underline" className={className} {...props}>
      {children}
    </Text>
  );
}

// Line Height Variants
export function TextLeadingNone({ children, className, ...props }: Omit<TextProps, 'lineHeight'>) {
  return (
    <Text lineHeight="none" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextLeadingTight({ children, className, ...props }: Omit<TextProps, 'lineHeight'>) {
  return (
    <Text lineHeight="tight" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextLeadingSnug({ children, className, ...props }: Omit<TextProps, 'lineHeight'>) {
  return (
    <Text lineHeight="snug" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextLeadingNormal({ children, className, ...props }: Omit<TextProps, 'lineHeight'>) {
  return (
    <Text lineHeight="normal" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextLeadingRelaxed({ children, className, ...props }: Omit<TextProps, 'lineHeight'>) {
  return (
    <Text lineHeight="relaxed" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextLeadingLoose({ children, className, ...props }: Omit<TextProps, 'lineHeight'>) {
  return (
    <Text lineHeight="loose" className={className} {...props}>
      {children}
    </Text>
  );
}

// Letter Spacing Variants
export function TextTrackingTighter({ children, className, ...props }: Omit<TextProps, 'letterSpacing'>) {
  return (
    <Text letterSpacing="tighter" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextTrackingTight({ children, className, ...props }: Omit<TextProps, 'letterSpacing'>) {
  return (
    <Text letterSpacing="tight" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextTrackingNormal({ children, className, ...props }: Omit<TextProps, 'letterSpacing'>) {
  return (
    <Text letterSpacing="normal" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextTrackingWide({ children, className, ...props }: Omit<TextProps, 'letterSpacing'>) {
  return (
    <Text letterSpacing="wide" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextTrackingWider({ children, className, ...props }: Omit<TextProps, 'letterSpacing'>) {
  return (
    <Text letterSpacing="wider" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextTrackingWidest({ children, className, ...props }: Omit<TextProps, 'letterSpacing'>) {
  return (
    <Text letterSpacing="widest" className={className} {...props}>
      {children}
    </Text>
  );
}

// Font Family Variants
export function TextSans({ children, className, ...props }: Omit<TextProps, 'fontFamily'>) {
  return (
    <Text fontFamily="sans" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextSerif({ children, className, ...props }: Omit<TextProps, 'fontFamily'>) {
  return (
    <Text fontFamily="serif" className={className} {...props}>
      {children}
    </Text>
  );
}

export function TextMono({ children, className, ...props }: Omit<TextProps, 'fontFamily'>) {
  return (
    <Text fontFamily="mono" className={className} {...props}>
      {children}
    </Text>
  );
}
