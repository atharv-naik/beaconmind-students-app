import { Text } from "react-native";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiContext } from "@/context/ApiContext";
import { useContext } from "react";
import Loader from "@/components/Loader";

export default function Index() {
  const apiContext = useContext(ApiContext);
  if (!apiContext) return null;

  const { loading, isLoggedIn, user, isProfileSetup } = apiContext;

  const userIsLoaded = !!user && Object.keys(user).length > 0;

  console.log("Index.tsx:10 - ", { loading, isLoggedIn, user, isProfileSetup, userIsLoaded });

  if (loading || (isLoggedIn && !userIsLoaded)) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Loading...</Text>
        <Loader loading={true} />
      </SafeAreaView>
    );
  }

  if (isLoggedIn && user?.role === "student" && !isProfileSetup) {
    console.log("Redirecting to profile setup");
    return <Redirect href="/profile-setup" />;
  }

  if (isLoggedIn) {
    console.log("Redirecting to home", { user, isProfileSetup });
    return <Redirect href="/(tabs)/home" />;
  }

  console.log("Redirecting to login");
  return <Redirect href="/login" />;
}
