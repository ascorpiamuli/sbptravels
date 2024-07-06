import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  RefreshControl,
  Button,
  Modal,
} from "react-native";
import DriverStatistics, { DriverStats } from "../../components/DriverStats";
import NotificationPopup, { PopupNotify } from "../../components/PopupNotify";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { images, icons } from "../../constants";
import { Icon } from "react-native-elements/dist/icons/Icon";
import {
  getCurrentDriverUser,
  getDriverBookings,
  markBookingAsRead,
  notifyDriverOnBooking,
  updateBookingStatus,
} from "../../lib/appwrite"; // Assuming these functions exist in appwrite.js
import Notification from "../../components/Notifications"; // Import the notification component

const Home = () => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [notifications, setNotifications] = useState(0); // Notification count
  const [bookings, setBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [declinedBookings, setDeclinedBookings] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [newBookingNotification, setNewBookingNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [driverStats, setDriverStats] = useState({
    score: 0,
    successfulTrips: 0,
    unsuccessfulTrips: 0,
  });
  const fetchBookings = async () => {
    try {
      const bookings = await notifyDriverOnBooking(name);
      setBookings(bookings);
      const unreadCount = bookings.filter((booking) => !booking.isRead).length;
      setNotifications(unreadCount);

      // Separate accepted,upcoming and declined bookings
      const upcoming = bookings.filter(
        (booking) => booking.status === "Pending Review"
      );
      const accepted = bookings.filter(
        (booking) => booking.status === "accepted"
      );
      const declined = bookings.filter(
        (booking) => booking.status === "declined"
      );
      setUpcomingBookings(upcoming);
      setAcceptedBookings(accepted);
      setDeclinedBookings(declined);

      // Update driver statistics
      const successfulTrips = accepted.length;
      const unsuccessfulTrips = declined.length;
      const score = successfulTrips - unsuccessfulTrips; // Example score calculation
      setDriverStats({
        score,
        successfulTrips,
        unsuccessfulTrips,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  const fetchUserName = async () => {
    try {
      const currUser = await getCurrentDriverUser();
      if (currUser) {
        setName(currUser.username);
        setUserId(currUser.$id);
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    fetchUserName();
    const intervalId = setInterval(() => {
      if (userId) {
        fetchBookings();
      }
    }, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId);
  }, [userId]);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchBookings().finally(() => setRefreshing(false));
  }, [fetchBookings]);

  const toggleAvailability = () => {
    setIsActive((prev) => !prev);
  };

  const handleMarkAsRead = async (bookingId) => {
    try {
      await markBookingAsRead(bookingId);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, isRead: true } : booking
        )
      );
      setNotifications((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark booking as read:", error);
      Alert.alert("Error", "Failed to mark booking as read.");
    }
  };
  const handleNotificationClick = async () => {
    setModalMessage("You clicked on the notification badge.");
    setModalVisible(true);
    setNotifications(0); // Clear notifications on click
  };

  const handleBookingResponse = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.$id === bookingId ? { ...booking, status } : booking
        )
      );
      const type = status === "accepted" ? "success" : "decline";
      setNewBookingNotification(`Booking ${status} successfully.`);
      setNotificationType(type);
      if (status === "accepted") {
        setAcceptedBookings((prev) => [
          ...prev,
          bookings.find((booking) => booking.$id === bookingId),
        ]);
        setNewBookingNotification("Booking accepted successfully.");
      } else if (status === "declined") {
        setDeclinedBookings((prev) => [
          ...prev,
          bookings.find((booking) => booking.$id === bookingId),
        ]);
        setNewBookingNotification("Booking declined successfully.");
      }
    } catch (error) {
      console.error(`Failed to ${status} booking:`, error);
      Alert.alert("Error", `Failed to ${status} booking.`);
    }
  };
  const clearNotifications = () => {
    setUpcomingBookings([]);
    setAcceptedBookings([]);
    setDeclinedBookings([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>Welcome Back</Text>
            <Text style={styles.username}>Driver {name}</Text>
          </View>
          <TouchableOpacity
            style={styles.imgContainer}
            onPress={handleNotificationClick}
          >
            <Image
              source={images.logoSmall}
              style={styles.img}
              resizeMode="contain"
            />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{notifications}</Text>
              </View>
            )}
            <Notification
              visible={modalVisible}
              message="You clicked on the notification badge."
              onClose={() => setModalVisible(false)}
              bookings={bookings}
            />
          </TouchableOpacity>
        </View>
        <DriverStatistics driverStats={driverStats} />
        <View style={styles.instructionsContainer}>
          <Icon
            name="lightbulb-on-outline"
            type="material-community"
            size={30}
            color="green"
          />
          <Text style={styles.instructionsTitlest}>Booking Instructions</Text>
          <Text style={styles.instructionsText}>
            1. Cancellation of Already Accepted bookings will result in a Deduct
            of 10% of your Income From Your Next Booking
          </Text>
          <Text style={styles.instructionsText}>
            2. Please ensure you are present 30 minutes before the scheduled
            time at the Client's Destination
          </Text>
          <Text style={styles.instructionsText}>
            3. You will be Paid After servicing Your Customer.
          </Text>
          <Text style={styles.instructionsText}>
            4. Ensure to Give your Customer a Rating.
          </Text>
          <Text style={styles.instructionsText}>
            5.Distance Accurancy is Measured with a 90% Accurancy from Google
            Maps.Any alteration may be Presented to the Contact us page for
            Correction
          </Text>
          <Text style={styles.instructionsText}>
            6.By Accepting Bookings,You agree with SBP Treks Privancy Terms and
            Policies.
          </Text>
          <Text style={styles.instructionsText}>
            7.Ensure to have a Greater than 50% Success Rate to Boost your
            Proficiency Bonus.Also avoid doing Booking Cancellation and declines
            which may result in poor Progress
          </Text>
        </View>
        {newBookingNotification && (
          <NotificationPopup
            message={newBookingNotification}
            type={notificationType}
            onClose={() => setNewBookingNotification(null)}
          />
        )}

        <Text style={styles.sectionTitle}>Available Bookings</Text>
        {bookings
          .sort((a, b) => b.time.localeCompare(a.time)) // Ensure bookings are sorted by time in descending order
          .map((booking) => (
            <View
              key={booking.id}
              style={[
                styles.instructionsContainer,
                booking.status === "accepted"
                  ? styles.acceptedBooking
                  : booking.status === "declined"
                  ? styles.declinedBooking
                  : {},
              ]}
            >
              <Text style={styles.instructionsTitle}>
                Booking From {booking.clientName}
              </Text>
              <Text style={styles.instructionsTitle}>Time: {booking.time}</Text>
              <Text style={styles.instructionsTitle}>
                Pick Up Stage: {booking.origin}
              </Text>
              <Text style={styles.instructionsTitle}>
                Destination: {booking.destination}
              </Text>
              <Text style={styles.instructionsTitle}>
                Payment: {booking.paymentDetails}
              </Text>
              <Text style={styles.instructionsTitle}>
                Booking ID: {booking.$id}
              </Text>
              <Text style={styles.instructionsTitle}>
                ClientID: {booking.userId}
              </Text>
              <Text style={styles.instructionsTitle}>
                Status:{" "}
                {booking.status === "accepted"
                  ? "Booking Accepted"
                  : booking.status === "declined"
                  ? "Booking Declined"
                  : "Pending"}
              </Text>
              {booking.status === "Pending Review" && (
                <View style={styles.bookingActions}>
                  <Button
                    title="Accept"
                    onPress={() =>
                      handleBookingResponse(booking.$id, "accepted")
                    }
                    color="#4CAF50"
                  />
                  <Button
                    title="Decline"
                    onPress={() =>
                      handleBookingResponse(booking.$id, "declined")
                    }
                    color="#F44336"
                  />
                </View>
              )}
            </View>
          ))}
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
      <Notification
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
        upcomingBookings={upcomingBookings}
        acceptedBookings={acceptedBookings}
        declinedBookings={declinedBookings}
        clearNotifications={clearNotifications}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 10,
    backgroundColor: "#161622",
    borderRadius: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  username: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imgContainer: {
    position: "relative",
    width: 36,
    height: 40,
  },
  img: {
    width: "100%",
    height: "100%",
  },
  fareContainer: {
    flexDirection: "row",
    paddingEnd: 10,
    paddingLeft: 20,
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statsText: {
    marginTop: 5,
    fontSize: 16,
  },
  notificationBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  instructionsContainer: {
    marginTop: 20,
    backgroundColor: "orange",
    padding: 12,
    borderRadius: 8,
    border: "green",
    borderColor: "green",
    marginLeft: 20,
    marginRight: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  acceptedBooking: {
    backgroundColor: "lightgreen",
  },
  declinedBooking: {
    backgroundColor: "lightcoral",
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructionsTitlest: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  instructionsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 20,
    color: "black",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  bookingItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "green",
    marginBottom: 10,
  },
  unreadBooking: {
    backgroundColor: "green",
  },
  bookingText: {
    fontSize: 16,
    marginBottom: 5,
  },
  bookingActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsContainer: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Home;
