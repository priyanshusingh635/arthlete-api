import axios from 'axios';
import { getAccessToken } from './getAccessToken';

const API_URL = 'https://platform.fatsecret.com/rest/server.api';

interface Food {
  food_id: string;
  food_name: string;
  food_type: string;
  food_url: string;
  brand_name?: string;
}

interface FoodsResponse {
  foods: {
    food: Food[];
  };
}

export const searchFood = async (query: string): Promise<Food[] | null> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    console.log('🔍 Searching for:', query);
    const response = await axios.get<FoodsResponse>(API_URL, {
      params: { method: 'foods.search', format: 'json', search_expression: query },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log('✅ API Response:', response.data);
    return response.data.foods.food;
  } catch (error) {
    const err = error as any;
    console.error('❌ API Error:', err.response?.data || err.message);
    return null;
  }
};
