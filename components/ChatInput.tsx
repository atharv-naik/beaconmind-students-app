import React, { useEffect, useRef } from "react";
import { TextInput, TouchableOpacity, Animated, Keyboard } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles, colors } from "@/styles/global";

interface ChatInputProps {
  allowInput: boolean;
  focusInput: boolean;
  inputText: string;
  setInputText: (text: string) => void;
  onPress: () => void;
  isWaitingForResponse: boolean;
}

const ChatInput = ({ allowInput, focusInput, inputText, setInputText, onPress, isWaitingForResponse }: ChatInputProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current; // Initially at normal position

  const inputRef = useRef<TextInput | null>(null);


  useEffect(() => {
    if (!allowInput) {
        Keyboard.dismiss(); // Hide the keyboard when input slides down
    }

    Animated.timing(slideAnim, {
      toValue: allowInput ? 0 : 100, // Slide down when allowInput is false
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [allowInput]);

  useEffect(() => {
    if (focusInput && inputRef.current) {
      // activate the input
      inputRef.current.focus();
    }
  }
  , [focusInput]);

  return (
    <Animated.View style={[styles.inputContainer, { transform: [{ translateY: slideAnim }] }]}>
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Share how you feel..."
        placeholderTextColor={colors.placeholderTextColor}
        numberOfLines={3}
        multiline={true}
      />
      {!isWaitingForResponse ? (
        <TouchableOpacity style={styles.sendButton} onPress={() => onPress()}>
          <MaterialIcons name="arrow-upward" size={20} color="#eee" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.sendButton} onPress={() => {}}>
          <MaterialIcons name="stop" size={20} color="#eee" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default ChatInput;
