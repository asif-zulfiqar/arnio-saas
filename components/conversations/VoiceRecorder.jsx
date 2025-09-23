"use client";
import { useState, useRef, useEffect } from "react";
import { Check, X, Play, Pause, Trash2 } from "lucide-react";

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
  const [audioDuration, setAudioDuration] = useState(0);
  const [waveformData, setWaveformData] = useState([]);
  const [recordingWaveform, setRecordingWaveform] = useState([]);
  
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Format time helper
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Real-time waveform visualization for recording
  const updateRecordingWaveform = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Process audio data into waveform bars
    const bars = 25;
    const barWidth = Math.floor(dataArrayRef.current.length / bars);
    const newWaveform = [];

    for (let i = 0; i < bars; i++) {
      let sum = 0;
      for (let j = 0; j < barWidth; j++) {
        sum += dataArrayRef.current[i * barWidth + j];
      }
      const average = sum / barWidth;
      // Normalize to 0-1 range and apply some smoothing
      const normalized = Math.min(average / 128, 1);
      const height = Math.max(normalized * 0.8 + 0.1, 0.1);
      newWaveform.push(height);
    }

    setRecordingWaveform(newWaveform);
    
    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(updateRecordingWaveform);
    }
  };

  // Initialize audio context for real-time visualization
  const initializeAudioContext = async (stream) => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      updateRecordingWaveform();
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  };

  // Generate waveform from audio blob for playback
  const generateWaveformFromAudio = async (audioBlob) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const rawData = audioBuffer.getChannelData(0);
      const samples = 25; // Number of bars
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];

      for (let i = 0; i < samples; i++) {
        const blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }

      // Normalize the waveform data
      const maxVal = Math.max(...filteredData);
      const normalizedData = filteredData.map(val => 
        Math.max((val / maxVal) * 0.8 + 0.1, 0.1)
      );

      setWaveformData(normalizedData);
    } catch (error) {
      console.error('Error generating waveform:', error);
      // Fallback to simple waveform
      setWaveformData(Array.from({ length: 25 }, () => Math.random() * 0.6 + 0.2));
    }
  };

  // Handle audio playback
  const togglePlayback = async () => {
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

  // Handle audio time updates
  useEffect(() => {
    if (audioRef.current && audioBlob) {
      const audio = audioRef.current;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => {
        setAudioDuration(audio.duration);
      };
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [audioBlob]);

  // Generate waveform when audio blob is available
  useEffect(() => {
    if (audioBlob) {
      generateWaveformFromAudio(audioBlob);
    }
  }, [audioBlob]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Recording state - show real-time waveform animation
  if (isRecording) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-xl border border-red-200">
        {/* Recording indicator */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center relative">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            {/* Pulse rings */}
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Real-time waveform */}
        <div className="flex-1 flex items-center justify-center gap-1 h-8">
          {recordingWaveform.length > 0 ? (
            recordingWaveform.map((height, i) => (
              <div
                key={i}
                className="bg-red-400 rounded-full transition-all duration-100 ease-out"
                style={{
                  width: '3px',
                  height: `${height * 24 + 4}px`,
                }}
              />
            ))
          ) : (
            // Fallback bars while initializing
            Array.from({ length: 25 }, (_, i) => (
              <div
                key={i}
                className="bg-red-300 rounded-full animate-pulse"
                style={{
                  width: '3px',
                  height: `${Math.random() * 20 + 6}px`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))
          )}
        </div>

        {/* Duration */}
        <div className="text-sm font-medium text-red-700">
          {formatTime(duration)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onStopRecording}
            className="p-2 hover:bg-red-200 rounded-full transition-colors"
            title="Stop recording"
          >
            <Check className="w-4 h-4 text-red-600" />
          </button>
          <button
            onClick={onCancelRecording}
            className="p-2 hover:bg-red-200 rounded-full transition-colors"
            title="Cancel recording"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    );
  }

  // Review state - show recorded audio with playback controls
  if (audioBlob) {
    const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;
    const playedBars = Math.floor((progress / 100) * waveformData.length);

    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
        {/* Play/Pause button */}
        <div className="flex-shrink-0">
          <button
            onClick={togglePlayback}
            className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Waveform visualization with progress */}
        <div className="flex-1 flex items-center justify-center gap-1 h-8 relative">
          {waveformData.map((height, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-200 relative"
              style={{
                width: '3px',
                height: `${height * 24 + 4}px`,
                backgroundColor: i < playedBars ? '#3B82F6' : '#E5E7EB'
              }}
            >
              {/* Current position indicator */}
              {i === playedBars && isPlaying && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-sm animate-pulse"></div>
              )}
            </div>
          ))}
        </div>

        {/* Time display */}
        <div className="text-sm font-medium text-blue-700 min-w-[4rem] text-right">
          {isPlaying ? formatTime(currentTime) : formatTime(audioDuration || duration)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {!isConfirmed ? (
            <>
              <button
                onClick={onConfirmRecording}
                className="p-2 hover:bg-blue-200 rounded-full transition-colors"
                title="Confirm recording"
              >
                <Check className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={onDeleteRecording}
                className="p-2 hover:bg-blue-200 rounded-full transition-colors"
                title="Delete recording"
              >
                <Trash2 className="w-4 h-4 text-blue-600" />
              </button>
            </>
          ) : (
            <div className="text-xs text-green-600 font-medium px-2 py-1 bg-green-100 rounded-full">
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