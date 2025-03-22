import { Ellipsis, Minus } from "lucide-react";
import "./chat_styles.css";
const ChatNavBar: React.FC = () => {
  return (
    <div className="flex justify-between items-center border-b border-gray-300 pt-2 pb-4 px-3 bg-white z-10000">
      <Ellipsis size={36} strokeWidth={2} />
      <div className="font-[inter] font-bold flex flex-row items-center justify-between">
        Neighborhood Services
      </div>
      <Minus size={32} strokeWidth={1.5} />
    </div>
  );
};

export default ChatNavBar;
