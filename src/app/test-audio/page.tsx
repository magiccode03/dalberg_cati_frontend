'use client';

import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import AudioPlayer from '@/components/ui/AudioPlayer';

export default function TestAudioPage() {
  return (
    <Container maxWidth="7xl" className="w-full max-w-9xl mx-auto py-6 px-4">
      <div className="space-y-6">
        {/* Header */}
        <Card className="p-6">
          <Heading level={2} className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Audio Player Test Page
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400">
            Test the AudioPlayer component with sample audio files
          </Text>
        </Card>

        {/* Sample Audio 1 - Short Test Audio */}
        <Card className="p-6">
          <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sample Audio 1 - Short Test (10 seconds)
          </Heading>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <AudioPlayer 
              src="https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3"
              className="w-full"
            />
          </div>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Short audio file for testing basic functionality
          </Text>
        </Card>

        {/* Sample Audio 2 - Longer Audio */}
        <Card className="p-6">
          <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sample Audio 2 - Music Track (2+ minutes)
          </Heading>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <AudioPlayer 
              src="https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3"
              className="w-full"
            />
          </div>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Longer audio file for testing seek and drag functionality
          </Text>
        </Card>

        {/* Sample Audio 3 - MP3 Format */}
        <Card className="p-6">
          <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sample Audio 3 - MP3 Format
          </Heading>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <AudioPlayer 
              src="https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav"
              className="w-full"
            />
          </div>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Testing with different audio format and duration
          </Text>
        </Card>

        {/* Sample Audio 4 - Very Short Test */}
        <Card className="p-6">
          <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sample Audio 4 - Very Short (3 seconds)
          </Heading>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <AudioPlayer 
              src="https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav"
              className="w-full"
            />
          </div>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Very short audio for testing quick interactions
          </Text>
        </Card>

        {/* Test Instructions */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <Heading level={3} className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Test Instructions
          </Heading>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <div>• <strong>Play/Pause:</strong> Click the play button to start/stop audio</div>
            <div>• <strong>Seek:</strong> Click anywhere on the progress bar to jump to that position</div>
            <div>• <strong>Drag:</strong> Click and drag on the progress bar to scrub through audio</div>
            <div>• <strong>Volume:</strong> Use the volume slider to adjust audio level</div>
            <div>• <strong>Mute:</strong> Click the volume icon to mute/unmute</div>
            <div>• <strong>Time Display:</strong> Shows current time and total duration</div>
          </div>
        </Card>

        {/* Known Issues to Test */}
        <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
          <Heading level={3} className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
            Issues to Test
          </Heading>
          <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
            <div>• <strong>Click vs Drag:</strong> Quick clicks should seek and resume playback</div>
            <div>• <strong>Drag Behavior:</strong> Dragging should seek but not auto-resume playback</div>
            <div>• <strong>No Reset:</strong> Audio should not jump back to beginning after seeking</div>
            <div>• <strong>Re-renders:</strong> Check console for excessive re-rendering during drag</div>
            <div>• <strong>Sticky Behavior:</strong> Test if sticky audio player causes issues</div>
          </div>
        </Card>
      </div>
    </Container>
  );
}
