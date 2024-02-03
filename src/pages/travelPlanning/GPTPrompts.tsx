import React from 'react';
import styles from '../../styles/gptPromptsForEfficientPlanning.module.css';

const EfficientItinerary = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Explore these propmts while interacting with 
                <a href="https://chat.openai.com/g/g-cxjX4K4Gn-itinaru-gpt-travel-itineraries" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.gptLink}>
                        ITINARU GPT</a> 
                 and refine your travel itinerary</h1>
                <p>Date: February 3, 2024</p>
            </header>
            <main className={styles.mainContent}>
    <section>
         <h3 className={styles.sectionHeaders}>Getting a Lay of the Land and Neighborhoods</h3>
        <ul>
            <li>&quot;Help me understand the layout of [destination] and its main neighborhoods.&quot;</li>
            <li>&quot;Provide an overview of the city districts or boroughs in [destination].&quot;</li>
            <li>&quot;What are the key landmarks or points of interest in different neighborhoods of [destination]?&quot;</li>
            <li>&quot;Give me insights into the safety and security of various neighborhoods in [destination].&quot;</li>
            <li>&quot;Share information on the local culture and vibe of different neighborhoods in [destination].&quot;</li>
            <li>&quot;Recommend neighborhoods in [destination] that are known for their food scene.&quot;</li>
            <li>&quot;Which neighborhoods in [destination] are best for shopping and nightlife?&quot;</li>
            <li>&quot;Tell me about family-friendly neighborhoods with parks and recreational areas in [destination].&quot;</li>
            <li>&quot;Provide details on public transportation options and accessibility in different neighborhoods of [destination].&quot;</li>
            <li>&quot;What are some hidden gems or lesser-known neighborhoods worth exploring in [destination]?&quot;</li>
        </ul>

        <h3 className={styles.sectionHeaders}>Sites and Attractions</h3>
        <ul>
            <li>&quot;Recommend top historical sites to visit in [destination].&quot;</li>
            <li>&quot;What are the must-see natural landmarks in [destination]?&quot;</li>
            <li>&quot;Tell me about cultural festivals and events happening in [destination] during my visit.&quot;</li>
            <li>&quot;Suggest hidden gems or lesser-known attractions in [destination].&quot;</li>
            <li>&quot;What are the most iconic landmarks in [destination].&quot;</li>
            <li>&quot;What are the best museums and art galleries to visit in [destination]?&quot;</li>
        </ul>
        <h3 className={styles.sectionHeaders}>Food and Dining</h3>
        <ul>
            <li>&quot;Provide a list venues that serve [specific food or drink] in [destination]?&quot;</li>
            <li>&quot;Recommend popular local restaurants for authentic cuisine in [destination].&quot;</li>
            <li>&quot;What are the must-try street foods in [destination]?&quot;</li>
            <li>&quot;Suggest a list of vegetarian-friendly or vegan restaurants in [destination].&quot;</li>
            <li>&quot;Tell me about dining experiences or food tours I shouldn&#39;t miss in [destination].&quot;</li>
            <li>&quot;Create a list of cafes and bakeries for a relaxing breakfast in [destination].&quot;</li>
            <li>&quot;Where can I find the best seafood or regional specialties in [destination]?&quot;</li>
        </ul>
        <h3 className={styles.sectionHeaders}>Transportation</h3>
        <ul>
            <li>&quot;Provide information on public transportation options and passes in [destination].&quot;</li>
            <li>&quot;How should I plan my transportation from the airport to the city center in [destination]?&quot;</li>
            <li>&quot;Recommend bike rental or bike-friendly areas for exploring [destination].&quot;</li>
            <li>&quot;Tell me about day trips or excursions accessible from [destination] by public transportation.&quot;</li>
            <li>&quot;What&#39;s the best way to get around the city, subway, bus, or taxi in [destination]?&quot;</li>
            <li>&quot;Are there any scenic train routes or boat tours I can take while visiting [destination]?&quot;</li>
        </ul>
        <h3>Lodging and Accommodation</h3>
        <ul>
            <li>&quot;Suggest affordable and well-located hotels or hostels in [destination].&quot;</li>
            <li>&quot;Recommend charming boutique hotels or guesthouses in [destination].&quot;</li>
            <li>&quot;What are some unique lodging options like treehouses or houseboats in [destination]?&quot;</li>
            <li>&quot;Tell me about accommodations with stunning views or beachfront locations in [destination].&quot;</li>
            <li>&quot;Provide tips for booking the best Airbnb or vacation rental in [destination].&quot;</li>
            <li>&quot;Are there any luxury resorts or spa retreats that you recommend in [destination]?&quot;</li>
        </ul>
        <h3 className={styles.sectionHeaders}>Activities and Entertainment</h3>
        <ul>
            <li>&quot;Suggest outdoor adventure activities such as hiking or water sports in [destination].&quot;</li>
            <li>&quot;Tell me about family-friendly attractions and activities in [destination].&quot;</li>
            <li>&quot;Recommend nightlife spots, bars, and clubs for evening entertainment in [destination].&quot;</li>
            <li>&quot;What cultural or live performances can I attend in [destination]?&quot;</li>
            <li>&quot;Tell me about shopping districts and local markets to explore in [destination].&quot;</li>
        </ul>
    </section>
</main>

            <footer className={styles.footer}>
                <p>&copy; 2024. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default EfficientItinerary;

