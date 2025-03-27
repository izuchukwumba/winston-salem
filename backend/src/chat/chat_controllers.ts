import { RequestHandler } from "express";
import Groq from "groq-sdk";

interface ChatRequest {
  prompt: string;
}

export const getChatResponse: RequestHandler = async (req, res) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
  console.log(process.env.GROQ_API_KEY);

  console.log(req.body);
  const { prompt } = req.body as ChatRequest;
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant for homeless people. Your job is to analyze the given prompt and determine if the it requires a text response or map direction. If it is text, return 'text'; if it is a map request, return 'map' and the desired search query. if it neither, return 'none'. add a short explanation. respond as json. the key-value pairs should be {response: 'text' or 'map' or 'none', explanation: 'explanation', map_query: 'map query' or 'none'}. the map_query should be the desired search query for the map, and should be empty if the response is not a map.",
        },
        {
          role: "user",
          content: "who is the president of the united states?",
        },
      ],
      model: process.env.GROQ_API_MODEL as string,
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: { type: "json_object" },
    });

    const request_response = chatCompletion.choices[0].message.content;
    const request_json = JSON.parse(request_response as string);
    console.log(request_json);
    const request_type = request_json["response"];
    const request_explanation = request_json["explanation"];

    if (request_type === "text") {
      const text_response = await groq.chat.completions.create({
        messages: [{ role: "user", content: "prompt" }],
        model: process.env.GROQ_API_MODEL as string,
      });
      const text_response_content = text_response.choices[0].message.content;
      res
        .status(200)
        .json({ request_type, request_explanation, text_response_content });
    } else if (request_type === "map") {
      const map_query = request_json["map_query"];
      const map_response = await groq.chat.completions.create({
        messages: [{ role: "user", content: "prompt" }],
        model: process.env.GROQ_API_MODEL as string,
      });
      const map_response_content = map_response.choices[0].message.content;
      res.status(200).json({
        request_type,
        request_explanation,
        map_query,
        map_response_content,
      });
    } else if (request_type === "none") {
      res.status(200).json({ request_type, request_explanation });
    }

    // console.log({ request_type, request_explanation });
    // res.status(200).json({ request_type, request_explanation });
  } catch (error) {
    console.error("Error in getChatResponse:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
