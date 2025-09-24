'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ImageIcon, AlertCircle, Loader2 } from 'lucide-react';

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  fetchPriority?: 'high' | 'low' | 'auto';
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLImageElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLImageElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLImageElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLImageElement>) => void;
  // Custom props
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'wide' | 'tall' | 'auto';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'outline';
  border?: 'none' | 'thin' | 'medium' | 'thick';
  borderColor?: 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'transparent' | 'current';
  hover?: 'none' | 'scale' | 'zoom' | 'brightness' | 'saturate' | 'grayscale' | 'blur';
  transition?: 'none' | 'fast' | 'normal' | 'slow';
  loadingState?: 'skeleton' | 'spinner' | 'none';
  errorState?: 'fallback' | 'placeholder' | 'none';
  caption?: string;
  showCaption?: boolean;
  captionPosition?: 'bottom' | 'top' | 'left' | 'right';
  overlay?: React.ReactNode;
  overlayPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  overlayOpacity?: 'light' | 'medium' | 'dark';
  lazy?: boolean;
  threshold?: number;
  rootMargin?: string;
  intersectionOptions?: IntersectionObserverInit;
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
  tall: 'aspect-[3/5]',
  auto: '',
};

const objectFitClasses = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

const objectPositionClasses = {
  center: 'object-center',
  top: 'object-top',
  bottom: 'object-bottom',
  left: 'object-left',
  right: 'object-right',
  'top-left': 'object-top-left',
  'top-right': 'object-top-right',
  'bottom-left': 'object-bottom-left',
  'bottom-right': 'object-bottom-right',
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
};

const transitionClasses = {
  none: '',
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-300',
  slow: 'transition-all duration-500',
};

const overlayOpacityClasses = {
  light: 'bg-black/20',
  medium: 'bg-black/40',
  dark: 'bg-black/60',
};

const captionPositionClasses = {
  bottom: 'mt-2',
  top: 'mb-2',
  left: 'mr-2',
  right: 'ml-2',
};

export default function ImageComponent({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  className,
  style,
  fallback,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  onLoad,
  onError,
  onLoadingComplete,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  aspectRatio = 'auto',
  objectFit = 'cover',
  objectPosition = 'center',
  rounded = 'none',
  shadow = 'none',
  border = 'none',
  borderColor = 'gray',
  hover = 'none',
  transition = 'normal',
  loadingState = 'skeleton',
  errorState = 'fallback',
  caption,
  showCaption = false,
  captionPosition = 'bottom',
  overlay,
  overlayPosition = 'center',
  overlayOpacity = 'medium',
  lazy = true,
  threshold = 0.1,
  rootMargin = '50px',
  intersectionOptions,
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const options = {
      threshold,
      rootMargin,
      ...intersectionOptions,
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setIsIntersecting(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      options
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, threshold, rootMargin, intersectionOptions]);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(event);
  };

  const handleLoadingComplete = (result: { naturalWidth: number; naturalHeight: number }) => {
    setIsLoading(false);
    onLoadingComplete?.(result);
  };

  const renderLoadingState = () => {
    if (loadingState === 'none') return null;

    if (loadingState === 'spinner') {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      );
    }

    if (loadingState === 'skeleton') {
      return (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      );
    }

    return null;
  };

  const renderErrorState = () => {
    if (errorState === 'none') return null;

    if (errorState === 'fallback' && fallback) {
      return <div className="absolute inset-0 flex items-center justify-center">{fallback}</div>;
    }

    if (errorState === 'placeholder') {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Image not available</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderOverlay = () => {
    if (!overlay) return null;

    const overlayClasses = cn(
      'absolute inset-0 flex items-center justify-center',
      overlayOpacityClasses[overlayOpacity],
      overlayPosition === 'top' && 'items-start',
      overlayPosition === 'bottom' && 'items-end',
      overlayPosition === 'left' && 'justify-start',
      overlayPosition === 'right' && 'justify-end',
      overlayPosition === 'center' && 'items-center justify-center'
    );

    return <div className={overlayClasses}>{overlay}</div>;
  };

  const renderCaption = () => {
    if (!showCaption || !caption) return null;

    return (
      <p className={cn(
        'text-sm text-gray-600 dark:text-gray-400 text-center',
        captionPositionClasses[captionPosition]
      )}>
        {caption}
      </p>
    );
  };

  const imageClasses = cn(
    'relative overflow-hidden',
    aspectRatioClasses[aspectRatio],
    objectFitClasses[objectFit],
    objectPositionClasses[objectPosition],
    roundedClasses[rounded],
    shadowClasses[shadow],
    borderClasses[border],
    borderColorClasses[borderColor],
    hoverClasses[hover],
    transitionClasses[transition],
    className
  );

  if (hasError && errorState !== 'none') {
    return (
      <div ref={imgRef} className={imageClasses} style={style}>
        {renderErrorState()}
        {renderOverlay()}
        {renderCaption()}
      </div>
    );
  }

  return (
    <div ref={imgRef} className={imageClasses} style={style}>
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          sizes={sizes}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
          onLoad={handleLoad}
          onError={handleError}
          onLoadingComplete={handleLoadingComplete}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full h-full"
        />
      )}
      {isLoading && renderLoadingState()}
      {hasError && renderErrorState()}
      {renderOverlay()}
      {renderCaption()}
    </div>
  );
}

// Preset Image Components
export function ImageSquare({ children, className, ...props }: Omit<ImageProps, 'aspectRatio'>) {
  return (
    <ImageComponent aspectRatio="square" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageVideo({ children, className, ...props }: Omit<ImageProps, 'aspectRatio'>) {
  return (
    <ImageComponent aspectRatio="video" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImagePortrait({ children, className, ...props }: Omit<ImageProps, 'aspectRatio'>) {
  return (
    <ImageComponent aspectRatio="portrait" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageLandscape({ children, className, ...props }: Omit<ImageProps, 'aspectRatio'>) {
  return (
    <ImageComponent aspectRatio="landscape" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageWide({ children, className, ...props }: Omit<ImageProps, 'aspectRatio'>) {
  return (
    <ImageComponent aspectRatio="wide" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageTall({ children, className, ...props }: Omit<ImageProps, 'aspectRatio'>) {
  return (
    <ImageComponent aspectRatio="tall" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

// Object Fit Variants
export function ImageContain({ children, className, ...props }: Omit<ImageProps, 'objectFit'>) {
  return (
    <ImageComponent objectFit="contain" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageCover({ children, className, ...props }: Omit<ImageProps, 'objectFit'>) {
  return (
    <ImageComponent objectFit="cover" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageFill({ children, className, ...props }: Omit<ImageProps, 'objectFit'>) {
  return (
    <ImageComponent objectFit="fill" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageNone({ children, className, ...props }: Omit<ImageProps, 'objectFit'>) {
  return (
    <ImageComponent objectFit="none" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageScaleDown({ children, className, ...props }: Omit<ImageProps, 'objectFit'>) {
  return (
    <ImageComponent objectFit="scale-down" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

// Rounded Variants
export function ImageRounded({ children, className, ...props }: Omit<ImageProps, 'rounded'>) {
  return (
    <ImageComponent rounded="md" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageRoundedLg({ children, className, ...props }: Omit<ImageProps, 'rounded'>) {
  return (
    <ImageComponent rounded="lg" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageRoundedXl({ children, className, ...props }: Omit<ImageProps, 'rounded'>) {
  return (
    <ImageComponent rounded="xl" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageRounded2xl({ children, className, ...props }: Omit<ImageProps, 'rounded'>) {
  return (
    <ImageComponent rounded="2xl" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageRounded3xl({ children, className, ...props }: Omit<ImageProps, 'rounded'>) {
  return (
    <ImageComponent rounded="3xl" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageRoundedFull({ children, className, ...props }: Omit<ImageProps, 'rounded'>) {
  return (
    <ImageComponent rounded="full" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

// Shadow Variants
export function ImageShadow({ children, className, ...props }: Omit<ImageProps, 'shadow'>) {
  return (
    <ImageComponent shadow="md" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageShadowLg({ children, className, ...props }: Omit<ImageProps, 'shadow'>) {
  return (
    <ImageComponent shadow="lg" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageShadowXl({ children, className, ...props }: Omit<ImageProps, 'shadow'>) {
  return (
    <ImageComponent shadow="xl" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageShadow2xl({ children, className, ...props }: Omit<ImageProps, 'shadow'>) {
  return (
    <ImageComponent shadow="2xl" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

// Hover Variants
export function ImageHoverScale({ children, className, ...props }: Omit<ImageProps, 'hover'>) {
  return (
    <ImageComponent hover="scale" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageHoverZoom({ children, className, ...props }: Omit<ImageProps, 'hover'>) {
  return (
    <ImageComponent hover="zoom" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageHoverBrightness({ children, className, ...props }: Omit<ImageProps, 'hover'>) {
  return (
    <ImageComponent hover="brightness" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageHoverSaturate({ children, className, ...props }: Omit<ImageProps, 'hover'>) {
  return (
    <ImageComponent hover="saturate" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageHoverGrayscale({ children, className, ...props }: Omit<ImageProps, 'hover'>) {
  return (
    <ImageComponent hover="grayscale" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageHoverBlur({ children, className, ...props }: Omit<ImageProps, 'hover'>) {
  return (
    <ImageComponent hover="blur" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

// Transition Variants
export function ImageTransitionFast({ children, className, ...props }: Omit<ImageProps, 'transition'>) {
  return (
    <ImageComponent transition="fast" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageTransitionNormal({ children, className, ...props }: Omit<ImageProps, 'transition'>) {
  return (
    <ImageComponent transition="normal" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageTransitionSlow({ children, className, ...props }: Omit<ImageProps, 'transition'>) {
  return (
    <ImageComponent transition="slow" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

// Loading State Variants
export function ImageSkeleton({ children, className, ...props }: Omit<ImageProps, 'loadingState'>) {
  return (
    <ImageComponent loadingState="skeleton" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageSpinner({ children, className, ...props }: Omit<ImageProps, 'loadingState'>) {
  return (
    <ImageComponent loadingState="spinner" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageNoLoading({ children, className, ...props }: Omit<ImageProps, 'loadingState'>) {
  return (
    <ImageComponent loadingState="none" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

// Error State Variants
export function ImageFallback({ children, className, ...props }: Omit<ImageProps, 'errorState'>) {
  return (
    <ImageComponent errorState="fallback" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImagePlaceholder({ children, className, ...props }: Omit<ImageProps, 'errorState'>) {
  return (
    <ImageComponent errorState="placeholder" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageNoError({ children, className, ...props }: Omit<ImageProps, 'errorState'>) {
  return (
    <ImageComponent errorState="none" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

// Lazy Loading Variants
export function ImageLazy({ children, className, ...props }: Omit<ImageProps, 'lazy'>) {
  return (
    <ImageComponent lazy={true} className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageEager({ children, className, ...props }: Omit<ImageProps, 'lazy'>) {
  return (
    <ImageComponent lazy={false} className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

// Caption Variants
export function ImageWithCaption({ children, className, ...props }: Omit<ImageProps, 'showCaption'>) {
  return (
    <ImageComponent showCaption={true} className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageCaptionBottom({ children, className, ...props }: Omit<ImageProps, 'showCaption' | 'captionPosition'>) {
  return (
    <ImageComponent showCaption={true} captionPosition="bottom" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageCaptionTop({ children, className, ...props }: Omit<ImageProps, 'showCaption' | 'captionPosition'>) {
  return (
    <ImageComponent showCaption={true} captionPosition="top" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageCaptionLeft({ children, className, ...props }: Omit<ImageProps, 'showCaption' | 'captionPosition'>) {
  return (
    <ImageComponent showCaption={true} captionPosition="left" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageCaptionRight({ children, className, ...props }: Omit<ImageProps, 'showCaption' | 'captionPosition'>) {
  return (
    <ImageComponent showCaption={true} captionPosition="right" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

// Overlay Variants
export function ImageWithOverlay({ children, className, ...props }: Omit<ImageProps, 'overlay'>) {
  return (
    <ImageComponent overlay={children} className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageOverlayTop({ children, className, ...props }: Omit<ImageProps, 'overlay' | 'overlayPosition'>) {
  return (
    <ImageComponent overlay={children} overlayPosition="top" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageOverlayBottom({ children, className, ...props }: Omit<ImageProps, 'overlay' | 'overlayPosition'>) {
  return (
    <ImageComponent overlay={children} overlayPosition="bottom" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageOverlayLeft({ children, className, ...props }: Omit<ImageProps, 'overlay' | 'overlayPosition'>) {
  return (
    <ImageComponent overlay={children} overlayPosition="left" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageOverlayRight({ children, className, ...props }: Omit<ImageProps, 'overlay' | 'overlayPosition'>) {
  return (
    <ImageComponent overlay={children} overlayPosition="right" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageOverlayCenter({ children, className, ...props }: Omit<ImageProps, 'overlay' | 'overlayPosition'>) {
  return (
    <ImageComponent overlay={children} overlayPosition="center" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

// Overlay Opacity Variants
export function ImageOverlayLight({ children, className, ...props }: Omit<ImageProps, 'overlay' | 'overlayOpacity'>) {
  return (
    <ImageComponent overlay={children} overlayOpacity="light" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageOverlayMedium({ children, className, ...props }: Omit<ImageProps, 'overlay' | 'overlayOpacity'>) {
  return (
    <ImageComponent overlay={children} overlayOpacity="medium" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}

export function ImageOverlayDark({ children, className, ...props }: Omit<ImageProps, 'overlay' | 'overlayOpacity'>) {
  return (
    <ImageComponent overlay={children} overlayOpacity="dark" className={className} {...props}>
      {children}
    </ImageComponent>
  );
}
