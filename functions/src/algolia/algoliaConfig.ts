import algoliasearch from 'algoliasearch';
import * as functions from 'firebase-functions';

const algoliaConfig = functions.config().algolia;

export const client = algoliasearch(algoliaConfig.app_id, algoliaConfig.admin_key);
export const index = client.initIndex('itineraries');
