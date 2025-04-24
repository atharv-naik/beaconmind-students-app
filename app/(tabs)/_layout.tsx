import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Loader from "@/components/Loader";
import { ApiContext } from "@/context/ApiContext";
import { useContext } from "react";

interface TabIconProps {
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  focused: boolean;
}

const TabIcon = ({ name, icon, color, focused }: TabIconProps) => {
  return (
    <View style={styles.iconContainer}>
      <View style={{ backgroundColor: focused ? "#ffc0cb66" : "transparent", borderRadius: 15, width: 50, alignItems: "center" }}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.iconText, { color, fontWeight: focused ? "600" : "400" }]}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {throw Error};

  const { loading, isLoggedIn } = apiContext;

  if (!loading && !isLoggedIn) return <Redirect href="/login" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: styles.tabActiveColor.color,
          tabBarInactiveTintColor: styles.tabInactiveColor.color,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="home" icon="home" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="assessment"
          options={{
            title: "assessment",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="assessments" icon="assessment" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="profile" icon="person" color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
      <Loader loading={loading} />
      {/* <StatusBar backgroundColor="#161622" style="light" /> */}
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 12,
    textAlign: "center",
    width: 68,
  },
  tabBar: {
    // backgroundColor: "#161622",
    backgroundColor: "black",
    borderTopWidth: 6,
    borderColor: "black",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
  },

  tabActiveColor: {
    // color: "#FFA001",
    color: "pink",
  },
  tabInactiveColor: {
    color: "#CDCDE0",
  },
});

export default TabLayout;
