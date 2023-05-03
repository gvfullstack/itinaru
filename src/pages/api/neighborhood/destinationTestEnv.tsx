import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type ResponseData = {
    neighborhood: string
    loc?: { lat: number, lng: number }[]
    desc?: string
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
    res.status(200).json(
      [{
          neighborhood: "Little Italy",
          loc: [{lat : 32.7204, lng: -117.1667}, {lat: 32.7181, lng: -117.1755}, {lat: 32.7235, lng: -117.1734}],
          desc: "Little Italy is a vibrant, historic neighborhood in San Diego. With its vibrant Italian culture, Little Italy is perfect for families of all ages. Visitors will enjoy exploring the many restaurants, boutiques, galleries, and art installations. For children, the Amici Park Playground is a great place to explore."
      },
      
      {
          neighborhood: "La Jolla",
          loc: [{lat: 32.8350, lng: -117.2711}, {lat: 32.8274, lng: -117.2858}, {lat: 32.8402, lng: -117.2783}],
          desc: "La Jolla is a picturesque coastal neighborhood in San Diego. Families can enjoy the beach, explore Torrey Pines State Reserve, and visit the Birch Aquarium. Children of all ages will enjoy the La Jolla Children's Pool, the La Jolla Playhouse, and the La Jolla Historical Society."
      },
      
      {
          neighborhood: "Coronado",
          loc: [{lat: 32.6789, lng: -117.1759}, {lat: 32.6841, lng: -117.1862}, {lat: 32.6814, lng: -117.1784}],
          desc: "Coronado is a popular destination for families. There is plenty to explore, including the Coronado Museum of History and Art, Coronado Beach, and the Coronado Ferry Landing. Kids of all ages will enjoy the Coronado Skatepark, the Coronado Dog Beach, and the Coronado Playhouse."
      },
      
      {
          neighborhood: "Oceanside",
          loc: [{lat: 33.1929, lng: -117.3820}, {lat: 33.1872, lng: -117.3993}, {lat: 33.1974, lng: -117.3949}],
          desc: "Oceanside is a charming beach community in San Diego county. Families can explore the Oceanside Pier, the Oceanside Harbor, and the Oceanside Museum of Art. The Oceanside Longboard Surfing Club is perfect for children of all ages, and the Oceanside Public Library is a great place to relax and explore."
      },
      
      {
          neighborhood: "Del Mar",
          loc: [{lat: 32.9554, lng: -117.2645}, {lat: 32.9512, lng: -117.2771}, {lat: 32.9592, lng: -117.2714}],
          desc: "Del Mar is a beautiful coastal community in San Diego County. Visitors can explore the Del Mar Race Track, the Del Mar Plaza, and the Del Mar Fairgrounds. Children of all ages will enjoy the Del Mar Beach, the Del Mar Skate Park, and the Del Mar Library."
      }]);

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

const generatePrompt = (city: string) =>{
  return `please provide 5 popular neighborhood names in the city of ${city} in a json array`;
}


// List five <San Diego> neighborhoods in JSON with culture and history, relaxation, and museums points of interest  that cater to ages 0 - 3, ages 4 - 8, and ages 9 - 17 e.g. 
// [{
//   neighborhood: "La Jolla",
//   loc: [{lat: 32.8350, lng: -117.2711}, {lat: 32.8274, lng: -117.2858}, {lat: 32.8402, lng: -117.2783}], //3 coordinates
//   desc: "La Jolla is a picturesque coastal neighborhood in San Diego. Families can enjoy the beach, explore Torrey Pines State Reserve, and visit the Birch Aquarium. Children of all ages will enjoy the La Jolla Children's Pool, the La Jolla Playhouse, and the La Jolla Historical Society." //max 50 words
// }]