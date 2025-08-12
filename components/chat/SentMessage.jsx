import React from 'react'

const SentMessage = ({message}) => {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-blue-500 text-white rounded-lg px-3 py-2 max-w-xs">
        {message}
      </div>
    </div>
  )
}

export default SentMessage