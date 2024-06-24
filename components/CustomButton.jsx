import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomButton = ({ title, handlePress, containerStyles }) => {
  return (
    <TouchableOpacity style={[styles.button, containerStyles]} onPress={handlePress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'orange', // Replace with your secondary color
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
