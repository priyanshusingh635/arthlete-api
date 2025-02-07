import axios from 'axios';
import { FATSECRET_CLIENT_ID, FATSECRET_CLIENT_SECRET } from '@env'; // Importing your credentials

// FatSecret API token URL to get access token
const FATSECRET_TOKEN_URL = 'https://oauth.fatsecret.com/connect/token';

// Function to fetch access token from FatSecret
const getAccessToken = async (): Promise<string | null> => {
    try {
        // Encoding client ID and client secret in base64 for Basic Authentication
        const credentials = `${FATSECRET_CLIENT_ID}:${FATSECRET_CLIENT_SECRET}`;
        const encodedCredentials = Buffer.from(credentials).toString('base64');

        // Make a POST request to get the token
        const response = await axios.post(
            FATSECRET_TOKEN_URL,
            new URLSearchParams({
                grant_type: 'client_credentials',  // Grant type for client credentials flow
                scope: 'basic',                    // Scope for basic data access
            }).toString(),
            {
                headers: {
                    'Authorization': `Basic ${encodedCredentials}`, // Authorization header with base64 encoded credentials
                    'Content-Type': 'application/x-www-form-urlencoded', // Content type for form data
                },
            }
        );

        // Return the access token if the request is successful
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response?.data || error.message);  // Log errors if any
        return null; // Return null if there's an error
    }
};

// Fetch food data from FatSecret API using the access token
const fetchFoodData = async (query: string) => {
    try {
        const token = await getAccessToken(); // Get the access token by calling the getAccessToken function
        if (!token) {
            throw new Error('Failed to get access token'); // Handle failure in getting the token
        }

        // Make a GET request to FatSecret API to search for food based on the query
        const response = await axios.get('https://platform.fatsecret.com/rest/server.api', {
            params: {
                method: 'foods.search', // Specify the method to search food
                format: 'json',         // Specify that the response should be in JSON format
                search_expression: query, // The query string (search term)
            },
            headers: {
                Authorization: `Bearer ${token}`, // Pass the access token in the Authorization header
            },
        });

        return response.data.foods.food; // Return the food list from the response
    } catch (error) {
        console.error('Error fetching food data:', error.message); // Log error if any
        throw error; // Rethrow the error for the calling function to handle
    }
};

export { fetchFoodData }; // Export the fetchFoodData function to use in other files
