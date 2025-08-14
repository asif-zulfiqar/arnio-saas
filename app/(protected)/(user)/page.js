import ConversationBox from "@/components/conversations/ConversationBox"
import Image from "next/image"

    
    const Conversations = () => {
      return (
        <div className="flex gap-4 h-full">
          <div className="max-w-xs w-full bg-white shadow-sm rounded-2xl">
            <div className="pt-5 pb-6 px-6 flex items-center justify-between">
              <h5 className="text-gray-900 text-xl font-semibold">Conversations</h5>
              <button className="cursor-pointer">
                <Image src="/svgs/add-button.svg" width={28} height={28} alt="add button" />
              </button>
            </div>
          </div>

          {/* Conversations box */}
          <ConversationBox />
        </div>
      )
    }
    
    export default Conversations