import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NotificationPopup = ({ message, onClose, type }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fadeOut = () => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000, // Fade-out duration
        useNativeDriver: true,
      }).start(() => onClose());
    };

    const timer = setTimeout(fadeOut, 2000); // Start fade-out after 2 seconds

    return () => {
      clearTimeout(timer);
      opacity.setValue(1); // Reset opacity for next notification
    };
  }, [opacity, onClose]);

  const backgroundColor = type === "success" ? "green" : "red";

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity
        style={[styles.notification, { backgroundColor }]}
        onPress={onClose}
      >
        <Ionicons name="notifications" size={24} color="white" />
        <Text style={styles.message}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  notification: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  message: {
    marginLeft: 12,
    color: "white",
    fontSize: 16,
  },
});

export default NotificationPopup;
