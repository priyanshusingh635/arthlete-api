import axios from 'axios';

const API_URL = 'https://platform.fatsecret.com/rest/server.api';
const ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwOEFEREZGRjZBNDkxOUFBNDE4QkREQTYwMDcwQzE5NzNDRjMzMUUiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJFSXJkX19ha2tacWtHTDNhWUFjTUdYUFBNeDQifQ.eyJuYmYiOjE3Mzg5MzMyOTYsImV4cCI6MTczOTAxOTY5NiwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiJlMDA1ZTQ3YWU4Mzc0MzkyOTI4MDM2ZjRhZmRlYmE5MSIsInNjb3BlIjpbImJhc2ljIl19.PIiMXqfXlOj-pRd7vnbI9PTUQrA55nSrCM9hBI9WsFx-HkRwy6ryjE98tEi9QfIhK-ajhHTBrQe_4W2016Uf-eU1iJZVgxg9WviNubcIbC-i0jrgJgefJmvM8sRnBGgqqW3W8sXgvEXiDwoRVFecKa-aOVN97Bbw6Ve7NN4QVZkhaeE6Yy9I73KQhU_irWdg5VqpevyONoXstGubdagChA_y48re1pbwNUVznjZv4n60ROsmlmf2fyywgnDmEY2HCw33GIYYMR17bPuTDoKmOz8qVDa_gTkna-J9t9TaQ2VmrBff6QgA4JGen2kMjPP5og7xXcF4p9RcLkLd7gODBUi9npVo9HGXSQiD2I0J2KXIioKATd1oSzhjWAn9502v8KbIOCzn5t4SYl23q589JkMViT59dRCj6xrSI06LnDCuLUW8fjHoBbAXbUUYvwFf_RdzXdMiaB4V39RU4e4EsoG_PvH1Y05kP54oU3jBXg8oehflaNvdhuj5o781Xq8e_1lRwrTyoytgmAx3xigamSBaKgdayMzRfRzSL_aYwXO4wojCIzDVWyZpc1vGE4iOkJ2H8LZf4BXpxLmpdL6U2cntlb0qW0i2rCXrhOm_nWovx7V5wVwjqlAM3F0x9Y6R3ywAA70VRQmjbumJO9lVybl0sULxUTWHfwAkfEUsSjE'; 

export type Food = {
  food_id: string;
  food_name: string;
  food_description: string;
};

export const searchFood = async (query: string): Promise<Food[]> => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        method: 'foods.search',
        search_expression: query,
        format: 'json',
      },
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    if (response.data.foods && response.data.foods.food) {
      return response.data.foods.food.map((item: any) => ({
        food_id: item.food_id,
        food_name: item.food_name,
        food_description: item.food_description || 'No description available',
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching food data:', error);
    return [];
  }
};
