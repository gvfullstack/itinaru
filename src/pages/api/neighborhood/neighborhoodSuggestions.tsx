import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next'
import cache from 'memory-cache';
import rateLimit from 'express-rate-limit';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// const CACHE_TIME = 30; // cache time in seconds
// const CACHE_KEY_PREFIX = 'destination-'; // prefix for cache key

type ResponseData = {
  neighborhood: string
}

type Error = {
  error: { message: string[]}
} | undefined

// create a rate limiter with a maximum of 5 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  keyGenerator: function (req, res) {
    return req.socket.remoteAddress;
  },
});

async function requestItineraryFunction(
  req: NextApiRequest,
  res: NextApiResponse<any | Error>
) {
    const destination = req.body.destination || '';
    if (destination.trim().length === 0) {
      res.status(400).json({
        error: {
          message: "Please enter a destination",
        }
      });
      return;
    }
    
  
    // check if the response is already cached
    // const cacheKey = CACHE_KEY_PREFIX + destination;
    // const cachedResponse = cache.get(cacheKey);
    // if (cachedResponse) {
    //   res.status(200).json(cachedResponse);
    //   return;
    // }
    
    ////////////////////////////////////////////////////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    const validate = (data: any) => {
      return [];
    }
    
    const introPrompt = `Provide neighborhoods in JSON format that might be able to cater to someone traveling to ${destination} and has the following preferences:`
    const itinPreferences = req.body.itinPreferences || ''
    const endPrompt = `The JSON formatted response should include a rating, title, and description.  The rating can be either "Top Match" or "Good Match" depending on compatibility. Response JSON Format is:[{rating: "Top Match", title: ..., description: This is a great option for you because..., location: {latitude: ..., longitude: ...}}]`
    const generatePrompt = () => {
      if (!destination || destination === '') return '';
      return introPrompt + itinPreferences + endPrompt;
    }
    
    ////////////////////////////////////////////////////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const prompt = generatePrompt();
  console.log("PROMPT AT API", prompt)


    try {
     const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
              { role: "user", content: prompt },
            ],
        temperature: 0.7,
        max_tokens: 2048,

    });

      let answer = []
      if(completion.data?.choices[0]?.message?.content){
        try {
          answer = JSON.parse(completion.data.choices[0].message?.content)
          console.log("ANSWER", answer)
        } catch (error) {
          answer = [completion.data.choices[0].message?.content]
        }
      }

      // cache the response
      // cache.put(cacheKey, { neighborhoodSuggestions: answer }, CACHE_TIME * 1000);

      res.status(200).json({ neighborhoodSuggestions: answer });
    } catch(error: unknown) {
      // Consider adjusting the error handling logic for your use case
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json(error);
      } else {
        console.error(`Error with OpenAI API request: ${error}`);
        res.status(500).json({
          error: {
            message: ['An error occurred during your request.'],
          }
        });
      }
    }
}


function withLimiter(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    limiter(req, res, () => {
      handler(req, res);
    });
  };
}


export default withLimiter(requestItineraryFunction)