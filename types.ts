export interface FoodItem {
    food_id: string;
    food_name: string;
    food_description?: string;
    brand_name?: string;
  }
  
  export interface FoodSearchResponse {
    foods: {
      food: FoodItem[];
      max_results: number;
      total_results: number;
      page_number: number;
    };
  }