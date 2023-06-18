import { OpenAIStream, OpenAIStreamPayload } from "@/utils/openAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

export default async function POST(req: Request): Promise<Response> {
  const { prompt, functions } = (await req.json()) as {
    prompt?: string;
  };

  console.log("prompt at GPT Request",prompt)
  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }
  const functionsString = JSON.stringify(functions);

  let response1:string | undefined = "";

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo-0613",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1
  };

    const stream = await OpenAIStream(payload);
    return new Response(stream);

  

}