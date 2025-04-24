import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { authStyles as styles, styles as baseStyles } from "@/styles/global";
import { ApiContext } from "@/context/ApiContext";
import { router } from "expo-router";
import AuthBackground from "@/components/AuthBackground";

const LoginHeader = () => (

    <View style={baseStyles.fancyTitleWrapper}>
    <Text style={{...baseStyles.fancyTitle, textAlign: 'center'}}>BeaconMind</Text>
    </View>
);

type InputFieldProps = {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  placeholder: string;
  keyboardType: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad" | "url";
  onChangeText: (text: string) => void;
}

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
    />
  </View>
);

const PasswordField = ({ onChangeText }: { onChangeText: (text: string) => void }) => {
  const [isSecure, setIsSecure] = useState(true);

  return (
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
        secureTextEntry={isSecure}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
        <MaterialIcons
          name={isSecure ? "visibility-off" : "visibility"}
          size={20}
          color={styles.inputIcon.color}
        />
      </TouchableOpacity>
    </View>
  );
};

const LoginButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.authButton} onPress={onPress}>
    <Text style={styles.authBtnText}>Login</Text>
  </TouchableOpacity>
);

const RegisterLink = () => (
  <TouchableOpacity
    onPress={() => router.navigate("/register")}
    style={styles.authLinkWrapper}
  >
    <Text style={styles.authText}>Don't have an account?</Text>
    <Text style={styles.authLinkText}> Register here</Text>
  </TouchableOpacity>
);

const Login = () => {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("Login must be used within an ApiProvider");
  }

  const { authUrl, setToken, loading, setLoading, setIsLoggedIn, setUser } = apiContext;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter a username and password.");
      return;
    }
    try {
      setLoading(true);
      if (!authUrl) {
        Alert.alert("Error", "Authentication service is unavailable.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${authUrl}get-auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        setToken(data.token);
        router.replace("/home");
        // Alert.alert("Success", `login successful, token: ${data.token}`);
      } else {
        const data = await response.json();
        Alert.alert("Error", data.detail || "Login failed.");
      }
    } catch {
      Alert.alert("Error", "Error logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <AuthBackground />
          <LoginHeader />
        <View style={styles.authContainer}>
            <Text style={styles.authTitle}>Login</Text>
          <View style={styles.authForm}>
            <InputField
              icon="person"
              placeholder="Username"
              keyboardType="default"
              onChangeText={setUsername}
            />
            <PasswordField onChangeText={setPassword} />

            {/* forgot password link */}
            <TouchableOpacity
              onPress={() => router.navigate("/forgotpassword")}
              style={{ alignSelf: "flex-end", marginBottom: 10 }}
            >
              <Text style={styles.authLinkText}>Forgot password?</Text>
            </TouchableOpacity>

            <LoginButton onPress={handleLogin} />
          </View>
          <RegisterLink />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
