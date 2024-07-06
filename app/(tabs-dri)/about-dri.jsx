import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { images } from "../../constants";
import { icons } from "../../constants";

const About = () => {
  const [notifications, setNotifications] = useState({
    car: 2,
    motor: 3,
    lorry: 1,
  }); // Example notification counts

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.username}>About Us</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Overview</Text>
          <Text style={styles.sectionText}>
            Welcome to SBP Travels, where we create memorable travel
            experiences. Our mission is to provide exceptional service and
            unforgettable journeys.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <View style={styles.teamContainer}>
            <View style={styles.teamMember}>
              <Image source={images.profile} style={styles.teamImage} />
              <Text style={styles.teamName}>Stephen Muli</Text>
              <Text style={styles.teamRole}>Founder & CEO</Text>
            </View>
            <View style={styles.teamMember}>
              <Image source={images.profile} style={styles.teamImage} />
              <Text style={styles.teamName}>Benedict Musyoki</Text>
              <Text style={styles.teamRole}>Operations Manager</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <Text style={styles.sectionText}>
            At SBP Travels, we offer a variety of travel packages including
            adventure treks, cultural tours, and customized itineraries to meet
            your needs.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Testimonials</Text>
          <Text style={styles.sectionText}>
            "SBP Travels made our trip unforgettable! Highly recommended." -
            Judith Muli
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.sectionText}>Phone: +254795751700</Text>
          <Text style={styles.sectionText}>Email: info@sbptreks.com</Text>
        </View>

        <View style={styles.socialMediaContainer}>
          <TouchableOpacity style={styles.socialMediaIcon}>
            <Ionicons name="logo-facebook" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialMediaIcon}>
            <Ionicons name="logo-twitter" size={24} color="skyblue" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialMediaIcon}>
            <Ionicons name="logo-instagram" size={24} color="purple" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialMediaIcon}>
            <Ionicons name="logo-tiktok" size={24} color="purple" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialMediaIcon}>
            <Ionicons name="logo-github" size={24} color="purple" />
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
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333",
  },
  sectionText: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
  },
  teamContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  teamMember: {
    alignItems: "center",
    width: "45%",
  },
  teamImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  teamRole: {
    fontSize: 14,
    color: "#666666",
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  socialMediaIcon: {
    marginHorizontal: 10,
  },
});

export default About;
