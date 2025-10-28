"use client";
import { Play, Pause, Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const VoiceMessage = ({ message, isUser }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(message.duration || 0);
  const [waveformData, setWaveformData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blobAudioUrl, setBlobAudioUrl] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAudioBlob = async () => {
      if (!message?.audioUrl && !message?.fileUrl) return;

      const audioSource = message.audioUrl || message.fileUrl;

      try {
        const response = await fetch(audioSource, {
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setBlobAudioUrl(blobUrl);
      } catch (error) {
        console.error("Error loading audio blob:", error);
        setBlobAudioUrl(audioSource); // fallback
      }
    };

    fetchAudioBlob();

    return () => {
      if (blobAudioUrl) URL.revokeObjectURL(blobAudioUrl);
    };
  }, [message?.audioUrl, message?.fileUrl]);

  // Generate waveform
  const generateWaveformFromAudio = async (audioUrl) => {
    try {
      setIsLoading(true);
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const rawData = audioBuffer.getChannelData(0);
      const samples = 30;
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

      const maxVal = Math.max(...filteredData);
      const normalizedData = filteredData.map((val) =>
        Math.max((val / maxVal) * 0.9 + 0.1, 0.15)
      );

      setWaveformData(normalizedData);
      setDuration(audioBuffer.duration);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating waveform:", error);
      const fallbackData = Array.from(
        { length: 30 },
        () => Math.random() * 0.7 + 0.2
      );
      setWaveformData(fallbackData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (blobAudioUrl) {
      generateWaveformFromAudio(blobAudioUrl);
    }
  }, [blobAudioUrl]);

  // Audio event handling
  useEffect(() => {
    if (audioRef.current && blobAudioUrl) {
      const audio = audioRef.current;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => {
        if (
          audio.duration &&
          !isNaN(audio.duration) &&
          isFinite(audio.duration)
        ) {
          setDuration(audio.duration);
        }
      };
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("canplay", updateDuration);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("canplay", updateDuration);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
      };
    }
  }, [blobAudioUrl]);

  const togglePlayPause = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const playedBars = Math.floor((progress / 100) * waveformData.length);

  return (
    <div className={`max-w-xs lg:max-w-md ${isUser ? "ml-auto" : ""}`}>
      <div
        className={`rounded-[20px] px-4 py-3 ${
          isUser ? "bg-primary text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <button
              onClick={togglePlayPause}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isUser
                  ? "bg-white/20 hover:bg-white/30 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-gray-700"
              }`}
            >
              {isLoading ? (
                <div
                  className={`w-3 h-3 rounded-full animate-spin border-2 border-transparent ${
                    isUser ? "border-t-white" : "border-t-gray-600"
                  }`}
                ></div>
              ) : isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-0.5 mb-2 h-6">
              {isLoading
                ? Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className={`rounded-full animate-pulse ${
                        isUser ? "bg-white/30" : "bg-gray-400"
                      }`}
                      style={{
                        width: "2px",
                        height: `${Math.random() * 16 + 4}px`,
                      }}
                    />
                  ))
                : waveformData.map((height, i) => {
                    const isPlayed = i < playedBars;
                    return (
                      <div
                        key={i}
                        className={`rounded-full transition-all duration-100 ${
                          isPlayed
                            ? isUser
                              ? "bg-white"
                              : "bg-gray-700"
                            : isUser
                            ? "bg-white/40"
                            : "bg-gray-400"
                        }`}
                        style={{
                          width: "2px",
                          height: `${height * 20}px`,
                        }}
                      />
                    );
                  })}

              {isPlaying && !isLoading && (
                <div
                  className={`absolute w-0.5 h-6 ${
                    isUser ? "bg-white" : "bg-gray-700"
                  } rounded-full transition-all duration-100`}
                  style={{
                    left: `${(playedBars / waveformData.length) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              )}
            </div>

            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                <Mic
                  className={`w-3 h-3 ${
                    isUser ? "text-white/70" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isUser ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  Voice message
                </span>
              </div>

              <span
                className={`text-xs font-medium ${
                  isUser ? "text-white/90" : "text-gray-600"
                }`}
              >
                {isPlaying && !isLoading
                  ? formatTime(currentTime)
                  : formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* ✅ Fixed audio element */}
        {blobAudioUrl && (
          <audio
            ref={audioRef}
            src={blobAudioUrl}
            preload="metadata"
            crossOrigin="anonymous"
          />
        )}
      </div>
    </div>
  );
};

export default VoiceMessage;
