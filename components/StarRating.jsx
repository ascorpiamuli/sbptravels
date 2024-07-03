import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ maxStars = 5, onRatingChange }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (newRating) => {
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <View style={styles.starContainer}>
      {[...Array(maxStars)].map((_, index) => (
        <TouchableOpacity key={index} onPress={() => handleRating(index + 1)}>
          <Ionicons
            name={index < rating ? 'star' : 'star-outline'}
            size={32}
            color={index < rating ? '#FFD700' : '#ccc'}
          />
        </TouchableOpacity>
      ))}
      <Text style={styles.ratingText}>{rating} / {maxStars}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default StarRating;
