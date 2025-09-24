'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ExternalLink, ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';

export interface LinkProps {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'underline' | 'button' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
  decoration?: 'underline' | 'line-through' | 'no-underline';
  className?: string;
  as?: 'a' | 'button' | 'span' | 'div';
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  download?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  showExternalIcon?: boolean;
  showArrow?: boolean;
  arrowDirection?: 'right' | 'left' | 'up' | 'down';
  truncate?: boolean;
  noWrap?: boolean;
  breakWords?: boolean;
  breakAll?: boolean;
  hyphens?: 'none' | 'manual' | 'auto';
  lineHeight?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  letterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
  fontFamily?: 'sans' | 'serif' | 'mono';
  italic?: boolean;
  highlight?: boolean;
  code?: boolean;
  keyboard?: boolean;
  mark?: boolean;
  deleted?: boolean;
  inserted?: boolean;
  subscript?: boolean;
  superscript?: boolean;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

const variantClasses = {
  default: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
  primary: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium',
  secondary: 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
  muted: 'text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300',
  accent: 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300',
  success: 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300',
  warning: 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300',
  error: 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300',
  info: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
  underline: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline',
  button: 'inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors',
  ghost: 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded-md transition-colors',
};

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
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

const iconPositionClasses = {
  left: 'flex-row',
  right: 'flex-row-reverse',
  top: 'flex-col',
  bottom: 'flex-col-reverse',
};

const arrowIcons = {
  right: ArrowRight,
  left: ArrowLeft,
  up: ArrowUp,
  down: ArrowDown,
};

export default function LinkComponent({
  children,
  href,
  external = false,
  variant = 'default',
  size = 'md',
  weight,
  align,
  transform,
  decoration,
  className,
  as: Component = 'a',
  target,
  rel,
  download = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  showExternalIcon = false,
  showArrow = false,
  arrowDirection = 'right',
  truncate = false,
  noWrap = false,
  breakWords = false,
  breakAll = false,
  hyphens,
  lineHeight,
  letterSpacing,
  fontFamily,
  italic = false,
  highlight = false,
  code = false,
  keyboard = false,
  mark = false,
  deleted = false,
  inserted = false,
  subscript = false,
  superscript = false,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: LinkProps) {
  const isExternal = external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
  const effectiveTarget = target || (isExternal ? '_blank' : undefined);
  const effectiveRel = rel || (isExternal ? 'noopener noreferrer' : undefined);

  const getVariantClass = () => {
    if (code) return 'font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded';
    if (keyboard) return 'font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded border border-gray-300 dark:border-gray-600';
    if (mark) return 'bg-yellow-200 dark:bg-yellow-800 px-1 py-0.5 rounded';
    if (deleted) return 'line-through text-gray-500 dark:text-gray-400';
    if (inserted) return 'underline text-green-600 dark:text-green-400';
    if (subscript) return 'text-xs align-sub';
    if (superscript) return 'text-xs align-super';
    return variantClasses[variant];
  };

  const getSizeClass = () => {
    return sizeClasses[size];
  };

  const getWeightClass = () => {
    if (weight) return weightClasses[weight];
    if (variant === 'primary' || variant === 'button') return weightClasses.medium;
    return weightClasses.normal;
  };

  const getDecorationClass = () => {
    if (decoration) return decorationClasses[decoration];
    if (variant === 'underline') return decorationClasses.underline;
    if (deleted) return decorationClasses['line-through'];
    if (inserted) return decorationClasses.underline;
    return '';
  };

  const getHyphensClass = () => {
    if (hyphens === 'none') return 'hyphens-none';
    if (hyphens === 'manual') return 'hyphens-manual';
    if (hyphens === 'auto') return 'hyphens-auto';
    return '';
  };

  const getIconPositionClass = () => {
    if (icon || showExternalIcon || showArrow) {
      return `flex items-center ${iconPositionClasses[iconPosition]} gap-1`;
    }
    return '';
  };

  const renderIcon = () => {
    if (icon) return icon;
    if (showExternalIcon && isExternal) return <ExternalLink className="h-3 w-3" />;
    if (showArrow) {
      const ArrowIcon = arrowIcons[arrowDirection];
      return <ArrowIcon className="h-3 w-3" />;
    }
    return null;
  };

  const linkContent = (
    <>
      {renderIcon()}
      {children}
    </>
  );

  const linkProps = {
    className: cn(
      getVariantClass(),
      getSizeClass(),
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
      getIconPositionClass(),
      disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      loading && 'opacity-50 cursor-wait pointer-events-none',
      'transition-colors duration-200',
      className
    ),
    style,
    onClick: disabled || loading ? undefined : onClick,
    onMouseEnter: disabled || loading ? undefined : onMouseEnter,
    onMouseLeave: disabled || loading ? undefined : onMouseLeave,
    onFocus: disabled || loading ? undefined : onFocus,
    onBlur: disabled || loading ? undefined : onBlur,
  };

  if (Component === 'a') {
    return (
      <a
        href={disabled || loading ? undefined : href}
        target={effectiveTarget}
        rel={effectiveRel}
        download={download}
        {...linkProps}
      >
        {linkContent}
      </a>
    );
  }

  if (Component === 'button') {
    return (
      <button
        type="button"
        disabled={disabled || loading}
        {...linkProps}
      >
        {linkContent}
      </button>
    );
  }

  if (Component === 'span' || Component === 'div') {
    return (
      <Component {...linkProps}>
        {linkContent}
      </Component>
    );
  }

  // Use Next.js Link for internal links
  if (!isExternal && Component === 'a') {
    return (
      <Link href={href} {...linkProps}>
        {linkContent}
      </Link>
    );
  }

  return (
    <a
      href={disabled || loading ? undefined : href}
      target={effectiveTarget}
      rel={effectiveRel}
      download={download}
      {...linkProps}
    >
      {linkContent}
    </a>
  );
}

// Preset Link Components
export function LinkPrimary({ children, className, ...props }: Omit<LinkProps, 'variant'>) {
  return (
    <LinkComponent variant="primary" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkSecondary({ children, className, ...props }: Omit<LinkProps, 'variant'>) {
  return (
    <LinkComponent variant="secondary" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkMuted({ children, className, ...props }: Omit<LinkProps, 'variant'>) {
  return (
    <LinkComponent variant="muted" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkAccent({ children, className, ...props }: Omit<LinkProps, 'variant'>) {
  return (
    <LinkComponent variant="accent" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkSuccess({ children, className, ...props }: Omit<LinkProps, 'variant'>) {
  return (
    <LinkComponent variant="success" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkWarning({ children, className, ...props }: Omit<LinkProps, 'variant'>) {
  return (
    <LinkComponent variant="warning" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkError({ children, className, ...props }: Omit<LinkProps, 'variant'>) {
  return (
    <LinkComponent variant="error" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkInfo({ children, className, ...props }: Omit<LinkProps, 'variant'>) {
  return (
    <LinkComponent variant="info" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkUnderline({ children, className, ...props }: Omit<LinkProps, 'variant'>) {
  return (
    <LinkComponent variant="underline" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkButton({ children, className, ...props }: Omit<LinkProps, 'variant'>) {
  return (
    <LinkComponent variant="button" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkGhost({ children, className, ...props }: Omit<LinkProps, 'variant'>) {
  return (
    <LinkComponent variant="ghost" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

// Size Variants
export function LinkSm({ children, className, ...props }: Omit<LinkProps, 'size'>) {
  return (
    <LinkComponent size="sm" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkMd({ children, className, ...props }: Omit<LinkProps, 'size'>) {
  return (
    <LinkComponent size="md" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkLg({ children, className, ...props }: Omit<LinkProps, 'size'>) {
  return (
    <LinkComponent size="lg" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

// Weight Variants
export function LinkNormal({ children, className, ...props }: Omit<LinkProps, 'weight'>) {
  return (
    <LinkComponent weight="normal" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkMedium({ children, className, ...props }: Omit<LinkProps, 'weight'>) {
  return (
    <LinkComponent weight="medium" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkSemibold({ children, className, ...props }: Omit<LinkProps, 'weight'>) {
  return (
    <LinkComponent weight="semibold" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkBold({ children, className, ...props }: Omit<LinkProps, 'weight'>) {
  return (
    <LinkComponent weight="bold" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

// Alignment Variants
export function LinkLeft({ children, className, ...props }: Omit<LinkProps, 'align'>) {
  return (
    <LinkComponent align="left" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkCenter({ children, className, ...props }: Omit<LinkProps, 'align'>) {
  return (
    <LinkComponent align="center" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkRight({ children, className, ...props }: Omit<LinkProps, 'align'>) {
  return (
    <LinkComponent align="right" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

// Transform Variants
export function LinkUppercase({ children, className, ...props }: Omit<LinkProps, 'transform'>) {
  return (
    <LinkComponent transform="uppercase" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkLowercase({ children, className, ...props }: Omit<LinkProps, 'transform'>) {
  return (
    <LinkComponent transform="lowercase" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkCapitalize({ children, className, ...props }: Omit<LinkProps, 'transform'>) {
  return (
    <LinkComponent transform="capitalize" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

// Decoration Variants
export function LinkUnderline({ children, className, ...props }: Omit<LinkProps, 'decoration' | 'underline'>) {
  return (
    <LinkComponent decoration="underline" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkLineThrough({ children, className, ...props }: Omit<LinkProps, 'decoration' | 'strikethrough'>) {
  return (
    <LinkComponent decoration="line-through" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkNoUnderline({ children, className, ...props }: Omit<LinkProps, 'decoration'>) {
  return (
    <LinkComponent decoration="no-underline" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

// Special Variants
export function LinkExternal({ children, className, ...props }: Omit<LinkProps, 'external' | 'showExternalIcon'>) {
  return (
    <LinkComponent external={true} showExternalIcon={true} className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkArrow({ children, className, ...props }: Omit<LinkProps, 'showArrow' | 'arrowDirection'>) {
  return (
    <LinkComponent showArrow={true} className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkArrowLeft({ children, className, ...props }: Omit<LinkProps, 'showArrow' | 'arrowDirection'>) {
  return (
    <LinkComponent showArrow={true} arrowDirection="left" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkArrowUp({ children, className, ...props }: Omit<LinkProps, 'showArrow' | 'arrowDirection'>) {
  return (
    <LinkComponent showArrow={true} arrowDirection="up" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkArrowDown({ children, className, ...props }: Omit<LinkProps, 'showArrow' | 'arrowDirection'>) {
  return (
    <LinkComponent showArrow={true} arrowDirection="down" className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkHighlight({ children, className, ...props }: Omit<LinkProps, 'highlight'>) {
  return (
    <LinkComponent highlight={true} className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkCode({ children, className, ...props }: Omit<LinkProps, 'code'>) {
  return (
    <LinkComponent code={true} className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkKeyboard({ children, className, ...props }: Omit<LinkProps, 'keyboard'>) {
  return (
    <LinkComponent keyboard={true} className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkMark({ children, className, ...props }: Omit<LinkProps, 'mark'>) {
  return (
    <LinkComponent mark={true} className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkDel({ children, className, ...props }: Omit<LinkProps, 'deleted'>) {
  return (
    <LinkComponent deleted={true} className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkIns({ children, className, ...props }: Omit<LinkProps, 'inserted'>) {
  return (
    <LinkComponent inserted={true} className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkSub({ children, className, ...props }: Omit<LinkProps, 'subscript'>) {
  return (
    <LinkComponent subscript={true} className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

export function LinkSup({ children, className, ...props }: Omit<LinkProps, 'superscript'>) {
  return (
    <LinkComponent superscript={true} className={className} {...props}>
      {children}
    </LinkComponent>
  );
}
