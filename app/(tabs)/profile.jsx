import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { images, icons } from "../../constants";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { signOut, getCurrentUser } from "../../lib/appwrite"; // Ensure this import points to where your Appwrite functions are defined

const Profile = () => {
  const [notifications, setNotifications] = useState({
    car: 2,
    motor: 3,
    lorry: 1,
  }); // Example notification counts
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+123456789");
  const [address, setAddress] = useState("123 Street, City, Country");
  const navigation = useNavigation(); // Initialize useNavigation
  const [currentUser, setCurrentUser] = useState([]);

  const handleUpdateProfile = () => {
    // Update profile logic
    Alert.alert(
      "Profile Updated",
      "Your profile information has been updated successfully."
    );
  };

  const handleLogout = async () => {
    try {
      await signOut();
      Alert.alert("Logged Out", "You have been logged out successfully.");
      navigation.navigate("index");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };
  const handleGetCurrentUser = async () => {
    try {
      const currUser = await getCurrentUser();
      setCurrentUser(currUser);
    } catch (error) {
      Alert.alert("No User Found", error.message);
    }
  };
  console.log(handleGetCurrentUser);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.username}>Profile</Text>
          </View>
          <TouchableOpacity style={styles.imgContainer}>
            <Image
              source={images.logoSmall}
              style={styles.img}
              resizeMode="contain"
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

        <View style={styles.profileSection}>
          <Image source={images.profile} style={styles.profileImage} />
          <TouchableOpacity style={styles.changePictureButton}>
            <Text style={styles.changePictureButtonText}>Change Picture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => currentUser.username}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => currentUser.email}
          />
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={(text) => currentUser.phone}
          />
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={(text) => setAddress(text)}
          />
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
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
  username: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
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
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePictureButton: {
    backgroundColor: "#161622",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  changePictureButtonText: {
    color: "#ffffff",
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: "orange",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  updateButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default Profile;
