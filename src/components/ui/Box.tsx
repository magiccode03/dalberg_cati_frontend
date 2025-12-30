'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BoxProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  width?: 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5' | '1/6' | '5/6' | '1/12' | '2/12' | '3/12' | '4/12' | '5/12' | '6/12' | '7/12' | '8/12' | '9/12' | '10/12' | '11/12' | '12/12';
  height?: 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5' | '1/6' | '5/6' | '1/12' | '2/12' | '3/12' | '4/12' | '5/12' | '6/12' | '7/12' | '8/12' | '9/12' | '10/12' | '11/12' | '12/12';
  maxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'min' | 'max' | 'fit' | 'prose' | 'screen-sm' | 'screen-md' | 'screen-lg' | 'screen-xl' | 'screen-2xl';
  maxHeight?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'min' | 'max' | 'fit' | 'screen' | 'screen-sm' | 'screen-md' | 'screen-lg' | 'screen-xl' | 'screen-2xl';
  minWidth?: '0' | 'full' | 'min' | 'max' | 'fit';
  minHeight?: '0' | 'full' | 'min' | 'max' | 'fit' | 'screen' | 'screen-sm' | 'screen-md' | 'screen-lg' | 'screen-xl' | 'screen-2xl';
  display?: 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'hidden';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24' | '32' | '40' | '48' | '56' | '64' | 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5' | '1/6' | '5/6' | '1/12' | '2/12' | '3/12' | '4/12' | '5/12' | '6/12' | '7/12' | '8/12' | '9/12' | '10/12' | '11/12' | '12/12';
  right?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24' | '32' | '40' | '48' | '56' | '64' | 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5' | '1/6' | '5/6' | '1/12' | '2/12' | '3/12' | '4/12' | '5/12' | '6/12' | '7/12' | '8/12' | '9/12' | '10/12' | '11/12' | '12/12';
  bottom?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24' | '32' | '40' | '48' | '56' | '64' | 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5' | '1/6' | '5/6' | '1/12' | '2/12' | '3/12' | '4/12' | '5/12' | '6/12' | '7/12' | '8/12' | '9/12' | '10/12' | '11/12' | '12/12';
  left?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24' | '32' | '40' | '48' | '56' | '64' | 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5' | '1/6' | '5/6' | '1/12' | '2/12' | '3/12' | '4/12' | '5/12' | '6/12' | '7/12' | '8/12' | '9/12' | '10/12' | '11/12' | '12/12';
  zIndex?: '0' | '10' | '20' | '30' | '40' | '50' | 'auto';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  border?: 'none' | 'thin' | 'medium' | 'thick';
  borderColor?: 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'transparent' | 'current';
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  backgroundColor?: 'transparent' | 'white' | 'black' | 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'current';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'outline';
  opacity?: '0' | '25' | '50' | '75' | '100';
  cursor?: 'auto' | 'default' | 'pointer' | 'wait' | 'text' | 'move' | 'help' | 'not-allowed' | 'grab' | 'grabbing';
  userSelect?: 'none' | 'text' | 'all' | 'auto';
  pointerEvents?: 'auto' | 'none';
  visibility?: 'visible' | 'hidden' | 'collapse';
  style?: React.CSSProperties;
}

const paddingClasses = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-12',
  '3xl': 'p-16',
};

const marginClasses = {
  none: 'm-0',
  sm: 'm-2',
  md: 'm-4',
  lg: 'm-6',
  xl: 'm-8',
  '2xl': 'm-12',
  '3xl': 'm-16',
};

const widthClasses = {
  auto: 'w-auto',
  full: 'w-full',
  screen: 'w-screen',
  min: 'w-min',
  max: 'w-max',
  fit: 'w-fit',
  '1/2': 'w-1/2',
  '1/3': 'w-1/3',
  '2/3': 'w-2/3',
  '1/4': 'w-1/4',
  '3/4': 'w-3/4',
  '1/5': 'w-1/5',
  '2/5': 'w-2/5',
  '3/5': 'w-3/5',
  '4/5': 'w-4/5',
  '1/6': 'w-1/6',
  '5/6': 'w-5/6',
  '1/12': 'w-1/12',
  '2/12': 'w-2/12',
  '3/12': 'w-3/12',
  '4/12': 'w-4/12',
  '5/12': 'w-5/12',
  '6/12': 'w-6/12',
  '7/12': 'w-7/12',
  '8/12': 'w-8/12',
  '9/12': 'w-9/12',
  '10/12': 'w-10/12',
  '11/12': 'w-11/12',
  '12/12': 'w-full',
};

const heightClasses = {
  auto: 'h-auto',
  full: 'h-full',
  screen: 'h-screen',
  min: 'h-min',
  max: 'h-max',
  fit: 'h-fit',
  '1/2': 'h-1/2',
  '1/3': 'h-1/3',
  '2/3': 'h-2/3',
  '1/4': 'h-1/4',
  '3/4': 'h-3/4',
  '1/5': 'h-1/5',
  '2/5': 'h-2/5',
  '3/5': 'h-3/5',
  '4/5': 'h-4/5',
  '1/6': 'h-1/6',
  '5/6': 'h-5/6',
  '1/12': 'h-1/12',
  '2/12': 'h-2/12',
  '3/12': 'h-3/12',
  '4/12': 'h-4/12',
  '5/12': 'h-5/12',
  '6/12': 'h-6/12',
  '7/12': 'h-7/12',
  '8/12': 'h-8/12',
  '9/12': 'h-9/12',
  '10/12': 'h-10/12',
  '11/12': 'h-11/12',
  '12/12': 'h-full',
};

const maxWidthClasses = {
  none: 'max-w-none',
  xs: 'max-w-xs',
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
  min: 'max-w-min',
  max: 'max-w-max',
  fit: 'max-w-fit',
  prose: 'max-w-prose',
  'screen-sm': 'max-w-screen-sm',
  'screen-md': 'max-w-screen-md',
  'screen-lg': 'max-w-screen-lg',
  'screen-xl': 'max-w-screen-xl',
  'screen-2xl': 'max-w-screen-2xl',
};

const maxHeightClasses = {
  none: 'max-h-none',
  xs: 'max-h-xs',
  sm: 'max-h-sm',
  md: 'max-h-md',
  lg: 'max-h-lg',
  xl: 'max-h-xl',
  '2xl': 'max-h-2xl',
  '3xl': 'max-h-3xl',
  '4xl': 'max-h-4xl',
  '5xl': 'max-h-5xl',
  '6xl': 'max-h-6xl',
  '7xl': 'max-h-7xl',
  full: 'max-h-full',
  min: 'max-h-min',
  max: 'max-h-max',
  fit: 'max-h-fit',
  screen: 'max-h-screen',
  'screen-sm': 'max-h-screen-sm',
  'screen-md': 'max-h-screen-md',
  'screen-lg': 'max-h-screen-lg',
  'screen-xl': 'max-h-screen-xl',
  'screen-2xl': 'max-h-screen-2xl',
};

const minWidthClasses = {
  '0': 'min-w-0',
  full: 'min-w-full',
  min: 'min-w-min',
  max: 'min-w-max',
  fit: 'min-w-fit',
};

const minHeightClasses = {
  '0': 'min-h-0',
  full: 'min-h-full',
  min: 'min-h-min',
  max: 'min-h-max',
  fit: 'min-h-fit',
  screen: 'min-h-screen',
  'screen-sm': 'min-h-screen-sm',
  'screen-md': 'min-h-screen-md',
  'screen-lg': 'min-h-screen-lg',
  'screen-xl': 'min-h-screen-xl',
  'screen-2xl': 'min-h-screen-2xl',
};

const displayClasses = {
  block: 'block',
  'inline-block': 'inline-block',
  inline: 'inline',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  grid: 'grid',
  'inline-grid': 'inline-grid',
  hidden: 'hidden',
};

const positionClasses = {
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',
};

const topClasses = {
  '0': 'top-0',
  '1': 'top-1',
  '2': 'top-2',
  '3': 'top-3',
  '4': 'top-4',
  '5': 'top-5',
  '6': 'top-6',
  '8': 'top-8',
  '10': 'top-10',
  '12': 'top-12',
  '16': 'top-16',
  '20': 'top-20',
  '24': 'top-24',
  '32': 'top-32',
  '40': 'top-40',
  '48': 'top-48',
  '56': 'top-56',
  '64': 'top-64',
  auto: 'top-auto',
  full: 'top-full',
  '1/2': 'top-1/2',
  '1/3': 'top-1/3',
  '2/3': 'top-2/3',
  '1/4': 'top-1/4',
  '3/4': 'top-3/4',
  '1/5': 'top-1/5',
  '2/5': 'top-2/5',
  '3/5': 'top-3/5',
  '4/5': 'top-4/5',
  '1/6': 'top-1/6',
  '5/6': 'top-5/6',
  '1/12': 'top-1/12',
  '2/12': 'top-2/12',
  '3/12': 'top-3/12',
  '4/12': 'top-4/12',
  '5/12': 'top-5/12',
  '6/12': 'top-6/12',
  '7/12': 'top-7/12',
  '8/12': 'top-8/12',
  '9/12': 'top-9/12',
  '10/12': 'top-10/12',
  '11/12': 'top-11/12',
  '12/12': 'top-full',
};

const rightClasses = {
  '0': 'right-0',
  '1': 'right-1',
  '2': 'right-2',
  '3': 'right-3',
  '4': 'right-4',
  '5': 'right-5',
  '6': 'right-6',
  '8': 'right-8',
  '10': 'right-10',
  '12': 'right-12',
  '16': 'right-16',
  '20': 'right-20',
  '24': 'right-24',
  '32': 'right-32',
  '40': 'right-40',
  '48': 'right-48',
  '56': 'right-56',
  '64': 'right-64',
  auto: 'right-auto',
  full: 'right-full',
  '1/2': 'right-1/2',
  '1/3': 'right-1/3',
  '2/3': 'right-2/3',
  '1/4': 'right-1/4',
  '3/4': 'right-3/4',
  '1/5': 'right-1/5',
  '2/5': 'right-2/5',
  '3/5': 'right-3/5',
  '4/5': 'right-4/5',
  '1/6': 'right-1/6',
  '5/6': 'right-5/6',
  '1/12': 'right-1/12',
  '2/12': 'right-2/12',
  '3/12': 'right-3/12',
  '4/12': 'right-4/12',
  '5/12': 'right-5/12',
  '6/12': 'right-6/12',
  '7/12': 'right-7/12',
  '8/12': 'right-8/12',
  '9/12': 'right-9/12',
  '10/12': 'right-10/12',
  '11/12': 'right-11/12',
  '12/12': 'right-full',
};

const bottomClasses = {
  '0': 'bottom-0',
  '1': 'bottom-1',
  '2': 'bottom-2',
  '3': 'bottom-3',
  '4': 'bottom-4',
  '5': 'bottom-5',
  '6': 'bottom-6',
  '8': 'bottom-8',
  '10': 'bottom-10',
  '12': 'bottom-12',
  '16': 'bottom-16',
  '20': 'bottom-20',
  '24': 'bottom-24',
  '32': 'bottom-32',
  '40': 'bottom-40',
  '48': 'bottom-48',
  '56': 'bottom-56',
  '64': 'bottom-64',
  auto: 'bottom-auto',
  full: 'bottom-full',
  '1/2': 'bottom-1/2',
  '1/3': 'bottom-1/3',
  '2/3': 'bottom-2/3',
  '1/4': 'bottom-1/4',
  '3/4': 'bottom-3/4',
  '1/5': 'bottom-1/5',
  '2/5': 'bottom-2/5',
  '3/5': 'bottom-3/5',
  '4/5': 'bottom-4/5',
  '1/6': 'bottom-1/6',
  '5/6': 'bottom-5/6',
  '1/12': 'bottom-1/12',
  '2/12': 'bottom-2/12',
  '3/12': 'bottom-3/12',
  '4/12': 'bottom-4/12',
  '5/12': 'bottom-5/12',
  '6/12': 'bottom-6/12',
  '7/12': 'bottom-7/12',
  '8/12': 'bottom-8/12',
  '9/12': 'bottom-9/12',
  '10/12': 'bottom-10/12',
  '11/12': 'bottom-11/12',
  '12/12': 'bottom-full',
};

const leftClasses = {
  '0': 'left-0',
  '1': 'left-1',
  '2': 'left-2',
  '3': 'left-3',
  '4': 'left-4',
  '5': 'left-5',
  '6': 'left-6',
  '8': 'left-8',
  '10': 'left-10',
  '12': 'left-12',
  '16': 'left-16',
  '20': 'left-20',
  '24': 'left-24',
  '32': 'left-32',
  '40': 'left-40',
  '48': 'left-48',
  '56': 'left-56',
  '64': 'left-64',
  auto: 'left-auto',
  full: 'left-full',
  '1/2': 'left-1/2',
  '1/3': 'left-1/3',
  '2/3': 'left-2/3',
  '1/4': 'left-1/4',
  '3/4': 'left-3/4',
  '1/5': 'left-1/5',
  '2/5': 'left-2/5',
  '3/5': 'left-3/5',
  '4/5': 'left-4/5',
  '1/6': 'left-1/6',
  '5/6': 'left-5/6',
  '1/12': 'left-1/12',
  '2/12': 'left-2/12',
  '3/12': 'left-3/12',
  '4/12': 'left-4/12',
  '5/12': 'left-5/12',
  '6/12': 'left-6/12',
  '7/12': 'left-7/12',
  '8/12': 'left-8/12',
  '9/12': 'left-9/12',
  '10/12': 'left-10/12',
  '11/12': 'left-11/12',
  '12/12': 'left-full',
};

const zIndexClasses = {
  '0': 'z-0',
  '10': 'z-10',
  '20': 'z-20',
  '30': 'z-30',
  '40': 'z-40',
  '50': 'z-50',
  auto: 'z-auto',
};

const overflowClasses = {
  visible: 'overflow-visible',
  hidden: 'overflow-hidden',
  scroll: 'overflow-scroll',
  auto: 'overflow-auto',
};

const overflowXClasses = {
  visible: 'overflow-x-visible',
  hidden: 'overflow-x-hidden',
  scroll: 'overflow-x-scroll',
  auto: 'overflow-x-auto',
};

const overflowYClasses = {
  visible: 'overflow-y-visible',
  hidden: 'overflow-y-hidden',
  scroll: 'overflow-y-scroll',
  auto: 'overflow-y-auto',
};

const borderRadiusClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
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

const borderStyleClasses = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
  double: 'border-double',
  none: 'border-none',
};

const backgroundColorClasses = {
  transparent: 'bg-transparent',
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

const opacityClasses = {
  '0': 'opacity-0',
  '25': 'opacity-25',
  '50': 'opacity-50',
  '75': 'opacity-75',
  '100': 'opacity-100',
};

const cursorClasses = {
  auto: 'cursor-auto',
  default: 'cursor-default',
  pointer: 'cursor-pointer',
  wait: 'cursor-wait',
  text: 'cursor-text',
  move: 'cursor-move',
  help: 'cursor-help',
  'not-allowed': 'cursor-not-allowed',
  grab: 'cursor-grab',
  grabbing: 'cursor-grabbing',
};

const userSelectClasses = {
  none: 'select-none',
  text: 'select-text',
  all: 'select-all',
  auto: 'select-auto',
};

const pointerEventsClasses = {
  auto: 'pointer-events-auto',
  none: 'pointer-events-none',
};

const visibilityClasses = {
  visible: 'visible',
  hidden: 'invisible',
  collapse: 'collapse',
};

export default function Box({
  children,
  className,
  as: Component = 'div',
  padding,
  margin,
  width,
  height,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  display,
  position,
  top,
  right,
  bottom,
  left,
  zIndex,
  overflow,
  overflowX,
  overflowY,
  borderRadius,
  border,
  borderColor,
  borderStyle,
  backgroundColor,
  shadow,
  opacity,
  cursor,
  userSelect,
  pointerEvents,
  visibility,
  style,
}: BoxProps) {
  return (
    <Component
      className={cn(
        padding && paddingClasses[padding],
        margin && marginClasses[margin],
        width && widthClasses[width],
        height && heightClasses[height],
        maxWidth && maxWidthClasses[maxWidth],
        maxHeight && maxHeightClasses[maxHeight],
        minWidth && minWidthClasses[minWidth],
        minHeight && minHeightClasses[minHeight],
        display && displayClasses[display],
        position && positionClasses[position],
        top && topClasses[top],
        right && rightClasses[right],
        bottom && bottomClasses[bottom],
        left && leftClasses[left],
        zIndex && zIndexClasses[zIndex],
        overflow && overflowClasses[overflow],
        overflowX && overflowXClasses[overflowX],
        overflowY && overflowYClasses[overflowY],
        borderRadius && borderRadiusClasses[borderRadius],
        border && borderClasses[border],
        borderColor && borderColorClasses[borderColor],
        borderStyle && borderStyleClasses[borderStyle],
        backgroundColor && backgroundColorClasses[backgroundColor],
        shadow && shadowClasses[shadow],
        opacity && opacityClasses[opacity],
        cursor && cursorClasses[cursor],
        userSelect && userSelectClasses[userSelect],
        pointerEvents && pointerEventsClasses[pointerEvents],
        visibility && visibilityClasses[visibility],
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
}

// Preset Box Components
export function BoxSm({ children, className, ...props }: Omit<BoxProps, 'padding'>) {
  return (
    <Box padding="sm" className={className} {...props}>
      {children}
    </Box>
  );
}

export function BoxMd({ children, className, ...props }: Omit<BoxProps, 'padding'>) {
  return (
    <Box padding="md" className={className} {...props}>
      {children}
    </Box>
  );
}

export function BoxLg({ children, className, ...props }: Omit<BoxProps, 'padding'>) {
  return (
    <Box padding="lg" className={className} {...props}>
      {children}
    </Box>
  );
}

export function BoxXl({ children, className, ...props }: Omit<BoxProps, 'padding'>) {
  return (
    <Box padding="xl" className={className} {...props}>
      {children}
    </Box>
  );
}

export function BoxFull({ children, className, ...props }: Omit<BoxProps, 'width' | 'height'>) {
  return (
    <Box width="full" height="full" className={className} {...props}>
      {children}
    </Box>
  );
}

export function BoxScreen({ children, className, ...props }: Omit<BoxProps, 'width' | 'height'>) {
  return (
    <Box width="screen" height="screen" className={className} {...props}>
      {children}
    </Box>
  );
}

export function BoxCenter({ children, className, ...props }: Omit<BoxProps, 'display' | 'justify' | 'align'>) {
  return (
    <Box display="flex" className={cn('justify-center items-center', className)} {...props}>
      {children}
    </Box>
  );
}

export function BoxCard({ children, className, ...props }: Omit<BoxProps, 'backgroundColor' | 'borderRadius' | 'shadow' | 'padding'>) {
  return (
    <Box
      backgroundColor="white"
      borderRadius="lg"
      shadow="md"
      padding="md"
      className={className}
      {...props}
    >
      {children}
    </Box>
  );
}

export function BoxModal({ children, className, ...props }: Omit<BoxProps, 'backgroundColor' | 'borderRadius' | 'shadow' | 'padding' | 'position' | 'zIndex'>) {
  return (
    <Box
      backgroundColor="white"
      borderRadius="lg"
      shadow="2xl"
      padding="lg"
      position="fixed"
      zIndex="50"
      className={className}
      {...props}
    >
      {children}
    </Box>
  );
}

export function BoxOverlay({ children, className, ...props }: Omit<BoxProps, 'backgroundColor' | 'position' | 'zIndex' | 'width' | 'height'>) {
  return (
    <Box
      backgroundColor="black"
      position="fixed"
      zIndex="40"
      width="screen"
      height="screen"
      className={cn('opacity-50', className)}
      {...props}
    >
      {children}
    </Box>
  );
}

// Section Box
export function SectionBox({ children, className, ...props }: Omit<BoxProps, 'as'>) {
  return (
    <Box as="section" className={className} {...props}>
      {children}
    </Box>
  );
}

// Article Box
export function ArticleBox({ children, className, ...props }: Omit<BoxProps, 'as'>) {
  return (
    <Box as="article" className={className} {...props}>
      {children}
    </Box>
  );
}

// Main Box
export function MainBox({ children, className, ...props }: Omit<BoxProps, 'as'>) {
  return (
    <Box as="main" className={className} {...props}>
      {children}
    </Box>
  );
}

// Aside Box
export function AsideBox({ children, className, ...props }: Omit<BoxProps, 'as'>) {
  return (
    <Box as="aside" className={className} {...props}>
      {children}
    </Box>
  );
}

// Header Box
export function HeaderBox({ children, className, ...props }: Omit<BoxProps, 'as'>) {
  return (
    <Box as="header" className={className} {...props}>
      {children}
    </Box>
  );
}

// Footer Box
export function FooterBox({ children, className, ...props }: Omit<BoxProps, 'as'>) {
  return (
    <Box as="footer" className={className} {...props}>
      {children}
    </Box>
  );
}

// Nav Box
export function NavBox({ children, className, ...props }: Omit<BoxProps, 'as'>) {
  return (
    <Box as="nav" className={className} {...props}>
      {children}
    </Box>
  );
}
