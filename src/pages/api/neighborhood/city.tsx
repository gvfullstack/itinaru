import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type ResponseData = {
    neighborhood: string
    coordinates?: { lat: number, lng: number }[]
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
      max_tokens: 500
    });

    let resp: ResponseData = {neighborhood: completion.data?.choices[0]?.text ? completion.data.choices[0].text : ''}
    res.status(200).json([
      {neighborhood: "ponderosa park",
      coordinates: [
        { lat: 37.3739, lng: -122.0263 },
        { lat: 37.3741, lng: -122.0255 },
        { lat: 37.3695, lng: -122.0235 },
        { lat: 37.3685, lng: -122.0261 },
        { lat: 37.3739, lng: -122.0263 },
      ]
    }, 
      {neighborhood:"heritage district"
      , coordinates: [
        { lat: 37.369275, lng: -122.036657 },
        { lat: 37.368918, lng: -122.037739 },
        { lat: 37.368287, lng: -122.036996 },
        { lat: 37.368626, lng: -122.035911 },
        { lat: 37.369275, lng: -122.036657 }
      ]}, 
      {neighborhood:"Lakewood Village"
      , coordinates:[
        { lat: 37.3684, lng: -122.0403 },
        { lat: 37.3673, lng: -122.0368 },
        { lat: 37.3634, lng: -122.0386 },
        { lat: 37.3643, lng: -122.0421 },
        { lat: 37.3684, lng: -122.0403 }
      ]}, 
      {neighborhood:"Wazzu"
      , coordinates:[
        { lat: 37.3682, lng: -122.0277 },
        { lat: 37.3676, lng: -122.0246 },
        { lat: 37.3651, lng: -122.0256 },
        { lat: 37.3646, lng: -122.0286 },
        { lat: 37.3682, lng: -122.0277 }
      ]}, 
      {neighborhood:"Sunnyvale West"
      , coordinates:[
        { lat: 37.3751, lng: -122.0686 },
        { lat: 37.3757, lng: -122.0537 },
        { lat: 37.3714, lng: -122.0528 },
        { lat: 37.3709, lng: -122.068 },
        { lat: 37.3751, lng: -122.0686 }
      ]}]);

  } catch(error: any) {
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

function generatePrompt(city: string) {
  return `please provide 5 popular neighborhood names in the city of ${city}`;
}