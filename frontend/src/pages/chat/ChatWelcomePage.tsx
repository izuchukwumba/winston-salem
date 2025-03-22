import ChatNavBar from "./ChatNavBar";
import "./chat_styles.css";
import { useNavigate } from "react-router-dom";

const ChatWelcomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-h-screen flex flex-col ">
      <ChatNavBar />
      <div className="flex-1 flex flex-col items-center mt-5 gap-y-20">
        <div className="font-[inter] text-lg font-bold">Chat with us !!!</div>
        <img
          src="/assets/city_of_winston_salem_logo.jpg"
          alt="city_of_winston_salem"
          width={150}
        />
        <div className="flex gap-y-10 flex-col items-center justify-center border border-gray-400 rounded-xl pt-20 px-5 pb-4 mx-5">
          <div className="chat-welcome-second-text text-center text-lg">
            Welcome! We're here to help you find the resources and support you
            need. Let’s get started.
          </div>
          <div
            className="w-full flex flex-col items-center justify-center bg-black text-white px-4 py-2 rounded-lg"
            onClick={() => navigate("/chat")}
          >
            <div className="font-[heebo] py-1.5">Start Chat</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWelcomePage;
