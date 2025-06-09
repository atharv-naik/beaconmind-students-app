import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";

import Loader from "@/components/Loader";
import { ApiContext } from "@/context/ApiContext";

const AuthLayout = () => {

    const apiContext = useContext(ApiContext);
    if (!apiContext) return null;

  const { loading, isLoggedIn } = apiContext;

  // if (!loading && isLoggedIn) return <Redirect href="/(tabs)/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgotpassword"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader loading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
