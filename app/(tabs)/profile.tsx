import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardTypeOptions,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ApiContext } from "@/context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface RowProps {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  text: string;
  readonly: boolean;
  multiline: boolean;
  onEdit: () => void;
  isEditing: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
  keyboardType?: KeyboardTypeOptions;
}

const Row = ({
  icon,
  text,
  onEdit,
  isEditing,
  value,
  onChangeText,
  onSave,
  onCancel,
  keyboardType = "default",
  readonly = false,
  multiline = false,
}: RowProps) => {
  
  return (
  <TouchableOpacity style={styles.rowContainer} onPress={readonly ? undefined : onEdit}>
    <View style={styles.row}>
      <MaterialIcons name={icon} size={24} color="#555" />
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          autoFocus
          keyboardType={keyboardType}
          {...(multiline && { multiline: true, numberOfLines: 4, textAlignVertical: "top" })}
        />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
      {!readonly && !isEditing && (
        <View style={{ marginLeft: "auto" }}>
        <MaterialIcons name="edit" size={20} color="#555" />
      </View>)}
    </View>
    {isEditing && (
      <View style={styles.editButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    )}
  </TouchableOpacity>
)};

const Profile = () => {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("Login must be used within an ApiProvider");
  }

  const { user, setUser, token, setLoading, setIsLoggedIn, setToken, authUrl, setIsProfileSetup } =
    apiContext;

  type UserInfoKey = keyof typeof user;
  const [editingField, setEditingField] = useState<UserInfoKey | null>(null);
  const [tempValues, setTempValues] = useState(user);

  const handleEdit = (field: keyof typeof user) => {
    setEditingField(field);
  };

  const handleSave = () => {

    // make a put request with the updated user info
    // if successful, update the user context

    setEditingField(null);
    saveProfileEdits();
  };

  const saveProfileEdits = async () => {
    const url = `${authUrl}profile/`;
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(tempValues),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      }
      else {
        // show the error message
        console.log(data);
        var error_text = "";
        for(const key in data) {
          error_text += `${key}: ${data[key]}\n`;
        }

        Alert.alert("Error", error_text);
      }
    } catch {
      Alert.alert("Error", "Error updating profile.");
    } finally {
      setLoading(false);
      setTempValues(user);
    }
  }

  const handleCancel = () => {
    setTempValues(user); // Reset temp values
    setEditingField(null);
  };

  const handleLogout = async () => {
    const url = `${authUrl}logout/`;
    try {
      setLoading(true);
  
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
  
      if (response.ok) {
        console.log("Logged out successfully from backend.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      console.log("Error logging out from backend. Logging out locally.");
    } finally {
      await AsyncStorage.multiRemove(["token", "isLoggedIn"]);
      setIsLoggedIn(false);
      setToken("");
      setUser({}); // ✅ clear context user
      setIsProfileSetup(false); // ✅ reset onboarding flag
      setLoading(false);
      router.replace("/login");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <View style={{ position: "relative", marginBottom: 20 }}>
          <Image
            source={require("@/assets/images/avatar.png")}
            style={styles.profileImage}
          />
          {/* <TouchableOpacity style={{ marginLeft: "auto", position: "absolute", right: 0, bottom: 0, backgroundColor: "#ccc", padding: 5, borderRadius: 50 }}>
            <MaterialIcons name="edit" size={24} color="#555" />
          </TouchableOpacity> */}
        </View>

        <View>
          <Text style={{ fontSize: 24, marginBottom: 10, textAlign: "center" }}>
            Hi, {user.username}!
          </Text>
        </View>
      </View>

      <ScrollView style={styles.infoContainer}>
        <Row
          icon="email"
          text={user.email}
          onEdit={() => handleEdit("email")}
          isEditing={editingField === "email"}
          value={tempValues.email}
          onChangeText={(text) =>
            setTempValues((prev) => ({ ...prev, email: text }))
          }
          onSave={handleSave}
          onCancel={handleCancel}
          keyboardType="email-address"
        />
        <Row
          icon="phone"
          text={user.phone}
          onEdit={() => handleEdit("phone")}
          isEditing={editingField === "phone"}
          value={tempValues.phone}
          onChangeText={(text) =>
            setTempValues((prev) => ({ ...prev, phone: text }))
          }
          onSave={handleSave}
          onCancel={handleCancel}
          keyboardType="phone-pad"
        />
        <Row
          icon="home"
          text={user.address}
          onEdit={() => handleEdit("address")}
          isEditing={editingField === "address"}
          value={tempValues.address}
          onChangeText={(text) =>
            setTempValues((prev) => ({ ...prev, address: text }))
          }
          onSave={handleSave}
          onCancel={handleCancel}
          multiline={true}
        />
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons
          name="logout"
          size={24}
          color={styles.logoutText.color}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
    paddingTop: 100,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  infoContainer: {
    width: "100%",
  },
  rowContainer: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    marginBottom: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
  },
  input: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    borderBottomColor: "#555",
    flex: 1,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
    display: "flex",
    gap: 10,
  },
  saveButton: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "darkblue",
    width: 60,
  },
  saveText: {
    color: "darkblue",
    fontSize: 14,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    width: 60,
  },
  cancelText: {
    color: "black",
    fontSize: 14,
    textAlign: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#A40000",
    width: "100%",
    justifyContent: "center",
  },
  logoutText: {
    color: "#A40000",
    fontSize: 16,
    marginLeft: 8,
  },
});
