import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "react-native";
import { ApiProvider } from "@/context/ApiContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { colors } from "@/styles/global";


SplashScreen.preventAutoHideAsync();


const RootLayout = () => {

  const [fontsLoaded, error] = useFonts({
    "Montserrat": require("../assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf"),
    "Montserrat_Bold": require("../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Playwrite_DE_LA": require("../assets/fonts/Playwrite_DE_LA/PlaywriteDELA-VariableFont_wght.ttf"),
    "Roboto": require("../assets/fonts/Roboto/static/Roboto-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  

  return (
    <ApiProvider>
      <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        {/* <Stack.Screen name="index" /> */}
        {/* <Stack.Screen name="login" />
        <Stack.Screen name="register" /> */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="home" />
        <Stack.Screen name="chat" />

        <Stack.Screen name="assessment" />
        
      </Stack>
      </PaperProvider>
      {/* <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent /> */}
            {/* <StatusBar backgroundColor="#161622" style="light" /> */}
      <StatusBar barStyle="light-content" backgroundColor={colors.headerBgColor} />
      
    </ApiProvider>
  );
};

export default RootLayout;
