import React, { useEffect, useRef } from "react";
import { Text, TouchableOpacity, Animated, StyleSheet } from "react-native";

interface SlideDownButtonProps {
  isVisible: boolean;
  onPress: () => void;
}

const SlideDownButton = ({ isVisible, onPress }: SlideDownButtonProps) => {
  const slideAnim = useRef(new Animated.Value(-100)).current; // Initially off-screen above

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -100, // Slide down when visible, up when hidden
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Session ended. Restart?</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 64,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
  button: {
    backgroundColor: "#51a700",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: "black",
  },
});

export default SlideDownButton;
