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
      return `Return an itinerary for ${destination} in JSON format. `;
    }
    
    // const generatePacePrompt = (data: any) => {
    //   if (!selectedPace || selectedPace === '' ) return '';
    //   return `The itinerary should have ${selectedPace} number of recommendations, inclusive of the specific sites` }

    // const generateSpecificSitesPrompt = (data: any) => {
    //   if (!specificSites || specificSites === '' ) return '';
    
    //   return  `Include ${specificSites} as specific sites to visit. `}
        
    // const generateTimePrompt = (data: any) => {
    //   if (!itinStartTime || itinStartTime === '' || !itinEndTime || itinEndTime === '') return '';
    
    //   return `The itinerary should have a start time of ${itinStartTime} and an end of ${itinEndTime}. `;
    // }
    
    // const generateExcludeSitesPrompt = (data: any) => {
    //   if (!excludedSites || excludedSites.length === 0) return '';
    //   return `Please exclude ${excludedSites} from the itinerary suggestions. `;
    // }
    
    // const generateTavelerCountPrompt = (data: any) => {
    //   if (!travelerCount || travelerCount === '') return '';
    
    //   return `The itinerary suggestions should be tailored for ${travelerCount} travelers `;
    // }
    
    // const generateTavelerAgePrompt = (data: any) => {
    //   if (!inScopeAgeRanges || inScopeAgeRanges.length === 0) return ''; 
    
    //   return `The itinerary suggestions should be tailored for ${inScopeAgeRanges}. `;
    // }
    
    // const generateThemePrompt = (data: any) => {
    //   if ((!inScopeThemes || inScopeThemes.length === 0) ) 
    //   return '';
    
    //   return `The itinerary suggestions should center around: ${inScopeThemes} `;
    // }
    
    // const generateNeighborhoodPrompt = (data: any) => {
    //   if ((!neighborhoodSelections || neighborhoodSelections.length === 0)) return "";
    
    //   return `The itinerary suggestions should be in or very near these neighborhoods: ${neighborhoodSelections}. `;
    
    // }
    
    // const generateBudgetPrompt = (data: any) => {
    //   if ((!perPersonAverageBudget || perPersonAverageBudget.length === 0)) return "";
    
    //   return `Total budget per person should be ${perPersonAverageBudget} or less. `;
    // }
    
    // const generateDatePrompt = (data: any) => {
    //   const monthNames = [
    //     "January", "February", "March", "April", "May", "June", "July",
    //     "August", "September", "October", "November", "December"
    //   ];
      
    //   const today = new Date();
    //   const currentMonthIndex = today.getMonth();
    //   const currentMonthName = monthNames[currentMonthIndex];  
    //   if ((!travelDate || travelDate.length === 0)){  
    //     return `Also, provide average expected weather on ${currentMonthName} for each site.`}
    //   else{ 
    //   return `Also, provide average expected weather on ${travelDate} for each site.`};
    // }
    
    // const generateJSONExamplePrompt = () => {
     
    //   return `
    //     Times should be in 24-hour time format with no time gaps e.g. current start time is equal to previous end time.
    //     The recommendations should be of specific venues, restaurants, activities, or sites. 
    //     The time allocated should be based on the average visiting time. 
    //     Each item should be scheduled at popular times for that specific suggestion.  Avoid scheduling during closed or unpopular hours.
    //     If a suggestion is of a street or neigborhood, split the recommendation but still count it as one, into sub recommendations of specific venues, restaurants, activities, or sites.     
        
    //   Example JSON format:
    //   [
    //             {   
    //                 "title": "Golden Gate Bridge Welcome Center",
    //                 "startTime": "09:30",
    //                 "endTime": "11:35",
    //                 "description": 
    //                 "Begin your tour of the Golden Gate Bridge at the Welcome Center, located at the southeastern end of the bridge. Here, you can get maps, brochures, and information about the bridge's history and construction."                    
    //                 "locationAddress": "501 Stanyan St, San Francisco, CA 94117",
    //                 "locationWebsite": "google.com",
    //                 "expectedPerPersonBudget": "$10-$15",
    //                 "averageWeather": 45 F Cloudy Windy,
    //             },

    //         ...
    //   ] `
    //   ;
    // }
    
   

    // const generatePrompt = (data: any) => {
    //       return generateDestinationPrompt(data) + generatePacePrompt(data) +  generateSpecificSitesPrompt(data) +
    //       generateTimePrompt(data) + generateExcludeSitesPrompt(data) 
    //       + generateTavelerCountPrompt(data) + generateTavelerAgePrompt(data) + generateThemePrompt(data) 
    //       + generateNeighborhoodPrompt(data) + generateBudgetPrompt (data) + generateDatePrompt(data) +
    //       generateJSONExamplePrompt();
    //     }

        const prompt = `Return an itinerary for ${destination} in JSON format. 
        Example JSON format:
      [
                {   
                    "title": "Golden Gate Bridge Welcome Center",
                    "startTime": "09:30",
                    "endTime": "11:35",
                    "description": 
                    "Begin your tour of the Golden Gate Bridge at the Welcome Center, located at the southeastern end of the bridge. Here, you can get maps, brochures, and information about the bridge's history and construction."                    
                    "locationAddress": "501 Stanyan St, San Francisco, CA 94117",
                    "locationWebsite": "google.com",
                    "expectedPerPersonBudget": "$10-$15",
                    "averageWeather": 45 F Cloudy Windy,
                },

            ...
      ] `

        console.log(prompt)
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
}


function withLimiter(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    limiter(req, res, () => {
      handler(req, res);
    });
  };
}


export default withLimiter(requestItineraryFunction)