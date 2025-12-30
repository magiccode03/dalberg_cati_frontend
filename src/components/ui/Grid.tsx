'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';
    '2xl'?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';
  };
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  flow?: 'row' | 'col' | 'dense' | 'row-dense' | 'col-dense';
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
  auto: 'grid-cols-auto',
};

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
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

const flowClasses = {
  row: 'grid-flow-row',
  col: 'grid-flow-col',
  dense: 'grid-flow-dense',
  'row-dense': 'grid-flow-row-dense',
  'col-dense': 'grid-flow-col-dense',
};

export default function Grid({
  children,
  columns = 3,
  gap = 'md',
  className,
  as: Component = 'div',
  responsive,
  align = 'stretch',
  justify = 'start',
  flow = 'row',
}: GridProps) {
  const responsiveClasses = responsive ? Object.entries(responsive).map(([breakpoint, cols]) => {
    const breakpointClass = breakpoint === '2xl' ? '2xl' : breakpoint;
    return `${breakpointClass}:${columnClasses[cols]}`;
  }).join(' ') : '';

  return (
    <Component
      className={cn(
        'grid',
        columnClasses[columns],
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        flowClasses[flow],
        responsiveClasses,
        className
      )}
    >
      {children}
    </Component>
  );
}

// Grid Item Component
export interface GridItemProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full';
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';
  end?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav';
  responsive?: {
    sm?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full'; start?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto'; end?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' };
    md?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full'; start?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto'; end?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' };
    lg?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full'; start?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto'; end?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' };
    xl?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full'; start?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto'; end?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' };
    '2xl'?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full'; start?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto'; end?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' };
  };
}

const spanClasses = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  12: 'col-span-12',
  full: 'col-span-full',
};

const startClasses = {
  1: 'col-start-1',
  2: 'col-start-2',
  3: 'col-start-3',
  4: 'col-start-4',
  5: 'col-start-5',
  6: 'col-start-6',
  12: 'col-start-12',
  auto: 'col-start-auto',
};

const endClasses = {
  1: 'col-end-1',
  2: 'col-end-2',
  3: 'col-end-3',
  4: 'col-end-4',
  5: 'col-end-5',
  6: 'col-end-6',
  12: 'col-end-12',
  auto: 'col-end-auto',
};

export function GridItem({
  children,
  span = 1,
  start,
  end,
  className,
  as: Component = 'div',
  responsive,
}: GridItemProps) {
  const responsiveClasses = responsive ? Object.entries(responsive).map(([breakpoint, config]) => {
    const breakpointClass = breakpoint === '2xl' ? '2xl' : breakpoint;
    const classes = [];
    
    if (config.span) {
      classes.push(`${breakpointClass}:${spanClasses[config.span]}`);
    }
    if (config.start) {
      classes.push(`${breakpointClass}:${startClasses[config.start]}`);
    }
    if (config.end) {
      classes.push(`${breakpointClass}:${endClasses[config.end]}`);
    }
    
    return classes.join(' ');
  }).join(' ') : '';

  return (
    <Component
      className={cn(
        spanClasses[span],
        start && startClasses[start],
        end && endClasses[end],
        responsiveClasses,
        className
      )}
    >
      {children}
    </Component>
  );
}

// Preset Grid Components
export function Grid2({ children, className, ...props }: Omit<GridProps, 'columns'>) {
  return (
    <Grid columns={2} className={className} {...props}>
      {children}
    </Grid>
  );
}

export function Grid3({ children, className, ...props }: Omit<GridProps, 'columns'>) {
  return (
    <Grid columns={3} className={className} {...props}>
      {children}
    </Grid>
  );
}

export function Grid4({ children, className, ...props }: Omit<GridProps, 'columns'>) {
  return (
    <Grid columns={4} className={className} {...props}>
      {children}
    </Grid>
  );
}

export function Grid6({ children, className, ...props }: Omit<GridProps, 'columns'>) {
  return (
    <Grid columns={6} className={className} {...props}>
      {children}
    </Grid>
  );
}

export function Grid12({ children, className, ...props }: Omit<GridProps, 'columns'>) {
  return (
    <Grid columns={12} className={className} {...props}>
      {children}
    </Grid>
  );
}

// Responsive Grid
export function ResponsiveGrid({ children, className, ...props }: Omit<GridProps, 'responsive'>) {
  return (
    <Grid
      responsive={{
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
      }}
      className={className}
      {...props}
    >
      {children}
    </Grid>
  );
}

// Auto Grid
export function AutoGrid({ children, className, ...props }: Omit<GridProps, 'columns'>) {
  return (
    <Grid columns="auto" className={className} {...props}>
      {children}
    </Grid>
  );
}

// Dense Grid
export function DenseGrid({ children, className, ...props }: Omit<GridProps, 'flow'>) {
  return (
    <Grid flow="dense" className={className} {...props}>
      {children}
    </Grid>
  );
}

// Section Grid
export function SectionGrid({ children, className, ...props }: Omit<GridProps, 'as'>) {
  return (
    <Grid as="section" className={className} {...props}>
      {children}
    </Grid>
  );
}

// Article Grid
export function ArticleGrid({ children, className, ...props }: Omit<GridProps, 'as'>) {
  return (
    <Grid as="article" className={className} {...props}>
      {children}
    </Grid>
  );
}

// Main Grid
export function MainGrid({ children, className, ...props }: Omit<GridProps, 'as'>) {
  return (
    <Grid as="main" className={className} {...props}>
      {children}
    </Grid>
  );
}

// Aside Grid
export function AsideGrid({ children, className, ...props }: Omit<GridProps, 'as'>) {
  return (
    <Grid as="aside" className={className} {...props}>
      {children}
    </Grid>
  );
}

// Header Grid
export function HeaderGrid({ children, className, ...props }: Omit<GridProps, 'as'>) {
  return (
    <Grid as="header" className={className} {...props}>
      {children}
    </Grid>
  );
}

// Footer Grid
export function FooterGrid({ children, className, ...props }: Omit<GridProps, 'as'>) {
  return (
    <Grid as="footer" className={className} {...props}>
      {children}
    </Grid>
  );
}

// Nav Grid
export function NavGrid({ children, className, ...props }: Omit<GridProps, 'as'>) {
  return (
    <Grid as="nav" className={className} {...props}>
      {children}
    </Grid>
  );
}
