import { Text } from "react-native";
import { Link, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiContext } from "@/context/ApiContext";
import { useContext } from "react";


export default function Index() {

  const apiContext = useContext(ApiContext);
  if (!apiContext) return null;

  const { loading, isLoggedIn } = apiContext;

  if (!loading && isLoggedIn) return <Redirect href="/(tabs)/home" />;

  // if (!loading && !isLoggedIn) return <Redirect href="/login" />;
  if (!loading && !isLoggedIn) return <Redirect href="/assessment" />;


  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Text>BeaconMind</Text>
      <Link href="/login" style={{ marginTop: 20, color: "blue" }}>
        Login
      </Link>
      <Link href="/register" style={{ color: "blue" }}>
        Register
      </Link>
      <Link href="/home" style={{ color: "blue" }}>
        Home
      </Link>
      <Link href="/chat" style={{ color: "blue" }}>
        Chat
      </Link> */}

      <Text style={{ fontFamily: "Playwrite_DE_LA", fontSize: 30 }}>
        BeaconMind
      </Text>
    </SafeAreaView>
  );
}
