import React, { useEffect, useRef } from "react";
import { TextInput, TouchableOpacity, View, Keyboard } from "react-native";
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

const ChatInput = ({
  allowInput,
  focusInput,
  inputText,
  setInputText,
  onPress,
  isWaitingForResponse,
}: ChatInputProps) => {
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (!allowInput) {
      Keyboard.dismiss(); // Hide the keyboard when input is disabled
    }
  }, [allowInput]);

  useEffect(() => {
    if (focusInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusInput]);

  if (!allowInput) return null;

  return (
    <View style={styles.inputContainer}>
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
      <TouchableOpacity style={styles.sendButton} onPress={isWaitingForResponse ? () => {} : onPress}>
        <MaterialIcons name={isWaitingForResponse ? "stop" : "arrow-upward"} size={20} color="#eee" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
