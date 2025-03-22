import { SendHorizontal } from "lucide-react";
import ChatNavBar from "./ChatNavBar";
import ChatMessages from "./ChatMessages";

const Chat: React.FC = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col relative">
      <ChatNavBar />
      <div className="absolute inset-0  flex justify-center items-center pointer-events-none">
        <img
          src="/assets/city_of_winston_salem_logo.jpg"
          alt="city_of_winston_salem"
          // className="w-1/3 absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30 z-1"
          className="opacity-30 w-[40%]"
        />
      </div>
      <div className="relative z-50 flex flex-col h-full justify-between">
        <div className="flex items-center gap-x-2 pl-10 py-5 border-b border-gray-300 z-10000 bg-white">
          <div className="w-12 h-12  relative ">
            <img
              src="/assets/user_sarah.jpg"
              alt="user_icon"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute bottom-1 right-0 w-3 h-3 bg-green-600 rounded-full"></div>
          </div>
          <div className="font-[inter] font-bold">Linda</div>
        </div>
        <div>
          <ChatMessages />
        </div>
        <div
          className="w-full flex justify-center items-center mb-10 border-y border-gray-300 py-6 px-5"
          onClick={() => document.getElementById("messageBox")?.focus()}
        >
          <div className="flex-grow flex items-center h-full w-full">
            <textarea
              id="messageBox"
              placeholder="Write a message"
              className=" outline-none resize-none leading-tight max-h-[500px]  overflow-hidden placeholder:font-[inter] placeholder:text-gray-400 placeholder:text-md"
              rows={1}
            />
          </div>
          <SendHorizontal
            size={27}
            color="#667085"
            strokeWidth={2.5}
            className="z-10000"
            onClick={(event) => {
              event.stopPropagation();
              console.log("clicked");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
