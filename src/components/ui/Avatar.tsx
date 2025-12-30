'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Camera, Edit, Check, X } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  variant?: 'circle' | 'square' | 'rounded';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  border?: boolean;
  borderColor?: string;
  borderWidth?: number;
  shadow?: boolean;
  hover?: boolean;
  clickable?: boolean;
  editable?: boolean;
  loading?: boolean;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onEdit?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusColor?: string;
  statusSize?: 'sm' | 'md' | 'lg';
  group?: boolean;
  groupSize?: number;
  groupSpacing?: number;
  groupOverlap?: boolean;
  groupDirection?: '' | 'vertical';
  groupReverse?: boolean;
  groupLimit?: number;
  groupMore?: React.ReactNode;
  groupMoreText?: string;
  groupMoreCount?: number;
  groupMoreColor?: string;
  groupMoreSize?: 'sm' | 'md' | 'lg';
  groupMoreVariant?: 'circle' | 'square' | 'rounded';
  groupMoreBorder?: boolean;
  groupMoreShadow?: boolean;
  groupMoreHover?: boolean;
  groupMoreClickable?: boolean;
  groupMoreOnClick?: () => void;
  groupMoreClassName?: string;
  groupMoreStyle?: React.CSSProperties;
  responsive?: boolean;
  compact?: boolean;
  sticky?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  animation?: 'fade' | 'scale' | 'slide' | 'none';
  duration?: number;
  delay?: number;
  repeat?: boolean;
  repeatDelay?: number;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  onAnimationRepeat?: () => void;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-20 w-20 text-2xl',
  '3xl': 'h-24 w-24 text-3xl',
  '4xl': 'h-32 w-32 text-4xl',
  '5xl': 'h-40 w-40 text-5xl',
};

const variantClasses = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
};

const colorClasses = {
  default: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  primary: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
  secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  success: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
  warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
  error: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
  info: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
};

const statusClasses = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

const statusSizeClasses = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
};

const badgePositionClasses = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
};

const animationClasses = {
  fade: 'transition-opacity duration-200',
  scale: 'transition-transform duration-200',
  slide: 'transition-transform duration-200',
  none: '',
};

export default function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  variant = 'circle',
  color = 'default',
  border = false,
  borderColor = 'gray-200',
  borderWidth = 1,
  shadow = false,
  hover = false,
  clickable = false,
  editable = false,
  loading = false,
  error,
  className,
  style,
  onClick,
  onEdit,
  onLoad,
  onError,
  placeholder,
  icon,
  badge,
  badgePosition = 'bottom-right',
  status,
  statusColor,
  statusSize = 'md',
  group = false,
  groupSize = 3,
  groupSpacing = -4,
  groupOverlap = true,
  groupDirection = '',
  groupReverse = false,
  groupLimit = 3,
  groupMore,
  groupMoreText = '+{count}',
  groupMoreCount = 0,
  groupMoreColor = 'gray',
  groupMoreSize = 'md',
  groupMoreVariant = 'circle',
  groupMoreBorder = false,
  groupMoreShadow = false,
  groupMoreHover = false,
  groupMoreClickable = false,
  groupMoreOnClick,
  groupMoreClassName,
  groupMoreStyle,
  responsive = true,
  compact = false,
  sticky = false,
  theme = 'auto',
  animation = 'fade',
  duration = 200,
  delay = 0,
  repeat = false,
  repeatDelay = 0,
  onAnimationStart,
  onAnimationEnd,
  onAnimationRepeat,
}: AvatarProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
    onError?.();
  };

  const handleEdit = () => {
    if (editable) {
      setIsEditing(true);
      onEdit?.();
    }
  };

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderAvatar = () => {
    if (loading) {
      return (
        <div
          className={cn(
            'animate-pulse bg-gray-200 dark:bg-gray-700',
            sizeClasses[size],
            variantClasses[variant],
            className
          )}
        />
      );
    }

    if (error || imageError) {
      return (
        <div
          className={cn(
            'flex items-center justify-center',
            sizeClasses[size],
            variantClasses[variant],
            colorClasses[color],
            border && `border-${borderWidth} border-${borderColor}`,
            shadow && 'shadow-md',
            hover && 'hover:shadow-lg transition-shadow duration-200',
            clickable && 'cursor-pointer',
            compact && 'h-8 w-8 text-sm',
            responsive && 'h-8 w-8 sm:h-10 sm:w-10',
            sticky && 'sticky top-0',
            animationClasses[animation],
            className
          )}
          style={style}
          onClick={onClick}
        >
          <User className="h-4 w-4" />
        </div>
      );
    }

    if (src && imageLoaded) {
      return (
        <img
          src={src}
          alt={alt}
          className={cn(
            'object-cover',
            sizeClasses[size],
            variantClasses[variant],
            border && `border-${borderWidth} border-${borderColor}`,
            shadow && 'shadow-md',
            hover && 'hover:shadow-lg transition-shadow duration-200',
            clickable && 'cursor-pointer',
            compact && 'h-8 w-8',
            responsive && 'h-8 w-8 sm:h-10 sm:w-10',
            sticky && 'sticky top-0',
            animationClasses[animation],
            className
          )}
          style={style}
          onClick={onClick}
        />
      );
    }

    if (placeholder) {
      return (
        <div
          className={cn(
            'flex items-center justify-center',
            sizeClasses[size],
            variantClasses[variant],
            colorClasses[color],
            border && `border-${borderWidth} border-${borderColor}`,
            shadow && 'shadow-md',
            hover && 'hover:shadow-lg transition-shadow duration-200',
            clickable && 'cursor-pointer',
            compact && 'h-8 w-8 text-sm',
            responsive && 'h-8 w-8 sm:h-10 sm:w-10',
            sticky && 'sticky top-0',
            animationClasses[animation],
            className
          )}
          style={style}
          onClick={onClick}
        >
          {placeholder}
        </div>
      );
    }

    if (icon) {
      return (
        <div
          className={cn(
            'flex items-center justify-center',
            sizeClasses[size],
            variantClasses[variant],
            colorClasses[color],
            border && `border-${borderWidth} border-${borderColor}`,
            shadow && 'shadow-md',
            hover && 'hover:shadow-lg transition-shadow duration-200',
            clickable && 'cursor-pointer',
            compact && 'h-8 w-8 text-sm',
            responsive && 'h-8 w-8 sm:h-10 sm:w-10',
            sticky && 'sticky top-0',
            animationClasses[animation],
            className
          )}
          style={style}
          onClick={onClick}
        >
          {icon}
        </div>
      );
    }

    return (
      <div
        className={cn(
          'flex items-center justify-center',
          sizeClasses[size],
          variantClasses[variant],
          colorClasses[color],
          border && `border-${borderWidth} border-${borderColor}`,
          shadow && 'shadow-md',
          hover && 'hover:shadow-lg transition-shadow duration-200',
          clickable && 'cursor-pointer',
          compact && 'h-8 w-8 text-sm',
          responsive && 'h-8 w-8 sm:h-10 sm:w-10',
          sticky && 'sticky top-0',
          animationClasses[animation],
          className
        )}
        style={style}
        onClick={onClick}
      >
        {fallback ? getInitials(fallback) : <User className="h-4 w-4" />}
      </div>
    );
  };

  const renderStatus = () => {
    if (!status) return null;

    return (
      <div
        className={cn(
          'absolute rounded-full border-2 border-white dark:border-gray-800',
          statusClasses[status],
          statusSizeClasses[statusSize],
          badgePositionClasses[badgePosition]
        )}
        style={{
          backgroundColor: statusColor,
        }}
      />
    );
  };

  const renderBadge = () => {
    if (!badge) return null;

    return (
      <div
        className={cn(
          'absolute flex items-center justify-center',
          badgePositionClasses[badgePosition]
        )}
      >
        {badge}
      </div>
    );
  };

  const renderEditButton = () => {
    if (!editable || isEditing) return null;

    return (
      <button
        onClick={handleEdit}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-full"
      >
        <Camera className="h-4 w-4 text-white" />
      </button>
    );
  };

  const renderEditMode = () => {
    if (!isEditing) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEditComplete}
            className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={handleEditCancel}
            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  };

  if (group) {
    return (
      <div
        className={cn(
          'flex items-center',
          groupDirection === 'vertical' && 'flex-col',
          groupReverse && 'flex-row-reverse',
          groupOverlap && 'space-x-0',
          !groupOverlap && `space-x-${Math.abs(groupSpacing)}`,
          groupDirection === 'vertical' && groupOverlap && 'space-y-0',
          groupDirection === 'vertical' && !groupOverlap && `space-y-${Math.abs(groupSpacing)}`,
          className
        )}
        style={{
          marginLeft: groupDirection === '' && groupOverlap ? `${groupSpacing}px` : undefined,
          marginTop: groupDirection === 'vertical' && groupOverlap ? `${groupSpacing}px` : undefined,
        }}
      >
        {Array.from({ length: Math.min(groupSize, groupLimit) }, (_, index) => (
          <div
            key={index}
            className={cn(
              'relative',
              groupOverlap && 'z-10',
              groupOverlap && index > 0 && '-ml-2'
            )}
            style={{
              zIndex: groupOverlap ? groupSize - index : undefined,
            }}
          >
            <Avatar
              size={size}
              variant={variant}
              color={color}
              border={border}
              borderColor={borderColor}
              borderWidth={borderWidth}
              shadow={shadow}
              hover={hover}
              clickable={clickable}
              editable={editable}
              loading={loading}
              error={error}
              className={className}
              style={style}
              onClick={onClick}
              onEdit={onEdit}
              onLoad={onLoad}
              onError={onError}
              placeholder={placeholder}
              icon={icon}
              badge={badge}
              badgePosition={badgePosition}
              status={status}
              statusColor={statusColor}
              statusSize={statusSize}
              responsive={responsive}
              compact={compact}
              sticky={sticky}
              theme={theme}
              animation={animation}
              duration={duration}
              delay={delay}
              repeat={repeat}
              repeatDelay={repeatDelay}
              onAnimationStart={onAnimationStart}
              onAnimationEnd={onAnimationEnd}
              onAnimationRepeat={onAnimationRepeat}
            />
          </div>
        ))}
        {groupMoreCount > 0 && (
          <div
            className={cn(
              'relative flex items-center justify-center',
              sizeClasses[groupMoreSize],
              variantClasses[groupMoreVariant],
              colorClasses[groupMoreColor],
              groupMoreBorder && `border-${borderWidth} border-${borderColor}`,
              groupMoreShadow && 'shadow-md',
              groupMoreHover && 'hover:shadow-lg transition-shadow duration-200',
              groupMoreClickable && 'cursor-pointer',
              groupMoreClassName
            )}
            style={groupMoreStyle}
            onClick={groupMoreOnClick}
          >
            {groupMore || groupMoreText.replace('{count}', groupMoreCount.toString())}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      {src && !imageLoaded && !imageError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className="hidden"
        />
      )}
      {renderAvatar()}
      {renderStatus()}
      {renderBadge()}
      {renderEditButton()}
      {renderEditMode()}
    </div>
  );
}
