import { View, ActivityIndicator, Dimensions, Platform } from "react-native";
import styles from "@/styles/global";

interface LoaderProps {
  loading: boolean;
}

const Loader = ({ loading }: LoaderProps) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!loading) return null;

  return (
      <View style={{...styles.loadingOverlay, height: screenHeight}}>
        <ActivityIndicator 
            animating={loading}
            color="#fff" 
            size={osName === "ios" ? "large" : 50}
        />
      </View>
  );
};

export default Loader;
