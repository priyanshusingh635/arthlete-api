// api.tsx
import axios from 'axios';


const FATSECRET_API_URL = 'https://platform.fatsecret.com/rest/server.api';

// You can set this to your static token for testing
const STATIC_ACCESS_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwOEFEREZGRjZBNDkxOUFBNDE4QkREQTYwMDcwQzE5NzNDRjMzMUUiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJFSXJkX19ha2tacWtHTDNhWUFjTUdYUFBNeDQifQ.eyJuYmYiOjE3Mzg5MzMyOTYsImV4cCI6MTczOTAxOTY5NiwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiJlMDA1ZTQ3YWU4Mzc0MzkyOTI4MDM2ZjRhZmRlYmE5MSIsInNjb3BlIjpbImJhc2ljIl19.PIiMXqfXlOj-pRd7vnbI9PTUQrA55nSrCM9hBI9WsFx-HkRwy6ryjE98tEi9QfIhK-ajhHTBrQe_4W2016Uf-eU1iJZVgxg9WviNubcIbC-i0jrgJgefJmvM8sRnBGgqqW3W8sXgvEXiDwoRVFecKa-aOVN97Bbw6Ve7NN4QVZkhaeE6Yy9I73KQhU_irWdg5VqpevyONoXstGubdagChA_y48re1pbwNUVznjZv4n60ROsmlmf2fyywgnDmEY2HCw33GIYYMR17bPuTDoKmOz8qVDa_gTkna-J9t9TaQ2VmrBff6QgA4JGen2kMjPP5og7xXcF4p9RcLkLd7gODBUi9npVo9HGXSQiD2I0J2KXIioKATd1oSzhjWAn9502v8KbIOCzn5t4SYl23q589JkMViT59dRCj6xrSI06LnDCuLUW8fjHoBbAXbUUYvwFf_RdzXdMiaB4V39RU4e4EsoG_PvH1Y05kP54oU3jBXg8oehflaNvdhuj5o781Xq8e_1lRwrTyoytgmAx3xigamSBaKgdayMzRfRzSL_aYwXO4wojCIzDVWyZpc1vGE4iOkJ2H8LZf4BXpxLmpdL6U2cntlb0qW0i2rCXrhOm_nWovx7V5wVwjqlAM3F0x9Y6R3ywAA70VRQmjbumJO9lVybl0sULxUTWHfwAkfEUsSjE";

interface FoodItem {
  food_id: string;
  food_name: string;
  brand_name?: string;
  food_description?: string;
  servings?: {
    serving: {
      serving_id: string;
      serving_description: string;
      serving_url?: string;
      metric_serving_amount?: number;
      metric_serving_unit?: string;
      calories?: number;
    }[];
  };
}

interface FoodSearchResponse {
  foods: {
    food: FoodItem | FoodItem[];
    max_results: number;
    total_results: number;
    page_number: number;
  };
}

class ApiError extends Error {
  constructor(public message: string, public statusCode?: number, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

// Function to get a valid access token
export const getAccessToken = async (): Promise<string> => {
  // Return the static token for immediate testing
  return STATIC_ACCESS_TOKEN;
  
  /* Uncomment this section when you want to fetch fresh tokens
  try {
    const credentials = `${FATSECRET_CLIENT_ID}:${FATSECRET_CLIENT_SECRET}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    const response = await axios.post(
      FATSECRET_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'basic',
      }).toString(),
      {
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        'Failed to get access token',
        error.response?.status,
        error.response?.data
      );
    }
    throw new ApiError('Unexpected error while getting access token');
  }
  */
};

// Function to search foods
export const searchFoods = async (
  searchTerm: string,
  pageNumber: number = 0,
  maxResults: number = 50
): Promise<FoodSearchResponse> => {
  try {
    const response = await axios.get(FATSECRET_API_URL, {
      params: {
        method: 'foods.search',
        search_expression: searchTerm,
        page_number: pageNumber,
        max_results: maxResults,
        format: 'json'
      },
      headers: {
        'Authorization': `Bearer ${STATIC_ACCESS_TOKEN}`,
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Search error:', error.response?.data);
      throw new ApiError(
        'Failed to search foods',
        error.response?.status,
        error.response?.data
      );
    }
    throw new ApiError('Unexpected error while searching foods');
  }
};

// Function to get food details
export const getFoodDetails = async (foodId: string): Promise<FoodItem> => {
  try {
    const response = await axios.get(FATSECRET_API_URL, {
      params: {
        method: 'food.get',
        food_id: foodId,
        format: 'json'
      },
      headers: {
        'Authorization': `Bearer ${STATIC_ACCESS_TOKEN}`,
      }
    });

    return response.data.food;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        'Failed to get food details',
        error.response?.status,
        error.response?.data
      );
    }
    throw new ApiError('Unexpected error while getting food details');
  }
};