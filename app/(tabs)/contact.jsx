import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Image, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import { images, icons } from '../../constants';
import { Alert } from 'react-native';

const Contact = () => {
  const [notifications, setNotifications] = useState({ car: 2, motor: 3, lorry: 1 }); // Example notification counts
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    // Here, you would typically send the contact information to your server
    // For this example, we'll just show an alert
    Alert.alert('Success', 'Your message has been sent.');
    setName('');
    setEmail('');
    setMessage('');
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.username}>Contact Us</Text>
          </View>
          <TouchableOpacity style={styles.imgContainer}>
            <Image
              source={images.logoSmall}
              style={styles.img}
              resizeMode='contain'
            />
            {Object.values(notifications).reduce((a, b) => a + b, 0) > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>
                  {Object.values(notifications).reduce((a, b) => a + b, 0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <Text style={styles.contactText}>Company Address:Po Box 1413,Kitui,Kenya</Text>
          <Text style={styles.contactText}>Phone: +254795751700</Text>
          <Text style={styles.contactText}>Email: info@sbptreks.com</Text>
          <Text style={styles.contactText}>Operating Hours: Mon - Fri, 9 AM - 6 PM</Text>

          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Your Message"
            value={message}
            onChangeText={(text) => setMessage(text)}
            multiline
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  contactContainer: {
    marginTop:60,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginLeft:20,
    marginRight:20,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 10,
    backgroundColor: '#161622',
    borderRadius: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  username: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  imgContainer: {
    position: 'relative',
    width: 36,
    height: 40,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  notificationBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  
});

export default Contact;
