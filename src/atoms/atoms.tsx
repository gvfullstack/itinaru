import {atom} from 'recoil';
import { Neighborhoods, Itinerary  } from '@/typeDefs'
  

export const neighborhoodsState = atom<Neighborhoods[]>({
    key: 'neighborhoodsState', 
    default: []
  });

  export const itineraryItemsState = atom<Itinerary>({
    key: 'itineraryItemsState', 
    default: [
      ]
  });


  export const curStepState = atom<string>({
    key: 'curStepState',
    default: '10T'
  })
  
  export const destinationState = atom<string>({
    key: 'destinationState', 
    default: ""
  });
  
  export const travelDateState = atom<string>({
    key: 'travelDateState', 
    default: ""
  });
  

  export const itinStartTimeState = atom<string>({
    key: 'itinStartTimeState', 
    default: ""
  });

  export const itinEndTimeState = atom<string>({
    key: 'itinEndTimeState', 
    default: ""
  });

  export const specificSitesState = atom<string>({
    key: 'specificSitesState', 
    default: ""
  });

  export const excludedSitesState = atom<string>({
    key: 'excludedSitesState', 
    default: ""
  });

  export const selectedPaceState = atom<string>({
    key: 'selectedPaceState', 
    default:""})

  export const paceOptionsState = atom<Array<{ numVal: string, label: string, selected: boolean}>>({
    key: 'paceOptionsState', 
    default: [
      {
        numVal: '1', 
        label:"just want to chill! (1 site)", 
        selected: false},
      {
        numVal: '2', 
        label:"take it easy! (2 sites)", 
        selected: false},
      {
        numVal: '3', 
        label:"no need to rush! (3 sites)", 
        selected: false},
      {
        numVal: '4', 
        label:"pep in my step! (4 sites)", 
        selected: false},
      {
        numVal: '5', 
        label:"let’s keep it moving! (5 sites)", 
        selected: false},
      {
        numVal: '6', 
        label:"pick up the pace! (6 sites)", 
        selected: false},
      {
        numVal: '7', 
        label:"let’s hustle! (7 sites)", 
        selected: false},
      ]
  });
  
  
  export const defaultAtom = atom<any>({
    key: 'defaultAtom', 
    default: "No atom found"
  });

  export const travelerCountState = atom<string>({
    key: 'travelerCountState', 
    default: ""
  });

  export const userDefinedThemesState = atom<string>({
    key: 'userDefinedThemesState', 
    default: ""
  });

  export const ageRangeOptionsState = atom<Array<{ label: string, selected: boolean}>>({
    key: 'ageRangeOptionsState', 
    default: [
      { 
        label:"ages 0 - 3", 
        selected: false},
      {
        label:"ages 4 - 8", 
        selected: false},
      {
        label:"ages 9 - 17", 
        selected: false},
      {
        label:"ages 18 - 35", 
        selected: false},
      {
        label: "ages 36 - 64", 
        selected: false},
      {
        label:"ages 65+", 
        selected: false},
      
      ]
  });

  export const themeOptionsState = atom<Array<{ label: string, selected: boolean}>>({
    key: 'themeOptionsState', 
    default: [
      { 
        label:"culture & history", 
        selected: false},
      {
        label:"relaxation", 
        selected: false},
      {
        label:"parks", 
        selected: false},
      {
        label:"food and drink", 
        selected: false},
      {
        label: "city exploration", 
        selected: false},
      {
        label:"beaches", 
        selected: false},
      {label:"adventure",
        selected: false},        
      {label:"guided tours",
        selected: false},
      {label:"tourist attractions",
        selected: false},
      {label:"nature & wildlife",
        selected: false},
      {label:"live shows",
        selected: false}
      ]
  });

  export const perPersonAverageBudgetState = atom<string>({ 
    key: 'perPersonAverageBudgetState',
    default: "$25"
  });


















  
//   {
//     "venue": "Golden Gate Park",
//     "startTime": "9:30 am",
//     "endTime": "12:00 pm",
//     "description": "Explore the beautiful Golden Gate Park and its many attractions including the Conservatory of Flowers, the Japanese Tea Garden, and the California Academy of Sciences. Enjoy a picnic lunch and take in the views of the San Francisco skyline.",
//     "locationAddress": "501 Stanyan St, San Francisco, CA 94117",
//     "locationWebsite": "google.com",
//     "budget": "$10-$15",
//     "descHidden": true
// },
// {
//     "venue": "Mission District",
//     "startTime": "1:00 pm",
//     "endTime": "4:00 pm",
//     "description": "Explore the vibrant Mission District of San Francisco and its many murals, galleries, and restaurants. Visit the famous Clarion Alley and learn about the history of the area. Stop in at local shops and get a souvenir.",
//     "locationAddress": "Mission St, San Francisco, CA 94110",
//     "locationWebsite": "google.com",
//     "budget": "$10-$15",
//     "descHidden": true
// },
// {
//     "venue": "North Beach",
//     "startTime": "4:30 pm",
//     "endTime": "6:00 pm",
//     "description": "Explore the charming North Beach neighborhood of San Francisco. Take a stroll along the waterfront and visit the iconic Washington Square Park. Stop into one of the many cafes and sample some of the local cuisine.",
//     "locationAddress": "Washington Square Park, San Francisco, CA 94133",
//     "locationWebsite": "google.com",
//     "budget": "$10-$15",
//     "descHidden": true

// },
// {
//     "venue": "Castro District",
//     "startTime": "6:30 pm",
//     "endTime": "8:00 pm",
//     "description": "Explore the lively Castro District of San Francisco. Visit the famous Castro Theater and take in a show, stop into one of the many bars and clubs, and visit the GLBT History Museum. End the day with a visit to the iconic Twin Peaks.",
//     "locationAddress": "Castro St, San Francisco, CA 94114",
//     "locationWebsite": "google.com",
//     "budget": "$10-$15",
//     "descHidden": true
// }