'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav';
  responsive?: {
    sm?: { direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'; wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'; justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'; align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch' };
    md?: { direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'; wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'; justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'; align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch' };
    lg?: { direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'; wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'; justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'; align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch' };
    xl?: { direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'; wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'; justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'; align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch' };
    '2xl'?: { direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'; wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'; justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'; align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch' };
  };
  grow?: boolean | number;
  shrink?: boolean | number;
  basis?: string | number;
  order?: number;
  self?: 'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch';
}

const directionClasses = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  col: 'flex-col',
  'col-reverse': 'flex-col-reverse',
};

const wrapClasses = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
};

const justifyClasses = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const alignClasses = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const selfClasses = {
  auto: 'self-auto',
  start: 'self-start',
  end: 'self-end',
  center: 'self-center',
  baseline: 'self-baseline',
  stretch: 'self-stretch',
};

export default function Flex({
  children,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'stretch',
  gap = 'md',
  className,
  as: Component = 'div',
  responsive,
  grow = false,
  shrink = true,
  basis,
  order,
  self = 'auto',
}: FlexProps) {
  const responsiveClasses = responsive ? Object.entries(responsive).map(([breakpoint, config]) => {
    const breakpointClass = breakpoint === '2xl' ? '2xl' : breakpoint;
    const classes = [];
    
    if (config.direction) {
      classes.push(`${breakpointClass}:${directionClasses[config.direction]}`);
    }
    if (config.wrap) {
      classes.push(`${breakpointClass}:${wrapClasses[config.wrap]}`);
    }
    if (config.justify) {
      classes.push(`${breakpointClass}:${justifyClasses[config.justify]}`);
    }
    if (config.align) {
      classes.push(`${breakpointClass}:${alignClasses[config.align]}`);
    }
    
    return classes.join(' ');
  }).join(' ') : '';

  const flexGrow = grow === true ? 'flex-grow' : grow === false ? 'flex-grow-0' : `flex-grow-${grow}`;
  const flexShrink = shrink === true ? 'flex-shrink' : shrink === false ? 'flex-shrink-0' : `flex-shrink-${shrink}`;
  const flexBasis = basis ? `flex-basis-${basis}` : '';
  const orderClass = order ? `order-${order}` : '';

  return (
    <Component
      className={cn(
        'flex',
        directionClasses[direction],
        wrapClasses[wrap],
        justifyClasses[justify],
        alignClasses[align],
        gapClasses[gap],
        flexGrow,
        flexShrink,
        flexBasis,
        orderClass,
        selfClasses[self],
        responsiveClasses,
        className
      )}
    >
      {children}
    </Component>
  );
}

// Flex Item Component
export interface FlexItemProps {
  children: React.ReactNode;
  grow?: boolean | number;
  shrink?: boolean | number;
  basis?: string | number;
  order?: number;
  self?: 'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav';
}

export function FlexItem({
  children,
  grow = false,
  shrink = true,
  basis,
  order,
  self = 'auto',
  className,
  as: Component = 'div',
}: FlexItemProps) {
  const flexGrow = grow === true ? 'flex-grow' : grow === false ? 'flex-grow-0' : `flex-grow-${grow}`;
  const flexShrink = shrink === true ? 'flex-shrink' : shrink === false ? 'flex-shrink-0' : `flex-shrink-${shrink}`;
  const flexBasis = basis ? `flex-basis-${basis}` : '';
  const orderClass = order ? `order-${order}` : '';

  return (
    <Component
      className={cn(
        flexGrow,
        flexShrink,
        flexBasis,
        orderClass,
        selfClasses[self],
        className
      )}
    >
      {children}
    </Component>
  );
}

// Preset Flex Components
export function FlexRow({ children, className, ...props }: Omit<FlexProps, 'direction'>) {
  return (
    <Flex direction="row" className={className} {...props}>
      {children}
    </Flex>
  );
}

export function FlexCol({ children, className, ...props }: Omit<FlexProps, 'direction'>) {
  return (
    <Flex direction="col" className={className} {...props}>
      {children}
    </Flex>
  );
}

export function FlexCenter({ children, className, ...props }: Omit<FlexProps, 'justify' | 'align'>) {
  return (
    <Flex justify="center" align="center" className={className} {...props}>
      {children}
    </Flex>
  );
}

export function FlexBetween({ children, className, ...props }: Omit<FlexProps, 'justify'>) {
  return (
    <Flex justify="between" className={className} {...props}>
      {children}
    </Flex>
  );
}

export function FlexAround({ children, className, ...props }: Omit<FlexProps, 'justify'>) {
  return (
    <Flex justify="around" className={className} {...props}>
      {children}
    </Flex>
  );
}

export function FlexEvenly({ children, className, ...props }: Omit<FlexProps, 'justify'>) {
  return (
    <Flex justify="evenly" className={className} {...props}>
      {children}
    </Flex>
  );
}

export function FlexWrap({ children, className, ...props }: Omit<FlexProps, 'wrap'>) {
  return (
    <Flex wrap="wrap" className={className} {...props}>
      {children}
    </Flex>
  );
}

export function FlexNowrap({ children, className, ...props }: Omit<FlexProps, 'wrap'>) {
  return (
    <Flex wrap="nowrap" className={className} {...props}>
      {children}
    </Flex>
  );
}

export function FlexWrapReverse({ children, className, ...props }: Omit<FlexProps, 'wrap'>) {
  return (
    <Flex wrap="wrap-reverse" className={className} {...props}>
      {children}
    </Flex>
  );
}

// Responsive Flex
export function ResponsiveFlex({ children, className, ...props }: Omit<FlexProps, 'responsive'>) {
  return (
    <Flex
      responsive={{
        sm: { direction: 'col', justify: 'start', align: 'start' },
        md: { direction: 'row', justify: 'between', align: 'center' },
        lg: { direction: 'row', justify: 'between', align: 'center' },
      }}
      className={className}
      {...props}
    >
      {children}
    </Flex>
  );
}

// Section Flex
export function SectionFlex({ children, className, ...props }: Omit<FlexProps, 'as'>) {
  return (
    <Flex as="section" className={className} {...props}>
      {children}
    </Flex>
  );
}

// Article Flex
export function ArticleFlex({ children, className, ...props }: Omit<FlexProps, 'as'>) {
  return (
    <Flex as="article" className={className} {...props}>
      {children}
    </Flex>
  );
}

// Main Flex
export function MainFlex({ children, className, ...props }: Omit<FlexProps, 'as'>) {
  return (
    <Flex as="main" className={className} {...props}>
      {children}
    </Flex>
  );
}

// Aside Flex
export function AsideFlex({ children, className, ...props }: Omit<FlexProps, 'as'>) {
  return (
    <Flex as="aside" className={className} {...props}>
      {children}
    </Flex>
  );
}

// Header Flex
export function HeaderFlex({ children, className, ...props }: Omit<FlexProps, 'as'>) {
  return (
    <Flex as="header" className={className} {...props}>
      {children}
    </Flex>
  );
}

// Footer Flex
export function FooterFlex({ children, className, ...props }: Omit<FlexProps, 'as'>) {
  return (
    <Flex as="footer" className={className} {...props}>
      {children}
    </Flex>
  );
}

// Nav Flex
export function NavFlex({ children, className, ...props }: Omit<FlexProps, 'as'>) {
  return (
    <Flex as="nav" className={className} {...props}>
      {children}
    </Flex>
  );
}
