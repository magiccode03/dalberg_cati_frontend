'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  axis?: 'x' | 'y' | 'both';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  responsive?: boolean;
  breakpoints?: {
    xs?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
    sm?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
    md?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
    lg?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
    xl?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
    '2xl'?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  };
  custom?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  debug?: boolean;
}

const sizeClasses = {
  xs: 'w-1 h-1',
  sm: 'w-2 h-2',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12',
  '3xl': 'w-16 h-16',
  '4xl': 'w-20 h-20',
  '5xl': 'w-24 h-24',
  '6xl': 'w-32 h-32',
  '7xl': 'w-40 h-40',
  '8xl': 'w-48 h-48',
  '9xl': 'w-64 h-64',
};

const axisClasses = {
  x: 'w-full h-0',
  y: 'w-0 h-full',
  both: 'w-full h-full',
};

const responsiveSizeClasses = {
  xs: {
    xs: 'w-1 h-1',
    sm: 'w-1 h-1',
    md: 'w-1 h-1',
    lg: 'w-1 h-1',
    xl: 'w-1 h-1',
    '2xl': 'w-1 h-1',
  },
  sm: {
    xs: 'w-1 h-1',
    sm: 'w-2 h-2',
    md: 'w-2 h-2',
    lg: 'w-2 h-2',
    xl: 'w-2 h-2',
    '2xl': 'w-2 h-2',
  },
  md: {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-4 h-4',
    xl: 'w-4 h-4',
    '2xl': 'w-4 h-4',
  },
  lg: {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-6 h-6',
    '2xl': 'w-6 h-6',
  },
  xl: {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-8 h-8',
    '2xl': 'w-8 h-8',
  },
  '2xl': {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-12 h-12',
    '2xl': 'w-12 h-12',
  },
  '3xl': {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-16 h-16',
    '2xl': 'w-16 h-16',
  },
  '4xl': {
    xs: 'w-10 h-10',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-20 h-20',
    '2xl': 'w-20 h-20',
  },
  '5xl': {
    xs: 'w-12 h-12',
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-24 h-24',
    '2xl': 'w-24 h-24',
  },
  '6xl': {
    xs: 'w-16 h-16',
    sm: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-32 h-32',
    '2xl': 'w-32 h-32',
  },
  '7xl': {
    xs: 'w-20 h-20',
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
    xl: 'w-40 h-40',
    '2xl': 'w-40 h-40',
  },
  '8xl': {
    xs: 'w-24 h-24',
    sm: 'w-32 h-32',
    md: 'w-40 h-40',
    lg: 'w-48 h-48',
    xl: 'w-48 h-48',
    '2xl': 'w-48 h-48',
  },
  '9xl': {
    xs: 'w-32 h-32',
    sm: 'w-40 h-40',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-64 h-64',
    '2xl': 'w-64 h-64',
  },
};

export default function Spacer({
  size = 'md',
  axis = 'both',
  className,
  style,
  children,
  responsive = false,
  breakpoints,
  custom,
  debug = false,
}: SpacerProps) {
  const getResponsiveClasses = () => {
    if (!responsive || !breakpoints) return '';

    const classes: string[] = [];
    
    Object.entries(breakpoints).forEach(([breakpoint, breakpointSize]) => {
      if (breakpointSize) {
        const responsiveClass = responsiveSizeClasses[breakpointSize][breakpoint as keyof typeof responsiveSizeClasses[typeof breakpointSize]];
        if (responsiveClass) {
          classes.push(`${breakpoint}:${responsiveClass}`);
        }
      }
    });

    return classes.join(' ');
  };

  const getCustomClasses = () => {
    if (!custom) return '';

    const classes: string[] = [];
    
    Object.entries(custom).forEach(([breakpoint, customClass]) => {
      if (customClass) {
        classes.push(`${breakpoint}:${customClass}`);
      }
    });

    return classes.join(' ');
  };

  const getSizeClasses = () => {
    if (responsive && breakpoints) {
      return getResponsiveClasses();
    }
    
    if (custom) {
      return getCustomClasses();
    }
    
    return sizeClasses[size];
  };

  const getAxisClasses = () => {
    return axisClasses[axis];
  };

  const spacerClasses = cn(
    getSizeClasses(),
    getAxisClasses(),
    debug && 'bg-red-500 border border-red-700',
    className
  );

  if (children) {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          spacerClasses
        )}
        style={style}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={spacerClasses}
      style={style}
    />
  );
}

// Preset Spacer Components
export function SpacerXs({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="xs" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function SpacerSm({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="sm" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function SpacerMd({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="md" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function SpacerLg({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="lg" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function SpacerXl({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="xl" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function Spacer2xl({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="2xl" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function Spacer3xl({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="3xl" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function Spacer4xl({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="4xl" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function Spacer5xl({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="5xl" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function Spacer6xl({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="6xl" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function Spacer7xl({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="7xl" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function Spacer8xl({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="8xl" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function Spacer9xl({ children, className, ...props }: Omit<SpacerProps, 'size'>) {
  return (
    <Spacer size="9xl" className={className} {...props}>
      {children}
    </Spacer>
  );
}

// Axis Components
export function SpacerX({ children, className, ...props }: Omit<SpacerProps, 'axis'>) {
  return (
    <Spacer axis="x" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function SpacerY({ children, className, ...props }: Omit<SpacerProps, 'axis'>) {
  return (
    <Spacer axis="y" className={className} {...props}>
      {children}
    </Spacer>
  );
}

export function SpacerBoth({ children, className, ...props }: Omit<SpacerProps, 'axis'>) {
  return (
    <Spacer axis="both" className={className} {...props}>
      {children}
    </Spacer>
  );
}

// Responsive Components
export function SpacerResponsive({ children, className, ...props }: Omit<SpacerProps, 'responsive'>) {
  return (
    <Spacer responsive={true} className={className} {...props}>
      {children}
    </Spacer>
  );
}

// Custom Components
export function SpacerCustom({ children, className, ...props }: Omit<SpacerProps, 'custom'>) {
  return (
    <Spacer custom={props.custom} className={className} {...props}>
      {children}
    </Spacer>
  );
}

// Debug Components
export function SpacerDebug({ children, className, ...props }: Omit<SpacerProps, 'debug'>) {
  return (
    <Spacer debug={true} className={className} {...props}>
      {children}
    </Spacer>
  );
}

// Utility Functions
export function createSpacer(size: SpacerProps['size'] = 'md', axis: SpacerProps['axis'] = 'both') {
  return function SpacerComponent({ children, className, ...props }: Omit<SpacerProps, 'size' | 'axis'>) {
    return (
      <Spacer size={size} axis={axis} className={className} {...props}>
        {children}
      </Spacer>
    );
  };
}

export function createResponsiveSpacer(breakpoints: SpacerProps['breakpoints']) {
  return function ResponsiveSpacerComponent({ children, className, ...props }: Omit<SpacerProps, 'breakpoints' | 'responsive'>) {
    return (
      <Spacer responsive={true} breakpoints={breakpoints} className={className} {...props}>
        {children}
      </Spacer>
    );
  };
}

export function createCustomSpacer(custom: SpacerProps['custom']) {
  return function CustomSpacerComponent({ children, className, ...props }: Omit<SpacerProps, 'custom'>) {
    return (
      <Spacer custom={custom} className={className} {...props}>
        {children}
      </Spacer>
    );
  };
}
