import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { authStyles as styles, styles as baseStyles, markdownStyles } from "@/styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import { ApiContext } from "@/context/ApiContext";
import Markdown from "react-native-markdown-display";
import AuthBackground from "@/components/AuthBackground";


const Register = () => {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("Login must be used within an ApiProvider");
  }
  const { authUrl, loading, setLoading, setUser } = apiContext;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password1: "",
    password2: "",
  });

  const [emailValidationError, setEmailValidationError] = useState("");
  const [passwordValidationError, setPasswordValidationError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const disclaimer = `
  # Terms & Conditions

_Last updated: March 7, 2025_

## 1. Introduction
Welcome to **[Your App Name]**. By using our app, you agree to these Terms & Conditions. If you do not agree, please do not use the app.

## 2. Disclaimer
- The content provided in this app is for informational purposes only.
- We do not guarantee the accuracy, completeness, or reliability of any information.
- Your use of this app is at your own risk.

## 3. Limitation of Liability
- We are not liable for any damages arising from your use of this app.
- This includes, but is not limited to, loss of data, revenue, or business opportunities.

## 4. User Responsibilities
- You agree to use this app lawfully and ethically.
- You must not misuse, hack, or attempt to disrupt the service.

## 5. Changes to These Terms
We may update these Terms & Conditions at any time. Continued use of the app after changes means you accept the new terms.

## 6. Contact Us
If you have any questions, please contact us at **[your@email.com]**.
`;

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    if (field === "email") {
      emailValidator(value);
    }

    if (field === "password1") {
      passwordValidator(value);
    }

    if (field === "password2") {
      untilMatch(formData.password1, value);
    }
  };

  const passwordValidator = (password: string) => {
    if (password.length < 8) {
      setPasswordStrength("Weak");
      setPasswordValidationError("Password must be at least 8 characters.");
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setPasswordStrength("Moderate");
      setPasswordValidationError(
        "Password must include at least one uppercase letter and one number."
      );
    } else {
      setPasswordStrength("Strong");
      setPasswordValidationError("");
    }
  };

  const emailValidator = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidationError("Invalid email address.");
    } else {
      setEmailValidationError("");
    }
  };

  const untilMatch = (password1: string, password2: string) => {
    if (password1 !== password2) {
      setPasswordMatchError("Passwords do not match.");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleRegister = async () => {
    const { username, email, phone, address, password1, password2 } = formData;

    if (!username || !email || !phone || !password1 || !password2) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

    if (password1 !== password2) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (passwordValidationError) {
      Alert.alert("Error", passwordValidationError);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${authUrl}register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "patient" }),
      });

      if (response.ok) {
        // Alert.alert("Success", "Registration successful!");
        // set user
        const data = await response.json();
        setUser(data);
        router.back();
      } else {
        Alert.alert("Error", "Registration failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Error registering.");
    } finally {
      setLoading(false);
    }
  };

  const LoginLink = () => (
    <TouchableOpacity
      onPress={() => router.back()}
      style={styles.authLinkWrapper}
    >
      <Text style={styles.authText}>Already have an account?</Text>
      <Text style={styles.authLinkText}> Login here</Text>
    </TouchableOpacity>
  );

  const RegisterHeader = () => (
    // <View style={styles.authHeader}>
    //   <Text style={styles.headerText}>Register to BeaconMind</Text>
    //   <Text style={styles.subHeaderText}>Register as patient</Text>
    // </View>

    <View style={baseStyles.fancyTitleWrapper}>
    <Text style={{...baseStyles.fancyTitle, textAlign: 'center'}}>BeaconMind</Text>
    </View>
  );

  const showDisclaimerPopup = () => {
    setShowDisclaimer(true);
  };

  const RegisterBtn = () => (
    <TouchableOpacity style={styles.authButton} onPress={showDisclaimerPopup}>
      <Text style={styles.authBtnText}>Register</Text>
    </TouchableOpacity>
  );

  const LoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <AuthBackground />
        {showDisclaimer && (
          <View style={styles.disclaimerPopup}>
            <View style={styles.disclaimerContent}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text style={styles.disclaimerTitle}>Disclaimer</Text>
                <TouchableOpacity onPress={() => setShowDisclaimer(false)}>
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 450 }}>
                <Markdown style={markdownStyles}>
                    {disclaimer}
                </Markdown>
              </ScrollView>
              <TouchableOpacity
                onPress={handleRegister}
                style={styles.authButton}
              >
                <Text style={styles.authBtnText}>Accept & register</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
          <RegisterHeader />
        <View style={styles.authContainer}>
            <Text style={styles.authTitle}>Register</Text>
          <View style={styles.authForm}>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="person"
                size={20}
                color={styles.inputIcon.color}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={styles.inputPlaceholder.color}
                onChangeText={(value) => handleInputChange("username", value)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="email"
                size={20}
                color={styles.inputIcon.color}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={styles.inputPlaceholder.color}
                keyboardType="email-address"
                onChangeText={(value) => handleInputChange("email", value)}
              />
            </View>
            {emailValidationError ? (
              <Text style={styles.errorText}>{emailValidationError}</Text>
            ) : null}
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="phone"
                size={20}
                color={styles.inputIcon.color}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                placeholderTextColor={styles.inputPlaceholder.color}
                keyboardType="phone-pad"
                onChangeText={(value) => handleInputChange("phone", value)}
              />
            </View>
            {/* <View style={styles.inputWrapper}>
              <MaterialIcons
                name="home"
                size={20}
                color={styles.inputIcon.color}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Address (optional)"
                placeholderTextColor={styles.inputPlaceholder.color}
                numberOfLines={3}
                multiline
                onChangeText={(value) => handleInputChange("address", value)}
              />
            </View> */}
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="lock"
                size={20}
                color={styles.inputIcon.color}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={styles.inputPlaceholder.color}
                secureTextEntry
                onChangeText={(value) => handleInputChange("password1", value)}
              />
            </View>
            {passwordStrength ? (
              <Text style={styles.passwordStrength}>
                Password strength: {passwordStrength}
              </Text>
            ) : null}
            {passwordValidationError ? (
              <Text style={styles.errorText}>{passwordValidationError}</Text>
            ) : null}
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="lock"
                size={20}
                color={styles.inputIcon.color}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={styles.inputPlaceholder.color}
                secureTextEntry
                onChangeText={(value) => handleInputChange("password2", value)}
              />
            </View>
            {passwordMatchError ? (
              <Text style={styles.errorText}>{passwordMatchError}</Text>
            ) : null}

            <RegisterBtn />
          </View>
        </View>
        <LoginLink />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
