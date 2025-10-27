'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, MoreVertical, Download } from 'lucide-react';
import apiClient from '@/lib/api-client';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';
import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';

interface AudioData {
  ac_name: string;
  ps_code: string;
  server_id: number;
  interview_date: string;
  device_id: string;
  interviewer_id: string;
  audio1_status_label: string;
  status_label: string;
  audio1: string;
}

interface AudioPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  audioFileName?: string;
}

const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  isOpen,
  onClose,
  serverId,
  audioFileName
}) => {
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [useIframe, setUseIframe] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch audio data when modal opens
  useEffect(() => {
    if (isOpen && serverId) {
      fetchAudioData();
    }
  }, [isOpen, serverId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAudioData(null);
      setError(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setShowDropdown(false);
      setAudioError(false);
      setUseIframe(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  const fetchAudioData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching audio data for server_id:', serverId, 'audioFileName:', audioFileName);
      
      // Use the actual audio file name from the interview data, or fallback to 'audio1'
      const imageParam = audioFileName && audioFileName.trim() !== '' ? audioFileName : 'audio1';
      
      const response = await apiClient.get(`/overview/interview-log/audio-data?server_id=${serverId}&image=${imageParam}`);
      console.log('📊 Audio Data API Response:', response);
      
      if (response.data.success && response.data.data) {
        setAudioData(response.data.data);
      } else {
        setError('Failed to load audio data');
      }
    } catch (err: any) {
      console.error('❌ Error fetching audio data:', err);
      setError(`Failed to load audio data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (audioData) {
      const audioUrl = audioData.audio1 && audioData.audio1.trim() !== '' 
        ? `https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=${audioData.audio1}`
        : `https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=audio1`;
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `interview_${audioData.server_id}_${audioData.audio1 || 'audio1'}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setShowDropdown(false);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAudioError = () => {
    console.error('Audio playback failed, switching to iframe mode');
    setAudioError(true);
    setUseIframe(true);
  };

  const handleIframeError = () => {
    console.error('Iframe audio playback also failed');
    setAudioError(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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
                  Interview Audio Player
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
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <Text className="ml-2" color="secondary">Loading audio data...</Text>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center py-8 bg-red-50 rounded-lg mb-4">
          <div className="text-red-500 mb-2">⚠️</div>
          <Text color="error" weight="medium" className="mb-2">Error Loading Audio</Text>
          <Text color="error" size="sm" align="center" className="mb-4">{error}</Text>
                  <Button
            onClick={fetchAudioData}
                    variant="outline"
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
                  </Button>
        </div>
      )}

      {audioData && !loading && (
        <>
                  {/* Interview Details */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Server ID</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{audioData.server_id}</p>
              </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Interview Date</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {new Date(audioData.interview_date).toLocaleDateString()}
                        </p>
              </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">AC Name</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{audioData.ac_name}</p>
              </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">PS Code</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{audioData.ps_code}</p>
              </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Device ID</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 font-mono text-xs">{audioData.device_id}</p>
              </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Interviewer ID</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{audioData.interviewer_id || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{audioData.status_label || 'Available'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Audio Player */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6">
                    <div className="mb-3 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {useIframe ? 'Using alternative player' : 'Click play to start the audio'}
                      </p>
                      {audioError && !useIframe && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Audio player had an issue. Try the alternative options below.
                        </p>
                      )}
                    </div>

                    {!useIframe ? (
                      audioData.audio1 && audioData.audio1.trim() !== '' ? (
                  <audio
                    ref={audioRef}
                          controls
                          className="w-full"
                          controlsList="nodownload"
                          preload="metadata"
                          onError={handleAudioError}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                          onLoadStart={() => console.log('Audio loading started')}
                          onCanPlay={() => console.log('Audio can play')}
                  >
                      <source src={`https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=${audioData.audio1}`} type="audio/mpeg" />
                          <source src={`https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=${audioData.audio1}`} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No audio file available for this interview.
                        </div>
                      )
                    ) : (
                      audioData.audio1 && audioData.audio1.trim() !== '' ? (
                        <div className="w-full">
                          <iframe
                            src={`https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=${audioData.audio1}`}
                            className="w-full h-16 border-0 rounded"
                            title="Audio Player"
                            allow="autoplay"
                            onError={handleIframeError}
                            onLoad={() => {
                              // Check if iframe content is just text (not audio player)
                              setTimeout(() => {
                                try {
                                  const iframe = document.querySelector('iframe[title="Audio Player"]') as HTMLIFrameElement;
                                  if (iframe && iframe.contentDocument) {
                                    const bodyText = iframe.contentDocument.body?.textContent?.trim();
                                    if (bodyText && bodyText.includes('recording for v2 is working fine')) {
                                      console.warn('Iframe returned text instead of audio player');
                                      setAudioError(true);
                                    }
                                  }
                                } catch (e) {
                                  // Cross-origin restrictions, can't access iframe content
                                  console.log('Cannot access iframe content due to CORS');
                                }
                              }, 1000);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No audio file available for this interview.
                        </div>
                      )
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
                              The audio URL is not serving playable content. The server returned: "recording for v2 is working fine."
                            </p>
                          </div>
                      </div>
                      </div>
                    )}
                    
                    {/* Alternative Options */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
                      {!useIframe && audioError && (
                        <Button
                          onClick={() => setUseIframe(true)}
                          variant="outline"
                          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Try Alternative Player
                        </Button>
                      )}
                      <a
                        href={audioData.audio1 && audioData.audio1.trim() !== '' 
                          ? `https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=${audioData.audio1}`
                          : `https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=audio1`
                        }
                        download
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                        style={{ display: audioData.audio1 && audioData.audio1.trim() !== '' ? 'inline' : 'none' }}
                      >
                        Download audio
                      </a>
                    </div>
                  </div>
                </>
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

export default AudioPlayerModal;
