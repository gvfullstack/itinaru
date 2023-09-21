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

type Error = {
  error: { message: string[]}
} | undefined

// create a rate limiter with a maximum of 5 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 5 requests per windowMs
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
    const cacheKey = CACHE_KEY_PREFIX + destination;
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      res.status(200).json(cachedResponse);
      return;
    }
    ////////////////////////////////////////////////////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    const validate = (data: any) => {
      return [];
    }

    // ``````````````````````````````````````````````````````````````````````````````
    const itinPreferences = req.body.itinPreferences || '';
    const neighborhoods = req.body.neighborhoods || '';
    const startTime = req.body.startTime || '';
    const endTime = req.body.endTime || '';

    const introPrompt1 = `Provide a list of at least 7 possible sites to visit/leisure activities and places to eat (i.e. breakfast, lunch, dinner) for a traveler visiting ${neighborhoods} in ${destination}. I'd like the suggestions to be introspective of the personal preferences provided by the traveler as follows:` 
    const endPrompt1 = `Your response should be in this exact JSON format:{"neighborhoodName": "nameOfNeighborhood", "activities": [{ "activityTitle": "Activity 1"}, { "activityTitle": "Activity2"} ], "eateries": [{"name": "Coffee at.."}, {"name": "Breakfast at.."},  {"name": "Lunch at ..."}, {"name": "Dinner at ..."}]}. Please replace 'nameOfNeighborhood' with the name of a real neighborhood and fill in the activities and eateries with real examples. For this request, please do not provide additional details beyond activity title and eatery name.` 
    const generatePrompt = () => {
      return introPrompt1 + itinPreferences + endPrompt1;
    }

    const prompt = generatePrompt();

    const prompt2 = `Place all of the activities and eateries into a schedule that starts at ${startTime} and ends at ${endTime}.  Where possible, order activities and eateries such that it minimizes the total distance traveled from one suggestion to the next.  The response should be in JSON format and include nothing else. Each of these fields are required and very important to include. e.g.[{"activityTitle": Visit...and do..., "description":"Based on your preferences you might enjoy...", suggestedStartTime:..., suggestedEndTime:...}, locationAddress:..., location:{latitude:...,longitude:...}, activityType: "Meal Site" or "Leisure Site", "name": "Eatery 1"},  {"name": "Eatery 2"} ]`

    ////////////////////////////////////////////////////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      });
    
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const chunks = response.data.choices;
        let initialResponseString = "";
    
        for (const chunk of chunks) {
          if (chunk.message && chunk.message.content) {
            let answer;
            try {
              answer = JSON.parse(chunk.message.content);
            } catch (error) {
              answer = [chunk.message.content];
            }
    
            const initialResponse = answer;
            initialResponseString = JSON.stringify(initialResponse) || "";
            // Cache the response
            cache.put(cacheKey, initialResponse, CACHE_TIME * 1000);
          }
        }
    
        const followupCompletion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: prompt },
            { role: "assistant", content: initialResponseString }, // Use initial response as assistant's message
            { role: "user", content: prompt2 }, // Follow-up message from the user
          ],
          temperature: 0.7,
          max_tokens: 2048,
        });
    
        let answer2 = [];
        if (followupCompletion.data?.choices[0]?.message?.content) {
          try {
            answer2 = JSON.parse(followupCompletion.data.choices[0].message?.content);
          } catch (error) {
            answer2 = [followupCompletion.data.choices[0].message?.content];
          }
        }
    
        // Get the follow-up response from OpenAI
        const followupResponse = answer2;
        const followupResponseString = followupResponse?.toString() || "";
        res.status(200).json({ itinaru: followupResponse });
        const cachedFollowupResponse = { itinaru: answer2 };
        cache.put(cacheKey, cachedFollowupResponse, CACHE_TIME * 1000);
      }
    } catch (error: unknown) {
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