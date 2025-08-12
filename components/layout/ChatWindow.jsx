import FileMessage from "../chat/FileMessage"
import RecievedMessage from "../chat/RecievedMessage"
import SentMessage from "../chat/SentMessage"
import VoiceMessage from "../chat/VoiceMessage"

const ChatWindow = ({ showProfile }) => {
  return (
    <div className={`flex-1 flex flex-col ${!showProfile ? 'w-full' : ''}`}>
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-200 mr-3"></div>
          <div>
            <h3 className="font-semibold">Robert Casas</h3>
            <span className="text-sm text-gray-500">+1 914 834 2354</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-6 h-6 bg-blue-100 rounded-full"></div>
          <div className="w-6 h-6 bg-blue-100 rounded-full"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#F9FAFB]">
        <RecievedMessage message="Sounds good!" time="14:23" />
        <SentMessage message="Of course. Does 12 PM work for you?" />
        <RecievedMessage message="Thanks. I'm browsing a bit. Could you tell me how it works?" time="" />
        <SentMessage message="Of course. We offer flexible options. Just share what you're thinking and we'll shape it from there." />
        <FileMessage fileName="Product Catalog.pdf" />
        <VoiceMessage duration="3:42" />
      </div>
      <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center">
        <input type="text" placeholder="Write a reply..." className="flex-1 bg-gray-100 rounded-full px-4 py-2" />
        <div className="ml-2 w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="ml-2 w-8 h-8 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  )
}

export default ChatWindow