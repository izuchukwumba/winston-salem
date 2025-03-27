import { useEffect, useState } from "react";
import ChatNavBar from "./ChatNavBar";
import ChatMessages from "./ChatMessages";
import { SendHorizontal } from "lucide-react";
import axios from "axios";
import Map from "../map/Map";
const Chat: React.FC = () => {
  const [newPrompt, setNewPrompt] = useState<{
    prompt: string;
    tag: string;
  }>({
    prompt: "",
    tag: "",
  });
  const [messages, setMessages] = useState<
    {
      tag: string;
      content: string;
      query_type: string;
      map_query: string;
    }[]
  >([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    console.log("logging messages", messages);
  }, [messages]);

  const analyzePrompt = async (prompt: string) => {
    const response = await axios.post(
      `${BACKEND_URL}/chat/get-chat-response`,
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    setMessages((prev) => [
      ...prev,
      {
        tag: "response",
        content: response.data.response_content,
        query_type: response.data.query_type,
        map_query: response.data.map_query,
      },
    ]);
  };

  const handleSendMessage = (prompt: string) => {
    console.log(newPrompt);
    setNewPrompt({
      prompt: prompt,
      tag: "question",
    });
    setMessages((prev) => [
      ...prev,
      { tag: "question", content: prompt, query_type: "text", map_query: "" },
    ]);
    analyzePrompt(prompt);
    setNewPrompt({
      prompt: "",
      tag: "",
    });
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col relative">
      {/* background image */}
      <div className="absolute inset-0  flex justify-center items-center pointer-events-none z-0">
        <img
          src="/assets/city_of_winston_salem_logo.jpg"
          alt="city_of_winston_salem"
          className="opacity-30 w-[40%]"
        />
      </div>
      {/* chat navbar */}
      <div>
        <ChatNavBar />
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
      </div>

      {/* chat messages */}
      <div className="z-10000 flex-grow overflow-y-auto mt-3 mb-2">
        <ChatMessages messages={messages} />
      </div>

      {/* chat input */}
      {/* <div className="relative z-50 flex flex-col h-full justify-between"> */}
      <div>
        {/* <div>
          <ChatMessages messages={messages} />
        </div> */}
        {/* <Map apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} /> */}

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
              value={newPrompt.prompt}
              onChange={(e) =>
                setNewPrompt({
                  prompt: e.target.value,
                  tag: "question",
                })
              }
            />
          </div>
          <SendHorizontal
            size={27}
            color="#667085"
            strokeWidth={2.5}
            className="z-10000"
            onClick={(event) => {
              event.stopPropagation();
              handleSendMessage(newPrompt.prompt);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
