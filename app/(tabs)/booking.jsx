import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Image, Text, TextInput, TouchableOpacity, ScrollView,TimePickerAndroid, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import { icons } from '../../constants';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


const Booking = () => {
  const [selectedBookingType, setSelectedBookingType] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [departureTime, setDepartureTime] = useState('');
  const [distance, setDistance] = useState('');
  const [condition, setCondition] = useState('');
  const [amountPerKm, setAmountPerKm] = useState('');
  const [driverProficiencyBonus, setDriverProficiencyBonus] = useState('');
  const [loadFee, setLoadFee] = useState('');
  const [commission, setCommission] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [totalCommission, setTotalCommission] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1, // Month is zero-based, so we add 1
    year: new Date().getFullYear(),
  });
  const [selectedTime, setSelectedTime] = useState({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
  });

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
  }
  const [activeDrivers, setActiveDrivers] = useState([
    { id: '1', name: 'John Doe', status: 'Free', image: icons.profile, vehicleRegNumber: 'ABC 123', proficiency: 'Expert', successRate: '95%', phoneNumber: '+1234567890' },
    { id: '2', name: 'Jane Smith', status: 'On Job', image: icons.profile, vehicleRegNumber: 'XYZ 456', proficiency: 'Intermediate', successRate: '85%', phoneNumber: '+1987654321' },
    { id: '3', name: 'Bob Brown', status: 'Free', image: icons.profile, vehicleRegNumber: 'DEF 789', proficiency: 'Beginner', successRate: '70%', phoneNumber: '+1122334455' },
  ]);

  useEffect(() => {
    // Simulate initial data load or API call on component mount
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    // Simulate fetching driver data from an API
    // This function can be replaced with actual API calls
    // For demonstration purposes, setting a timeout to simulate async behavior
    setTimeout(() => {
      // Set initial driver data
      setActiveDrivers([
        { id: '1', name: 'John Doe', status: 'Free', image: icons.profile, vehicleRegNumber: 'ABC 123', proficiency: 'Expert', successRate: '95%', phoneNumber: '+1234567890' },
        { id: '2', name: 'Jane Smith', status: 'On Job', image: icons.profile, vehicleRegNumber: 'XYZ 456', proficiency: 'Intermediate', successRate: '85%', phoneNumber: '+1987654321' },
        { id: '3', name: 'Bob Brown', status: 'Free', image: icons.profile, vehicleRegNumber: 'DEF 789', proficiency: 'Beginner', successRate: '70%', phoneNumber: '+1122334455' },
      ]);
    }, 1000); // Simulating a delay of 1 second
  };

  const fetchDestinationDetails = async () => {
    // Simulate fetching destination details from a Maps API
    // For demonstration purposes, using a timeout to mimic async behavior
    setTimeout(() => {
      setDistance('15 km');
      setCondition('Good');
      setAmountPerKm('Shs 2');
      setDriverProficiencyBonus('Shs 5');
      setLoadFee('Shs 20');
      setCommission('10');

      // Calculate totals
      const amount = parseFloat(distance) * parseFloat(amountPerKm.replace('Shs ', ''));

      setTotalAmount(amount.toFixed(2));
    }, 1500); // Simulating a delay of 1.5 seconds
  };

  const handleBookingTypeChange = (type) => {
    setSelectedBookingType(type);
    setSelectedUnit(null);
    setSelectedDriver(null);
    setDestination('');
    setDistance('');
    setCondition('');
    setAmountPerKm('');
    setDriverProficiencyBonus('');
    setLoadFee('');
    setCommission('');
    setTotalAmount('');
    setTotalCommission('');
  };

  const handleUnitChange = (unit) => {
    setSelectedUnit(unit);
    setSelectedDriver(null);
  };

  const handleDriverSelection = (driver) => {
    setSelectedDriver(driver);
  };

  const handleSearch = () => {
    fetchDestinationDetails();
  };

  const handleDateChange = (date) => {
    setDepartureDate(date);
  };
;
  

  const handleSubmit = () => {
    if (!selectedDriver || !destination || !totalAmount || !totalCommission || !departureTime) {
      Alert.alert('Incomplete Information', 'Please select a driver, enter destination, set departure time, and search before submitting.');
      return;
    }

    // Example submission logic (replace with actual backend integration)
    const bookingDetails = {
      selectedBookingType,
      selectedUnit,
      selectedDriver,
      destination,
      departureDate,
      departureTime,
      totalAmount,
      totalCommission,
    };

    console.log('Booking Details:', bookingDetails);
    // Simulated submission success alert
    Alert.alert('Booking Submitted', 'Your booking details have been successfully submitted.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Bookings</Text>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select the type of booking to continue</Text>
          <View style={styles.bookingTypeContainer}>
            <TouchableOpacity style={[styles.bookingTypeButton, selectedBookingType === 'Travel' && styles.selectedBookingTypeButton]} onPress={() => handleBookingTypeChange('Travel')}>
              <Text style={styles.bookingTypeText}>Travel Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bookingTypeButton, selectedBookingType === 'Carriage' && styles.selectedBookingTypeButton]} onPress={() => handleBookingTypeChange('Carriage')}>
              <Text style={styles.bookingTypeText}>Carriage Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
        {selectedBookingType === 'Travel' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select the unit of carriage</Text>
            <View style={styles.unitSelectionContainer}>
              <TouchableOpacity style={[styles.unitItem, selectedUnit === 'Car' && styles.selectedUnitItem]} onPress={() => handleUnitChange('Car')}>
                <Image source={icons.caricon} style={styles.unitImage} />
                <Text style={styles.unitText}>Car</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.unitItem, selectedUnit === 'Motorcycle' && styles.selectedUnitItem]} onPress={() => handleUnitChange('Motorcycle')}>
                <Image source={icons.motoricon} style={styles.unitImage} />
                <Text style={styles.unitText}>Motorcycle</Text>
              </TouchableOpacity>
            </View>
            {selectedUnit && (
              <>
                <Text style={styles.sectionTitle}>Select an active driver</Text>
                <ScrollView style={styles.driverListContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Name</Text>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Vehicle Reg Number</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Proficiency</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Success Rate</Text>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Phone Number</Text>
                  </View>
                  {activeDrivers.map(driver => (
                    <TouchableOpacity
                      key={driver.id}
                      style={[styles.driverItem, selectedDriver?.id === driver.id && styles.selectedDriverItem]}
                      onPress={() => handleDriverSelection(driver)}
                    >
                      <Text style={[styles.driverText, { flex: 2 }]}>{driver.name}</Text>
                      <Text style={[styles.driverText, { flex: 2 }]}>{driver.vehicleRegNumber}</Text>
                      <Text style={[styles.driverText, { flex: 1.5 }]}>{driver.proficiency}</Text>
                      <Text style={[styles.driverText, { flex: 1.5 }]}>{driver.successRate}</Text>
                      <Text style={[styles.driverText, { flex: 2 }]}>{driver.phoneNumber}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <Text style={styles.sectionTitle}>Departure Time</Text>
                <TouchableOpacity style={styles.input} onPress={showDatePicker}>
                  <Text>{departureTime || 'Select departure time'}</Text>
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>Destination</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter destination"
                  value={destination}
                  onChangeText={setDestination}
                />
 

                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
                {totalAmount && (
                 <View style={styles.resultsContainer}>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Departure Time:</Text>
                      <Text style={styles.resultValue}>On {`${selectedDate.day}/${selectedDate.month}/${selectedDate.year} At ${selectedTime.hours}:${selectedTime.minutes}`}</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Distance:</Text>
                      <Text style={styles.resultValue}>{distance}</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Condition:</Text>
                      <Text style={styles.resultValue}>{condition}</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Amount per Km:</Text>
                      <Text style={styles.resultValue}>{amountPerKm}</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Driver Proficiency Bonus:</Text>
                      <Text style={styles.resultValue}>{driverProficiencyBonus}</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Load Fee:</Text>
                      <Text style={styles.resultValue}>{loadFee}</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Commission:</Text>
                      <Text style={styles.resultValue}>{commission}%</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Total Amount to Pay:</Text>
                      <Text style={styles.resultValue}>Shs {totalAmount}</Text>
                    </View>

                  </View>
               
                )}
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="datetime" // or "datetime" for date and time picker
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 10,
    backgroundColor: '#161622',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    width: '50%', // Adjust width as needed
  },
  resultValue: {
    fontSize: 16,
    color: 'black',
    textAlign: 'right',
    width: '50%', // Adjust width as needed
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  bookingTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bookingTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    backgroundColor: '#161622',
  },
  selectedBookingTypeButton: {
    backgroundColor: '#FF9C01',
  },
  bookingTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  unitSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    alignItems: 'center',
    marginLeft: 20,
  },
  unitItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  selectedUnitItem: {
    borderColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 8,
  },
  unitImage: {
    width: 50,
    height: 50,
  },
  unitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 5,
  },
  driverListContainer: {
    flex: 1,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedDriverItem: {
    backgroundColor: '#FF9C01',
  },
  driverText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: 'black',
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#161622',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  destinationDetailsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  destinationDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  destinationDetailTable: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  destinationDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  destinationDetailLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  destinationDetailText: {
    flex: 2,
    fontSize: 16,
    color: 'black',
  },
  totalLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  totalText: {
    flex: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#FF9C01',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom:20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateTimeContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  dateTimeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  datePicker: {
    marginBottom: 20,
  },
  timePickerButton: {
    backgroundColor: '#161622',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Booking;
