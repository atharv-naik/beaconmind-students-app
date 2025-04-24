import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";

interface SlideUpButtonProps {
  isVisible: boolean;
  onPress: () => void;
}

const SlideUpButton = ({ isVisible, onPress }: SlideUpButtonProps) => {
  const slideAnim = useRef(new Animated.Value(100)).current; // Initially off-screen

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : 100, // Slide up when visible, down when hidden
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
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
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

export default SlideUpButton;
