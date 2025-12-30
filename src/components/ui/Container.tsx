'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav';
  center?: boolean;
  fluid?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

export default function Container({
  children,
  maxWidth = '7xl',
  padding = 'md',
  className,
  as: Component = 'div',
  center = true,
  fluid = false,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'w-full',
        !fluid && maxWidthClasses[maxWidth],
        center && 'mx-auto',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </Component>
  );
}

// Preset Container Components
export function ContainerSm({ children, className, ...props }: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container maxWidth="sm" className={className} {...props}>
      {children}
    </Container>
  );
}

export function ContainerMd({ children, className, ...props }: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container maxWidth="md" className={className} {...props}>
      {children}
    </Container>
  );
}

export function ContainerLg({ children, className, ...props }: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container maxWidth="lg" className={className} {...props}>
      {children}
    </Container>
  );
}

export function ContainerXl({ children, className, ...props }: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container maxWidth="xl" className={className} {...props}>
      {children}
    </Container>
  );
}

export function Container2xl({ children, className, ...props }: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container maxWidth="2xl" className={className} {...props}>
      {children}
    </Container>
  );
}

export function Container3xl({ children, className, ...props }: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container maxWidth="3xl" className={className} {...props}>
      {children}
    </Container>
  );
}

export function Container4xl({ children, className, ...props }: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container maxWidth="4xl" className={className} {...props}>
      {children}
    </Container>
  );
}

export function Container5xl({ children, className, ...props }: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container maxWidth="5xl" className={className} {...props}>
      {children}
    </Container>
  );
}

export function Container6xl({ children, className, ...props }: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container maxWidth="6xl" className={className} {...props}>
      {children}
    </Container>
  );
}

export function Container7xl({ children, className, ...props }: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container maxWidth="7xl" className={className} {...props}>
      {children}
    </Container>
  );
}

export function ContainerFull({ children, className, ...props }: Omit<ContainerProps, 'maxWidth'>) {
  return (
    <Container maxWidth="full" className={className} {...props}>
      {children}
    </Container>
  );
}

// Fluid Container (no max-width)
export function FluidContainer({ children, className, ...props }: Omit<ContainerProps, 'maxWidth' | 'fluid'>) {
  return (
    <Container fluid={true} className={className} {...props}>
      {children}
    </Container>
  );
}

// Section Container
export function SectionContainer({ children, className, ...props }: Omit<ContainerProps, 'as'>) {
  return (
    <Container as="section" className={className} {...props}>
      {children}
    </Container>
  );
}

// Article Container
export function ArticleContainer({ children, className, ...props }: Omit<ContainerProps, 'as'>) {
  return (
    <Container as="article" className={className} {...props}>
      {children}
    </Container>
  );
}

// Main Container
export function MainContainer({ children, className, ...props }: Omit<ContainerProps, 'as'>) {
  return (
    <Container as="main" className={className} {...props}>
      {children}
    </Container>
  );
}

// Aside Container
export function AsideContainer({ children, className, ...props }: Omit<ContainerProps, 'as'>) {
  return (
    <Container as="aside" className={className} {...props}>
      {children}
    </Container>
  );
}

// Header Container
export function HeaderContainer({ children, className, ...props }: Omit<ContainerProps, 'as'>) {
  return (
    <Container as="header" className={className} {...props}>
      {children}
    </Container>
  );
}

// Footer Container
export function FooterContainer({ children, className, ...props }: Omit<ContainerProps, 'as'>) {
  return (
    <Container as="footer" className={className} {...props}>
      {children}
    </Container>
  );
}

// Nav Container
export function NavContainer({ children, className, ...props }: Omit<ContainerProps, 'as'>) {
  return (
    <Container as="nav" className={className} {...props}>
      {children}
    </Container>
  );
}
