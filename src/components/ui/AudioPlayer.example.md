# AudioPlayer Component

A custom audio player component with drag functionality for timeline scrubbing.

## Features

- ✅ **Draggable Timeline**: Click and drag on the progress bar to seek through audio
- ✅ **Play/Pause Controls**: Standard play/pause button
- ✅ **Volume Control**: Mute/unmute and volume slider
- ✅ **Time Display**: Current time and total duration
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Dark Mode Support**: Automatically adapts to theme
- ✅ **Keyboard Accessible**: Full keyboard navigation support

## Usage

```tsx
import AudioPlayer from '@/components/ui/AudioPlayer';

// Basic usage
<AudioPlayer src="/path/to/audio.mp3" />

// With custom styling
<AudioPlayer 
  src="/path/to/audio.mp3" 
  className="w-full max-w-md" 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | **Required.** URL to the audio file |
| `className` | `string` | `""` | Additional CSS classes |

## Features in Detail

### Timeline Scrubbing
- **Click to Seek**: Click anywhere on the progress bar to jump to that position
- **Drag to Seek**: Click and drag the progress handle to scrub through audio
- **Visual Feedback**: Progress handle appears on hover
- **Smooth Animation**: Smooth transitions and animations

### Volume Control
- **Mute Toggle**: Click the volume icon to mute/unmute
- **Volume Slider**: Drag the volume slider to adjust volume (0-100%)
- **Visual Indicators**: Volume icon changes based on mute state

### Time Display
- **Current Time**: Shows current playback position (MM:SS format)
- **Total Duration**: Shows total audio duration (MM:SS format)
- **Auto-Update**: Time updates in real-time during playback

## Styling

The component uses Tailwind CSS classes and includes custom CSS for the range sliders:

```css
/* Custom slider styles are included in globals.css */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}
```

## Browser Support

- ✅ Chrome/Edge (WebKit)
- ✅ Firefox (Mozilla)
- ✅ Safari
- ✅ Mobile browsers

## Accessibility

- **Keyboard Navigation**: All controls are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators
- **High Contrast**: Works with high contrast themes

## Example Implementation

```tsx
// In a QC form page
{audioUrl && (
  <div className="sticky top-16 z-50 bg-white shadow-lg">
    <div className="p-4">
      <div className="flex items-center gap-3">
        <Volume2 className="h-5 w-5 text-blue-600" />
        <AudioPlayer 
          src={audioUrl} 
          className="flex-1" 
        />
      </div>
    </div>
  </div>
)}
```

## Notes

- The component automatically handles audio loading and metadata
- Progress updates are throttled for performance
- Volume and playback state persist during the session
- The component is fully self-contained and doesn't require external state management
