import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next'

// Add the following lines to create a new Configuration object and initialize the OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Define the ResponseData and Error types
type ResponseData = {
    neighborhood: string
}

type Error = {
    error: { message: string; }
}

// Define the API endpoint
export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData[] | Error>
) {
  // Check if the OpenAI API key is configured
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
    // Make the API call to OpenAI using the initialized openai object
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(city),
      temperature: 0.6,
    });

    // Return the response with the neighborhoods
    let resp: ResponseData = { neighborhood: completion.data?.choices[0]?.text ? completion.data.choices[0].text : '' }
    res.status(200).json(resp);
  } catch (error) {
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

// Define the generatePrompt function
function generatePrompt(city: string) {
  return `please provide 5 popular neighborhood names in the city of ${city}`;
}