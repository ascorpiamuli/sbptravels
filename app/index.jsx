import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router"; // Import useRouter
import { Video } from "expo-av";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { StyleSheet } from "react-native";
import { useGlobalContext } from "../context/GlobalProvider";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();
  const router = useRouter(); // Initialize router

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  const handleButtonPress = () => {
    router.push("/sign-in"); // Navigate to sign-in
  };
  const handleButtonPressDriver = () => {
    router.push("/dri-sign-in"); //Navigate to driver's portal sign in
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#161622" }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Video
            source={require("../assets/videos/logo-presentation.mp4")}
            rate={0.7}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            isLooping
            style={styles.video}
          />
          <View style={styles.textView}>
            <Text style={styles.mainText}>
              <Text style={styles.highlightText}> Your Gateway </Text> to
              Luxurious Journeys.
            </Text>
            <Image
              source={images.path}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.descriptionText}>
            Discover the world with the precision and luxury that only Scorpio
            Travels can provide.
          </Text>
          <CustomButton
            title="Client Portal"
            handlePress={handleButtonPress}
            containerStyles={styles.button}
          />
          <CustomButton
            title="Driver Portal"
            handlePress={handleButtonPressDriver}
            containerStyles={styles.button}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  video: {
    width: 250,
    height: 240,
  },
  textView: {
    position: "relative",
    marginTop: 68,
    alignItems: "center",
  },
  mainText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  highlightText: {
    color: "#f0ad4e",
  },
  image: {
    width: 154,
    height: 15,
    position: "absolute",
    bottom: -12,
    left: 0,
  },
  descriptionText: {
    fontSize: 14,
    color: "#d1d1d1",
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  button: {
    width: "100%",
    marginTop: 28,
  },
});
