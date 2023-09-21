import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next'
import cache from 'memory-cache';
import rateLimit from 'express-rate-limit';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const CACHE_TIME = 30; // cache time in seconds
const CACHE_KEY_PREFIX = 'replacement-'; // prefix for cache key

type Error = {
  error: { message: string[]}
} | undefined

// create a rate limiter with a maximum of 5 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 5 requests per windowMs
  keyGenerator: function (req, res) {
    return req.socket.remoteAddress || "unknown";
  },
});

async function requestReplacementFunction(
  req: NextApiRequest,
  res: NextApiResponse<any | Error>
) {
      
   // ``````````````````````````````````````````````````````````````````````````````
    const itineraryItem = req.body.itineraryItem || '';
    const tripPreferences = req.body.tripPreferences || '';
    const specificSitesToExclude = tripPreferences.specificSitesToExclude || '';
    const activityType = itineraryItem.activityType || '';
    const neighborhoodsToExplore = tripPreferences.neighborhoodsToExplore || '';
    const destination = tripPreferences.destination || '';

    const introPrompt1 = 
    `Provide another ${activityType} for a travel itinerary in ${neighborhoodsToExplore}, ${destination}. Please provide suggestion in JSON format and nothing else. 
    [{    "activityTitle": "${itineraryItem.activityTitle}",
          "description": "${itineraryItem.description}",
          "locationAddress": "${itineraryItem.locationAddress}",
          "activityType": "${itineraryItem.activityType}"
    }]`

    const endPrompt1 = specificSitesToExclude.length > 0 ? `please exclude from suggestion ${specificSitesToExclude}`: "";

    const generatePrompt = () => {
      return introPrompt1 + endPrompt1;
    }

    const prompt = generatePrompt();


    ////////////////////////////////////////////////////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    try {
     const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "user", content: prompt }
            ],
        temperature: 0.7,
        max_tokens: 2048,

    });
      let answer = []
      if(completion.data?.choices[0]?.message?.content){
        try {
          answer = JSON.parse(completion.data.choices[0].message?.content)
        } catch (error) {
          answer = [completion.data.choices[0].message?.content]
        }
      }
      const initialResponse = answer;
      const initialResponseString = JSON.stringify(initialResponse) ?? "";
    
      res.status(200).json({ replacement: answer });

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
    limiter(req as any, res as any, () => {
      handler(req, res);
    });
  };
}


export default withLimiter(requestReplacementFunction)