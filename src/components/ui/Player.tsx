'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward, 
  RotateCw, 
  Settings, 
  Download, 
  Share, 
  Heart, 
  MoreHorizontal,
  Loader2
} from 'lucide-react';

export interface PlayerProps {
  src: string;
  type?: 'audio' | 'video';
  title?: string;
  description?: string;
  poster?: string;
  thumbnail?: string;
  duration?: number;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showProgress?: boolean;
  showVolume?: boolean;
  showFullscreen?: boolean;
  showDownload?: boolean;
  showShare?: boolean;
  showLike?: boolean;
  showSettings?: boolean;
  showSkip?: boolean;
  showRotate?: boolean;
  showThumbnail?: boolean;
  allowFullscreen?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowLike?: boolean;
  allowSettings?: boolean;
  allowSkip?: boolean;
  allowRotate?: boolean;
  allowThumbnail?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVolumeChange?: (volume: number) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onDownload?: () => void;
  onShare?: () => void;
  onLike?: () => void;
  onSettings?: () => void;
  onSkip?: (direction: 'back' | 'forward') => void;
  onRotate?: () => void;
  onThumbnail?: () => void;
  className?: string;
  playerClassName?: string;
  controlsClassName?: string;
  loading?: boolean;
  error?: string;
  warning?: string;
  info?: string;
  success?: string;
  compact?: boolean;
  responsive?: boolean;
  sticky?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  quality?: 'auto' | 'low' | 'medium' | 'high' | 'ultra';
  playbackRate?: number;
  volume?: number;
  isLiked?: boolean;
  likes?: number;
  views?: number;
  downloads?: number;
  metadata?: {
    artist?: string;
    album?: string;
    year?: string;
    genre?: string;
    size?: string;
    format?: string;
  };
}

export default function Player({
  src,
  type = 'video',
  title,
  description,
  poster,
  thumbnail,
  duration,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  showTitle = true,
  showDescription = true,
  showProgress = true,
  showVolume = true,
  showFullscreen = true,
  showDownload = false,
  showShare = false,
  showLike = false,
  showSettings = false,
  showSkip = false,
  showRotate = false,
  showThumbnail = false,
  allowFullscreen = true,
  allowDownload = false,
  allowShare = false,
  allowLike = false,
  allowSettings = false,
  allowSkip = false,
  allowRotate = false,
  allowThumbnail = false,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
  onFullscreenChange,
  onDownload,
  onShare,
  onLike,
  onSettings,
  onSkip,
  onRotate,
  onThumbnail,
  className,
  playerClassName,
  controlsClassName,
  loading = false,
  error,
  warning,
  info,
  success,
  compact = false,
  responsive = true,
  sticky = false,
  theme = 'auto',
  quality = 'auto',
  playbackRate = 1,
  volume = 1,
  isLiked = false,
  likes = 0,
  views = 0,
  downloads = 0,
  metadata,
}: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(loading);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(playbackRate);
  const [currentQuality, setCurrentQuality] = useState(quality);
  const [isRotated, setIsRotated] = useState(false);
  const [showThumbnailOverlay, setShowThumbnailOverlay] = useState(false);

  const playerRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleLoadedMetadata = () => {
      setTotalDuration(player.duration);
      setIsLoading(false);
      setHasError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(player.currentTime);
      onTimeUpdate?.(player.currentTime, player.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    const handleVolumeChange = () => {
      setCurrentVolume(player.volume);
      setIsMuted(player.muted);
      onVolumeChange?.(player.volume);
    };

    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isFullscreen);
      onFullscreenChange?.(isFullscreen);
    };

    player.addEventListener('loadedmetadata', handleLoadedMetadata);
    player.addEventListener('timeupdate', handleTimeUpdate);
    player.addEventListener('play', handlePlay);
    player.addEventListener('pause', handlePause);
    player.addEventListener('ended', handleEnded);
    player.addEventListener('error', handleError);
    player.addEventListener('volumechange', handleVolumeChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      player.removeEventListener('loadedmetadata', handleLoadedMetadata);
      player.removeEventListener('timeupdate', handleTimeUpdate);
      player.removeEventListener('play', handlePlay);
      player.removeEventListener('pause', handlePause);
      player.removeEventListener('ended', handleEnded);
      player.removeEventListener('error', handleError);
      player.removeEventListener('volumechange', handleVolumeChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onPlay, onPause, onEnded, onTimeUpdate, onVolumeChange, onFullscreenChange]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    player.volume = currentVolume;
    player.muted = isMuted;
    player.playbackRate = playbackRate;
  }, [currentVolume, isMuted, playbackRate]);

  const handlePlayPause = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSeek = (time: number) => {
    const player = playerRef.current;
    if (!player) return;

    player.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    setCurrentVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreenToggle = () => {
    if (!allowFullscreen) return;

    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleSkip = (direction: 'back' | 'forward') => {
    if (!allowSkip) return;

    const player = playerRef.current;
    if (!player) return;

    const skipTime = 10; // 10 seconds
    const newTime = direction === 'back' 
      ? Math.max(0, player.currentTime - skipTime)
      : Math.min(player.duration, player.currentTime + skipTime);
    
    player.currentTime = newTime;
    setCurrentTime(newTime);
    onSkip?.(direction);
  };

  const handleRotate = () => {
    if (!allowRotate) return;

    setIsRotated(!isRotated);
    onRotate?.();
  };

  const handleThumbnail = () => {
    if (!allowThumbnail) return;

    setShowThumbnailOverlay(!showThumbnailOverlay);
    onThumbnail?.();
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 1000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDuration = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    return formatTime(time);
  };

  const renderControls = () => {
    if (!controls || !showControls) return null;

    return (
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300',
          controlsClassName
        )}
      >
        <div className="space-y-3">
          {(showTitle || showDescription) && (
            <div className="text-white">
              {showTitle && title && (
                <h3 className="text-lg font-semibold truncate">{title}</h3>
              )}
              {showDescription && description && (
                <p className="text-sm text-gray-200 truncate">{description}</p>
              )}
            </div>
          )}

          {showProgress && (
            <div className="space-y-2">
              <ProgressBar
                progress={(currentTime / totalDuration) * 100}
                onChange={(progress) => handleSeek((progress / 100) * totalDuration)}
                className="h-1"
                showLabel={false}
              />
              <div className="flex items-center justify-between text-sm text-white">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(totalDuration)}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="text-white hover:text-gray-300"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              {showSkip && allowSkip && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSkip('back')}
                    className="text-white hover:text-gray-300"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSkip('forward')}
                    className="text-white hover:text-gray-300"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </>
              )}

              {showVolume && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMuteToggle}
                    className="text-white hover:text-gray-300"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : currentVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              {showRotate && allowRotate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotate}
                  className="text-white hover:text-gray-300"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {showThumbnail && allowThumbnail && thumbnail && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleThumbnail}
                  className="text-white hover:text-gray-300"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}

              {showSettings && allowSettings && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSettings}
                  className="text-white hover:text-gray-300"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}

              {showDownload && allowDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDownload}
                  className="text-white hover:text-gray-300"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              {showShare && allowShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  className="text-white hover:text-gray-300"
                >
                  <Share className="h-4 w-4" />
                </Button>
              )}

              {showLike && allowLike && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLike}
                  className="text-white hover:text-gray-300"
                >
                  <Heart className={cn('h-4 w-4', isLiked && 'fill-current text-red-500')} />
                  {likes > 0 && <span className="ml-1 text-sm">{likes}</span>}
                </Button>
              )}

              {showFullscreen && allowFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreenToggle}
                  className="text-white hover:text-gray-300"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderThumbnailOverlay = () => {
    if (!showThumbnailOverlay || !thumbnail) return null;

    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <img
          src={thumbnail}
          alt="Thumbnail"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  };

  const renderLoadingOverlay = () => {
    if (!isLoading) return null;

    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading...</p>
        </div>
      </div>
    );
  };

  const renderErrorOverlay = () => {
    if (!hasError) return null;

    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg font-semibold mb-2">Error loading media</p>
          <p className="text-sm text-gray-300">Please try again later</p>
        </div>
      </div>
    );
  };

  const renderMetadata = () => {
    if (!metadata) return null;

    return (
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {metadata.artist && <p>Artist: {metadata.artist}</p>}
        {metadata.album && <p>Album: {metadata.album}</p>}
        {metadata.year && <p>Year: {metadata.year}</p>}
        {metadata.genre && <p>Genre: {metadata.genre}</p>}
        {metadata.size && <p>Size: {metadata.size}</p>}
        {metadata.format && <p>Format: {metadata.format}</p>}
      </div>
    );
  };

  const renderStats = () => {
    if (views === 0 && downloads === 0) return null;

    return (
      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
        {views > 0 && <span>{views} views</span>}
        {downloads > 0 && <span>{downloads} downloads</span>}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'relative bg-black rounded-lg overflow-hidden',
        compact && 'rounded-md',
        sticky && 'sticky top-4',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cn('relative', playerClassName)}>
        {type === 'video' ? (
          <video
            ref={playerRef as React.RefObject<HTMLVideoElement>}
            src={src}
            poster={poster}
            className={cn(
              'w-full h-full object-cover',
              isRotated && 'transform rotate-90'
            )}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            playsInline
          />
        ) : (
          <audio
            ref={playerRef as React.RefObject<HTMLAudioElement>}
            src={src}
            className="w-full"
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
          />
        )}

        {renderLoadingOverlay()}
        {renderErrorOverlay()}
        {renderThumbnailOverlay()}
        {renderControls()}
      </div>

      {(title || description) && (
        <div className="p-4">
          {showTitle && title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {showDescription && description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      {renderMetadata()}
      {renderStats()}

      {(error || warning || info || success) && (
        <div className="p-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
          {warning && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{warning}</p>
            </div>
          )}
          {info && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">{info}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
              <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
