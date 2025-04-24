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
    // <View
    //   className="absolute flex justify-center items-center w-full h-full bg-primary/60 z-10"
    //   style={{
    //     height: screenHeight,
    //   }}
    // >
    //   <ActivityIndicator
    //     animating={loading}
    //     color="#fff"
    //     size={osName === "ios" ? "large" : 50}
    //   />
    // </View>

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
