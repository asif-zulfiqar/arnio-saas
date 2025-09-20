"use client";
import { useState, useRef, useEffect } from "react";
import { Check, X, Play, Pause } from "lucide-react";

const VoiceRecorder = ({ 
  isRecording, 
  duration, 
  audioBlob, 
  isConfirmed,
  onStartRecording, 
  onStopRecording, 
  onCancelRecording, 
  onConfirmRecording,
  onDeleteRecording 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate waveform data for visualization
  const generateWaveform = (duration) => {
    const bars = 20; // Number of bars in waveform
    const waveform = [];
    for (let i = 0; i < bars; i++) {
      // Simulate different heights for visual effect
      const height = Math.random() * 0.8 + 0.2; // Random height between 0.2 and 1.0
      waveform.push(height);
    }
    return waveform;
  };

  const waveform = generateWaveform(duration);

  // Handle audio playback
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle audio time updates
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioBlob]);

  // Recording state - show waveform animation
  if (isRecording) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
        {/* Recording indicator */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Waveform animation */}
        <div className="flex-1 flex items-center gap-1">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="bg-gray-400 rounded-full animate-pulse"
              style={{
                width: '3px',
                height: `${Math.random() * 20 + 8}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>

        {/* Duration */}
        <div className="text-sm font-medium text-gray-700">
          {formatTime(duration)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStopRecording}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Stop recording"
          >
            <Check className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onCancelRecording}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Cancel recording"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    );
  }

  // Review state - show recorded audio with playback controls
  if (audioBlob) {
    const progress = audioRef.current ? (currentTime / audioRef.current.duration) * 100 : 0;
    const playedBars = Math.floor((progress / 100) * waveform.length);

    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
        {/* Play/Pause button */}
        <div className="flex-shrink-0">
          <button
            onClick={togglePlayback}
            className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-gray-700" />
            ) : (
              <Play className="w-4 h-4 text-gray-700 ml-0.5" />
            )}
          </button>
        </div>

        {/* Waveform visualization */}
        <div className="flex-1 flex items-center gap-1">
          {waveform.map((height, i) => (
            <div
              key={i}
              className="rounded-full relative"
              style={{
                width: '3px',
                height: `${height * 20}px`,
                backgroundColor: i < playedBars ? '#374151' : '#D1D5DB'
              }}
            >
              {/* Blue dot for current position */}
              {i === playedBars && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Duration */}
        <div className="text-sm font-medium text-gray-700">
          {formatTime(duration)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {!isConfirmed ? (
            <>
              <button
                onClick={onConfirmRecording}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Confirm recording"
              >
                <Check className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={onDeleteRecording}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Delete recording"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </>
          ) : (
            <div className="text-xs text-green-600 font-medium">
              Ready to send
            </div>
          )}
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={audioBlob ? URL.createObjectURL(audioBlob) : null}
          preload="metadata"
        />
      </div>
    );
  }

  return null;
};

export default VoiceRecorder;
