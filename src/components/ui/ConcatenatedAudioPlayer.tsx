'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioTrack {
  id: string;
  url: string;
  label: string;
}

interface ConcatenatedAudioPlayerProps {
  audioTracks: AudioTrack[];
  className?: string;
  onError?: (error: string) => void;
  showTrackTabs?: boolean;
}

const ConcatenatedAudioPlayer: React.FC<ConcatenatedAudioPlayerProps> = ({
  audioTracks,
  className = '',
  onError,
  showTrackTabs = false
}) => {
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarMobileRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const wasPlayingRef = useRef(false);
  const dragStartTimeRef = useRef(0);
  const dragStartPositionRef = useRef(0);
  const isPlayingRef = useRef(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [trackDurations, setTrackDurations] = useState<Record<string, number>>({});
  const [trackStartTimes, setTrackStartTimes] = useState<number[]>([]);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const onErrorRef = useRef(onError);
  const errorReportedRef = useRef<Set<string>>(new Set());

  // Keep onError ref updated without causing re-renders
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Calculate track start times based on durations
  useEffect(() => {
    if (audioTracks.length === 0) return;

    const durations = Object.values(trackDurations);
    if (durations.length !== audioTracks.length) return;

    const startTimes: number[] = [0];
    let cumulative = 0;
    
    for (let i = 0; i < durations.length - 1; i++) {
      cumulative += durations[i] || 0;
      startTimes.push(cumulative);
    }

    setTrackStartTimes(startTimes);

    // Calculate total duration
    const total = durations.reduce((sum, dur) => sum + (dur || 0), 0);
    setTotalDuration(total);
    setLoading(false);
  }, [trackDurations, audioTracks.length]);

  // Load metadata for all audio tracks
  useEffect(() => {
    if (audioTracks.length === 0) return;

    // Reset error reporting for new tracks
    errorReportedRef.current.clear();
    setError(null);
    setLoading(true);

    let loadedCount = 0;
    const durations: Record<string, number> = {};
    const failedTracks: string[] = [];
    const handlers = new Map<string, { loaded: () => void; error: () => void }>();

    audioTracks.forEach((track) => {
      const audio = new Audio();
      audio.preload = 'metadata';

      const handleLoadedMetadata = () => {
        durations[track.id] = audio.duration;
        loadedCount++;

        if (loadedCount === audioTracks.length) {
          setTrackDurations(durations);
          // Report errors only once when all tracks are processed
          if (failedTracks.length > 0 && !errorReportedRef.current.has('batch')) {
            errorReportedRef.current.add('batch');
            const errorMsg = failedTracks.length === 1 
              ? `Failed to load audio: ${failedTracks[0]}`
              : `Failed to load ${failedTracks.length} audio track(s): ${failedTracks.join(', ')}`;
            setError(errorMsg);
            onErrorRef.current?.(errorMsg);
          }
        }
      };

      const handleError = () => {
        loadedCount++;
        durations[track.id] = 0;
        failedTracks.push(track.label);
        
        if (loadedCount === audioTracks.length) {
          setTrackDurations(durations);
          // Report errors only once when all tracks are processed
          if (failedTracks.length > 0 && !errorReportedRef.current.has('batch')) {
            errorReportedRef.current.add('batch');
            const errorMsg = failedTracks.length === 1 
              ? `Failed to load audio: ${failedTracks[0]}`
              : `Failed to load ${failedTracks.length} audio track(s): ${failedTracks.join(', ')}`;
            setError(errorMsg);
            onErrorRef.current?.(errorMsg);
          }
        }
      };

      // Store handlers for cleanup
      handlers.set(track.id, { loaded: handleLoadedMetadata, error: handleError });

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('error', handleError);

      audio.src = track.url;
      audioRefs.current[track.id] = audio;
    });

    return () => {
      // Clean up event listeners and audio elements
      audioTracks.forEach((track) => {
        const audio = audioRefs.current[track.id];
        const handlerSet = handlers.get(track.id);
        
        if (audio && handlerSet) {
          audio.removeEventListener('loadedmetadata', handlerSet.loaded);
          audio.removeEventListener('error', handlerSet.error);
          audio.pause();
          audio.src = '';
          delete audioRefs.current[track.id];
        }
      });
    };
  }, [audioTracks]);

  // Handle time updates
  useEffect(() => {
    if (!isPlaying || currentTrackIndex >= audioTracks.length) return;

    const currentTrack = audioTracks[currentTrackIndex];
    const audio = audioRefs.current[currentTrack.id];
    if (!audio) return;

    const updateTime = () => {
      if (!isDraggingRef.current) {
        const trackStartTime = trackStartTimes[currentTrackIndex] || 0;
        const globalTime = trackStartTime + audio.currentTime;
        setCurrentTime(globalTime);
      }
    };

    const handleEnded = async () => {
      // Move to next track
      if (currentTrackIndex < audioTracks.length - 1) {
        const nextIndex = currentTrackIndex + 1;
        setCurrentTrackIndex(nextIndex);
        const nextTrack = audioTracks[nextIndex];
        const nextAudio = audioRefs.current[nextTrack.id];
        
        if (nextAudio && isPlayingRef.current) {
          nextAudio.currentTime = 0;
          try {
            // Cancel any pending play promise
            if (playPromiseRef.current) {
              playPromiseRef.current.catch(() => {});
              playPromiseRef.current = null;
            }
            
            // Small delay to ensure smooth transition
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Check if still supposed to be playing
            if (!isPlayingRef.current) return;
            
            const playPromise = nextAudio.play();
            playPromiseRef.current = playPromise;
            
            await playPromise;
            playPromiseRef.current = null;
          } catch (err: any) {
            playPromiseRef.current = null;
            // Only log non-abort errors
            if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
              console.error('Error playing next track:', err);
              setIsPlaying(false);
            }
          }
        }
      } else {
        // All tracks finished
        setIsPlaying(false);
        setCurrentTrackIndex(0);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, currentTrackIndex, audioTracks, trackStartTimes]);

  // Handle play/pause
  useEffect(() => {
    if (audioTracks.length === 0) return;

    const currentTrack = audioTracks[currentTrackIndex];
    const audio = audioRefs.current[currentTrack.id];
    if (!audio) return;

    // Set volume
    audio.volume = isMuted ? 0 : volume;

    // Update ref
    isPlayingRef.current = isPlaying;

    if (isPlaying) {
      // Cancel any pending play promise
      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }

      // Pause all other tracks first
      audioTracks.forEach((track, index) => {
        if (index !== currentTrackIndex) {
          const otherAudio = audioRefs.current[track.id];
          if (otherAudio) {
            otherAudio.pause();
          }
        }
      });

      // Small delay to ensure pause completes
      const playAudio = async () => {
        try {
          // Wait a bit to ensure previous pause operations complete
          await new Promise(resolve => setTimeout(resolve, 10));
          
          // Check if still supposed to be playing
          if (!isPlayingRef.current) return;
          
          const playPromise = audio.play();
          playPromiseRef.current = playPromise;
          
          await playPromise;
          playPromiseRef.current = null;
        } catch (err: any) {
          playPromiseRef.current = null;
          // Only log non-abort errors
          if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
            console.error('Error playing audio:', err);
            setIsPlaying(false);
            setError('Failed to play audio');
            onErrorRef.current?.(err.message || 'Failed to play audio');
          } else if (err.name === 'NotAllowedError') {
            // User interaction required
            setIsPlaying(false);
          }
        }
      };

      playAudio();
    } else {
      // Pause audio
      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex, audioTracks, volume, isMuted]);

  // Pause all other tracks when switching
  useEffect(() => {
    // Cancel any pending play promise when switching tracks
    if (playPromiseRef.current) {
      playPromiseRef.current.catch(() => {});
      playPromiseRef.current = null;
    }
    
    audioTracks.forEach((track, index) => {
      const audio = audioRefs.current[track.id];
      if (audio && index !== currentTrackIndex) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }, [currentTrackIndex, audioTracks]);

  // Seek logic - handle both mouse and touch events
  const startDrag = useCallback((clientX: number) => {
    if (totalDuration === 0) return;
    
    isDraggingRef.current = true;
    setIsDragging(true);
    wasPlayingRef.current = isPlaying;
    
    if (isPlaying) {
      // Pause all tracks
      audioTracks.forEach((track) => {
        const audio = audioRefs.current[track.id];
        if (audio) audio.pause();
      });
      setIsPlaying(false);
    }

    // Get the active progress bar (mobile or desktop)
    const activeBar = progressBarMobileRef.current || progressBarRef.current;
    if (!activeBar) return;
    
    const rect = activeBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const seekTime = percent * totalDuration;
    
    setCurrentTime(seekTime);
    dragStartTimeRef.current = seekTime;
  }, [totalDuration, isPlaying, audioTracks]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    startDrag(e.clientX);
  }, [startDrag]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      startDrag(e.touches[0].clientX);
    }
  }, [startDrag]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const activeBar = progressBarMobileRef.current || progressBarRef.current;
    if (!activeBar) return;
    
    const rect = activeBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTime = percent * totalDuration;
    
    setCurrentTime(seekTime);
    dragStartTimeRef.current = seekTime;
  }, [totalDuration]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length === 0) return;
    
    const activeBar = progressBarMobileRef.current || progressBarRef.current;
    if (!activeBar) return;
    
    const rect = activeBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
    const seekTime = percent * totalDuration;
    
    setCurrentTime(seekTime);
    dragStartTimeRef.current = seekTime;
  }, [totalDuration]);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    isDraggingRef.current = false;
    setIsDragging(false);

    // Find which track and position to seek to
    const seekTime = dragStartTimeRef.current;
    
    // Find the track that contains this time
    let targetTrackIndex = 0;
    let trackRelativeTime = seekTime;

    for (let i = 0; i < trackStartTimes.length; i++) {
      const trackStart = trackStartTimes[i];
      const trackDuration = trackDurations[audioTracks[i]?.id] || 0;
      const trackEnd = trackStart + trackDuration;

      if (seekTime >= trackStart && seekTime < trackEnd) {
        targetTrackIndex = i;
        trackRelativeTime = seekTime - trackStart;
        break;
      } else if (i === trackStartTimes.length - 1 && seekTime >= trackEnd) {
        // Past the last track, go to end
        targetTrackIndex = i;
        trackRelativeTime = trackDuration;
        break;
      }
    }

    // Pause all tracks
    audioTracks.forEach((track) => {
      const audio = audioRefs.current[track.id];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Set current track and seek position
    setCurrentTrackIndex(targetTrackIndex);
    const targetTrack = audioTracks[targetTrackIndex];
    const targetAudio = audioRefs.current[targetTrack.id];
    
    if (targetAudio) {
      targetAudio.currentTime = trackRelativeTime;
      
      if (wasPlayingRef.current) {
        // Cancel any pending play promise
        if (playPromiseRef.current) {
          playPromiseRef.current.catch(() => {});
          playPromiseRef.current = null;
        }
        
        setIsPlaying(true);
        isPlayingRef.current = true;
        
        // The useEffect will handle the actual play
      }
    }
  }, [audioTracks, trackStartTimes, trackDurations]);

  // Mouse and touch event handlers
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Playback controls
  const togglePlayPause = async () => {
    if (audioTracks.length === 0) return;
    
    if (isPlaying) {
      // Pause current track
      const currentTrack = audioTracks[currentTrackIndex];
      const audio = audioRefs.current[currentTrack.id];
      
      // Cancel any pending play promise
      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }
      
      if (audio) {
        audio.pause();
      }
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      // Play current track
      const currentTrack = audioTracks[currentTrackIndex];
      const audio = audioRefs.current[currentTrack.id];
      
      if (audio) {
        // Cancel any pending play promise
        if (playPromiseRef.current) {
          playPromiseRef.current.catch(() => {});
          playPromiseRef.current = null;
        }
        
        setIsPlaying(true);
        isPlayingRef.current = true;
        
        // The useEffect will handle the actual play
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  // Format time helper
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  if (audioTracks.length === 0) {
    return (
      <div className={`text-center text-gray-500 p-4 ${className}`}>
        No audio tracks available
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`text-center text-gray-500 p-4 ${className}`}>
        Loading audio tracks...
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      {/* Current Track Indicator */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="font-medium">Playing:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {audioTracks[currentTrackIndex]?.label || 'Unknown'}
          </span>
          <span className="text-gray-400">
            ({currentTrackIndex + 1} of {audioTracks.length})
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Main Player Controls */}
      <div className="w-full">
        {/* Mobile Layout: Progress Bar Full Width on Top */}
        <div className="block sm:hidden">
          {/* Progress Bar - Full Width */}
          <div className="w-full mb-3">
            <div
              ref={progressBarMobileRef}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group touch-none"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {/* Progress Fill */}
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
              
              {/* Track Markers */}
              {trackStartTimes.map((startTime, index) => {
                if (index === 0) return null;
                const percent = (startTime / totalDuration) * 100;
                return (
                  <div
                    key={`marker-${index}`}
                    className="absolute top-0 w-0.5 h-full bg-gray-400 dark:bg-gray-500"
                    style={{ left: `${percent}%` }}
                    title={`Start of ${audioTracks[index]?.label}`}
                  />
                );
              })}
              
              {/* Progress Handle */}
              <div
                className={`absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-opacity duration-150 ${
                  isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                style={{ left: `${progressPercent}%` }}
              />
            </div>
            
            {/* Time Display Below Progress Bar */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Controls Below Progress Bar */}
          <div className="flex items-center justify-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex-shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={toggleMute}
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={isMuted ? 0 : volume * 100}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout: Horizontal */}
        <div className="hidden sm:flex items-center gap-3 w-full">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex-shrink-0"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>

          {/* Time Display */}
          <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[50px]">
            {formatTime(currentTime)}
          </span>

          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group touch-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Progress Fill */}
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
            
            {/* Track Markers */}
            {trackStartTimes.map((startTime, index) => {
              if (index === 0) return null;
              const percent = (startTime / totalDuration) * 100;
              return (
                <div
                  key={`marker-${index}`}
                  className="absolute top-0 w-0.5 h-full bg-gray-400 dark:bg-gray-500"
                  style={{ left: `${percent}%` }}
                  title={`Start of ${audioTracks[index]?.label}`}
                />
              );
            })}
            
            {/* Progress Handle */}
            <div
              className={`absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-opacity duration-150 ${
                isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          {/* Total Time */}
          <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[50px]">
            {formatTime(totalDuration)}
          </span>

          {/* Volume Control */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={toggleMute}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      {/* Track List (Optional - shows all tracks) */}
      {showTrackTabs && (
        <div className="flex flex-wrap gap-2 text-xs">
          {audioTracks.map((track, index) => (
            <button
              key={track.id}
              onClick={() => {
                // Pause all tracks
                audioTracks.forEach((t) => {
                  const audio = audioRefs.current[t.id];
                  if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                  }
                });
                
                // Set to selected track
                setCurrentTrackIndex(index);
                const audio = audioRefs.current[track.id];
                if (audio) {
                  audio.currentTime = 0;
                  if (isPlaying) {
                    audio.play().catch((err) => {
                      console.error('Error playing track:', err);
                      setIsPlaying(false);
                    });
                  }
                }
              }}
              className={`px-2 py-1 rounded transition-colors ${
                index === currentTrackIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConcatenatedAudioPlayer;

