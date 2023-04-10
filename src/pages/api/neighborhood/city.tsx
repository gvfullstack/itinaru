import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type ResponseData = {
    neighborhood: string
  }

type Error = {
    error: { message: string;}
}

export default async function (
    req: NextApiRequest,
    res: NextApiResponse<ResponseData[] | Error>) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const city = req.body.city || '';
  if (city.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a city",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(city),
      temperature: 0.6,
      max_tokens: 2048
    });

    let responseArray = []
    if(completion.data?.choices[0]?.text){
     responseArray = JSON.parse(completion.data?.choices[0]?.text).map((neighborhoodName: string) => {
        return {neighborhood: neighborhoodName}
    })
}

    res.status(200).json(responseArray);
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

const generatePrompt = (city: string) =>{
  return `please provide 5 popular neighborhood names in the city of ${city} in a json array`;
}