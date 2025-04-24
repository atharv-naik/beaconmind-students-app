import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authStyles as styles, styles as baseStyles } from "@/styles/global";
import { ApiContext } from "@/context/ApiContext";
import { router } from "expo-router";
import AuthBackground from "@/components/AuthBackground";

const ForgotPasswordHeader = () => (
  <View style={baseStyles.fancyTitleWrapper}>
    <Text style={{ ...baseStyles.fancyTitle, textAlign: "center" }}>
      BeaconMind
    </Text>
  </View>
);

type InputFieldProps = {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  placeholder: string;
  keyboardType: "default" | "email-address";
  onChangeText: (text: string) => void;
};

const InputField = ({ icon, placeholder, keyboardType, onChangeText }: InputFieldProps) => (
  <View style={styles.inputWrapper}>
    <MaterialIcons
      name={icon}
      size={20}
      color={styles.inputIcon.color}
      style={styles.inputIcon}
    />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      keyboardType={keyboardType}
      placeholderTextColor={styles.inputPlaceholder.color}
      onChangeText={onChangeText}
      autoCapitalize="none"
    />
  </View>
);

const SubmitButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.authButton} onPress={onPress}>
    <Text style={styles.authBtnText}>Send reset link</Text>
  </TouchableOpacity>
);

const LoginLink = () => (
  <TouchableOpacity onPress={() => router.back()} style={styles.authLinkWrapper}>
    <Text style={styles.authText}>Remembered your password?</Text>
    <Text style={styles.authLinkText}> Login here</Text>
  </TouchableOpacity>
);

const ForgotPassword = () => {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("ForgotPassword must be used within an ApiProvider");
  }

  const { authUrl, setLoading } = apiContext;
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      if (!authUrl) {
        Alert.alert("Error", "Authentication service is unavailable.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${authUrl}password-reset/request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Alert.alert("Success", "A password reset link has been sent to your email.");
        router.replace("/login");
      } else {
        const data = await response.json();
        Alert.alert("Error", data.detail || "Failed to request password reset.");
      }
    } catch {
      Alert.alert("Error", "Error requesting password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <AuthBackground />
        <ForgotPasswordHeader />
        <View style={styles.authContainer}>
          <Text style={styles.authTitle}>Forgot Password</Text>
          <View style={styles.authForm}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                <MaterialIcons name="info" size={20} color={styles.inputIcon.color} style={styles.inputIcon} />
                <Text style={{fontSize: 14, flexShrink: 1, color: styles.inputPlaceholder.color}}>
                Enter your email address to receive a password reset link.
                </Text>
            </View>
            <InputField
              icon="email"
              placeholder="Enter your email"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
            <SubmitButton onPress={handlePasswordReset} />
          </View>
          <LoginLink />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
