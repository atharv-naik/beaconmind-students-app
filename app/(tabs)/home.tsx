import React from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { styles } from "@/styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const Home = () => {
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
            router.push("/assessment");
          }}
        >
          <View style={styles.inOneLine}>
            <MaterialIcons name="assessment" size={30} color="#eee" />
            <Text style={styles.buttonText}>Start Assessment</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
