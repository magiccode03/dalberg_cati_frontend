'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Play, Pause, Volume2 } from 'lucide-react';
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
  
  // Multi-audio state management
  const [activeAudioTab, setActiveAudioTab] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState<Record<string, number>>({});
  const [duration, setDuration] = useState<Record<string, number>>({});
  const [audioProgress, setAudioProgress] = useState<Record<string, number>>({});
  const [volume, setVolume] = useState<Record<string, number>>({});
  const [isMuted, setIsMuted] = useState<Record<string, boolean>>({});
  const [audioError, setAudioError] = useState<Record<string, boolean>>({});
  const [useIframe, setUseIframe] = useState<Record<string, boolean>>({});
  
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // Get all audio URLs from audio1 (comma-separated string)
  const audioUrls = useMemo(() => {
    if (!audioData?.audio1) return [];
    
    // Split comma-separated audio files
    const audioFiles = audioData.audio1.split(',').map((file: string) => file.trim()).filter((file: string) => file);
    if (audioFiles.length === 0) return [];
    
    return audioFiles.map((audioFile: string, index: number) => ({
      id: `audio-${index}`,
      fileName: audioFile,
      url: `https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=${audioFile}`,
      label: `Audio ${index + 1}`
    }));
  }, [audioData?.audio1, audioData?.server_id]);

  // Get current active audio URL
  const currentAudioUrl = useMemo(() => {
    return audioUrls.find((audio: { id: string; url: string }) => audio.id === activeAudioTab)?.url || null;
  }, [audioUrls, activeAudioTab]);

  // Set default active tab when audio URLs are loaded
  useEffect(() => {
    if (audioUrls.length > 0 && !activeAudioTab) {
      const firstAudioId = audioUrls[0].id;
      setActiveAudioTab(firstAudioId);
    }
  }, [audioUrls, activeAudioTab]);

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
      setActiveAudioTab('');
      setIsPlaying({});
      setCurrentTime({});
      setDuration({});
      setAudioProgress({});
      setVolume({});
      setIsMuted({});
      setAudioError({});
      setUseIframe({});
      // Pause all audio elements
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      audioRefs.current = {};
    }
  }, [isOpen]);

  const fetchAudioData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching audio data for server_id:', serverId, 'audioFileName:', audioFileName);
      
      // If audioFileName is comma-separated (multiple files), extract the first one for the API call
      // The API response will contain the full audio1 string with all files
      let imageParam = 'audio1'; // Default fallback
      if (audioFileName && audioFileName.trim() !== '') {
        // If it contains comma, split and take first file
        const firstAudioFile = audioFileName.includes(',') 
          ? audioFileName.split(',')[0].trim() 
          : audioFileName.trim();
        imageParam = firstAudioFile || 'audio1';
      }
      
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

  // Handle tab change and auto-play audio
  const handleTabChange = (audioId: string) => {
    // Pause currently playing audio if any
    if (activeAudioTab && activeAudioTab !== audioId) {
      const currentAudio = audioRefs.current[activeAudioTab];
      if (currentAudio) {
        currentAudio.pause();
        setIsPlaying(prev => ({ ...prev, [activeAudioTab]: false }));
      }
    }
    
    setActiveAudioTab(audioId);
    
    // Auto-play audio when tab is clicked
    setTimeout(() => {
      const audio = audioRefs.current[audioId];
      if (audio) {
        audio.play().catch((error) => {
          console.log('Auto-play prevented by browser:', error);
        });
      }
    }, 100);
  };

  const togglePlayPause = (audioId: string = activeAudioTab) => {
    const audio = audioRefs.current[audioId];
    if (audio) {
      if (isPlaying[audioId]) {
        audio.pause();
        setIsPlaying(prev => ({ ...prev, [audioId]: false }));
      } else {
        audio.play();
        setIsPlaying(prev => ({ ...prev, [audioId]: true }));
      }
    }
  };

  const handleTimeUpdate = (audioId: string, e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    const progress = (audio.currentTime / audio.duration) * 100;
    setCurrentTime(prev => ({ ...prev, [audioId]: audio.currentTime }));
    setAudioProgress(prev => ({ ...prev, [audioId]: progress || 0 }));
  };

  const handleLoadedMetadata = (audioId: string, e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    setDuration(prev => ({ ...prev, [audioId]: audio.duration }));
  };

  const handleSeek = (audioId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRefs.current[audioId];
    if (!audio) return;
    const seekTime = (parseFloat(e.target.value) / 100) * audio.duration;
    audio.currentTime = seekTime;
    setAudioProgress(prev => ({ ...prev, [audioId]: parseFloat(e.target.value) }));
    setCurrentTime(prev => ({ ...prev, [audioId]: seekTime }));
  };

  const handleVolumeChange = (audioId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRefs.current[audioId];
    if (!audio) return;
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(prev => ({ ...prev, [audioId]: newVolume }));
    audio.volume = newVolume;
    setIsMuted(prev => ({ ...prev, [audioId]: newVolume === 0 }));
  };

  const toggleMute = (audioId: string = activeAudioTab) => {
    const audio = audioRefs.current[audioId];
    if (audio) {
      const currentMuted = isMuted[audioId] || false;
      const currentVolume = volume[audioId] !== undefined ? volume[audioId] : 1;
      if (currentMuted) {
        audio.volume = currentVolume;
        setIsMuted(prev => ({ ...prev, [audioId]: false }));
      } else {
        audio.volume = 0;
        setIsMuted(prev => ({ ...prev, [audioId]: true }));
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = (audioId?: string) => {
    if (!audioData) return;
    
    const selectedAudio = audioId 
      ? audioUrls.find(a => a.id === audioId)
      : audioUrls.find(a => a.id === activeAudioTab);
    
    if (selectedAudio) {
      const link = document.createElement('a');
      link.href = selectedAudio.url;
      link.download = `interview_${audioData.server_id}_${selectedAudio.fileName}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleAudioError = (audioId: string) => {
    console.error('Audio playback failed for:', audioId);
    setAudioError(prev => ({ ...prev, [audioId]: true }));
  };

  const handleIframeError = (audioId: string) => {
    console.error('Iframe audio playback failed for:', audioId);
    setAudioError(prev => ({ ...prev, [audioId]: true }));
  };

  const handleTryAlternativePlayer = (audioId: string) => {
    setUseIframe(prev => ({ ...prev, [audioId]: true }));
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
                    {/* Audio Tabs - Only show when there are multiple audio files */}
                    {audioUrls.length > 1 && (
                      <div className="mb-3 sm:mb-4">
                        <div className="flex overflow-x-auto scrollbar-hide -mx-2 sm:mx-0">
                          <div className="flex space-x-1 sm:space-x-2 px-2 sm:px-0 min-w-full sm:min-w-0">
                            {audioUrls.map((audio: { id: string; label: string }) => {
                              const isActive = audio.id === activeAudioTab;
                              return (
                                <button
                                  key={audio.id}
                                  onClick={() => handleTabChange(audio.id)}
                                  className={`
                                    flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-all duration-200
                                    ${isActive 
                                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 shadow-sm' 
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }
                                  `}
                                >
                                  {audio.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Audio Player Content */}
                    <div className="flex-1 min-w-0">
                      {currentAudioUrl && (
                        <>
                          <div className="mb-2 text-center">
                            {audioError[activeAudioTab] && !useIframe[activeAudioTab] && (
                              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Audio player had an issue. Try the alternative options below.
                              </p>
                            )}
                          </div>

                          {!useIframe[activeAudioTab] ? (
                            <audio
                              key={activeAudioTab}
                              ref={(el) => {
                                if (el) {
                                  audioRefs.current[activeAudioTab] = el;
                                } else {
                                  delete audioRefs.current[activeAudioTab];
                                }
                              }}
                              controls
                              className="w-full h-12"
                              controlsList="nodownload"
                              preload="metadata"
                              onError={() => handleAudioError(activeAudioTab)}
                              onTimeUpdate={(e) => handleTimeUpdate(activeAudioTab, e)}
                              onLoadedMetadata={(e) => handleLoadedMetadata(activeAudioTab, e)}
                              onPlay={() => setIsPlaying(prev => ({ ...prev, [activeAudioTab]: true }))}
                              onPause={() => setIsPlaying(prev => ({ ...prev, [activeAudioTab]: false }))}
                              onEnded={() => setIsPlaying(prev => ({ ...prev, [activeAudioTab]: false }))}
                              onLoadStart={() => console.log('Audio loading started:', activeAudioTab)}
                              onCanPlay={() => console.log('Audio can play:', activeAudioTab)}
                            >
                              <source src={currentAudioUrl} type="audio/mpeg" />
                              <source src={currentAudioUrl} type="audio/mp3" />
                              Your browser does not support the audio element.
                            </audio>
                          ) : (
                            <div className="w-full">
                              <iframe
                                key={activeAudioTab}
                                src={currentAudioUrl}
                                className="w-full h-16 border-0 rounded"
                                title={`Audio Player - ${audioUrls.find((a: { id: string; label: string }) => a.id === activeAudioTab)?.label}`}
                                allow="autoplay"
                                onError={() => handleIframeError(activeAudioTab)}
                                onLoad={() => {
                                  setTimeout(() => {
                                    try {
                                      const iframe = document.querySelector(`iframe[title*="Audio Player"]`) as HTMLIFrameElement;
                                      if (iframe && iframe.contentDocument) {
                                        const bodyText = iframe.contentDocument.body?.textContent?.trim();
                                        if (bodyText && bodyText.includes('recording for v2 is working fine')) {
                                          console.warn('Iframe returned text instead of audio player');
                                          setAudioError(prev => ({ ...prev, [activeAudioTab]: true }));
                                        }
                                      }
                                    } catch (e) {
                                      console.log('Cannot access iframe content due to CORS');
                                    }
                                  }, 1000);
                                }}
                              />
                            </div>
                          )}

                          {/* Error Message for Failed Audio */}
                          {audioError[activeAudioTab] && (
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
                            {!useIframe[activeAudioTab] && audioError[activeAudioTab] && (
                              <Button
                                onClick={() => handleTryAlternativePlayer(activeAudioTab)}
                                variant="outline"
                                className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                              >
                                Try Alternative Player
                              </Button>
                            )}
                            <a
                              href={currentAudioUrl || ''}
                              download
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                              style={{ display: currentAudioUrl ? 'inline' : 'none' }}
                            >
                              Download audio
                            </a>
                          </div>
                        </>
                      )}

                      {!currentAudioUrl && audioUrls.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No audio file available for this interview.
                        </div>
                      )}
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
