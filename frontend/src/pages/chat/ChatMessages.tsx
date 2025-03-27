import { useState } from "react";
import "./chat_styles.css";
import Map from "../map/Map";

const Questions: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="flex flex-col gap-y-1 items-end mr-4">
      <div className="text-white text-lg font-[inter] bg-gray-800 rounded-lg py-2 px-4">
        {content}
      </div>
      <div className="text-gray-500 text-xs mr-1">
        {new Date().toLocaleString()}
      </div>
    </div>
  );
};
const Answers: React.FC<{ content: string }> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isTooLong = content.length > 200;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // remove the thinking part of the response
  let i = 0;
  let j = 7; // length of "</think>", because thinking is part of the reponse format
  while (j < content.length) {
    if (content.slice(i, j + 1) === "</think>") {
      content = content.slice(j + 1);
      break;
    }
    i++;
    j++;
  }

  const responseFormat = (response: string) => {
    //Markup the response
    response = response.replace(
      /\*\*(.*?)\*\*/g,
      "<span class='font-bold '>$1</span>"
    );
    // Convert to lines
    const lines = response.split("\n");
    return lines.map((line, index) => (
      <div key={index} className="mb-2">
        <span dangerouslySetInnerHTML={{ __html: line }} />
      </div>
    ));
  };

  const formattedResponse = responseFormat(content); //entire content
  const truncatedResponse = responseFormat(content.slice(0, 200)); //first 100 characters

  return (
    <div className="flex flex-col gap-y-2 items-start ml-4 mr-10 mt-4">
      <div className="text-md bg-gray-50 border border-gray-400 rounded-2xl py-2 px-4">
        {isExpanded ? formattedResponse : truncatedResponse}
        {isTooLong && (
          <span>
            <button onClick={toggleExpansion} className="text-blue-500">
              {isExpanded ? "Read less" : "Read more"}
            </button>
          </span>
        )}
      </div>
      <div className="text-gray-500 text-xs ml-1">
        {new Date().toLocaleString()}
      </div>
    </div>
  );
};

const ChatMessages: React.FC<{
  messages: {
    tag: string;
    content: string;
    query_type: string;
    map_query: string;
  }[];
}> = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => {
        if (message.tag === "question") {
          return <Questions content={message.content} key={index} />;
        } else if (message.query_type === "map") {
          return (
            <div className="mb-5">
              <div className="text-black italic text-md ml-5 mt-2 mb-2">
                Searching for &quot;{message.map_query}&quot;...
              </div>
              <div className="overflow-hidden flex flex-col relative">
                <div className="flex-grow flex justify-center items-center">
                  <div className="w-[90%] h-[50%] ">
                    <Map
                      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                      searchQuery={message.map_query}
                    />
                  </div>
                </div>
              </div>
              <div className="text-black italic text-md ml-5 mt-2 mb-2">
                <a
                  href={`https://www.google.com/maps/search/${message.map_query}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          );
        } else {
          return <Answers content={message.content} key={index} />;
        }
      })}
    </div>
  );
};

export default ChatMessages;
