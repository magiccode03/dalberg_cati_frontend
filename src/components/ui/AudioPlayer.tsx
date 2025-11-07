"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import Button from "./Button";

interface AudioPlayerProps {
  src: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = memo(({ src, className = "" }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const wasPlayingRef = useRef(false);
  const dragStartTimeRef = useRef(0);
  const dragStartPositionRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  /* ------------------------ Audio Events ------------------------ */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isDraggingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const setMeta = () => setDuration(audio.duration);
    const handleEnd = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setMeta);
    audio.addEventListener("ended", handleEnd);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setMeta);
      audio.removeEventListener("ended", handleEnd);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  /* ------------------------ Seek Logic ------------------------ */
  const calculateSeekTime = useCallback(
    (clientX: number) => {
      if (!progressBarRef.current || duration === 0) return 0;
      const rect = progressBarRef.current.getBoundingClientRect();
      const relativeX = Math.min(Math.max(0, clientX - rect.left), rect.width);
      const percent = relativeX / rect.width;
      return percent * duration;
    },
    [duration]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioRef.current) return;

    // Record drag start time and position
    dragStartTimeRef.current = Date.now();
    dragStartPositionRef.current = e.clientX;
    
    isDraggingRef.current = true;
    setIsDragging(true);
    wasPlayingRef.current = !audioRef.current.paused;
    
    // Don't pause during drag - let it continue playing
    // audioRef.current.pause();

    const newTime = calculateSeekTime(e.clientX);
    setCurrentTime(newTime);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const newTime = calculateSeekTime(e.clientX);
      setCurrentTime(newTime);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      
      const dragDuration = Date.now() - dragStartTimeRef.current;
      const dragDistance = Math.abs(e.clientX - dragStartPositionRef.current);
      
      isDraggingRef.current = false;
      setIsDragging(false);
      const newTime = calculateSeekTime(e.clientX);

      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        
        // Since we're not pausing during drag, we don't need to resume
        // The audio should continue playing naturally
      }
    };

    // Add event listeners to document to handle mouse events outside the component
    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [calculateSeekTime]);

  /* ------------------------ Volume Logic ------------------------ */
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  /* ------------------------ Playback ------------------------ */
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  /* ------------------------ Utils ------------------------ */
  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* ------------------------ UI ------------------------ */
  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />

      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlayPause}
        className="p-2 h-8 w-8 flex items-center justify-center"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <span className="text-xs text-gray-600 min-w-[40px]">
        {formatTime(currentTime)}
      </span>

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group"
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className={`absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-opacity duration-150 ${
            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      <span className="text-xs text-gray-600 min-w-[40px]">
        {formatTime(duration)}
      </span>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="p-1 h-6 w-6 flex items-center justify-center"
        >
          {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
        </Button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
