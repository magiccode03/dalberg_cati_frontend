"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Button from './Button';

interface AudioPlayerProps {
  src: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, className = "" }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Update current time as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  // Global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, duration]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && audioRef.current && duration > 0) {
      // Find the progress bar element
      const progressBar = document.querySelector('.audio-progress-bar') as HTMLElement;
      if (progressBar) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percentage * duration;
        
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlayPause}
        className="p-2 h-8 w-8 flex items-center justify-center"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      {/* Time Display */}
      <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[40px]">
        {formatTime(currentTime)}
      </span>

      {/* Progress Bar */}
      <div
        className="audio-progress-bar flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group"
        onMouseDown={handleMouseDown}
      >
        {/* Progress Fill */}
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-100"
          style={{ width: `${progressPercentage}%` }}
        />
        
        {/* Progress Handle */}
        <div
          className={`absolute top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-opacity duration-200 ${
            isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{ left: `${progressPercentage}%` }}
        />
      </div>

      {/* Duration */}
      <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[40px]">
        {formatTime(duration)}
      </span>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="p-1 h-6 w-6 flex items-center justify-center"
        >
          {isMuted ? (
            <VolumeX className="h-3 w-3" />
          ) : (
            <Volume2 className="h-3 w-3" />
          )}
        </Button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
