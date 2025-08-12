
const VoiceMessage = ({duration}) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-2">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gray-400 rounded-full"></div> {/* Play button placeholder */}
        <div className="flex-1 h-4 bg-gray-300 rounded-full relative">
          <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ width: '20%' }}></div>
        </div>
        <span className="text-sm text-gray-600">{duration}</span>
      </div>
    </div>
  )
}

export default VoiceMessage