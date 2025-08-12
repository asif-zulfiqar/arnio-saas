import React from 'react'
import ConversationItem from './ConversationItem'

const Conversations = () => {
  return (
    <section className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-4 py-3">
        <h2 className="font-bold text-lg">Conversations</h2>
      </div>
      <div className="px-4 pb-2">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <span className="text-gray-500">All Messages</span>
          <span className="ml-auto text-blue-500">▼</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ConversationItem avatarColor="bg-blue-200" name="Robert Casas" time="14:23" message="" isTyping={true} />
        <ConversationItem avatarColor="bg-yellow-200" name="Leslie Livingston" time="18:05" message="Yes, we can do this" isOnline={true} />
        <ConversationItem avatarColor="bg-pink-200" name="Nelly Sims" time="10:02" message="" isVoice={true} />
        <ConversationItem avatarColor="bg-purple-200" name="Michael Gough" time="07:45" message="Nvm, I'll grab all in maxi..." />
        <ConversationItem avatarColor="bg-green-200" name="Bonnie Green" time="3h" message="" isPhoto={true} isOnline={true} />
        <ConversationItem avatarColor="bg-red-200" name="Lana Byrd" time="5h" message="Awesome, let's go!" />
      </div>
    </section>
  )
}

export default Conversations