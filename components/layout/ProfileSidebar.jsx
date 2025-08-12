import React from 'react'

const ProfileSidebar = () => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="w-10 h-10 rounded-full bg-purple-200"></div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold">Robert Casas</h3>
          <span className="text-sm text-gray-500">+1 914 834 2354</span>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div> {/* Close icon */}
      </div>
      <div className="px-4 py-3 border-t border-gray-200">
        <span className="text-sm text-gray-500">Sent From</span>
        <span className="block text-sm">+1 786 561 7760</span>
      </div>
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between">
          <span>Notes</span>
          <span className="text-blue-500">▼</span>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between">
          <span>Files</span>
          <span className="text-blue-500">▼</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileSidebar