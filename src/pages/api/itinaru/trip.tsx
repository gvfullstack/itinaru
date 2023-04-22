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

export default async function (
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
    
    const selectedPace = req.body.selectedPace || '';
    const itinStartTime = req.body.itinStartTime || '';
    const itinEndTime = req.body.itinEndTime || '';
    const specificSites = req.body.specificSites || '';
    const excludedSites = req.body.excludedSites || '';
    const travelerCount = req.body.travelerCount || '';
    const inScopeAgeRanges = req.body.inScopeAgeRanges || '';
    const inScopeThemes = req.body.inScopeThemes || '';
    const neighborhoodSelections = req.body.neighborhoodSelections || '';
    const perPersonAverageBudget = req.body.perPersonAverageBudgetState || '';
    const travelDate = req.body.travelDate || '';

    // `````````````````````````````````````````````````````````````````````````````
    const generateDestinationPrompt = (data: any) => {
      if (!destination || destination === '') return '';

      return `please create a trip itinerary for ${destination} `;
    }
    
    const generatePacePrompt = (data: any) => {
      if (!selectedPace || selectedPace === '') return;
    
      return `to visit ${selectedPace} points of interest  `;
    }
    
    const generateTimeStartPrompt = (data: any) => {
      if (!itinStartTime || itinStartTime === '') return '';
    
      return `The trip should start at ${itinStartTime} `;
    }
    
    const generateTimeEndPrompt = (data: any) => {
      if (!itinEndTime || itinEndTime === '') return '';
    
      return `and end by ${itinEndTime}. `;
    }
    
    const generateIncludeSitesPrompt = (data: any) => {
      if (!specificSites || specificSites.length === 0) return;
    
      return `inclusive of ${specificSites}. `;
    }
    
    const generateExcludeSitesPrompt = (data: any) => {
      if (!excludedSites || excludedSites.length === 0) return;
    
      return `Please exclude ${excludedSites} from my trip. `;
    }
    
    const generateTavelerCountPrompt = (data: any) => {
      if (!travelerCount || travelerCount === '') return;
    
      return `The activities on my trip should accommodate ${travelerCount} persons `;
    }
    
    const generateTavelerAgePrompt = (data: any) => {
      if (!inScopeAgeRanges || inScopeAgeRanges.length === 0) return;
    
      return `and people ${inScopeAgeRanges}. `;
    }
    
    const generateThemePrompt = (data: any) => {
      if ((!inScopeThemes || inScopeThemes.length === 0) ) 
      return;
    
      return `The activities on my trip should focus around ${inScopeThemes} `;
    }
    
    const generateNeighborhoodPrompt = (data: any) => {
      if ((!neighborhoodSelections || neighborhoodSelections.length === 0)) return "";
    
      return `and stay primarily in ${neighborhoodSelections} neighborhoods. `;
    
    }
    
    const generateBudgetPrompt = (data: any) => {
      if ((!perPersonAverageBudget || perPersonAverageBudget.length === 0)) return;
    
      return `Total budget for this trip should be ${perPersonAverageBudget} or less. `;
    }
    
    const generateDatePrompt = (data: any) => {
      const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
      ];
      
      const today = new Date();
      const currentMonthIndex = today.getMonth();
      const currentMonthName = monthNames[currentMonthIndex];  
      if ((!travelDate || travelDate.length === 0)){  
        return `Also, provide average expected weather on ${currentMonthName} for each site.`}
      else{ 
      return `Also, provide average expected weather on ${travelDate} for each site.`};
    }
    
    const generateJSONExamplePrompt = () => {
     
      return `
      
      Example JSON format:
      [
                {
                    "venue": "Golden Gate Park",
                    "startTime": "9:30 am",
                    "endTime": "12:00 pm",
                    "description": "Explore the beautiful Golden Gate Park and its many attractions including the Conservatory of Flowers, the Japanese Tea Garden, and the California Academy of Sciences. Enjoy a picnic lunch and take in the views of the San Francisco skyline.",
                    "locationAddress": "501 Stanyan St, San Francisco, CA 94117",
                    "locationWebsite": "google.com",
                    "expectedPerPersonBudget": "$10-$15",
                    "averageWeather": 45 F Cloudy Windy 
                },
        ...
      ] `;
    }

    const generatePrompt = (data: any) => {
          return generateDestinationPrompt(data) + generatePacePrompt(data) + generateIncludeSitesPrompt(data) + 
          generateTimeStartPrompt(data) + generateTimeEndPrompt(data) + generateExcludeSitesPrompt(data) 
          + generateTavelerCountPrompt(data) + generateTavelerAgePrompt(data) + generateThemePrompt(data) 
          + generateNeighborhoodPrompt(data) + generateBudgetPrompt (data) + generateDatePrompt(data) +
          generateJSONExamplePrompt();
        }

        const prompt = generatePrompt(req.body)


    ////////////////////////////////////////////////////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



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
      cache.put(cacheKey, { itinaru: answer }, CACHE_TIME * 1000);

      res.status(200).json({ itinaru: answer });
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


// const generatePrompt = (data: any) => {
//   return generateDestinationPrompt(data) + generatePacePrompt(data) + generateIncludeSitesPrompt(data) + 
//   generateTimeStartPrompt(data) + generateTimeEndPrompt(data) + generateExcludeSitesPrompt(data) 
//   + generateTavelerCountPrompt(data) + generateTavelerAgePrompt(data) + generateThemePrompt(data) 
//   + generateNeighborhoodPrompt(data) + generateBudgetPrompt (data) + generateDatePrompt(data) +
//   generateJSONExamplePrompt(data);
// }


// const validate = (data: any) => {
//   return [];
// }

// const generateDestinationPrompt = (data: any) => {
//   if (!data.destination || data.destination === '') return '';

//   return `please create a trip itinerary for ${data.destination}`;
// }

// const generatePacePrompt = (data: any) => {
//   if (!data.pace || data.pace === '') return;

//   return `that only takes me to ${data.pace} locations.`;
// }

// // const generateDatePrompt = (data: any) => {
// //   if (!data.travelDate || data.travelDate === '') return '';

// //   return `The trip will be on ${data.travelDate}. `;
// // }

// const generateTimeStartPrompt = (data: any) => {
//   if (!data.itinStartTime || data.itinStartTime === '') return '';

//   return `The trip should start at ${data.itinStartTime} `;
// }

// const generateTimeEndPrompt = (data: any) => {
//   if (!data.itinEndTime || data.itinEndTime === '') return '';

//   return `and end by ${data.itinEndTime}. `;
// }

// const generateIncludeSitesPrompt = (data: any) => {
//   if (!data.specificSites || data.specificSites.length === 0) return;

//   return `inclusive of ${data.specificSites.join(",")}. `;
// }

// const generateExcludeSitesPrompt = (data: any) => {
//   if (!data.excludedSites || data.excludedSites.length === 0) return;

//   return `Please exclude ${data.excludedSites.join(",")} from my trip. `;
// }

// const generateTavelerCountPrompt = (data: any) => {
//   if (!data.travelerCount || data.travelerCount === '') return;

//   return `The activities on my trip should accommodate ${data.travelerCount} persons. `;
// }

// const generateTavelerAgePrompt = (data: any) => {
//   if (!data.inScopeAgeRanges || data.inScopeAgeRanges.length === 0) return;

//   return `and people in ${data.inScopeAgeRanges}. `;
// }

// const generateThemePrompt = (data: any) => {
//   if ((!data.inScopeThemes || data.inScopeThemes.length === 0) ) 
//   return;

//   return `The activities on my trip should focus around ${data.inScopeThemes} `;
// }

// const generateNeighborhoodPrompt = (data: any) => {
//   if ((!data.neighborhoodSelections || data.neighborhoodSelections.length === 0)) return;

//   return `and stay primarily in ${data.neighborhoodSelections} neighborhoods. `;

// }

// const generateBudgetPrompt = (data: any) => {
//   if ((!data.perPersonAverageBudget || data.perPersonAverageBudget.length === 0)) return;

//   return `Total budget for this trip should be ${data.perPersonAverageBudget} or less. `;
// }

// const generateDatePrompt = (data: any) => {
//   const monthNames = [
//     "January", "February", "March", "April", "May", "June", "July",
//     "August", "September", "October", "November", "December"
//   ];
  
//   const today = new Date();
//   const currentMonthIndex = today.getMonth();
//   const currentMonthName = monthNames[currentMonthIndex];  
//   const travelDate = data.travelDate ? data.travelDate : currentMonthName;
//   return `Also, provide average weather on ${travelDate}.`;
// }

// const generateJSONExamplePrompt = (data: any) => {
 
//   return `
  
//   Example JSON format:
//   [
//             {
//                 "venue": "Golden Gate Park",
//                 "startTime": "9:30 am",
//                 "endTime": "12:00 pm",
//                 "description": "Explore the beautiful Golden Gate Park and its many attractions including the Conservatory of Flowers, the Japanese Tea Garden, and the California Academy of Sciences. Enjoy a picnic lunch and take in the views of the San Francisco skyline.",
//                 "locationAddress": "501 Stanyan St, San Francisco, CA 94117",
//                 "locationWebsite": "google.com",
//                 "expectedPerPersonBudget": "$10-$15",
//                 "averageWeather": 45 F Cloudy Windy 
//             },
//     ...
//   ] `;
// }