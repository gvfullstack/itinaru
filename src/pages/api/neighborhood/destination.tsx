import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next'
import cache from 'memory-cache';
import rateLimit from 'express-rate-limit';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const CACHE_TIME = 30; // cache time in seconds
const CACHE_KEY_PREFIX = 'destination-'; // prefix for cache key

type ResponseData = {
  neighborhood: string
}

type Error = {
  error: { message: string[]}
} | undefined

// create a rate limiter with a maximum of 5 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5 // limit each IP to 5 requests per windowMs
});

export async function requestNeighborhoodsFunction(
  req: NextApiRequest,
  res: NextApiResponse<any | Error>
) {
  // apply the rate limiter middleware to this route
  limiter(req, res, async () => {
    const destination = req.body.destination || '';
    if (destination.trim().length === 0) {
      res.status(400).json({
        error: {
          message: "Please enter a destination",
        }
      });
      return;
    }

    const inScopeThemes = req.body.inScopeThemes || '';
    const inScopeAgeRanges = req.body.inScopeAgeRanges || '';

    const prompt = `
    Provide a list of 5 ${destination} neighborhoods in JSON format, with ${inScopeThemes} points of interest that cater to ${inScopeAgeRanges}. In addition, provide a coordinate that is at about the center of all points.
    
    Example JSON format:
    [
      {
        "neighborhood": "Fisherman's Wharf",
        "loc": [{ "lat": 37.80834, "lng": -122.417874 }],
        "desc": "Fisherman's Wharf is a popular tourist destination known for its seafood, shopping, and views of the Golden Gate Bridge. Families can enjoy attractions like the Aquarium of the Bay and the San Francisco Dungeon."
      },
      ...,
      {
        "center": [
            {
                "lat": 37.8608,
                "lng": -122.4861
            }
        ] }
    ]
    `;



    // check if the response is already cached
    const cacheKey = CACHE_KEY_PREFIX + destination;
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      res.status(200).json(cachedResponse);
      return;
    }

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
        } catch (error) {
          answer = [completion.data.choices[0].message?.content]
        }
      }

      // cache the response
      cache.put(cacheKey, { neighborhoods: answer }, CACHE_TIME * 1000);

      res.status(200).json({ neighborhoods: answer });
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
  });
}


