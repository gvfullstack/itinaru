// import { SitemapStream, streamToPromise } from 'sitemap';
// import { Readable } from 'stream';

// export default async (req, res) => {
//   try {
//     // Set response header
//     res.setHeader('Content-Type', 'application/xml');

//     // Fetch your itinerary data from Firestore
//     const itineraries = await fetchItineraries(); // Replace with your actual data fetching logic

//     // Create a stream to write to
//     const stream = new SitemapStream({ hostname: 'http://itinaru.com/' });

//     // Loop over your itineraries and add them to the sitemap
//     itineraries.forEach(itinerary => {
//       stream.write({
//         url: `/viewItinerary/${itinerary.id}`,
//         changefreq: 'weekly',
//         priority: 0.9
//       });
//     });

//     // End the stream
//     stream.end();

//     // Convert the stream to a promise
//     const data = await streamToPromise(Readable.from(stream)).then(data => data.toString());

//     // Send the XML to the browser
//     res.end(data);
//   } catch (e) {
//     console.error(e);
//     res.status(500).end();
//   }
// };
