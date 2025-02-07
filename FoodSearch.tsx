import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { fetchFoodData } from './fatSecretApi'; // Import the fetchFoodData function

const FoodSearch = () => {
    const [query, setQuery] = useState(''); // State to hold the search query
    const [foodList, setFoodList] = useState<any[]>([]); // State to hold the list of food results

    // Function to handle search button click
    const handleSearch = async () => {
        if (query.trim() === '') return; // If query is empty, do nothing
        try {
            const foods = await fetchFoodData(query); // Call the fetchFoodData function to get food data
            setFoodList(foods); // Update the food list state with the fetched data
        } catch (error) {
            console.error('Error fetching food:', error); // Handle any error while fetching food
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search food..."
                value={query} // Bind query state to the input field
                onChangeText={setQuery} // Update query state when text changes
                style={styles.input}
            />
            <Button title="Search" onPress={handleSearch} /> {/* Button to trigger search */}
            <FlatList
                data={foodList} // Pass foodList to FlatList
                keyExtractor={(item) => item.food_id.toString()} // Use food_id as the key
                renderItem={({ item }) => <Text style={styles.foodItem}>{item.food_name}</Text>} // Render each food item
            />
        </View>
    );
};

// Styles for the screen
const styles = StyleSheet.create({
    container: { padding: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10 },
    foodItem: { fontSize: 16, padding: 5 },
});

export default FoodSearch; // Export the FoodSearch screen component
