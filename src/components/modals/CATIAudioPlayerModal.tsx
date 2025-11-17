'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Volume2 } from 'lucide-react';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';
import DateFormatter from '@/components/ui/DateFormatter';

interface CustomField {
  label: string;
  value: string | number | null | undefined;
  className?: string; // Optional custom styling for value
}

interface CustomLabels {
  serverId?: string;
  interviewDate?: string;
  acCode?: string;
  acName?: string;
  [key: string]: string | undefined; // Allow any custom label
}

interface CATIAudioPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioUrl: string; // Direct audio URL for CATI
  customFields?: CustomField[]; // Custom fields to display
  customLabels?: CustomLabels; // Custom labels for default fields
  title?: string; // Optional custom modal title
}

const CATIAudioPlayerModal: React.FC<CATIAudioPlayerModalProps> = ({
  isOpen,
  onClose,
  audioUrl,
  customFields = [],
  customLabels = {},
  title = 'Interview Audio Player'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [useIframe, setUseIframe] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setAudioProgress(0);
      setVolume(1);
      setIsMuted(false);
      setAudioError(false);
      setUseIframe(false);
      // Pause audio element
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch((error) => {
          console.log('Auto-play prevented by browser:', error);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    const progress = (audio.currentTime / audio.duration) * 100;
    setCurrentTime(audio.currentTime);
    setAudioProgress(progress || 0);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    setDuration(audio.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const seekTime = (parseFloat(e.target.value) / 100) * audio.duration;
    audio.currentTime = seekTime;
    setAudioProgress(parseFloat(e.target.value));
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    audio.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isMuted) {
        audio.volume = volume;
        setIsMuted(false);
      } else {
        audio.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `interview_audio_${Date.now()}.mp3`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAudioError = () => {
    console.error('Audio playback failed');
    setAudioError(true);
  };

  const handleIframeError = () => {
    console.error('Iframe audio playback failed');
    setAudioError(true);
  };

  const handleTryAlternativePlayer = () => {
    setUseIframe(true);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Volume2 className="h-6 w-6 text-blue-600" />
                <Heading level={3} className="text-lg font-semibold">
                  {title}
                </Heading>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Interview Details */}
              {customFields.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    {customFields.map((field, index) => (
                      <div key={`custom-${index}`}>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{field.label}</p>
                        <p className={`font-semibold text-gray-900 dark:text-gray-100 ${field.className || ''}`}>
                          {field.value !== null && field.value !== undefined ? (
                            typeof field.value === 'string' && field.value.match(/^\d{4}-\d{2}-\d{2}/) ? (
                              <DateFormatter date={field.value} format="dd/mm/yyyy" />
                            ) : (
                              String(field.value)
                            )
                          ) : (
                            '-'
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Player */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6">
                {audioError && !useIframe && (
                  <div className="mb-2 text-center">
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Audio player had an issue. Try the alternative options below.
                    </p>
                  </div>
                )}

                {!useIframe ? (
                  <audio
                    ref={audioRef}
                    controls
                    className="w-full h-12"
                    controlsList="nodownload"
                    preload="metadata"
                    onError={handleAudioError}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  >
                    <source src={audioUrl} type="audio/mpeg" />
                    <source src={audioUrl} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <div className="w-full">
                    <iframe
                      src={audioUrl}
                      className="w-full h-16 border-0 rounded"
                      title="Audio Player"
                      allow="autoplay"
                      onError={handleIframeError}
                    />
                  </div>
                )}

                {/* Error Message for Failed Audio */}
                {audioError && (
                  <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mt-4">
                    <div className="text-center">
                      <div className="text-red-600 dark:text-red-400 mb-2">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-semibold">Audio Playback Failed</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          The audio URL is not serving playable content.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Alternative Options */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
                  {!useIframe && audioError && (
                    <Button
                      onClick={handleTryAlternativePlayer}
                      variant="outline"
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Try Alternative Player
                    </Button>
                  )}
                  {audioUrl && (
                    <a
                      href={audioUrl}
                      download
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                    >
                      Download audio
                    </a>
                  )}
                </div>
              </div>

              {!audioUrl && (
                <div className="text-center py-4 text-gray-500">
                  No audio file available.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={onClose}
                variant="outline"
                className="px-4 py-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CATIAudioPlayerModal;

