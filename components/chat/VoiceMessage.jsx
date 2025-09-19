"use client";
import { Play, Pause, Mic, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const VoiceMessage = ({ message, isUser, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(message.duration || 0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

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

  const formatTime = (seconds) => {
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
                <div className={`h-1 rounded-full ${
                  isUser ? 'bg-blue-200' : 'bg-gray-300'
                }`}>
                  <div
                    className={`h-1 rounded-full transition-all duration-100 ${
                      isUser ? 'bg-white' : 'bg-gray-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
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