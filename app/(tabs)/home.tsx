import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { styles } from "@/styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Redirect } from "expo-router";
import { ApiContext } from "@/context/ApiContext";

const Home = () => {

  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("Login must be used within an ApiProvider");
  }
  const { loading, isLoggedIn, user, status } = apiContext;

  // if (!loading && isLoggedIn && !user.profile_setup_complete && user.role === "student") {
  //   console.log("home.tsx:16 - Redirecting to profile setup", user.profile_setup_complete);
  //   return <Redirect href="/profile-setup" />;}

  return (
    <SafeAreaView style={{...styles.container, paddingTop: 50}}>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Image
          source={require("@/assets/images/chat/profile.png")}
          style={{ width: 200, height: 200 }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // router.push("/chat");
            // router.push("/assessment");
            if (status === "chat") {
              router.push("/chat");
            }
            else if (status === "assessment") {
              router.push("/assessment");
            }
            else {
              console.log("`status` is not set. Redirecting to chat.");
              router.push("/chat");
            }
          }}
        >
          <View style={styles.inOneLine}>
            <MaterialIcons name="chat" size={30} color="#eee" />
            <Text style={styles.buttonText}>Chat here</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: '#000', paddingHorizontal: 15, borderRadius: 10 }}
          onPress={() => {
            router.push("/assessment");
          }}
        >
          <View style={styles.inOneLine}>
            <Text style={styles.buttonText}>
              Take the assessment
            </Text>
            <MaterialIcons name="arrow-forward" size={30} color="#eee" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
