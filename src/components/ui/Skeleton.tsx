'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  lines?: number;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  show?: boolean;
  loading?: boolean;
  error?: string;
  warning?: string;
  info?: string;
  success?: string;
  compact?: boolean;
  responsive?: boolean;
  sticky?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'horizontal' | 'vertical';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: string | number;
  maxHeight?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  borderRadius?: string | number;
  opacity?: number;
  blur?: boolean;
  shimmer?: boolean;
  gradient?: boolean;
  pattern?: 'dots' | 'lines' | 'grid' | 'none';
  density?: 'low' | 'medium' | 'high';
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
  delay?: number;
  repeat?: boolean;
  repeatDelay?: number;
  onLoad?: () => void;
  onError?: () => void;
  onComplete?: () => void;
}

const variantClasses = {
  text: 'h-4',
  rectangular: 'h-4',
  circular: 'rounded-full',
  rounded: 'rounded-md',
};

const animationClasses = {
  pulse: 'animate-pulse',
  wave: 'animate-wave',
  none: '',
};

const speedClasses = {
  slow: 'duration-1000',
  normal: 'duration-500',
  fast: 'duration-300',
};

const colorClasses = {
  default: 'bg-gray-200 dark:bg-gray-700',
  primary: 'bg-blue-200 dark:bg-blue-700',
  secondary: 'bg-gray-200 dark:bg-gray-700',
  success: 'bg-green-200 dark:bg-green-700',
  warning: 'bg-yellow-200 dark:bg-yellow-700',
  error: 'bg-red-200 dark:bg-red-700',
  info: 'bg-blue-200 dark:bg-blue-700',
};

const sizeClasses = {
  xs: 'h-2',
  sm: 'h-3',
  md: 'h-4',
  lg: 'h-6',
  xl: 'h-8',
  '2xl': 'h-12',
  '3xl': 'h-16',
  '4xl': 'h-20',
  '5xl': 'h-24',
};

const spacingClasses = {
  none: 'space-y-0',
  sm: 'space-y-1',
  md: 'space-y-2',
  lg: 'space-y-3',
  xl: 'space-y-4',
};

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
  xl: 'gap-4',
};

const directionClasses = {
  horizontal: 'flex-row',
  vertical: 'flex-col',
};

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const patternClasses = {
  dots: 'bg-dots',
  lines: 'bg-lines',
  grid: 'bg-grid',
  none: '',
};

const densityClasses = {
  low: 'opacity-30',
  medium: 'opacity-50',
  high: 'opacity-70',
};

const intensityClasses = {
  low: 'opacity-40',
  medium: 'opacity-60',
  high: 'opacity-80',
};

export default function Skeleton({
  lines = 1,
  width = '100%',
  height,
  variant = 'text',
  animation = 'pulse',
  speed = 'normal',
  className,
  style,
  children,
  show = true,
  loading = true,
  error,
  warning,
  info,
  success,
  compact = false,
  responsive = true,
  sticky = false,
  theme = 'auto',
  color = 'default',
  size = 'md',
  spacing = 'md',
  direction = 'vertical',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'md',
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  borderRadius,
  opacity = 1,
  blur = false,
  shimmer = false,
  gradient = false,
  pattern = 'none',
  density = 'medium',
  intensity = 'medium',
  duration = 1000,
  delay = 0,
  repeat = true,
  repeatDelay = 0,
  onLoad,
  onError,
  onComplete,
}: SkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsLoaded(false);
      setHasError(false);
      setIsComplete(false);
    } else {
      setIsLoaded(true);
      onLoad?.();
    }
  }, [loading, onLoad]);

  useEffect(() => {
    if (error) {
      setHasError(true);
      onError?.();
    }
  }, [error, onError]);

  useEffect(() => {
    if (isLoaded && !hasError) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [isLoaded, hasError, onComplete]);

  const getSkeletonStyle = () => {
    const baseStyle: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      maxWidth: maxWidth ? (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth) : undefined,
      maxHeight: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined,
      minWidth: minWidth ? (typeof minWidth === 'number' ? `${minWidth}px` : minWidth) : undefined,
      minHeight: minHeight ? (typeof minHeight === 'number' ? `${minHeight}px` : minHeight) : undefined,
      borderRadius: borderRadius ? (typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius) : undefined,
      opacity: opacity,
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`,
      animationIterationCount: repeat ? 'infinite' : 1,
      ...style,
    };

    if (shimmer) {
      baseStyle.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)';
      baseStyle.backgroundSize = '200% 100%';
      baseStyle.animation = 'shimmer 1.5s infinite';
    }

    if (gradient) {
      baseStyle.background = 'linear-gradient(45deg, #f0f0f0, #e0e0e0, #f0f0f0)';
    }

    if (blur) {
      baseStyle.filter = 'blur(1px)';
    }

    return baseStyle;
  };

  const renderSkeletonLine = (index: number) => {
    const lineWidth = typeof width === 'number' ? width : '100%';
    const lineHeight = height || sizeClasses[size];

    return (
      <div
        key={index}
        className={cn(
          'skeleton-line',
          variantClasses[variant],
          animationClasses[animation],
          speedClasses[speed],
          colorClasses[color],
          lineHeight,
          patternClasses[pattern],
          densityClasses[density],
          intensityClasses[intensity],
          compact && 'h-3',
          responsive && 'w-full sm:w-auto',
          sticky && 'sticky top-0'
        )}
        style={getSkeletonStyle()}
      />
    );
  };

  const renderSkeletonContent = () => {
    if (lines === 1) {
      return renderSkeletonLine(0);
    }

    return (
      <div
        className={cn(
          'skeleton-container',
          directionClasses[direction],
          alignClasses[align],
          justifyClasses[justify],
          wrap && 'flex-wrap',
          gapClasses[gap],
          spacingClasses[spacing],
          compact && 'space-y-1',
          responsive && 'flex-col sm:flex-row'
        )}
      >
        {Array.from({ length: lines }, (_, index) => renderSkeletonLine(index))}
      </div>
    );
  };

  const renderErrorState = () => {
    if (!error) return null;

    return (
      <div className="flex items-center justify-center p-4 text-red-600 dark:text-red-400">
        <div className="text-center">
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  };

  const renderWarningState = () => {
    if (!warning) return null;

    return (
      <div className="flex items-center justify-center p-4 text-yellow-600 dark:text-yellow-400">
        <div className="text-center">
          <p className="text-sm font-medium">{warning}</p>
        </div>
      </div>
    );
  };

  const renderInfoState = () => {
    if (!info) return null;

    return (
      <div className="flex items-center justify-center p-4 text-blue-600 dark:text-blue-400">
        <div className="text-center">
          <p className="text-sm font-medium">{info}</p>
        </div>
      </div>
    );
  };

  const renderSuccessState = () => {
    if (!success) return null;

    return (
      <div className="flex items-center justify-center p-4 text-green-600 dark:text-green-400">
        <div className="text-center">
          <p className="text-sm font-medium">{success}</p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (error) return renderErrorState();
    if (warning) return renderWarningState();
    if (info) return renderInfoState();
    if (success) return renderSuccessState();
    if (isLoaded && children) return children;
    if (show && loading) return renderSkeletonContent();
    return null;
  };

  return (
    <div
      className={cn(
        'skeleton-wrapper',
        compact && 'compact',
        responsive && 'responsive',
        sticky && 'sticky',
        className
      )}
    >
      {renderContent()}
    </div>
  );
}

// Preset Skeleton Components
export function SkeletonText({ children, className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <Skeleton variant="text" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonRectangular({ children, className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <Skeleton variant="rectangular" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonCircular({ children, className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <Skeleton variant="circular" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonRounded({ children, className, ...props }: Omit<SkeletonProps, 'variant'>) {
  return (
    <Skeleton variant="rounded" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

// Size Variants
export function SkeletonXs({ children, className, ...props }: Omit<SkeletonProps, 'size'>) {
  return (
    <Skeleton size="xs" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonSm({ children, className, ...props }: Omit<SkeletonProps, 'size'>) {
  return (
    <Skeleton size="sm" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonMd({ children, className, ...props }: Omit<SkeletonProps, 'size'>) {
  return (
    <Skeleton size="md" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonLg({ children, className, ...props }: Omit<SkeletonProps, 'size'>) {
  return (
    <Skeleton size="lg" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonXl({ children, className, ...props }: Omit<SkeletonProps, 'size'>) {
  return (
    <Skeleton size="xl" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function Skeleton2xl({ children, className, ...props }: Omit<SkeletonProps, 'size'>) {
  return (
    <Skeleton size="2xl" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function Skeleton3xl({ children, className, ...props }: Omit<SkeletonProps, 'size'>) {
  return (
    <Skeleton size="3xl" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function Skeleton4xl({ children, className, ...props }: Omit<SkeletonProps, 'size'>) {
  return (
    <Skeleton size="4xl" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function Skeleton5xl({ children, className, ...props }: Omit<SkeletonProps, 'size'>) {
  return (
    <Skeleton size="5xl" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

// Animation Variants
export function SkeletonPulse({ children, className, ...props }: Omit<SkeletonProps, 'animation'>) {
  return (
    <Skeleton animation="pulse" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonWave({ children, className, ...props }: Omit<SkeletonProps, 'animation'>) {
  return (
    <Skeleton animation="wave" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonNone({ children, className, ...props }: Omit<SkeletonProps, 'animation'>) {
  return (
    <Skeleton animation="none" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

// Color Variants
export function SkeletonPrimary({ children, className, ...props }: Omit<SkeletonProps, 'color'>) {
  return (
    <Skeleton color="primary" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonSecondary({ children, className, ...props }: Omit<SkeletonProps, 'color'>) {
  return (
    <Skeleton color="secondary" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonSuccess({ children, className, ...props }: Omit<SkeletonProps, 'color'>) {
  return (
    <Skeleton color="success" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonWarning({ children, className, ...props }: Omit<SkeletonProps, 'color'>) {
  return (
    <Skeleton color="warning" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonError({ children, className, ...props }: Omit<SkeletonProps, 'color'>) {
  return (
    <Skeleton color="error" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonInfo({ children, className, ...props }: Omit<SkeletonProps, 'color'>) {
  return (
    <Skeleton color="info" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

// Special Variants
export function SkeletonShimmer({ children, className, ...props }: Omit<SkeletonProps, 'shimmer'>) {
  return (
    <Skeleton shimmer={true} className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonGradient({ children, className, ...props }: Omit<SkeletonProps, 'gradient'>) {
  return (
    <Skeleton gradient={true} className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export function SkeletonBlur({ children, className, ...props }: Omit<SkeletonProps, 'blur'>) {
  return (
    <Skeleton blur={true} className={className} {...props}>
      {children}
    </Skeleton>
  );
}

// Utility Functions
export function createSkeleton(variant: SkeletonProps['variant'] = 'text', size: SkeletonProps['size'] = 'md') {
  return function SkeletonComponent({ children, className, ...props }: Omit<SkeletonProps, 'variant' | 'size'>) {
    return (
      <Skeleton variant={variant} size={size} className={className} {...props}>
        {children}
      </Skeleton>
    );
  };
}

export function createSkeletonGroup(direction: SkeletonProps['direction'] = 'vertical', gap: SkeletonProps['gap'] = 'md') {
  return function SkeletonGroup({ children, className, ...props }: Omit<SkeletonProps, 'direction' | 'gap'>) {
    return (
      <Skeleton direction={direction} gap={gap} className={className} {...props}>
        {children}
      </Skeleton>
    );
  };
}

export function createSkeletonAnimation(animation: SkeletonProps['animation'] = 'pulse', speed: SkeletonProps['speed'] = 'normal') {
  return function SkeletonAnimation({ children, className, ...props }: Omit<SkeletonProps, 'animation' | 'speed'>) {
    return (
      <Skeleton animation={animation} speed={speed} className={className} {...props}>
        {children}
      </Skeleton>
    );
  };
}
