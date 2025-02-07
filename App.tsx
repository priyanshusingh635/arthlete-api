import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { getAccessToken } from './api';
import { FoodItem, FoodSearchResponse } from './types';

const App = () => {
  const [query, setQuery] = useState('');
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFoodData = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessToken();
      const response = await axios.get<FoodSearchResponse>(
        'https://platform.fatsecret.com/rest/server.api',
        {
          params: {
            method: 'foods.search',
            format: 'json',
            search_expression: query,
            max_results: 50,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const foods = response.data.foods.food;
      setFoodList(Array.isArray(foods) ? foods : [foods]);
    } catch (error) {
      console.error('Error fetching food data:', error);
      Alert.alert(
        'Error',
        'Failed to fetch food data. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodName}>{item.food_name}</Text>
      {item.brand_name && (
        <Text style={styles.brandName}>Brand: {item.brand_name}</Text>
      )}
      {item.food_description && (
        <Text style={styles.description}>{item.food_description}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search food..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          onSubmitEditing={fetchFoodData}
          returnKeyType="search"
        />
        <Button
          title="Search"
          onPress={fetchFoodData}
          disabled={loading}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={foodList}
          keyExtractor={(item) => item.food_id}
          renderItem={renderFoodItem}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No foods found. Try searching for something else.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  list: {
    flex: 1,
  },
  foodItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  loader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default App;