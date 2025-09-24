'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Badge } from './Badge';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Share, 
  Heart, 
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize
} from 'lucide-react';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  caption?: string;
  tags?: string[];
  metadata?: {
    size?: string;
    dimensions?: string;
    format?: string;
    uploadedAt?: string;
    uploadedBy?: string;
  };
  thumbnail?: string;
  fullSize?: string;
  downloadUrl?: string;
  shareUrl?: string;
  isVideo?: boolean;
  videoUrl?: string;
  duration?: string;
  isLiked?: boolean;
  likes?: number;
  views?: number;
  downloads?: number;
}

export interface GalleryProps {
  images: GalleryImage[];
  onImageClick?: (image: GalleryImage, index: number) => void;
  onImageSelect?: (image: GalleryImage, index: number) => void;
  onImageLike?: (image: GalleryImage, index: number) => void;
  onImageDownload?: (image: GalleryImage, index: number) => void;
  onImageShare?: (image: GalleryImage, index: number) => void;
  onImageDelete?: (image: GalleryImage, index: number) => void;
  selectedImages?: string[];
  layout?: 'grid' | 'masonry' | 'carousel' | 'list';
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  showThumbnails?: boolean;
  showLightbox?: boolean;
  showControls?: boolean;
  showMetadata?: boolean;
  showLikes?: boolean;
  showViews?: boolean;
  showDownloads?: boolean;
  showTags?: boolean;
  showCaptions?: boolean;
  showTitles?: boolean;
  showDescriptions?: boolean;
  allowSelection?: boolean;
  allowMultipleSelection?: boolean;
  allowLiking?: boolean;
  allowDownloading?: boolean;
  allowSharing?: boolean;
  allowDeleting?: boolean;
  allowFullscreen?: boolean;
  allowZoom?: boolean;
  allowRotation?: boolean;
  allowAutoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
  imageClassName?: string;
  thumbnailClassName?: string;
  lightboxClassName?: string;
  loading?: boolean;
  error?: string;
  emptyState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  responsive?: boolean;
  compact?: boolean;
  sticky?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const layoutClasses = {
  grid: 'grid',
  masonry: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4',
  carousel: 'flex overflow-x-auto',
  list: 'space-y-4',
};

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

const columnsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
};

export default function Gallery({
  images,
  onImageClick,
  onImageSelect,
  onImageLike,
  onImageDownload,
  onImageShare,
  onImageDelete,
  selectedImages = [],
  layout = 'grid',
  columns = 4,
  gap = 'md',
  showThumbnails = true,
  showLightbox = true,
  showControls = true,
  showMetadata = false,
  showLikes = false,
  showViews = false,
  showDownloads = false,
  showTags = false,
  showCaptions = false,
  showTitles = false,
  showDescriptions = false,
  allowSelection = false,
  allowMultipleSelection = false,
  allowLiking = false,
  allowDownloading = false,
  allowSharing = false,
  allowDeleting = false,
  allowFullscreen = true,
  allowZoom = true,
  allowRotation = false,
  allowAutoplay = false,
  autoplayInterval = 3000,
  className,
  imageClassName,
  thumbnailClassName,
  lightboxClassName,
  loading = false,
  error,
  emptyState,
  responsive = true,
  compact = false,
  sticky = false,
  searchable = false,
  filterable = false,
  sortable = false,
  pagination,
}: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout>();

  const currentImage = images[currentImageIndex];

  useEffect(() => {
    if (allowAutoplay && isPlaying && currentImage?.isVideo) {
      autoplayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, autoplayInterval);
    } else {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [allowAutoplay, isPlaying, currentImage?.isVideo, autoplayInterval, images.length]);

  const handleImageClick = (image: GalleryImage, index: number) => {
    if (showLightbox) {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
      setZoom(1);
      setRotation(0);
    }
    onImageClick?.(image, index);
  };

  const handleImageSelect = (image: GalleryImage, index: number) => {
    if (allowSelection) {
      onImageSelect?.(image, index);
    }
  };

  const handleImageLike = (image: GalleryImage, index: number) => {
    if (allowLiking) {
      onImageLike?.(image, index);
    }
  };

  const handleImageDownload = (image: GalleryImage, index: number) => {
    if (allowDownloading) {
      onImageDownload?.(image, index);
    }
  };

  const handleImageShare = (image: GalleryImage, index: number) => {
    if (allowSharing) {
      onImageShare?.(image, index);
    }
  };

  const handleImageDelete = (image: GalleryImage, index: number) => {
    if (allowDeleting) {
      onImageDelete?.(image, index);
    }
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!lightboxOpen) return;

    switch (e.key) {
      case 'Escape':
        setLightboxOpen(false);
        break;
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case 'r':
        handleRotate();
        break;
      case ' ':
        e.preventDefault();
        handleTogglePlay();
        break;
      case 'f':
        handleToggleFullscreen();
        break;
    }
  };

  const renderImage = (image: GalleryImage, index: number) => {
    const isSelected = selectedImages.includes(image.id);
    const isLiked = image.isLiked || false;
    const likes = image.likes || 0;
    const views = image.views || 0;
    const downloads = image.downloads || 0;

    return (
      <div
        key={image.id}
        className={cn(
          'relative group cursor-pointer',
          layout === 'carousel' && 'flex-shrink-0',
          layout === 'list' && 'flex items-center space-x-4',
          imageClassName
        )}
        onClick={() => handleImageClick(image, index)}
      >
        <div className={cn(
          'relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800',
          layout === 'list' ? 'w-24 h-24' : 'aspect-square',
          isSelected && 'ring-2 ring-blue-500 ring-offset-2',
          compact && 'rounded-md'
        )}>
          {image.isVideo ? (
            <video
              src={image.videoUrl || image.src}
              poster={image.thumbnail || image.src}
              className="w-full h-full object-cover"
              muted={isMuted}
              controls={showControls}
              loop
            />
          ) : (
            <img
              src={image.thumbnail || image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          )}

          {allowSelection && (
            <div className="absolute top-2 left-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleImageSelect(image, index)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          )}

          {image.tags && showTags && (
            <div className="absolute top-2 right-2 flex flex-wrap gap-1">
              {image.tags.slice(0, 2).map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
              {allowLiking && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageLike(image, index);
                  }}
                  className="text-white hover:text-red-500"
                >
                  <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
                  {showLikes && likes > 0 && <span className="ml-1">{likes}</span>}
                </Button>
              )}

              {allowDownloading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageDownload(image, index);
                  }}
                  className="text-white hover:text-blue-500"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              {allowSharing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageShare(image, index);
                  }}
                  className="text-white hover:text-green-500"
                >
                  <Share className="h-4 w-4" />
                </Button>
              )}

              {allowDeleting && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageDelete(image, index);
                  }}
                  className="text-white hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {image.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {image.duration}
            </div>
          )}
        </div>

        {(showTitles || showCaptions || showDescriptions) && (
          <div className="mt-2">
            {showTitles && image.title && (
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {image.title}
              </h3>
            )}
            {showCaptions && image.caption && (
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {image.caption}
              </p>
            )}
            {showDescriptions && image.description && (
              <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">
                {image.description}
              </p>
            )}
          </div>
        )}

        {showMetadata && image.metadata && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {image.metadata.size && <span>{image.metadata.size}</span>}
            {image.metadata.dimensions && <span className="ml-2">{image.metadata.dimensions}</span>}
            {image.metadata.format && <span className="ml-2">{image.metadata.format}</span>}
          </div>
        )}
      </div>
    );
  };

  const renderLightbox = () => {
    if (!lightboxOpen || !currentImage) return null;

    return (
      <div
        ref={lightboxRef}
        className={cn(
          'fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center',
          lightboxClassName
        )}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </Button>

          {showControls && (
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="text-white hover:text-gray-300"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="text-white hover:text-gray-300"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}

          <div className="relative max-w-full max-h-full">
            {currentImage.isVideo ? (
              <video
                src={currentImage.videoUrl || currentImage.src}
                poster={currentImage.thumbnail || currentImage.src}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay={isPlaying}
                muted={isMuted}
                loop
              />
            ) : (
              <img
                src={currentImage.fullSize || currentImage.src}
                alt={currentImage.alt}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease',
                }}
              />
            )}
          </div>

          {showControls && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-2">
              {allowZoom && !currentImage.isVideo && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    className="text-white hover:text-gray-300"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-white text-sm">{Math.round(zoom * 100)}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    className="text-white hover:text-gray-300"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </>
              )}

              {allowRotation && !currentImage.isVideo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotate}
                  className="text-white hover:text-gray-300"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              )}

              {currentImage.isVideo && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleTogglePlay}
                    className="text-white hover:text-gray-300"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleMute}
                    className="text-white hover:text-gray-300"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </>
              )}

              {allowFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleFullscreen}
                  className="text-white hover:text-gray-300"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              )}

              {allowDownloading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleImageDownload(currentImage, currentImageIndex)}
                  className="text-white hover:text-gray-300"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              {allowSharing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleImageShare(currentImage, currentImageIndex)}
                  className="text-white hover:text-gray-300"
                >
                  <Share className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          <div className="absolute bottom-4 right-4 z-10 text-white text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {emptyState?.title || 'No images found'}
          </p>
          {emptyState?.description && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {emptyState.description}
            </p>
          )}
          {emptyState?.action && (
            <Button
              variant="outline"
              onClick={emptyState.action.onClick}
              className="mt-4"
            >
              {emptyState.action.label}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          layoutClasses[layout],
          layout === 'grid' && columnsClasses[columns as keyof typeof columnsClasses],
          gapClasses[gap],
          layout === 'carousel' && 'scrollbar-hide'
        )}
      >
        {images.map(renderImage)}
      </div>

      {renderLightbox()}
    </div>
  );
}
