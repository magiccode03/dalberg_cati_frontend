'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

export interface IconProps {
  name: keyof typeof LucideIcons;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl' | number;
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'white' | 'black' | 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'current' | 'inherit';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<SVGElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<SVGElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<SVGElement>) => void;
  onFocus?: (event: React.FocusEvent<SVGElement>) => void;
  onBlur?: (event: React.FocusEvent<SVGElement>) => void;
  // Custom props
  variant?: 'default' | 'outline' | 'filled' | 'duotone' | 'monochrome';
  strokeWidth?: number;
  fill?: 'none' | 'current' | 'white' | 'black' | 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo';
  background?: 'none' | 'white' | 'black' | 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'current';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'outline';
  border?: 'none' | 'thin' | 'medium' | 'thick';
  borderColor?: 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'transparent' | 'current';
  hover?: 'none' | 'scale' | 'zoom' | 'brightness' | 'saturate' | 'grayscale' | 'blur' | 'rotate' | 'bounce' | 'pulse';
  transition?: 'none' | 'fast' | 'normal' | 'slow';
  spin?: boolean;
  pulse?: boolean;
  bounce?: boolean;
  rotate?: number;
  flip?: 'horizontal' | 'vertical' | 'both';
  mirror?: boolean;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  ariaLabel?: string;
  ariaHidden?: boolean;
  role?: string;
  tabIndex?: number;
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
  '3xl': 'h-12 w-12',
  '4xl': 'h-16 w-16',
  '5xl': 'h-20 w-20',
  '6xl': 'h-24 w-24',
  '7xl': 'h-28 w-28',
  '8xl': 'h-32 w-32',
  '9xl': 'h-36 w-36',
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
  inherit: 'text-inherit',
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

const variantClasses = {
  default: '',
  outline: 'stroke-2',
  filled: 'fill-current',
  duotone: 'stroke-2 fill-current',
  monochrome: 'stroke-1 fill-current',
};

const fillClasses = {
  none: 'fill-none',
  current: 'fill-current',
  white: 'fill-white',
  black: 'fill-black dark:fill-white',
  gray: 'fill-gray-600 dark:fill-gray-400',
  blue: 'fill-blue-600 dark:fill-blue-400',
  red: 'fill-red-600 dark:fill-red-400',
  green: 'fill-green-600 dark:fill-green-400',
  yellow: 'fill-yellow-600 dark:fill-yellow-400',
  purple: 'fill-purple-600 dark:fill-purple-400',
  pink: 'fill-pink-600 dark:fill-pink-400',
  indigo: 'fill-indigo-600 dark:fill-indigo-400',
};

const backgroundClasses = {
  none: '',
  white: 'bg-white dark:bg-gray-900',
  black: 'bg-black dark:bg-white',
  gray: 'bg-gray-100 dark:bg-gray-800',
  blue: 'bg-blue-100 dark:bg-blue-900',
  red: 'bg-red-100 dark:bg-red-900',
  green: 'bg-green-100 dark:bg-green-900',
  yellow: 'bg-yellow-100 dark:bg-yellow-900',
  purple: 'bg-purple-100 dark:bg-purple-900',
  pink: 'bg-pink-100 dark:bg-pink-900',
  indigo: 'bg-indigo-100 dark:bg-indigo-900',
  current: 'bg-current',
};

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  outline: 'shadow-outline',
};

const borderClasses = {
  none: 'border-0',
  thin: 'border',
  medium: 'border-2',
  thick: 'border-4',
};

const borderColorClasses = {
  gray: 'border-gray-300 dark:border-gray-600',
  blue: 'border-blue-300 dark:border-blue-600',
  red: 'border-red-300 dark:border-red-600',
  green: 'border-green-300 dark:border-green-600',
  yellow: 'border-yellow-300 dark:border-yellow-600',
  purple: 'border-purple-300 dark:border-purple-600',
  pink: 'border-pink-300 dark:border-pink-600',
  indigo: 'border-indigo-300 dark:border-indigo-600',
  transparent: 'border-transparent',
  current: 'border-current',
};

const hoverClasses = {
  none: '',
  scale: 'hover:scale-105',
  zoom: 'hover:scale-110',
  brightness: 'hover:brightness-110',
  saturate: 'hover:saturate-150',
  grayscale: 'hover:grayscale',
  blur: 'hover:blur-sm',
  rotate: 'hover:rotate-12',
  bounce: 'hover:animate-bounce',
  pulse: 'hover:animate-pulse',
};

const transitionClasses = {
  none: '',
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-300',
  slow: 'transition-all duration-500',
};

const flipClasses = {
  horizontal: 'scale-x-[-1]',
  vertical: 'scale-y-[-1]',
  both: 'scale-[-1]',
};

export default function Icon({
  name,
  size = 'md',
  color = 'current',
  weight,
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  variant = 'default',
  strokeWidth = 2,
  fill = 'none',
  background = 'none',
  rounded = 'none',
  shadow = 'none',
  border = 'none',
  borderColor = 'gray',
  hover = 'none',
  transition = 'normal',
  spin = false,
  pulse = false,
  bounce = false,
  rotate = 0,
  flip,
  mirror = false,
  disabled = false,
  loading = false,
  tooltip,
  tooltipPosition = 'top',
  ariaLabel,
  ariaHidden = false,
  role,
  tabIndex,
}: IconProps) {
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide React icons`);
    return null;
  }

  const getSizeClass = () => {
    if (typeof size === 'number') {
      return `h-${size} w-${size}`;
    }
    return sizeClasses[size];
  };

  const getColorClass = () => {
    return colorClasses[color];
  };

  const getWeightClass = () => {
    if (weight) return weightClasses[weight];
    return '';
  };

  const getVariantClass = () => {
    return variantClasses[variant];
  };

  const getFillClass = () => {
    return fillClasses[fill];
  };

  const getBackgroundClass = () => {
    return backgroundClasses[background];
  };

  const getRoundedClass = () => {
    return roundedClasses[rounded];
  };

  const getShadowClass = () => {
    return shadowClasses[shadow];
  };

  const getBorderClass = () => {
    return borderClasses[border];
  };

  const getBorderColorClass = () => {
    return borderColorClasses[borderColor];
  };

  const getHoverClass = () => {
    return hoverClasses[hover];
  };

  const getTransitionClass = () => {
    return transitionClasses[transition];
  };

  const getFlipClass = () => {
    if (flip) return flipClasses[flip];
    if (mirror) return flipClasses.horizontal;
    return '';
  };

  const getAnimationClass = () => {
    if (spin) return 'animate-spin';
    if (pulse) return 'animate-pulse';
    if (bounce) return 'animate-bounce';
    return '';
  };

  const getTransformClass = () => {
    if (rotate !== 0) return `rotate-${rotate}`;
    return '';
  };

  const getDisabledClass = () => {
    if (disabled || loading) return 'opacity-50 cursor-not-allowed pointer-events-none';
    return '';
  };

  const getLoadingClass = () => {
    if (loading) return 'opacity-50 cursor-wait pointer-events-none';
    return '';
  };

  const getTooltipClass = () => {
    if (tooltip) return 'cursor-help';
    return '';
  };

  const getCursorClass = () => {
    if (onClick) return 'cursor-pointer';
    return '';
  };

  const iconClasses = cn(
    'inline-block',
    getSizeClass(),
    getColorClass(),
    getWeightClass(),
    getVariantClass(),
    getFillClass(),
    getBackgroundClass(),
    getRoundedClass(),
    getShadowClass(),
    getBorderClass(),
    getBorderColorClass(),
    getHoverClass(),
    getTransitionClass(),
    getFlipClass(),
    getAnimationClass(),
    getTransformClass(),
    getDisabledClass(),
    getLoadingClass(),
    getTooltipClass(),
    getCursorClass(),
    className
  );

  const iconStyle = {
    ...style,
    transform: rotate !== 0 ? `rotate(${rotate}deg)` : undefined,
  };

  const iconProps = {
    className: iconClasses,
    style: iconStyle,
    strokeWidth,
    onClick: disabled || loading ? undefined : onClick,
    onMouseEnter: disabled || loading ? undefined : onMouseEnter,
    onMouseLeave: disabled || loading ? undefined : onMouseLeave,
    onFocus: disabled || loading ? undefined : onFocus,
    onBlur: disabled || loading ? undefined : onBlur,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    role,
    tabIndex: disabled || loading ? -1 : tabIndex,
  };

  if (tooltip) {
    return (
      <div className="relative group">
        <IconComponent {...iconProps} />
        <div className={cn(
          'absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none',
          tooltipPosition === 'top' && 'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
          tooltipPosition === 'bottom' && 'top-full left-1/2 transform -translate-x-1/2 mt-1',
          tooltipPosition === 'left' && 'right-full top-1/2 transform -translate-y-1/2 mr-1',
          tooltipPosition === 'right' && 'left-full top-1/2 transform -translate-y-1/2 ml-1'
        )}>
          {tooltip}
        </div>
      </div>
    );
  }

  return <IconComponent {...iconProps} />;
}

// Preset Icon Components
export function IconXs({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="xs" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconSm({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="sm" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconMd({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="md" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconLg({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="lg" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconXl({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function Icon2xl({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="2xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function Icon3xl({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="3xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function Icon4xl({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="4xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function Icon5xl({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="5xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function Icon6xl({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="6xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function Icon7xl({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="7xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function Icon8xl({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="8xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function Icon9xl({ children, className, ...props }: Omit<IconProps, 'size'>) {
  return (
    <Icon size="9xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

// Color Variants
export function IconPrimary({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="primary" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconSecondary({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="secondary" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconMuted({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="muted" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconAccent({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="accent" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconSuccess({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="success" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconWarning({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="warning" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconError({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="error" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconInfo({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="info" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconWhite({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="white" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBlack({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="black" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconGray({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="gray" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBlue({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="blue" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconRed({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="red" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconGreen({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="green" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconYellow({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="yellow" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconPurple({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="purple" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconPink({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="pink" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconIndigo({ children, className, ...props }: Omit<IconProps, 'color'>) {
  return (
    <Icon color="indigo" className={className} {...props}>
      {children}
    </Icon>
  );
}

// Weight Variants
export function IconThin({ children, className, ...props }: Omit<IconProps, 'weight'>) {
  return (
    <Icon weight="thin" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconLight({ children, className, ...props }: Omit<IconProps, 'weight'>) {
  return (
    <Icon weight="light" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconNormal({ children, className, ...props }: Omit<IconProps, 'weight'>) {
  return (
    <Icon weight="normal" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconMedium({ children, className, ...props }: Omit<IconProps, 'weight'>) {
  return (
    <Icon weight="medium" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconSemibold({ children, className, ...props }: Omit<IconProps, 'weight'>) {
  return (
    <Icon weight="semibold" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBold({ children, className, ...props }: Omit<IconProps, 'weight'>) {
  return (
    <Icon weight="bold" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconExtrabold({ children, className, ...props }: Omit<IconProps, 'weight'>) {
  return (
    <Icon weight="extrabold" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBlack({ children, className, ...props }: Omit<IconProps, 'weight'>) {
  return (
    <Icon weight="black" className={className} {...props}>
      {children}
    </Icon>
  );
}

// Variant Variants
export function IconOutline({ children, className, ...props }: Omit<IconProps, 'variant'>) {
  return (
    <Icon variant="outline" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconFilled({ children, className, ...props }: Omit<IconProps, 'variant'>) {
  return (
    <Icon variant="filled" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconDuotone({ children, className, ...props }: Omit<IconProps, 'variant'>) {
  return (
    <Icon variant="duotone" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconMonochrome({ children, className, ...props }: Omit<IconProps, 'variant'>) {
  return (
    <Icon variant="monochrome" className={className} {...props}>
      {children}
    </Icon>
  );
}

// Hover Variants
export function IconHoverScale({ children, className, ...props }: Omit<IconProps, 'hover'>) {
  return (
    <Icon hover="scale" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconHoverZoom({ children, className, ...props }: Omit<IconProps, 'hover'>) {
  return (
    <Icon hover="zoom" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconHoverBrightness({ children, className, ...props }: Omit<IconProps, 'hover'>) {
  return (
    <Icon hover="brightness" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconHoverSaturate({ children, className, ...props }: Omit<IconProps, 'hover'>) {
  return (
    <Icon hover="saturate" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconHoverGrayscale({ children, className, ...props }: Omit<IconProps, 'hover'>) {
  return (
    <Icon hover="grayscale" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconHoverBlur({ children, className, ...props }: Omit<IconProps, 'hover'>) {
  return (
    <Icon hover="blur" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconHoverRotate({ children, className, ...props }: Omit<IconProps, 'hover'>) {
  return (
    <Icon hover="rotate" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconHoverBounce({ children, className, ...props }: Omit<IconProps, 'hover'>) {
  return (
    <Icon hover="bounce" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconHoverPulse({ children, className, ...props }: Omit<IconProps, 'hover'>) {
  return (
    <Icon hover="pulse" className={className} {...props}>
      {children}
    </Icon>
  );
}

// Animation Variants
export function IconSpin({ children, className, ...props }: Omit<IconProps, 'spin'>) {
  return (
    <Icon spin={true} className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconPulse({ children, className, ...props }: Omit<IconProps, 'pulse'>) {
  return (
    <Icon pulse={true} className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBounce({ children, className, ...props }: Omit<IconProps, 'bounce'>) {
  return (
    <Icon bounce={true} className={className} {...props}>
      {children}
    </Icon>
  );
}

// Transition Variants
export function IconTransitionFast({ children, className, ...props }: Omit<IconProps, 'transition'>) {
  return (
    <Icon transition="fast" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconTransitionNormal({ children, className, ...props }: Omit<IconProps, 'transition'>) {
  return (
    <Icon transition="normal" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconTransitionSlow({ children, className, ...props }: Omit<IconProps, 'transition'>) {
  return (
    <Icon transition="slow" className={className} {...props}>
      {children}
    </Icon>
  );
}

// Special Variants
export function IconDisabled({ children, className, ...props }: Omit<IconProps, 'disabled'>) {
  return (
    <Icon disabled={true} className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconLoading({ children, className, ...props }: Omit<IconProps, 'loading'>) {
  return (
    <Icon loading={true} className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconWithTooltip({ children, className, ...props }: Omit<IconProps, 'tooltip'>) {
  return (
    <Icon tooltip={children} className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconTooltipTop({ children, className, ...props }: Omit<IconProps, 'tooltip' | 'tooltipPosition'>) {
  return (
    <Icon tooltip={children} tooltipPosition="top" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconTooltipBottom({ children, className, ...props }: Omit<IconProps, 'tooltip' | 'tooltipPosition'>) {
  return (
    <Icon tooltip={children} tooltipPosition="bottom" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconTooltipLeft({ children, className, ...props }: Omit<IconProps, 'tooltip' | 'tooltipPosition'>) {
  return (
    <Icon tooltip={children} tooltipPosition="left" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconTooltipRight({ children, className, ...props }: Omit<IconProps, 'tooltip' | 'tooltipPosition'>) {
  return (
    <Icon tooltip={children} tooltipPosition="right" className={className} {...props}>
      {children}
    </Icon>
  );
}

// Flip Variants
export function IconFlipHorizontal({ children, className, ...props }: Omit<IconProps, 'flip'>) {
  return (
    <Icon flip="horizontal" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconFlipVertical({ children, className, ...props }: Omit<IconProps, 'flip'>) {
  return (
    <Icon flip="vertical" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconFlipBoth({ children, className, ...props }: Omit<IconProps, 'flip'>) {
  return (
    <Icon flip="both" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconMirror({ children, className, ...props }: Omit<IconProps, 'mirror'>) {
  return (
    <Icon mirror={true} className={className} {...props}>
      {children}
    </Icon>
  );
}

// Rotate Variants
export function IconRotate90({ children, className, ...props }: Omit<IconProps, 'rotate'>) {
  return (
    <Icon rotate={90} className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconRotate180({ children, className, ...props }: Omit<IconProps, 'rotate'>) {
  return (
    <Icon rotate={180} className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconRotate270({ children, className, ...props }: Omit<IconProps, 'rotate'>) {
  return (
    <Icon rotate={270} className={className} {...props}>
      {children}
    </Icon>
  );
}

// Background Variants
export function IconWithBackground({ children, className, ...props }: Omit<IconProps, 'background'>) {
  return (
    <Icon background="gray" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBackgroundBlue({ children, className, ...props }: Omit<IconProps, 'background'>) {
  return (
    <Icon background="blue" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBackgroundRed({ children, className, ...props }: Omit<IconProps, 'background'>) {
  return (
    <Icon background="red" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBackgroundGreen({ children, className, ...props }: Omit<IconProps, 'background'>) {
  return (
    <Icon background="green" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBackgroundYellow({ children, className, ...props }: Omit<IconProps, 'background'>) {
  return (
    <Icon background="yellow" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBackgroundPurple({ children, className, ...props }: Omit<IconProps, 'background'>) {
  return (
    <Icon background="purple" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBackgroundPink({ children, className, ...props }: Omit<IconProps, 'background'>) {
  return (
    <Icon background="pink" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBackgroundIndigo({ children, className, ...props }: Omit<IconProps, 'background'>) {
  return (
    <Icon background="indigo" className={className} {...props}>
      {children}
    </Icon>
  );
}

// Rounded Variants
export function IconRounded({ children, className, ...props }: Omit<IconProps, 'rounded'>) {
  return (
    <Icon rounded="md" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconRoundedLg({ children, className, ...props }: Omit<IconProps, 'rounded'>) {
  return (
    <Icon rounded="lg" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconRoundedXl({ children, className, ...props }: Omit<IconProps, 'rounded'>) {
  return (
    <Icon rounded="xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconRounded2xl({ children, className, ...props }: Omit<IconProps, 'rounded'>) {
  return (
    <Icon rounded="2xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconRounded3xl({ children, className, ...props }: Omit<IconProps, 'rounded'>) {
  return (
    <Icon rounded="3xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconRoundedFull({ children, className, ...props }: Omit<IconProps, 'rounded'>) {
  return (
    <Icon rounded="full" className={className} {...props}>
      {children}
    </Icon>
  );
}

// Shadow Variants
export function IconShadow({ children, className, ...props }: Omit<IconProps, 'shadow'>) {
  return (
    <Icon shadow="md" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconShadowLg({ children, className, ...props }: Omit<IconProps, 'shadow'>) {
  return (
    <Icon shadow="lg" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconShadowXl({ children, className, ...props }: Omit<IconProps, 'shadow'>) {
  return (
    <Icon shadow="xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconShadow2xl({ children, className, ...props }: Omit<IconProps, 'shadow'>) {
  return (
    <Icon shadow="2xl" className={className} {...props}>
      {children}
    </Icon>
  );
}

// Border Variants
export function IconWithBorder({ children, className, ...props }: Omit<IconProps, 'border'>) {
  return (
    <Icon border="thin" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBorderMedium({ children, className, ...props }: Omit<IconProps, 'border'>) {
  return (
    <Icon border="medium" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBorderThick({ children, className, ...props }: Omit<IconProps, 'border'>) {
  return (
    <Icon border="thick" className={className} {...props}>
      {children}
    </Icon>
  );
}

// Border Color Variants
export function IconBorderBlue({ children, className, ...props }: Omit<IconProps, 'borderColor'>) {
  return (
    <Icon borderColor="blue" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBorderRed({ children, className, ...props }: Omit<IconProps, 'borderColor'>) {
  return (
    <Icon borderColor="red" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBorderGreen({ children, className, ...props }: Omit<IconProps, 'borderColor'>) {
  return (
    <Icon borderColor="green" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBorderYellow({ children, className, ...props }: Omit<IconProps, 'borderColor'>) {
  return (
    <Icon borderColor="yellow" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBorderPurple({ children, className, ...props }: Omit<IconProps, 'borderColor'>) {
  return (
    <Icon borderColor="purple" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBorderPink({ children, className, ...props }: Omit<IconProps, 'borderColor'>) {
  return (
    <Icon borderColor="pink" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBorderIndigo({ children, className, ...props }: Omit<IconProps, 'borderColor'>) {
  return (
    <Icon borderColor="indigo" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBorderTransparent({ children, className, ...props }: Omit<IconProps, 'borderColor'>) {
  return (
    <Icon borderColor="transparent" className={className} {...props}>
      {children}
    </Icon>
  );
}

export function IconBorderCurrent({ children, className, ...props }: Omit<IconProps, 'borderColor'>) {
  return (
    <Icon borderColor="current" className={className} {...props}>
      {children}
    </Icon>
  );
}
