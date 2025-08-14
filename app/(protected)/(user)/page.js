import { Plus } from "lucide-react"
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
          <div className="flex-1 w-full grid place-items-center">
            <div>
              <Image
                src="/svgs/empty.svg"
                width={234}
                height={228}
                alt="No conversations"
              />
              <h5 className="text-gray-900 text-base font-medium text-center mt-5">No conversations yet</h5>
              <p className="text-gray-400 text-sm text-center mt-1">
                Start a new chat to begin messaging.
              </p>
              <button className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-primary bg-white text-primary text-xs font-medium w-[210px] h-[34px] mx-auto">
                <Plus className="size-[10px] text-primary" />
                Start Your First Conversation
              </button>
            </div>
          </div>
        </div>
      )
    }
    
    export default Conversations