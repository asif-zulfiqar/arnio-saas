"use client";
import { Play, Pause, Mic, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const VoiceMessage = ({ message, isUser, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(message.duration || 0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && message.audioUrl) {
      const audio = audioRef.current;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          setDuration(audio.duration);
        }
      };
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('canplay', updateDuration);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      
      // Set initial duration from message if available
      if (message.duration && message.duration > 0) {
        setDuration(message.duration);
      }
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('canplay', updateDuration);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [message.audioUrl, message.duration]);

  const togglePlayPause = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`max-w-xs lg:max-w-md ${isUser ? 'ml-auto' : ''}`}>
      <div className={`rounded-[20px] p-4 ${
        isUser 
          ? 'bg-primary text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        
        {/* Voice Message Content */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Mic className={`w-5 h-5 ${
              isUser ? 'text-blue-100' : 'text-gray-600'
            }`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={togglePlayPause}
                className={`p-1 rounded-full transition-colors ${
                  isUser 
                    ? 'hover:bg-blue-600 text-white' 
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              
              <div className="flex-1">
                {/* Waveform visualization */}
                <div className="flex items-center gap-1 h-4">
                  {Array.from({ length: 20 }, (_, i) => {
                    const barHeight = Math.random() * 0.6 + 0.4; // Random height between 0.4 and 1.0
                    const isPlayed = (i / 20) * 100 <= progress;
                    return (
                      <div
                        key={i}
                        className={`rounded-full transition-all duration-100 ${
                          isPlayed 
                            ? (isUser ? 'bg-white' : 'bg-gray-600')
                            : (isUser ? 'bg-blue-200' : 'bg-gray-300')
                        }`}
                        style={{
                          width: '2px',
                          height: `${barHeight * 16}px`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              
              <span className={`text-xs ${
                isUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <p className={`text-xs ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}>
              Voice message
            </p>
          </div>

          {/* Delete button for user's own messages */}
          {isUser && onDelete && (
            <button
              onClick={onDelete}
              className="p-1 hover:bg-blue-600 rounded transition-colors text-blue-100"
              title="Delete voice message"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hidden audio element */}
        {message.audioUrl && (
          <audio
            ref={audioRef}
            src={message.audioUrl}
            preload="metadata"
          />
        )}
      </div>
    </div>
  );
};

export default VoiceMessage;