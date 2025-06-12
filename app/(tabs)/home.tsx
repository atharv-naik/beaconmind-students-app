import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { styles } from "@/styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Redirect } from "expo-router";
import { ApiContext } from "@/context/ApiContext";

const Home = () => {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("Home must be used within an ApiProvider");
  }
  const { loading, isLoggedIn, user, status, setStatus } = apiContext;

  return (
    <SafeAreaView style={{ ...styles.container, paddingTop: 50 }}>
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

        {status === "assessment" ? (
          <>
            {/* Continue Assessment (Primary if assessment) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/assessment")}
            >
              <View style={styles.inOneLine}>
                <MaterialIcons name="assignment" size={30} color="#eee" />
                <Text style={styles.buttonText}>Continue Assessment</Text>
              </View>
            </TouchableOpacity>

            {/* Start New Chat (Secondary if assessment) */}
            <TouchableOpacity
              style={{ backgroundColor: "#000", paddingHorizontal: 15, borderRadius: 10 }}
              onPress={() => {
                setStatus("chat");
                router.push("/chat");
              }}
            >
              <View style={styles.inOneLine}>
                <Text style={styles.buttonText}>Start New Chat</Text>
                <MaterialIcons name="arrow-forward" size={30} color="#eee" />
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Chat Here (Primary if chat) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/chat")}
            >
              <View style={styles.inOneLine}>
                <MaterialIcons name="chat" size={30} color="#eee" />
                <Text style={styles.buttonText}>Chat Here</Text>
              </View>
            </TouchableOpacity>

            {/* Start Assessment (Secondary if chat) */}
            <TouchableOpacity
              style={{ backgroundColor: "#000", paddingHorizontal: 15, borderRadius: 10 }}
              onPress={() => router.push("/assessment")}
            >
              <View style={styles.inOneLine}>
                <Text style={styles.buttonText}>Form Assessments</Text>
                <MaterialIcons name="arrow-forward" size={30} color="#eee" />
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
