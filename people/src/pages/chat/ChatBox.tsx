import { useEffect, useState } from "react";
import ChatNavBar from "./ChatNavBar";
import ChatMessages from "./ChatMessages";
import { SendHorizontal } from "lucide-react";
import axios from "axios";

const Chat: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      isLoading: boolean;
    }[]
  >([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    console.log("logging messages", messages);
  }, [messages]);

  const analyzePrompt = async (prompt: string) => {
    // setIsLoading(true);
    const response = await axios.post(
      `${BACKEND_URL}/chat/get-chat-response`,
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setMessages((prev) => [
      ...prev,
      {
        tag: "response",
        content: response.data.response_content,
        query_type: response.data.query_type,
        map_query: response.data.map_query,
        isLoading: false,
      },
    ]);
    // setIsLoading(false);
  };

  const handleSendMessage = async (prompt: string) => {
    console.log(newPrompt);
    try {
      setIsLoading(true);
      setNewPrompt({
        prompt: prompt,
        tag: "question",
      });
      setMessages((prev) => [
        ...prev,
        {
          tag: "question",
          content: prompt,
          query_type: "text",
          map_query: "",
          isLoading: false,
        },
      ]);
      await analyzePrompt(prompt);
      setNewPrompt({
        prompt: "",
        tag: "",
      });
      // setIsLoading(false);
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between relative overflow-hidden">
      {/* Loading screen */}
      {/* {isLoading && (
        <div className="fixed left-0 top-0 w-screen h-screen bg-red-500">
          <div className="text-gray-500 text-md">Loading...</div>
        </div>
      )} */}

      {/* background image */}
      <div className="absolute inset-0  flex justify-center items-center pointer-events-none z-0">
        <img
          src="/assets/city_of_winston_salem_logo.jpg"
          alt="city_of_winston_salem"
          className="opacity-30 w-[40%]"
        />
      </div>
      {/* chat navbar */}
      <div className="fixed top-0 left-0 right-0 z-10000 flex-shrink-0">
        <ChatNavBar />
        <div className="flex items-center gap-x-2 pl-10 py-5 border-b border-gray-300 z-10000 bg-white">
          <div className="w-12 h-12 relative">
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
      <div className="flex flex-col justify-end flex-grow z-10 overflow-y-auto mt-40 mb-20">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </div>

      {/* chat input */}
      <div className="bg-white z-1000 fixed bottom-0 left-0 right-0 flex-shrink-0">
        <div
          className="w-full flex justify-between items-center border-y border-gray-300 py-6 px-5"
          onClick={() => document.getElementById("messageBox")?.focus()}
        >
          {/* <div className=""> */}
          <textarea
            id="messageBox"
            placeholder="Write a message"
            className="textarea outline-none resize-none leading-tight  placeholder:font-[inter] placeholder:text-gray-400 placeholder:text-md"
            rows={1}
            value={newPrompt.prompt}
            onChange={(e) =>
              setNewPrompt({
                prompt: e.target.value,
                tag: "question",
              })
            }
          ></textarea>
          {/* </div> */}
          <SendHorizontal
            size={27}
            color="#667085"
            strokeWidth={2.5}
            className="z-1000"
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

//
