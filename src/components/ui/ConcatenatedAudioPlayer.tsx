'use client';

import React, { useState, useRef, useEffect, useCallback, startTransition } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioTrack {
  id: string;
  url: string;
  label: string;
  durationHint?: number;
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
  // Refs
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarMobileRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentGlobalTime, setCurrentGlobalTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Internal refs for performance
  const playingRef = useRef(false);
  const draggingRef = useRef(false);
  const wasPlayingBeforeDragRef = useRef(false);
  const durationsRef = useRef<Record<string, number>>({});
  const cumulativeRef = useRef<number[]>([]);
  const currentTrackIndexRef = useRef(0);

  // Early return if no tracks
  if (!audioTracks || audioTracks.length === 0) {
    return (
      <div className={`text-center text-gray-500 p-4 ${className}`}>
        No audio tracks available
      </div>
    );
  }

  // Calculate cumulative durations
  const calculateCumulative = useCallback(() => {
    const durations = audioTracks.map(t => durationsRef.current[t.id] || 0);
    const cum: number[] = [0];
    durations.forEach(d => cum.push(cum[cum.length - 1] + d));
    cumulativeRef.current = cum;
    setTotalDuration(cum[cum.length - 1] || 0);
  }, [audioTracks]);

  // Load metadata for all tracks
  useEffect(() => {
    if (audioTracks.length === 0) return;

    let loadedCount = 0;
    const totalTracks = audioTracks.length;

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === totalTracks) {
        calculateCumulative();
      } else {
        calculateCumulative(); // Update as we go
      }
    };

    audioTracks.forEach(track => {
      const audio = audioRefs.current[track.id];
      if (!audio) return;

      // Check if already loaded
      if (audio.readyState >= 2 && audio.duration > 0) {
        durationsRef.current[track.id] = audio.duration;
        checkComplete();
        return;
      }

      const onLoadedMetadata = () => {
        if (audio.duration > 0) {
          durationsRef.current[track.id] = audio.duration;
        }
        checkComplete();
      };

      const onError = () => {
        durationsRef.current[track.id] = 0;
        checkComplete();
      };

      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('error', onError);

      return () => {
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('error', onError);
      };
    });
  }, [audioTracks, calculateCumulative]);

  // Switch to track - moved before updateProgress
  const switchToTrack = useCallback(async (idx: number, localTime: number = 0, autoPlay: boolean = false) => {
    if (idx < 0 || idx >= audioTracks.length) return;

    console.log('switchToTrack called:', idx, 'autoPlay:', autoPlay, 'playingRef.current:', playingRef.current);

    // Pause all tracks
    audioTracks.forEach(track => {
      const audio = audioRefs.current[track.id];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const track = audioTracks[idx];
    const audio = audioRefs.current[track.id];
    if (!audio) {
      console.error('Audio element not found for track:', track.id);
      return;
    }

    try {
      audio.currentTime = Math.max(0, localTime);
      setCurrentTrackIndex(idx);
      currentTrackIndexRef.current = idx; // Update ref

      // If autoPlay is true, play regardless of playingRef.current
      // (useful when advancing from ended track)
      if (autoPlay) {
        console.log('Auto-playing track:', track.id);
        playingRef.current = true;
        setIsPlaying(true);
        await audio.play();
        console.log('Track started playing:', track.id);
      } else if (playingRef.current) {
        // If we were playing before, continue playing
        await audio.play();
        playingRef.current = true;
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Error switching track:', err);
      playingRef.current = false;
      setIsPlaying(false);
    }
  }, [audioTracks]);

  // Update progress - use refs to avoid stale closures
  const updateProgress = useCallback(() => {
    // During drag, don't update from audio - user is controlling the position
    if (draggingRef.current) {
      // Don't schedule next frame during drag - we'll restart when drag ends
      rafRef.current = null;
      return;
    }

    // Check playing state - must be playing AND not paused
    if (!playingRef.current || !isPlaying) {
      rafRef.current = null;
      return;
    }

    // Get current values - use refs to get latest values
    const currentIdx = currentTrackIndex;
    const currentTrack = audioTracks[currentIdx];
    if (!currentTrack) {
      rafRef.current = null;
      return;
    }

    const audio = audioRefs.current[currentTrack.id];
    if (!audio) {
      rafRef.current = null;
      return;
    }

    // Check if audio is actually playing - if paused, stop updates
    if (audio.paused) {
      playingRef.current = false;
      setIsPlaying(false);
      rafRef.current = null;
      return;
    }

    const localTime = audio.currentTime || 0;
    const cum = cumulativeRef.current;
    
    // Ensure cumulative array is valid
    if (!cum || cum.length === 0) {
      // Keep trying - maybe cumulative hasn't loaded yet
      rafRef.current = requestAnimationFrame(updateProgress);
      return;
    }
    
    // Calculate global time
    const globalTime = (cum[currentIdx] || 0) + localTime;
    
    // Update immediately - this is critical for smooth progress
    setCurrentGlobalTime(globalTime);

    // Note: Auto-advance to next track is now handled by 'ended' event listener
    // on the audio element, which is more reliable than checking audio.ended here

    // Continue RAF loop - this is critical
    rafRef.current = requestAnimationFrame(updateProgress);
  }, [audioTracks, currentTrackIndex, switchToTrack, isPlaying]);

  // Sync currentTrackIndexRef with state
  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  // Start/stop progress updates
  useEffect(() => {
    // Sync playingRef with isPlaying state
    playingRef.current = isPlaying;
    
    if (isPlaying && !draggingRef.current) {
      // Start RAF loop if not already running
      if (rafRef.current === null) {
        // Start RAF loop - this will continue automatically
        rafRef.current = requestAnimationFrame(updateProgress);
      }
    } else {
      // Stop RAF loop
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, updateProgress]);


  // Play/Pause
  const togglePlayPause = useCallback(async () => {
    const currentTrack = audioTracks[currentTrackIndex];
    if (!currentTrack) {
      console.error('No current track found');
      return;
    }

    const audio = audioRefs.current[currentTrack.id];
    if (!audio) {
      console.error('Audio element not found for track:', currentTrack.id);
      setError('Audio not ready. Please wait...');
      return;
    }

    try {
      if (playingRef.current) {
        // Stop RAF immediately on pause
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        audio.pause();
        playingRef.current = false;
        setIsPlaying(false);
        // Don't update progress after pause - keep current position
      } else {
        // Pause other tracks first
        audioTracks.forEach((track, i) => {
          if (i !== currentTrackIndex) {
            const otherAudio = audioRefs.current[track.id];
            if (otherAudio) {
              otherAudio.pause();
              otherAudio.currentTime = 0;
            }
          }
        });

        // Ensure audio is ready
        if (audio.readyState < 2) {
          // Wait for audio to be ready
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Audio load timeout'));
            }, 5000);

            const onCanPlay = () => {
              clearTimeout(timeout);
              audio.removeEventListener('canplay', onCanPlay);
              audio.removeEventListener('error', onError);
              resolve();
            };

            const onError = () => {
              clearTimeout(timeout);
              audio.removeEventListener('canplay', onCanPlay);
              audio.removeEventListener('error', onError);
              reject(new Error('Audio load error'));
            };

            audio.addEventListener('canplay', onCanPlay);
            audio.addEventListener('error', onError);

            if (audio.readyState >= 2) {
              clearTimeout(timeout);
              audio.removeEventListener('canplay', onCanPlay);
              audio.removeEventListener('error', onError);
              resolve();
            }
          });
        }

        // Play audio
        await audio.play();
        playingRef.current = true;
        setIsPlaying(true);
        setError(null);
        
        // Ensure RAF loop starts after play
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(updateProgress);
        }
      }
    } catch (err: any) {
      console.error('Play error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Please click play to start audio');
        onError?.('Autoplay not allowed');
      } else {
        setError(`Play failed: ${err.message || err}`);
        onError?.(`Play failed: ${err.message || err}`);
      }
      playingRef.current = false;
      setIsPlaying(false);
    }
  }, [audioTracks, currentTrackIndex, onError]);

  // Seek to global time
  const seekToGlobal = useCallback(async (globalSeconds: number, autoPlay: boolean = false) => {
    const cum = cumulativeRef.current;
    if (!cum || cum.length === 0) return;

    const clamped = Math.max(0, Math.min(globalSeconds, cum[cum.length - 1] || 0));
    
    // Find which track this time belongs to
    let trackIdx = 0;
    for (let i = 0; i < cum.length - 1; i++) {
      if (clamped >= cum[i] && clamped < cum[i + 1]) {
        trackIdx = i;
        break;
      }
      if (i === cum.length - 2 && clamped >= cum[i + 1]) {
        trackIdx = i + 1;
        break;
      }
    }

    const localTime = clamped - (cum[trackIdx] || 0);
    await switchToTrack(trackIdx, localTime, autoPlay);
    setCurrentGlobalTime(clamped);
    
    // Resume RAF if playing - ensure it starts
    if (autoPlay && playingRef.current) {
      // Small delay to ensure audio is playing
      setTimeout(() => {
        if (playingRef.current && rafRef.current === null) {
          rafRef.current = requestAnimationFrame(updateProgress);
        }
      }, 50);
    }
  }, [switchToTrack, updateProgress]);

  // Simplified seek handler - only updates visual position during drag
  const handleSeek = useCallback((clientX: number) => {
    const bar = progressBarRef.current || progressBarMobileRef.current;
    if (!bar || totalDuration === 0) return null;
    
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetTime = ratio * totalDuration;
    
    // Only update visual position during drag, don't seek yet
    // Stop any RAF updates during drag
    if (draggingRef.current) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setCurrentGlobalTime(targetTime);
    }
    
    return targetTime;
  }, [totalDuration]);

  // Pointer start handler
  const handlePointerStart = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const x = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const targetTime = handleSeek(x);
    
    if (targetTime === null) return;
    
    // Remember if we were playing before drag
    wasPlayingBeforeDragRef.current = playingRef.current;
    
    // Start dragging - don't pause audio yet, just mark as dragging
    draggingRef.current = true;
    setIsDragging(true);
    
    // Update visual position immediately
    handleSeek(x);
  }, [handleSeek]);

  // Pointer move handler (for global events and direct events)
  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    
    // Prevent default to stop scrolling on mobile
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    
    const x = 'touches' in e && e.touches && e.touches[0] 
      ? e.touches[0].clientX 
      : 'changedTouches' in e && e.changedTouches && e.changedTouches[0]
        ? e.changedTouches[0].clientX
        : 'clientX' in e 
          ? (e as MouseEvent).clientX 
          : null;
    
    if (x === null) return;
    
    // Only update visual position during drag
    handleSeek(x);
  }, [handleSeek]);

  // Pointer end handler - actually seek here
  const handlePointerEnd = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!draggingRef.current) return;
    
    const x = 'touches' in e && e.changedTouches?.[0] 
      ? e.changedTouches[0].clientX 
      : 'clientX' in e 
        ? (e as MouseEvent).clientX 
        : null;
    
    if (x === null) {
      draggingRef.current = false;
      setIsDragging(false);
      return;
    }
    
    const targetTime = handleSeek(x);
    if (targetTime !== null) {
      // Now actually seek to the position
      seekToGlobal(targetTime, wasPlayingBeforeDragRef.current);
    }
    
    draggingRef.current = false;
    setIsDragging(false);
  }, [handleSeek, seekToGlobal]);

  // Global drag handlers
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      handlePointerMove(e);
    };

    const handleGlobalEnd = (e: MouseEvent | TouchEvent) => {
      handlePointerEnd(e);
    };

    document.addEventListener('mousemove', handleGlobalMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalEnd);
    document.addEventListener('touchmove', handleGlobalMove, { passive: false });
    document.addEventListener('touchend', handleGlobalEnd);
    document.addEventListener('touchcancel', handleGlobalEnd); // Handle touch cancel

    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('touchend', handleGlobalEnd);
      document.removeEventListener('touchcancel', handleGlobalEnd);
    };
  }, [isDragging, handlePointerMove, handlePointerEnd]);

  // Volume and mute
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.muted = newMuted;
        audio.volume = newMuted ? 0 : volume;
      }
    });
  }, [isMuted, volume]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = newVolume;
        audio.muted = newVolume === 0;
      }
    });
  }, []);

  // Format time
  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const s = Math.floor(seconds % 60);
    const m = Math.floor((seconds / 60) % 60);
    const h = Math.floor(seconds / 3600);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Render track markers
  const renderMarkers = () => {
    const cum = cumulativeRef.current;
    if (!cum || cum.length < 2 || totalDuration === 0) return null;

    return (
      <div className="absolute inset-0 pointer-events-none">
        {cum.slice(1, -1).map((boundary, i) => {
          const left = (boundary / totalDuration) * 100;
          return (
            <div
              key={`marker-${i}`}
              className="absolute top-0 h-full w-px bg-white/60 dark:bg-gray-600/60"
              style={{ left: `${left}%` }}
            />
          );
        })}
      </div>
    );
  };

  // Calculate progress percentage - ensure it's always a valid number
  const progressPercent = React.useMemo(() => {
    if (!totalDuration || totalDuration <= 0) return 0;
    // Allow 0 as valid time (start of audio)
    if (currentGlobalTime === undefined || currentGlobalTime === null || currentGlobalTime < 0) return 0;
    const percent = (currentGlobalTime / totalDuration) * 100;
    return Math.min(100, Math.max(0, percent));
  }, [currentGlobalTime, totalDuration]);

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
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          <div className="w-full mb-3">
            <div
              ref={progressBarMobileRef}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group touch-none"
              onMouseDown={handlePointerStart}
              onTouchStart={handlePointerStart}
              onTouchMove={handlePointerMove}
              onMouseUp={handlePointerEnd}
              onTouchEnd={handlePointerEnd}
              onMouseMove={isDragging ? handlePointerMove : undefined}
            >
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full pointer-events-none"
                style={{ 
                  width: `${progressPercent}%`,
                  minWidth: progressPercent > 0 ? '2px' : '0px',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                  transition: 'opacity 150ms, background-color 150ms'
                }}
              />
              {renderMarkers()}
              <div
                className={`absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-opacity duration-150 ${
                  isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                style={{ left: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={togglePlayPause}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex-shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={toggleMute}
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={isMuted ? 0 : volume * 100}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span>{formatTime(currentGlobalTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center gap-3 w-full">
          <button
            onClick={togglePlayPause}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex-shrink-0"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[50px]">
            {formatTime(currentGlobalTime)}
          </span>

          <div
            ref={progressBarRef}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group touch-none"
            onMouseDown={handlePointerStart}
            onTouchStart={handlePointerStart}
            onMouseUp={handlePointerEnd}
            onTouchEnd={handlePointerEnd}
          >
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full pointer-events-none"
              style={{ 
                width: `${progressPercent}%`,
                minWidth: progressPercent > 0 ? '2px' : '0px',
                maxWidth: '100%',
                boxSizing: 'border-box',
                flexShrink: 0,
                transition: 'opacity 150ms, background-color 150ms'
              }}
            />
            {renderMarkers()}
            <div
              className={`absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-opacity duration-150 ${
                isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[50px]">
            {formatTime(totalDuration)}
          </span>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={toggleMute}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Track Tabs (Optional) */}
      {showTrackTabs && (
        <div className="flex flex-wrap gap-2 text-xs">
          {audioTracks.map((track, index) => (
            <button
              key={track.id}
              onClick={() => {
                const cum = cumulativeRef.current;
                if (cum && cum.length > index) {
                  seekToGlobal(cum[index] || 0, playingRef.current);
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

      {/* Hidden Audio Elements */}
      {audioTracks.map((track, index) => (
        <audio
          key={track.id}
          ref={(el) => {
            if (el) {
              audioRefs.current[track.id] = el;
              // Ensure src is set
              if (el.src !== track.url) {
                el.src = track.url;
                el.load(); // Force reload if src changed
              }
              el.muted = isMuted;
              el.volume = isMuted ? 0 : volume;
              el.preload = 'metadata';
              
              // Add ended event listener for automatic track switching
              const handleEnded = () => {
                // Use ref to get current track index (avoids stale closure)
                const currentIdx = currentTrackIndexRef.current;
                const currentTrack = audioTracks[currentIdx];
                
                // Only auto-advance if this is the currently playing track
                // Note: When audio ends, el.paused will be true, so we don't check that
                if (currentTrack && currentTrack.id === track.id) {
                  console.log('Track ended, advancing to next:', track.id, 'currentIdx:', currentIdx);
                  const next = index + 1;
                  if (next < audioTracks.length) {
                    // Switch to next track and auto-play
                    // Keep playingRef.current as true so next track plays
                    switchToTrack(next, 0, true).catch(err => {
                      console.error('Error auto-advancing to next track:', err);
                    });
                  } else {
                    // All tracks finished
                    console.log('All tracks finished');
                    playingRef.current = false;
                    setIsPlaying(false);
                    setCurrentTrackIndex(0);
                    currentTrackIndexRef.current = 0;
                    setCurrentGlobalTime(0);
                    if (rafRef.current) {
                      cancelAnimationFrame(rafRef.current);
                      rafRef.current = null;
                    }
                  }
                }
              };
              
              // Add timeupdate listener for this track - backup to RAF for smooth updates
              const handleTimeUpdate = () => {
                // Only update if:
                // 1. This is the current track
                // 2. Audio is actually playing (not paused)
                // 3. We're not dragging
                // 4. playingRef is true
                if (
                  track.id === audioTracks[currentTrackIndex]?.id &&
                  !el.paused &&
                  !draggingRef.current &&
                  playingRef.current
                ) {
                  const localTime = el.currentTime || 0;
                  const cum = cumulativeRef.current;
                  const currentIdx = currentTrackIndex;
                  if (cum && cum.length > currentIdx) {
                    const globalTime = (cum[currentIdx] || 0) + localTime;
                    // Update progress - this ensures smooth updates even if RAF misses a frame
                    setCurrentGlobalTime(globalTime);
                  }
                }
              };
              
              el.addEventListener('ended', handleEnded);
              el.addEventListener('timeupdate', handleTimeUpdate);
              
              // Store cleanup functions
              (el as any)._cleanupEnded = () => {
                el.removeEventListener('ended', handleEnded);
              };
              (el as any)._cleanupTimeUpdate = () => {
                el.removeEventListener('timeupdate', handleTimeUpdate);
              };
            } else {
              const audio = audioRefs.current[track.id];
              if (audio) {
                if ((audio as any)._cleanupEnded) {
                  (audio as any)._cleanupEnded();
                }
                if ((audio as any)._cleanupTimeUpdate) {
                  (audio as any)._cleanupTimeUpdate();
                }
              }
              delete audioRefs.current[track.id];
            }
          }}
          src={track.url}
          preload="metadata"
          onLoadedMetadata={() => {
            const audio = audioRefs.current[track.id];
            if (audio && audio.duration > 0) {
              durationsRef.current[track.id] = audio.duration;
              calculateCumulative();
            }
          }}
          onError={(e) => {
            console.error('Audio load error for', track.id, ':', e);
            durationsRef.current[track.id] = 0;
            calculateCumulative();
          }}
        />
      ))}
    </div>
  );
};

export default ConcatenatedAudioPlayer;
