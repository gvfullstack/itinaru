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
    const paramItinStartTime = itinStartTime.toLocaleString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const itinEndTime = req.body.itinEndTime || '';
    const paramItinEndTime = itinEndTime.toLocaleString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const specificSites = req.body.specificSites || '';
    const excludedSites = req.body.excludedSites || '';
    const travelerCount = req.body.travelerCount || '';
    const inScopeAgeRanges = req.body.inScopeAgeRanges || '';
    const inScopeThemes = req.body.inScopeThemes || '';
    const neighborhoodSelections = req.body.neighborhoodSelections || '';
    const perPersonAverageBudget = req.body.perPersonAverageBudgetState || '';
    const travelDate = req.body.travelDate || '';
    const paramTravelDate = travelDate.toISOString().substr(0, 10);

    // `````````````````````````````````````````````````````````````````````````````
    const generateDestinationPrompt = (data: any) => {
      if (!destination || destination === '') return '';

      return `Create an itinerary for ${destination}. `;
    }
    
    const generatePacePrompt = (data: any) => {
      if (!selectedPace || selectedPace === '') return;
    
      return `Provide exactly ${selectedPace} recommendations inclusive of ${specificSites}. The recommendations should be of specific venues, restaurants, activities, or sites. 
      The time allocated to each recommendation should be based on the average amount of time people spend at the recommendation. 
      Each item should be scheduled at popular times for that specific suggestion.  Avoid scheduling during closed or unpopular hours.
      If a suggestion is of a street or neigborhood, split the recommendation but still count it as one, into sub recommendations of specific venues, restaurants, activities, or sites.     
      The recommendations should consider the travel date of ${paramTravelDate} For example, if there are very popular events happening 
      during that time of the year related to the selected themes, those should be recommended. Also, include travel time between recommendations based on the average travel time between each recommendation.` 
      }
    
    const generateTimeStartPrompt = (data: any) => {
      if (!itinStartTime || itinStartTime === '') return '';
    
      return `The itinerary should have a start time of ${paramItinStartTime} and an end of ${paramItinEndTime}. Times should be in 24-hour time format and there should be no gaps in time between itinerary items.`;
    }
    
    const generateExcludeSitesPrompt = (data: any) => {
      if (!excludedSites || excludedSites.length === 0) return;
    
      return `Please exclude ${excludedSites} from my trip. `;
    }
    
    const generateTavelerCountPrompt = (data: any) => {
      if (!travelerCount || travelerCount === '') return;
    
      return `The itinerary suggestions should be able to accommodate ${travelerCount} travelers `;
    }
    
    const generateTavelerAgePrompt = (data: any) => {
      if (!inScopeAgeRanges || inScopeAgeRanges.length === 0) return;
    
      return `and people ${inScopeAgeRanges}. `;
    }
    
    const generateThemePrompt = (data: any) => {
      if ((!inScopeThemes || inScopeThemes.length === 0) ) 
      return;
    
      return `The itinerary suggestions should be related to these themes: ${inScopeThemes} `;
    }
    
    const generateNeighborhoodPrompt = (data: any) => {
      if ((!neighborhoodSelections || neighborhoodSelections.length === 0)) return "";
    
      return `The itinerary suggestions should be in or very near these neighborhoods: ${neighborhoodSelections}. `;
    
    }
    
    const generateBudgetPrompt = (data: any) => {
      if ((!perPersonAverageBudget || perPersonAverageBudget.length === 0)) return;
    
      return `Total budget per person for this trip should be ${perPersonAverageBudget} or less. `;
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
                {   "recommendation": "2 hours: Golden Gate Bridge",
                    "title": "Golden Gate Bridge Welcome Center",
                    "startTime": "09:30",
                    "endTime": "9:35",
                    "description": 
                    Begin your tour of the Golden Gate Bridge at the Welcome Center, located at the southeastern end of the bridge. Here, you can get maps, brochures, and information about the bridge's history and construction.                    
                    "locationAddress": "501 Stanyan St, San Francisco, CA 94117",
                    "locationWebsite": "google.com",
                    "expectedPerPersonBudget": "$10-$15",
                    "averageWeather": 45 F Cloudy Windy,
                    "activityDuration": 300000 
                },
                {   "recommendation": "2 hours at Golden Gate Bridge",
                    "title": "Walk across the bridge",
                    "startTime": "09:35",
                    "endTime": "11:30",
                    "description": Take a leisurely stroll across the bridge, enjoying the stunning views of San Francisco Bay and the surrounding areas. Be sure to stop at the various overlooks along the way, such as the Battery East Vista and the Golden Gate Bridge Pavilion, to take in the scenery. 
                    "locationAddress": "501 Stanyan St, San Francisco, CA 94117",
                    "locationWebsite": "google.com",
                    "expectedPerPersonBudget": "$0",
                    "averageWeather": 45 F Cloudy Windy,
                    "activityDuration": 6900000  
                },
                {  "recommendation": "1 hour: Fort Point",
                    "title": "Visit Fort Point",
                    "startTime": "11:30",
                    "endTime": "12:30",
                    "description": Located at the base of the Golden Gate Bridge on the San Francisco side, Fort Point is a historic military fort that was used to protect the city from sea attacks. Take a tour of the fort and learn about its history and significance.. 
                    "locationAddress": "501 Stanyan St, San Francisco, CA 94117",
                    "locationWebsite": "google.com",
                    "expectedPerPersonBudget": "$0",
                    "averageWeather": 45 F Cloudy Windy,
                    "activityDuration": 3600000 
                }
            ...
      ] `;
    }
    
    const generateDurationPrompt = (data: any) => {
      return `Please provide the duration at each destination in milliseconds based on average time visitors spend at those destinations.`;
    }

    const generatePrompt = (data: any) => {
          return generateDestinationPrompt(data) + generatePacePrompt(data) +  
          generateTimeStartPrompt(data) + generateExcludeSitesPrompt(data) 
          + generateTavelerCountPrompt(data) + generateTavelerAgePrompt(data) + generateThemePrompt(data) 
          + generateNeighborhoodPrompt(data) + generateBudgetPrompt (data) + generateDatePrompt(data) +
          generateJSONExamplePrompt() + generateDurationPrompt(data);
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