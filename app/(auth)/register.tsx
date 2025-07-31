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
import { Picker } from '@react-native-picker/picker';
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
    age: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    password1: "",
    password2: "",
  });

  const [emailValidationError, setEmailValidationError] = useState("");
  const [passwordValidationError, setPasswordValidationError] = useState("");
  const [usernameValidationError, setUsernameValidationError] = useState("");
  const [phoneValidationError, setPhoneValidationError] = useState("");
  const [ageValidationError, setAgeValidationError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const consentForm = `
  # Informed Consent
  
  _Last updated: May 9, 2025_
  
  ## Study Title
  **Developing and Testing the Acceptability of AI-Integrated Virtual Assistant "CONNECT2CARE" for Mental Health Assessment of College Students**
  
  ## 1. Purpose of the Study
  You are being invited to participate in a research study that involves using the "CONNECT2CARE" virtual assistant for mental health assessment. The goal is to understand its usability and effectiveness for college students.
  
  ## 2. Voluntary Participation
  Your participation is completely voluntary. You are free to withdraw from the study at any time without giving a reason. This will not affect your medical care or legal rights in any way.
  
  ## 3. Confidentiality
  All personal information and responses will be kept strictly confidential. Only authorized individuals such as the Principal Investigator, the ethics committee of the institution, and regulatory authorities may access your health records for the purposes of this study or related future research. Your identity will not be revealed in any public results or reports.
  
  ## 4. Data Usage
  By continuing, you agree not to place any restrictions on the use of data or results obtained from this study. The data may be used for research purposes now and in the future, even if you choose to withdraw later.
  
  ## 5. Consent
  By registering and using this app, you confirm that:
  - You have read and understood the information provided.
  - You voluntarily agree to take part in this study.
  - You accept the terms described above and provide your consent.
  
  ## 6. Contact Information
  If you have any questions about this study, please contact the study doctor or research team.
  
  ---
  
  By proceeding, you acknowledge and agree to the above terms of participation.
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

    if (field === "username") {
      // no space
      if (value.includes(" ")) {
        setUsernameValidationError("Username cannot contain spaces.");
      } else {
        setUsernameValidationError("");
      }
    }

    if (field === "phone") {
      if (value.length === 0) {
        setPhoneValidationError("");
      } else {
        const phoneRegex = /^(?:\+91[\-\s]?|0)?[6-9]\d{9}$/;
        if (!phoneRegex.test(value)) {
          setPhoneValidationError("Not a valid Indian number.");
        } else {
          setPhoneValidationError("");
        }
      }
    }


    if (field === "age") {
      // between 18 and 150
      const ageValue = parseInt(value, 10);
      if (ageValue < 18 || ageValue > 150) {
        setAgeValidationError("Age must be between 18 and 150.");
      } else {
        setAgeValidationError("");
      }
    }

    if (field === "gender") {
      // You can add gender validation here if needed
    }
  };

  const passwordValidator = (password: string) => {
    if (password.length < 8) {
      setPasswordStrength("Too short");
      setPasswordValidationError("Password must be at least 8 characters.");
    // } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    //   setPasswordStrength("Moderate");
    //   setPasswordValidationError(
    //     "Password must include at least one uppercase letter and one number."
    //   );
    } else {
      setPasswordStrength("OK");
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
        body: JSON.stringify({ ...formData, role: "student" }),
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
      console.error("Registration error:", error, authUrl);
      Alert.alert("Error", "Error registering.");
    } finally {
      setLoading(false);
      console.log("Registration data:", formData);
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
                    {consentForm}
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
            <View style={{...styles.inputWrapper, marginTop: 0}}>
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
            {usernameValidationError ? (
              <Text style={styles.errorText}>{usernameValidationError}</Text>
            ) : null}

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
            {phoneValidationError ? (
              <Text style={styles.errorText}>{phoneValidationError}</Text>
            ) : null}

            {/* age and gender */}
            {/* in one line */}
            <View style={{ flexDirection: "row", gap: 10 }}>

              {/* Age */}
              <View style={{...styles.inputWrapper, flex: 1}}>
                <MaterialIcons
                  name="cake"
                  size={20}
                  color={styles.inputIcon.color}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor={styles.inputPlaceholder.color}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange("age", value)}
                />
              </View>

              {/* Gender */}
              <View style={{...styles.inputWrapper, flex: 2}}>
                <MaterialIcons
                  name="wc"
                  size={20}
                  color={styles.inputIcon.color}
                  style={styles.inputIcon}
                />
                <View style={[styles.input, { paddingVertical: 0 }]}>
                  <Picker
                    selectedValue={formData.gender}
                    onValueChange={(value) => handleInputChange('gender', value)}
                    dropdownIconColor={styles.inputIcon.color}
                    style={{ color: styles.inputPlaceholder.color, padding: 0, margin: 0 }}
                  >
                    <Picker.Item label="Gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>
            </View>
            {ageValidationError ? (
                <Text style={styles.errorText}>{ageValidationError}</Text>
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
            <View style={{marginTop: 10}}>
              <RegisterBtn />
            </View>
          </View>
        </View>
        <LoginLink />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
