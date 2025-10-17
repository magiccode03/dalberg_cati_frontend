'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, MoreVertical, Download } from 'lucide-react';
import apiClient from '@/lib/api-client';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';
import Heading from '@/components/ui/Heading';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interview Details"
      size="lg"
    >
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
          <button
            onClick={fetchAudioData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Retry
          </button>
        </div>
      )}

      {audioData && !loading && (
        <>
          {/* Interview Details Table */}
          <div className="mb-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded">
                <Text weight="medium" color="secondary">AC Name</Text>
                <Text color="primary">{audioData.ac_name}</Text>
              </div>
              <div className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded">
                <Text weight="medium" color="secondary">PS Code</Text>
                <Text color="primary">{audioData.ps_code}</Text>
              </div>
              <div className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded">
                <Text weight="medium" color="secondary">Server Id</Text>
                <Text color="primary">{audioData.server_id}</Text>
              </div>
              <div className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded">
                <Text weight="medium" color="secondary">Interview Date</Text>
                <Text color="primary">
                  {new Date(audioData.interview_date).toLocaleDateString()}
                </Text>
              </div>
              <div className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded">
                <Text weight="medium" color="secondary">Device Id</Text>
                <Text color="primary" fontFamily="mono" size="xs">{audioData.device_id}</Text>
              </div>
              <div className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded">
                <Text weight="medium" color="secondary">Interviewer Id</Text>
                <Text color="primary">{audioData.interviewer_id || '-'}</Text>
              </div>
              <div className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded">
                <Text weight="medium" color="secondary">Status</Text>
                <Text color="primary">{audioData.status_label || 'Available'}</Text>
              </div>
            </div>
          </div>

          {/* Audio Player Section */}
          <div className="border-t border-gray-200 pt-6">
            <Heading level={4} size="lg" weight="medium" className="mb-4">Listen Audio:</Heading>
                  
                  {/* Audio Element */}
                  <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  >
                    {audioData.audio1 && audioData.audio1.trim() !== '' ? (
                      <source src={`https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=${audioData.audio1}`} type="audio/mpeg" />
                    ) : (
                      <source src={`https://convergentview.co.in/image/showimage?formid=49&instanceid=${audioData.server_id}&image=audio1`} type="audio/mpeg" />
                    )}
                    Your browser does not support the audio element.
                  </audio>

                  {/* Audio Player Controls */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      {/* Play/Pause Button */}
                      <button
                        onClick={togglePlayPause}
                        className="flex-shrink-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </button>

                      {/* Time Display */}
                      <div className="flex-shrink-0 text-sm text-gray-600 font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>

                      {/* Progress Bar */}
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={toggleMute}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Volume2 className={`w-5 h-5 ${isMuted ? 'text-red-500' : ''}`} />
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>

                      {/* More Options */}
                      <div className="relative flex-shrink-0" ref={dropdownRef}>
                        <button 
                          onClick={toggleDropdown}
                          className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {showDropdown && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={handleDownload}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Download className="w-4 h-4 mr-3" />
                                Download Audio
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
          </div>
        </>
      )}

      {/* Custom CSS for slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Modal>
  );
};

export default AudioPlayerModal;
