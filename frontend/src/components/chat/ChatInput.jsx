import React from 'react'

const ChatInput = () => {
  return (
    <div className='h-16 px-4 flex items-center gap-3 border-t border-gray-800 bg-[#0f0f0f]'>
        <input type="text" placeholder='Type a message' className='flex-1 px-4 py-2 rounded-full bg-[#1a1a1a] text-sm outline-none'/>

        <button className='bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm'>Send</button>
    </div>
  )
}

export default ChatInput