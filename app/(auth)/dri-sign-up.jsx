import { View, Image, ScrollView, Text, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { createDriver } from "../../lib/appwrite";
import { Link, router } from "expo-router";

const DriverSignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    vehicleRegNumber: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const submit = async () => {
    if (!validateEmail(form.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createDriver(
        form.email,
        form.password,
        form.username,
        form.vehicleRegNumber,
        form.phoneNumber
      );
      router.replace("/home-dri");
    } catch (error) {
      console.error("Error creating user:", error);
      Alert.alert("Error", "Sign up Failed. Please Retry!");
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.title}>Driver Sign Up</Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={styles.formField}
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={styles.formField}
            keyboardType="email-address"
          />
          <FormField
            title="Vehicle Registration Number"
            value={form.vehicleRegNumber}
            handleChangeText={(e) => setForm({ ...form, vehicleRegNumber: e })}
            otherStyles={styles.formField}
          />
          <FormField
            title="Phone Number"
            value={form.phoneNumber}
            handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
            otherStyles={styles.formField}
            keyboardType="phone-pad"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.formField}
            secureTextEntry
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>Have an Account Already?</Text>
            <Link href="/sign-in" style={styles.footerLink}>
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  logo: {
    width: 85,
    height: 85,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  formField: {
    marginTop: 10,
    width: "100%",
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
  },
  footerText: {
    color: "#fff",
    fontSize: 16,
  },
  footerLink: {
    color: "#1E90FF",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default DriverSignUp;
