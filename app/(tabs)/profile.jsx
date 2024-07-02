import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Image, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import { images, icons } from '../../constants';

const Profile= () => {
  const [notifications, setNotifications] = useState({ car: 2, motor: 3, lorry: 1 }); // Example notification counts

 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default Profile;
