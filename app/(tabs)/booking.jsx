import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Image, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBookingDetails, createBooking, fetchDriverDetails } from '../../lib/appwrite';
import { icons } from '../../constants';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import { initiatePayment } from '../../lib/payments';
import { ActivityIndicator } from 'react-native';

const Booking = () => {
  const [driver, setDriver] = useState(null);
  const [origin, setOrigin] = useState('');
  const [selectedBookingType, setSelectedBookingType] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [departureTime, setDepartureTime] = useState('');
  const [distance, setDistance] = useState('');
  const [amountPerKm, setAmountPerKm] = useState('');
  const [driverProficiencyBonus, setDriverProficiencyBonus] = useState('');
  const [commission, setCommission] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedTime, setSelectedTime] = useState({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
  });
  const [bookingHistory, setBookingHistory] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);

  useEffect(() => {
    fetchBookingHistory();
    fetchDriverData();
  }, []);

  const handlePayment = async () => {
    if (!phoneNumber || !totalAmount) {
      Alert.alert('Error', 'Please enter both phone number and amount.');
      return;
    }

    try {
      const response = await initiatePayment(phoneNumber, totalAmount);
      Alert.alert('Success', 'Payment initiated successfully.');
      console.log('Payment response:', response);
    } catch (error) {
      Alert.alert('Error', 'Please enter Phone in 254 Format.');
      console.error('Payment error:', error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const selectedDateTime = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
    const selectedTime = {
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
    setSelectedDate(selectedDateTime);
    setSelectedTime(selectedTime);
    hideDatePicker();
  };

  const fetchBookingHistory = async () => {
    try {
      const bookings = await getBookingDetails();
      setBookingHistory(bookings);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      Alert.alert('Error', 'Failed to fetch booking history.');
    }
  };

  const fetchDriverData = async () => {
    try {
      const details = await fetchDriverDetails();
      setActiveDrivers(details);
    } catch (error) {
      console.error('Error fetching driver data:', error);
      setActiveDrivers([]);
      Alert.alert('Error', 'Failed to fetch data.');
    }
  };

  const GOOGLE_MAPS_API_KEY = 'vNfZNGG4769cvzyI4NwTex31L0ksAHDO088kHWwWvSBaEKaIP5tMUyDrIVAUC0Or';

  const fetchDestinationDetails = async (origin, destination) => {
    try {
      console.log('Origin:', origin);
      console.log('Destination:', destination);

      const distanceResponse = await axios.get('https://api.distancematrix.ai/maps/api/distancematrix/json', {
        params: {
          origins: origin,
          destinations: destination,
          key: GOOGLE_MAPS_API_KEY,
        },
      });

      const distanceData = distanceResponse.data;
      console.log('Distance Matrix API Response:', distanceData);

      if (distanceData.rows[0].elements[0].status === 'OK') {
        const distance = distanceData.rows[0].elements[0].distance.text;
        setDistance(distance);

        const amountPerKm = 'Shs 17';
        const profbonus = 'Shs 10';
        setAmountPerKm(amountPerKm);
        setDriverProficiencyBonus(profbonus);
        const commission = 'Shs 10';
        setCommission(commission);

        let amount = (parseFloat(distance.replace(' km', '')) * parseFloat(amountPerKm.replace('Shs ', ''))) * 1.1 + parseFloat(profbonus.replace('Shs ', ''));
        console.log(amount);
        setTotalAmount(amount.toFixed(2));
      } else {
        Alert.alert('Error', 'Could not fetch distance data');
      }
    } catch (error) {
      console.error('Error fetching destination details:', error);
      Alert.alert('Error', 'Failed to fetch destination details.');
    }
  };

  const handleBookingTypeChange = (type) => {
    setSelectedBookingType(type);
    setSelectedUnit(null);
    setSelectedDriver(null);
    setDestination('');
    setDistance('');
    setAmountPerKm('');
    setDriverProficiencyBonus('');
    setCommission('');
    setTotalAmount('');
  };

  const handleUnitChange = (unit) => {
    setSelectedUnit(unit);
    setSelectedDriver(null);
  };

  const handleDriverSelection = (driver) => {
    setDriver(driver);
    setSelectedDriver(driver);
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      Alert.alert('Incomplete Information', 'Please enter both origin and destination.');
      return;
    }

    setIsLoading(true);
    await fetchDestinationDetails(origin, destination);
    setIsLoading(false);
  };

  const dateFormatting = `${selectedDate.day}/${selectedDate.month}/${selectedDate.year} At ${selectedTime.hours}:${selectedTime.minutes}`;
  const handleSubmit = async () => {
    const paymentSuccess = await handlePayment();
    if (!paymentSuccess) {
      return;
    }
    try {
      const bookingDetails = {
        Driver: driver.drname,
        time: dateFormatting,
        destination: destination,
        paymentDetails: parseFloat(totalAmount),
      };
      console.log(bookingDetails);

      await createBooking(bookingDetails);
      Alert.alert('Success', 'Booking created successfully.');

      setOrigin('');
      setDestination('');
      setSelectedDriver(null);
      setSelectedBookingType(null);
      setSelectedUnit(null);
      setDepartureDate(new Date());
      setDepartureTime('');
      setDistance('');
      setAmountPerKm('');
      setDriverProficiencyBonus('');
      setCommission('');
      setTotalAmount('');
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bookingTypeContainer}>
          <TouchableOpacity
            style={[
              styles.bookingTypeButton,
              selectedBookingType === 'travel' && styles.selectedButton,
            ]}
            onPress={() => handleBookingTypeChange('travel')}
          >
            <Text
              style={[
                styles.bookingTypeButtonText,
                selectedBookingType === 'travel' && styles.selectedButtonText,
              ]}
            >
              Book Travel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.bookingTypeButton,
              selectedBookingType === 'goods' && styles.selectedButton,
            ]}
            onPress={() => handleBookingTypeChange('goods')}
          >
            <Text
              style={[
                styles.bookingTypeButtonText,
                selectedBookingType === 'goods' && styles.selectedButtonText,
              ]}
            >
              Book Goods
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.bookingTypeButton,
              selectedBookingType === 'history' && styles.selectedButton,
            ]}
            onPress={() => handleBookingTypeChange('history')}
          >
            <Text
              style={[
                styles.bookingTypeButtonText,
                selectedBookingType === 'history' && styles.selectedButtonText,
              ]}
            >
              View History
            </Text>
          </TouchableOpacity>
        </View>

        {selectedBookingType === 'history' && (
          <FlatList
            data={bookingHistory}
            keyExtractor={(item) => item.$id.toString()}
            renderItem={({ item }) => (
              <View style={styles.bookingItem}>
                <Text style={styles.bookingText}>Driver: {item.Driver}</Text>
                <Text style={styles.bookingText}>Time: {item.time}</Text>
                <Text style={styles.bookingText}>Destination: {item.destination}</Text>
                <Text style={styles.bookingText}>Payment Details: {item.paymentDetails}</Text>
              </View>
            )}
          />
        )}

        {selectedBookingType === 'travel' && (

          <>
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Booking Instructions</Text>
              <Text style={styles.instructionsText}>
               1. Cancellation of booking more than 3 times will result in a refund of only 70% of the total travel amount.
              </Text>
              <Text style={styles.instructionsText}>
               2. Please ensure you are present 30 minutes before the scheduled time for time keeping.
              </Text>
              <Text style={styles.instructionsText}>
               3. Payment is Before Service and Transport Fee is Calculated in Price per KM.
              </Text>
              <Text style={styles.instructionsText}>
               4. Ensure to Give your Driver a Rating According to the Service you are Given.
              </Text>
              <Text style={styles.instructionsText}>
               5.Distance Accurancy is Measured with a 90% Accurancy from Google Maps.
              </Text>

            </View>
            <View style={styles.unitContainer}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  selectedUnit === 'Car' && styles.selectedButton,
                ]}
                onPress={() => handleUnitChange('Car')}
              >
                <Image source={icons.caricon} style={styles.unitIcon} />
                <Text
                  style={[
                    styles.unitButtonText,
                    selectedUnit === 'Car' && styles.selectedButtonText,
                  ]}
                >
                  Car
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.unitButton,
                  selectedUnit === 'Motorcycle' && styles.selectedButton,
                ]}
                onPress={() => handleUnitChange('Motorcycle')}
              >
                <Image source={icons.motoricon} style={styles.unitIcon} />
                <Text
                  style={[
                    styles.unitButtonText,
                    selectedUnit === 'Motorcycle' && styles.selectedButtonText,
                  ]}
                >
                  Motorcycle
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.unitButton,
                  selectedUnit === 'Van' && styles.selectedButton,
                ]}
                onPress={() => handleUnitChange('Van')}
              >
                <Image source={icons.lorryicon} style={styles.unitIcon} />
                <Text
                  style={[
                    styles.unitButtonText,
                    selectedUnit === 'Van' && styles.selectedButtonText,
                  ]}
                >
                  Van
                </Text>
              </TouchableOpacity>
            </View>

            {selectedUnit && (
              <>
                <Text style={styles.sectionTitle}>Select Active Driver</Text>
                <ScrollView
                  contentContainerStyle={styles.driverContainer}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {activeDrivers.map((driver, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.driverCard,
                        selectedDriver === driver && styles.selectedDriverCard,
                      ]}
                      onPress={() => handleDriverSelection(driver)}
                    >
                      <Image source={icons.profile} style={styles.driverImage} />
                      <Text style={styles.driverName}>{driver.drname}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.inputContainer}>
                  <Text style={styles.sectionTitle}>Origin:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter origin"
                    value={origin}
                    onChangeText={(text) => setOrigin(text)}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.sectionTitle}>Destination:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter destination"
                    value={destination}
                    onChangeText={(text) => setDestination(text)}
                  />
                </View>

                <View style={styles.searchButtonContainer}>
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.searchButtonText}>Calculate Fare</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.sectionTitle}>Departure Time:</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={showDatePicker}
                  >
                    <Text style={styles.datePickerButtonText}>
                      {selectedDate.day}/{selectedDate.month}/
                      {selectedDate.year}
                    </Text>
                  </TouchableOpacity>
                </View>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="datetime"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />

                <View style={styles.fareContainer}>
                  <Text style={styles.label}>Distance:</Text>
                  <Text style={styles.value}>{distance}</Text>
                </View>

                <View style={styles.fareContainer}>
                  <Text style={styles.label}>Amount per Km:</Text>
                  <Text style={styles.value}>{amountPerKm}</Text>
                </View>

                <View style={styles.fareContainer}>
                  <Text style={styles.label}>Driver Proficiency Bonus:</Text>
                  <Text style={styles.value}>{driverProficiencyBonus}</Text>
                </View>

                <View style={styles.fareContainer}>
                  <Text style={styles.label}>Commission:</Text>
                  <Text style={styles.value}>{commission}</Text>
                </View>

                <View style={styles.fareContainer}>
                  <Text style={styles.label}>Total Amount:</Text>
                  <Text style={styles.value}>{totalAmount}</Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.sectionTitle}>Phone Number (2547..)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text)}
                  />
                </View>

                <View style={styles.submitButtonContainer}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    width: '100%',
    alignItems:'center',
  },
  
  bookingTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal:0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#161622',
    borderRadius: 1,
    width: '100%',
  },

  bookingTypeButton: {
    padding: 10,
    backgroundColor: '#161622',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  bookingTypeButtonText: {
    color: 'orange',
  },
  selectedButtonText: {
    color: 'orange',
  },
  unitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    marginHorizontal:0,
  },
  unitButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#161622',
  },
  unitIcon: {
    width: 50,
    height: 40,
    marginBottom: 5,
  },
  unitButtonText: {
    color: 'orange',
  },
  selectedButton: {
    backgroundColor: 'orange',
    borderColor: '#161622',
  },
  selectedButtonText: {
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign:'center',
  },
  driverContainer: {
    flexDirection: 'row',
    marginLeft:20,
    marginRight:20,
    marginBottom: 20,
  },
  driverCard: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#161622',
    marginRight: 20,
    marginLeft:10,
  },
  selectedDriverCard: {
    borderColor: 'orange',
  },
  driverImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  driverName: {
    fontSize: 14,
    color: '#161622',
  },
  inputContainer: {
    marginVertical: 10,
    marginEnd:20,
    marginLeft:20,
    borderRadius:50,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchButtonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  searchButton: {
    padding: 15,
    backgroundColor: 'orange',
    borderRadius: 20,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  datePickerButtonText: {
    color: '#161622',
  },
  fareContainer: {
    flexDirection: 'row',
    paddingEnd:10,
    paddingLeft:20,
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButtonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  instructionsContainer: {
    marginTop:20,
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 8,
    border:'green',
    borderColor:'green',
    marginLeft:20,
    marginRight:20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  submitButton: {
    padding: 15,
    backgroundColor: 'orange',
    borderRadius: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  bookingItem: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
  },
  bookingText: {
    fontSize: 14,
  },
});

export default Booking;
