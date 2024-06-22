import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView } from "react-native";
import { Link } from "expo-router";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontFamily: 'Poppins-Black' }}>Stephen</Text>
      <StatusBar style="auto" />
      <Link href="home" style={{ color: 'blue' }}>Go to Home</Link>
    </View>
  );
}
