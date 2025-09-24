'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Play, Pause, Circle, Square } from 'lucide-react';
import Button from './Button';

export interface CarouselItem {
  id: string;
  content: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  alt?: string;
}

export interface CarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  showPlayPause?: boolean;
  showThumbnails?: boolean;
  infinite?: boolean;
  className?: string;
  itemClassName?: string;
  onItemChange?: (index: number, item: CarouselItem) => void;
  onItemClick?: (index: number, item: CarouselItem) => void;
  startIndex?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  showProgress?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  transition?: 'slide' | 'fade' | 'zoom';
}

const sizeConfig = {
  sm: {
    container: 'h-48',
    item: 'h-48',
    thumbnail: 'h-12 w-16',
  },
  md: {
    container: 'h-64',
    item: 'h-64',
    thumbnail: 'h-16 w-20',
  },
  lg: {
    container: 'h-96',
    item: 'h-96',
    thumbnail: 'h-20 w-24',
  },
};

export default function Carousel({
  items,
  autoplay = false,
  autoplayInterval = 3000,
  showIndicators = true,
  showArrows = true,
  showPlayPause = true,
  showThumbnails = false,
  infinite = true,
  className,
  itemClassName,
  onItemChange,
  onItemClick,
  startIndex = 0,
  pauseOnHover = true,
  showDots = true,
  showProgress = false,
  orientation = 'horizontal',
  size = 'md',
  transition = 'slide',
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const progressRef = useRef<NodeJS.Timeout>();

  const sizeConfig = sizeConfig[size];

  // Handle autoplay
  useEffect(() => {
    if (isPlaying && !isHovered && items.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = infinite ? (prev + 1) % items.length : Math.min(prev + 1, items.length - 1);
          onItemChange?.(nextIndex, items[nextIndex]);
          return nextIndex;
        });
      }, autoplayInterval);

      // Progress bar
      if (showProgress) {
        setProgress(0);
        progressRef.current = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              return 0;
            }
            return prev + (100 / (autoplayInterval / 100));
          });
        }, 100);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [isPlaying, isHovered, items.length, autoplayInterval, infinite, onItemChange, showProgress]);

  // Handle index change
  useEffect(() => {
    onItemChange?.(currentIndex, items[currentIndex]);
  }, [currentIndex, items, onItemChange]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
      setProgress(0);
    }
  };

  const goToPrevious = () => {
    if (infinite) {
      setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
    } else {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
    setProgress(0);
  };

  const goToNext = () => {
    if (infinite) {
      setCurrentIndex(prev => (prev + 1) % items.length);
    } else {
      setCurrentIndex(prev => Math.min(prev + 1, items.length - 1));
    }
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
    setProgress(0);
  };

  const handleItemClick = (item: CarouselItem) => {
    onItemClick?.(currentIndex, item);
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsHovered(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg', sizeConfig.container, className)}>
        <p className="text-gray-500 dark:text-gray-400">No items to display</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div
      className={cn('relative group', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Carousel */}
      <div className={cn('relative overflow-hidden rounded-lg', sizeConfig.container)}>
        {/* Items */}
        <div className="relative h-full">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'absolute inset-0 transition-all duration-500 ease-in-out',
                index === currentIndex ? 'opacity-100' : 'opacity-0',
                transition === 'fade' && 'opacity-100',
                transition === 'zoom' && 'scale-100',
                itemClassName
              )}
              style={{
                transform: transition === 'slide' 
                  ? `translateX(${(index - currentIndex) * 100}%)`
                  : transition === 'zoom'
                  ? `scale(${index === currentIndex ? 1 : 0.8})`
                  : 'none',
                opacity: transition === 'fade' 
                  ? (index === currentIndex ? 1 : 0)
                  : (index === currentIndex ? 1 : 0),
              }}
              onClick={() => handleItemClick(item)}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.alt || item.title || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        {(currentItem.title || currentItem.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            {currentItem.title && (
              <h3 className="text-white font-semibold text-lg mb-1">
                {currentItem.title}
              </h3>
            )}
            {currentItem.description && (
              <p className="text-white/90 text-sm">
                {currentItem.description}
              </p>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Navigation Arrows */}
        {showArrows && items.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              disabled={!infinite && currentIndex === 0}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              disabled={!infinite && currentIndex === items.length - 1}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Play/Pause Button */}
        {showPlayPause && (
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-lg"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                index === currentIndex
                  ? 'bg-blue-600 dark:bg-blue-400'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              )}
            />
          ))}
        </div>
      )}

      {/* Dots */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-200',
                index === currentIndex
                  ? 'bg-blue-600 dark:bg-blue-400'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              )}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && items.length > 1 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              className={cn(
                'flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200',
                index === currentIndex
                  ? 'border-blue-600 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.alt || item.title || ''}
                  className={cn('object-cover', sizeConfig.thumbnail)}
                />
              ) : (
                <div className={cn(
                  'bg-gray-100 dark:bg-gray-800 flex items-center justify-center',
                  sizeConfig.thumbnail
                )}>
                  <Square className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Image Carousel
export interface ImageCarouselProps extends Omit<CarouselProps, 'items'> {
  images: string[];
  titles?: string[];
  descriptions?: string[];
  alts?: string[];
}

export function ImageCarousel({
  images,
  titles = [],
  descriptions = [],
  alts = [],
  ...props
}: ImageCarouselProps) {
  const items: CarouselItem[] = images.map((image, index) => ({
    id: `image_${index}`,
    content: null,
    image,
    title: titles[index],
    description: descriptions[index],
    alt: alts[index],
  }));

  return <Carousel items={items} {...props} />;
}

// Content Carousel
export interface ContentCarouselProps extends Omit<CarouselProps, 'items'> {
  contents: React.ReactNode[];
  titles?: string[];
  descriptions?: string[];
}

export function ContentCarousel({
  contents,
  titles = [],
  descriptions = [],
  ...props
}: ContentCarouselProps) {
  const items: CarouselItem[] = contents.map((content, index) => ({
    id: `content_${index}`,
    content,
    title: titles[index],
    description: descriptions[index],
  }));

  return <Carousel items={items} {...props} />;
}

// Auto-playing Carousel
export function AutoCarousel({
  autoplay = true,
  autoplayInterval = 5000,
  ...props
}: CarouselProps) {
  return (
    <Carousel
      autoplay={autoplay}
      autoplayInterval={autoplayInterval}
      showPlayPause={true}
      showProgress={true}
      {...props}
    />
  );
}
