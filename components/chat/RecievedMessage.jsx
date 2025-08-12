import React from 'react'

const RecievedMessage = ({message, time}) => {
  return (
    <div className="flex items-end mb-2">
      <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 max-w-xs">
        {message}
      </div>
      <span className="text-xs text-gray-500 ml-2">{time}</span>
    </div>
  )
}

export default RecievedMessage