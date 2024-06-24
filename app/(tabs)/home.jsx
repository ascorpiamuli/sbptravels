import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Image, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import { images, icons } from '../../constants';

const Home = () => {
  const [notifications, setNotifications] = useState({ car: 2, motor: 3, lorry: 1 }); // Example notification counts
  const [activeDrivers, setActiveDrivers] = useState([
    { id: '1', name: 'John Doe', status: 'Free', image: icons.profile },
    { id: '2', name: 'Jane Smith', status: 'On Job', image: icons.profile },
    { id: '3', name: 'Bob Brown', status: 'Free', image: icons.profile },
  ]);
  const [bookingStatus, setBookingStatus] = useState([
    {
      id: '1',
      type: 'Car',
      service: 'Travel',
      staff: 'John Doe',
      driver: 'Jane Smith',
      price: 2000,
      paymentMode: 'Credit Card',
      status: 'Pending',
    },
    {
      id: '2',
      type: 'Goods',
      service: 'Supermarket',
      staff: 'Alice Johnson',
      driver: 'Bob Brown',
      price: 1750,
      paymentMode: 'PayPal',
      status: 'Finished',
    },
    {
      id: '3',
      type: 'Car',
      service: 'Travel',
      staff: 'Michael Davis',
      driver: 'Anna Lee',
      price: 500,
      paymentMode: 'Cash',
      status: 'Cancelled',
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>Welcome Back</Text>
            <Text style={styles.username}>Stephen Muli</Text>
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Bookings</Text>
          <View style={styles.transportOptions}>
            {Object.keys(notifications).map((key) => (
              <TouchableOpacity key={key} style={styles.transportItem}>
                <Image source={icons[key + 'icon']} style={styles.transportImage} />
                {notifications[key] > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>{notifications[key]}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>On Job and Free Drivers</Text>
          <FlatList
            horizontal
            data={activeDrivers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.driverItem}>
                <Image source={item.image} style={styles.driverImage} />
                <Text style={styles.driverName}>{item.name}</Text>
                <Text style={[styles.driverStatus, { color: item.status === 'Free' ? 'green' : 'orange' }]}>{item.status}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Booking Status</Text>
          {bookingStatus.map((booking) => (
            <TouchableOpacity key={booking.id} style={[styles.bookingItem, { backgroundColor: booking.status === 'Pending' ? '#ffecd1' : booking.status === 'Finished' ? '#d4ffdc' : '#ffcccc' }]}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingType}>{booking.type}</Text>
                <Text style={styles.bookingPrice}>Shs {booking.price}</Text>
              </View>
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingText}>Service: {booking.service}</Text>
                <Text style={styles.bookingText}>Staff: {booking.staff}</Text>
                <Text style={styles.bookingText}>Driver: {booking.driver}</Text>
                <Text style={styles.bookingText}>Payment Mode: {booking.paymentMode}</Text>
                <Text style={[styles.bookingStatus, { color: booking.status === 'Pending' ? 'orange' : booking.status === 'Finished' ? 'green' : 'red' }]}>{booking.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  transportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  transportItem: {
    alignItems: 'center',
  },
  transportImage: {
    width: 50,
    height: 50,
  },
  driverItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  driverName: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color:'black'
  },
  driverStatus: {
    fontSize: 14,
  },
  bookingItem: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bookingType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookingPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6347',
  },
  bookingDetails: {
    paddingLeft: 10,
  },
  bookingText: {
    fontSize: 16,
    marginBottom: 5,
  },
  bookingStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default Home;
