import { useWorkspaceStore } from "@/store/workspace/workspaceStore";
import {
  formatMessageDate,
  formatPhoneNumber,
  getInitials,
  shouldShowTimestamp,
} from "@/utils/utils";
import { Mic, Paperclip, Plus, Smile } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ButtonWithTooltip, { Dropdown } from "./ButtonWithTooltip";
import { ArrowDown } from "@/app/assets/svgs/icons";
import DeleteChat from "./DeleteChat";
import FileAttachmentDropdown from "./FileAttachmentDropdown";
import FilePreview from "./FilePreview";
import FileMessage from "../chat/FileMessage";
import VoiceMessage from "../chat/VoiceMessage";
import EmojiPickerComponent from "./EmojiPicker";
import VoiceRecorder from "./VoiceRecorder";

const ConversationBox = ({ onStartConversation, setIsProfileOpen }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAiDraft, setIsAiDraft] = useState(false);
  const [isAttachmentDropdownOpen, setIsAttachmentDropdownOpen] =
    useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [isRecordingConfirmed, setIsRecordingConfirmed] = useState(false);

  const {
    activeConversationId,
    getActiveConversation,
    sendMessage,
    setPendingMessageToInput,
    setDraftMessage,
    addFileUpload,
    getFileUploads,
    removeFileUpload,
    retryFileUpload,
    clearFileUploads,
    startVoiceRecording,
    stopVoiceRecording,
    updateVoiceDuration,
    clearVoiceMessage,
    getVoiceMessageState,
    setVoiceRecordingStream,
    setVoiceWaveformData,
  } = useWorkspaceStore();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const activeConversation = getActiveConversation();
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const handleAIInitialMessage = () => {
    if (!activeConversationId) return;

    const aiMessage = setPendingMessageToInput(activeConversationId);
    setMessage(aiMessage);
    setIsAiDraft(true);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  const handleMoveChat = () => {
    // Toggle dropdown visibility
    setDropdownOpen((prevState) => !prevState);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!activeConversationId) return;

    const fileUploads = getFileUploads(activeConversationId);

    // Check if we have content to send
    const hasText = message.trim();
    const hasFiles = fileUploads.some((upload) => upload.status === "success");
    const hasVoice = recordedAudioBlob && isRecordingConfirmed;

    if (!hasText && !hasFiles && !hasVoice) return;

    // Send text message if there's text
    if (hasText) {
      sendMessage(
        activeConversationId,
        message.trim(),
        isAiDraft ? "ai" : "manual"
      );
    }

    // Send file messages for each successful upload
    if (hasFiles) {
      fileUploads.forEach((upload) => {
        if (upload.status === "success") {
          sendMessage(
            activeConversationId,
            message.trim() || "", // Include text if any
            "manual",
            {
              name: upload.name,
              size: upload.size,
              type: upload.type,
              url: upload.url,
            }
          );
        }
      });
    }

    // Send voice message if available
    if (hasVoice) {
      const audioUrl = URL.createObjectURL(recordedAudioBlob);
      const voiceState = getVoiceMessageState(activeConversationId);
      sendMessage(
        activeConversationId,
        message.trim() || "", // Include text if any
        "manual",
        null,
        {
          url: audioUrl,
          duration: recordingDuration,
          waveformData: voiceState?.waveformData || null,
        }
      );
    }

    // Clear everything after sending
    setMessage("");
    setIsAiDraft(false);
    setDraftMessage(activeConversationId, "");
    clearFileUploads(activeConversationId);
    setRecordedAudioBlob(null);
    setRecordingDuration(0);
    setIsRecordingConfirmed(false);
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    setIsAiDraft(false);
    if (activeConversationId) {
      setDraftMessage(activeConversationId, newMessage);
    }
  };

  // File attachment handlers
  const handleFileSelect = (file) => {
    if (activeConversationId) {
      addFileUpload(activeConversationId, file);
    }
  };

  const handlePhotoSelect = (file) => {
    if (activeConversationId) {
      addFileUpload(activeConversationId, file);
    }
  };

  const handleRemoveFile = (uploadId) => {
    if (activeConversationId) {
      removeFileUpload(activeConversationId, uploadId);
    }
  };

  const handleRetryFile = (uploadId) => {
    if (activeConversationId) {
      retryFileUpload(activeConversationId, uploadId);
    }
  };

  // Emoji selection handler
  const handleEmojiSelect = (emoji) => {
    const newMessage = message + emoji;
    setMessage(newMessage);
    setIsAiDraft(false);
    if (activeConversationId) {
      setDraftMessage(activeConversationId, newMessage);
    }
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm; codecs=opus') 
          ? 'audio/webm; codecs=opus' 
          : 'audio/webm'
      });
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
        setRecordedAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100); // Collect data every 100ms for real-time feedback
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingDuration(0);

      // Store the stream for real-time visualization
      if (activeConversationId) {
        setVoiceRecordingStream(activeConversationId, stream);
        startVoiceRecording(activeConversationId);
      }

      // Start duration counter
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
        if (activeConversationId) {
          updateVoiceDuration(activeConversationId, prev + 1);
        }
      }, 1000);

    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      setRecordedAudioBlob(null);
      setIsRecordingConfirmed(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const confirmRecording = () => {
    // Just confirm the recording is ready - don't send yet
    // The user will click the send button to actually send the message
    setIsRecordingConfirmed(true);
    
    // Generate waveform data for the recorded audio
    if (recordedAudioBlob && activeConversationId) {
      generateWaveformData(recordedAudioBlob, activeConversationId);
    }
  };

  // Generate waveform data from audio blob
  const generateWaveformData = async (audioBlob, conversationId) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const rawData = audioBuffer.getChannelData(0);
      const samples = 30; // Number of bars for message display
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
        Math.max((val / maxVal) * 0.9 + 0.1, 0.15)
      );

      setVoiceWaveformData(conversationId, normalizedData);
    } catch (error) {
      console.error('Error generating waveform data:', error);
    }
  };

  const deleteRecording = () => {
    setRecordedAudioBlob(null);
    setRecordingDuration(0);
    setIsRecordingConfirmed(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isLastUserMessage = (currentMsg, messages) => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === "user") {
        return messages[i].id === currentMsg.id;
      }
    }
    return false;
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  useEffect(() => {
    if (activeConversation) {
      setMessage(activeConversation.draftMessage || "");
    } else {
      setMessage("");
    }
  }, [activeConversationId, activeConversation?.draftMessage]);

  // Show empty state when no active conversation
  if (!activeConversation) {
    return (
      <div className="flex-1 w-full grid place-items-center bg-white rounded-2xl shadow-sm">
        <div>
          <Image
            src="/svgs/empty.svg"
            width={234}
            height={228}
            alt="No conversations"
          />
          <h5 className="text-gray-900 text-base font-medium text-center mt-5">
            No conversations yet
          </h5>
          <p className="text-gray-400 text-sm text-center mt-1">
            Start a new chat to begin messaging.
          </p>
          <button
            onClick={onStartConversation}
            className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-primary bg-white text-primary text-xs font-medium w-[210px] h-[34px] mx-auto hover:bg-blue-50 transition-colors"
          >
            <Plus className="size-[10px] text-primary" />
            Start Your First Conversation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center relative">
            <span className="text-white font-medium text-sm">
              {getInitials(activeConversation.name)}
            </span>
            <div
              className={`absolute -bottom-[1px] -right-[1px] size-3 rounded-full border-[1.5px] border-white group cursor-pointer ${
                activeConversation.deviceType === "andriod"
                  ? "bg-green-600"
                  : activeConversation.deviceType === "apple"
                  ? "bg-[#3F83F8]"
                  : "bg-gray-300"
              }`}
            >
              <span className="absolute top-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 bg-gray-800 text-white text-sm p-4 rounded-sm z-20 transition-all duration-300 ease-in-out text-nowrap">
                {activeConversation.deviceType === "andriod"
                  ? "use SMS"
                  : activeConversation.deviceType === "apple"
                  ? "use iMessage"
                  : "Unknown"}
                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <ArrowDown />
                </span>
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-base text-gray-900">
              {activeConversation.name}
            </h3>
            <p className="text-xs font-medium text-gray-500">
              {formatPhoneNumber(activeConversation?.phoneNumber)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <ButtonWithTooltip
            iconSrc="/svgs/phone.svg"
            tooltipText="Make a call"
          />
          <ButtonWithTooltip
            iconSrc="/svgs/folder-arrow-right.svg"
            tooltipText="Move chat"
            onClick={handleMoveChat}
          >
            <Dropdown isOpen={isDropdownOpen} onClose={handleCloseDropdown} />
          </ButtonWithTooltip> */}
          <ButtonWithTooltip
            iconSrc="/svgs/profile.svg"
            tooltipText="Open Profile"
            onClick={() => setIsProfileOpen(true)}
          />
          <DeleteChat />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scroll-0 p-6">
        {activeConversation.messages.length === 0 ? (
          <div className="flex flex-col justify-center h-full">
            <p className="text-center text-base text-gray-500">
              No messages yet
            </p>
            {!message && (
              <div>
                <p className="text-center text-sm text-gray-500 mt-1">
                  Want to start with an AI-generated intro?
                </p>
                <button
                  onClick={handleAIInitialMessage}
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-primary bg-white text-primary text-xs font-medium w-[150px] h-[34px] mx-auto hover:bg-blue-50 transition-colors"
                >
                  <Image
                    src="/svgs/ai-icon.svg"
                    width={12}
                    height={14}
                    alt="icon"
                  />
                  AI Initial Message
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {activeConversation.messages.map((msg, index) => {
              const showTimestamp = shouldShowTimestamp(
                msg,
                index,
                activeConversation.messages
              );
              return (
                <div key={msg.id}>
                  {showTimestamp && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-gray-400">
                        {formatMessageDate(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "user" && (
                      <div className="flex flex-col items-end">
                        {/* File Message */}
                        {msg.type === "file" ? (
                          <FileMessage message={msg} isUser={true} />
                        ) : msg.type === "voice" ? (
                          <VoiceMessage message={msg} isUser={true} />
                        ) : (
                          /* Text Message */
                          <div className="max-w-xs lg:max-w-md px-6 py-5 rounded-[20px] bg-primary text-white">
                            <p className="text-sm">{msg.content}</p>
                            {msg.origin === "ai" && (
                              <span className="mt-2 text-xs text-[#C3DDFD] flex items-center gap-[6px]">
                                <Image
                                  src="/svgs/ai-icon-white.svg"
                                  width={12}
                                  height={14}
                                  alt="icon"
                                />
                                Generated with AI
                              </span>
                            )}
                          </div>
                        )}

                        {isLastUserMessage(
                          msg,
                          activeConversation.messages
                        ) && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-400">
                              {msg.status === "read" ? "Read" : "Delivered"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {msg.sender !== "user" && (
                      <div className="flex gap-2">
                        <div className="size-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {getInitials(activeConversation.name)}
                          </span>
                        </div>
                        <div>
                          <h6 className="text-xs font-medium mb-1">
                            {activeConversation?.name}
                          </h6>

                          {/* File Message */}
                          {msg.type === "file" ? (
                            <FileMessage message={msg} isUser={false} />
                          ) : msg.type === "voice" ? (
                            <VoiceMessage message={msg} isUser={false} />
                          ) : (
                            /* Text Message */
                            <p className="max-w-xs lg:max-w-md px-6 py-5 rounded-[20px] bg-gray-100 text-gray-900 text-sm">
                              {msg.content}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="px-6 py-5">
        <form
          onSubmit={handleSendMessage}
          className="flex flex-col gap-1 border border-gray-100 rounded-2xl"
        >
          {/* File Previews */}
          {activeConversationId &&
            getFileUploads(activeConversationId).length > 0 && (
              <div className="px-5 pt-4 space-y-2">
                {getFileUploads(activeConversationId).map((upload) => (
                  <FilePreview
                    key={upload.id}
                    upload={upload}
                    onRemove={handleRemoveFile}
                    onRetry={handleRetryFile}
                  />
                ))}
              </div>
            )}

          {/* Voice Recorder */}
          {(isRecording || recordedAudioBlob) && (
            <div className="px-5 pt-4">
              <VoiceRecorder
                isRecording={isRecording}
                duration={recordingDuration}
                audioBlob={recordedAudioBlob}
                isConfirmed={isRecordingConfirmed}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                onCancelRecording={cancelRecording}
                onConfirmRecording={confirmRecording}
                onDeleteRecording={deleteRecording}
              />
            </div>
          )}

          <div className="flex-1 relative">
            <textarea
              rows={1}
              name="message"
              id="message"
              value={message}
              onChange={handleMessageChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={`Write a ${
                activeConversation.messages.length === 0 ? "message" : "reply"
              } ...`}
              className="scroll-0 w-full border-transparent focus:outline-none text-sm text-gray-900 placeholder:text-gray-400 py-6 px-5 resize-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-between px-5 pb-4 relative">
            <div className="flex items-center gap-4">
              {/* File Attachment Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIsAttachmentDropdownOpen(!isAttachmentDropdownOpen)
                  }
                  className={`transition-colors ${
                    isAttachmentDropdownOpen ? "text-primary" : "text-gray-600"
                  }`}
                >
                  <Paperclip className="size-4 text-gray-400 hover:text-primary" />
                </button>
                <FileAttachmentDropdown
                  isOpen={isAttachmentDropdownOpen}
                  onClose={() => setIsAttachmentDropdownOpen(false)}
                  onFileSelect={handleFileSelect}
                  onPhotoSelect={handlePhotoSelect}
                />
              </div>

              {/* Emoji Picker Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className={`transition-colors ${
                    isEmojiPickerOpen ? "text-primary" : "text-gray-600"
                  }`}
                >
                  <Smile className="size-4 text-gray-400 hover:text-primary" />
                </button>
                <EmojiPickerComponent
                  isOpen={isEmojiPickerOpen}
                  onClose={() => setIsEmojiPickerOpen(false)}
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>

              {/* Voice Recording Button */}
              <button
                type="button"
                onClick={startRecording}
                disabled={isRecording}
                className={`p-1 rounded transition-colors ${
                  isRecording ? "text-red-500 cursor-not-allowed" : "text-gray-400 hover:text-primary"
                }`}
                title={isRecording ? "Recording in progress..." : "Record voice message"}
              >
                <Mic className={`size-4 ${isRecording ? "animate-pulse" : ""}`} />
              </button>
            </div>

            <button
              type="submit"
              disabled={
                !message.trim() &&
                (!activeConversationId ||
                  getFileUploads(activeConversationId).length === 0) &&
                !(recordedAudioBlob && isRecordingConfirmed)
              }
              className="disabled:cursor-not-allowed transition-colors"
            >
              <Image src="/svgs/send.svg" width={16} height={16} alt="icon" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConversationBox;
