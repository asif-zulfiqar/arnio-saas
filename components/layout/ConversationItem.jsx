import React from 'react'

const ConversationItem = ({avatarColor, name, time, message, isOnline = false, isTyping = false, isVoice = false, isPhoto = false}) => {
  return (
    <div className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
      <div className={`relative w-10 h-10 rounded-full ${avatarColor}`}>
        {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between">
          <span className="font-semibold">{name}</span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <div className="text-sm text-gray-600 truncate">
          {isTyping ? "Typing..." : isVoice ? "Voice Message" : isPhoto ? "Photo" : message}
        </div>
      </div>
    </div>
  )
}

export default ConversationItem