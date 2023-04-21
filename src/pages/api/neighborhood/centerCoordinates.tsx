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
    error: { message: string[]}
}

export default async function (
    req: NextApiRequest,
    res: NextApiResponse<any | Error>) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: ["OpenAI API key not configured, please follow instructions in README.md"],
      }
    });
    return;
  }

  const validation = validate(req.body)
  if (validation.length > 0) {
    res.status(400).json({
      error: {
        message: validation,
      }
    });
    return;
  }

  try {
    const prompt = generatePrompt(req.body)
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 2048
    });

    let answer = []
    if(completion.data?.choices[0]?.text){
        if(completion.data.choices[0].text.charAt(0) === '.'){
            completion.data.choices[0].text = replaceChar(completion.data.choices[0].text, '', 0)
        }
        try{
            answer = JSON.parse(completion.data.choices[0].text)

        }catch (error){
            answer = [completion.data.choices[0].text]
        }
    }
    res.status(200).json({itinarue: answer, generatedPrompt: prompt});
  } catch(error) {
    
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: ['An error occurred during your request.'],
        }
      });
    }
  }
}

const replaceChar = (origString: string, replaceChar: string, index: number) => {
    let firstPart = origString.substr(0, index);
    let lastPart = origString.substr(index + 1);
      
    let newString = firstPart + replaceChar + lastPart;
    return newString;
}

const generatePrompt = (data: any) => {
    return generateDestinationPrompt(data) + generatePacePrompt(data) +  generateDatePrompt(data) + generateTimeStartPrompt(data) + generateTimeEndPrompt(data)
        + generateIncludeSitesPrompt(data) + generateExcludeSitesPrompt(data) + generateTavelerCountPrompt(data)
        + generateTavelerAgePrompt(data) + generateThemePrompt(data) + generateNeighborhoodPrompt(data) + ' please provide the reponse in a json array and each item should be a json object with the following attributes venue, start time, end time, description and location address' 
}

const validate = (data: any) => {
    return [];
}

const generateDestinationPrompt = (data: any) => {
    if (!data.destination || data.destination === '') return '';

    return `please create a trip itenirary for ${data.destination} city `;
}

const generatePacePrompt = (data: any) => {
    if (!data.pace || data.pace === '') return;

    return `that only takes me to ${data.pace} locations. `;
}

const generateDatePrompt = (data: any) => {
    if (!data.travelDate || data.travelDate === '') return '';

    return `The trip will be on ${data.travelDate}. `;
}

const generateTimeStartPrompt = (data: any) => {
    if (!data.itinStartTime || data.itinStartTime === '') return '';

    return `The trip should start at around ${data.itinStartTime}. `;
}

const generateTimeEndPrompt = (data: any) => {
    if (!data.itinEndTime || data.itinEndTime === '') return '';

    return `The trip should end by ${data.itinEndTime}. `;
}

const generateIncludeSitesPrompt = (data: any) => {
    if (!data.specificSitesBool) return;
    if (!data.specificSites || data.specificSites.length === 0) return;

    return `I would like to visit ${data.specificSites.join(",")} during my trip. `;
}

const generateExcludeSitesPrompt = (data: any) => {
    if (!data.excludedSites || data.excludedSites.length === 0) return;

    return `Please exclude ${data.excludedSites.join(",")} from my trip. `;
}


const generateTavelerCountPrompt = (data: any) => {
    if (!data.travelerCount || data.travelerCount === '') return;

    return `The activities on my trip should accomodate ${data.travelerCount} persons. `;
}

const generateTavelerAgePrompt = (data: any) => {
    if (!data.ageRangeSelection || data.ageRangeSelection.length === 0) return;

    return `The activities on my trip should accomodate people in age ranges ${data.ageRangeSelection.join(',')}. `;
}

const generateThemePrompt = (data: any) => {
    if ((!data.themeSelections || data.themeSelections.length === 0) && 
    (!data.userDefinedThemes || data.userDefinedThemes.length === 0)) return;

    let themes: string[] = [];
    if(data.themeSelections && data.themeSelections.length > 0){
        themes = themes.concat(data.themeSelections)
    }
    if(data.userDefinedThemes && data.userDefinedThemes.length > 0){
        themes = themes.concat(data.userDefinedThemes)
    }

    if(themes.length === 1) {
        return `The activities on my trip should focus around ${themes[0]}. `;
    }

    return `The activities on my trip should focus around ${data.themeSelections.join(',')}. `;
}

const generateNeighborhoodPrompt = (data: any) => {
    if ((!data.neighborhoodSelections || data.neighborhoodSelections.length === 0) &&
    (!data.userDefinedNeighborhoods || data.userDefinedNeighborhoods.length === 0)) return;

    let neighborhoods: string[] = [];
    if(data.neighborhoodSelections && data.neighborhoodSelections.length > 0){
        neighborhoods = neighborhoods.concat(data.neighborhoodSelections)
    }
    if(data.userDefinedNeighborhoods && data.userDefinedNeighborhoods.length > 0){
        neighborhoods = neighborhoods.concat(data.userDefinedNeighborhoods)
    }

    if(neighborhoods.length === 1) 
    return `My trip should include the ${neighborhoods[0]} neighborhood. `;

    return `My trip should include the ${neighborhoods.join(',')} neighborhoods. `;

}