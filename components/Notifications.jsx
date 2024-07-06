import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const Notification = ({
  visible,
  message,
  onClose,
  clearNotifications,
  upcomingBookings = [],
  acceptedBookings = [],
  declinedBookings = [],
}) => {
  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.modalHeader}>Notifications</Text>
            <Text style={styles.sectionHeader}>Upcoming Bookings</Text>
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <View key={booking.id} style={styles.bookingItem}>
                  <Text style={styles.bookingText}>Time: {booking.time}</Text>
                  <Text style={styles.bookingText}>
                    Destination: {booking.destination}
                  </Text>
                  <Text style={styles.bookingText}>
                    Payment: {booking.paymentDetails}
                  </Text>
                  <Text style={styles.bookingStatusUpcoming}>
                    Status: Upcoming
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noBookingsText}>
                There are no bookings received yet.
              </Text>
            )}
            <Text style={styles.sectionHeader}>Accepted Bookings</Text>
            {acceptedBookings.length > 0 ? (
              acceptedBookings.map((booking) => (
                <View key={booking.id} style={styles.bookingItem}>
                  <Text style={styles.bookingText}>Time: {booking.time}</Text>
                  <Text style={styles.bookingText}>
                    Destination: {booking.destination}
                  </Text>
                  <Text style={styles.bookingText}>
                    Payment: {booking.paymentDetails}
                  </Text>
                  <Text style={styles.bookingStatusAccepted}>
                    Status: Accepted
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noBookingsText}>
                There are no bookings received yet.
              </Text>
            )}
            <Text style={styles.sectionHeader}>Declined Bookings</Text>
            {declinedBookings.length > 0 ? (
              declinedBookings.map((booking) => (
                <View key={booking.id} style={styles.bookingItem}>
                  <Text style={styles.bookingText}>Time: {booking.time}</Text>
                  <Text style={styles.bookingText}>
                    Destination: {booking.destination}
                  </Text>
                  <Text style={styles.bookingText}>
                    Payment: {booking.paymentDetails}
                  </Text>
                  <Text style={styles.bookingStatusDeclined}>
                    Status: Declined
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noBookingsText}>
                There are no bookings received yet.
              </Text>
            )}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearNotifications}
            >
              <Text style={styles.clearText}>Clear Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#161622",
    padding: 20,
    borderRadius: 8,
    width: "90%",
    height: "80%",
  },
  scrollView: {
    marginVertical: 10,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  bookingItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#333333",
    borderRadius: 5,
  },
  bookingText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  bookingStatusUpcoming: {
    fontSize: 16,
    color: "#FFD700",
    marginTop: 5,
  },
  bookingStatusAccepted: {
    fontSize: 16,
    color: "green",
    marginTop: 5,
  },
  bookingStatusDeclined: {
    fontSize: 16,
    color: "red",
    marginTop: 5,
  },
  noBookingsText: {
    fontSize: 16,
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#DDDDDD",
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  clearButton: {
    padding: 10,
    backgroundColor: "#FF0000",
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginLeft: 10,
  },
  closeText: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
  },
  clearText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default Notification;
