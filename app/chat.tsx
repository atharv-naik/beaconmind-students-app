import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import TypingAnimation from "@/components/TypingDots";
import { styles, colors, markdownStyles } from "@/styles/global";
import { ApiContext } from "@/context/ApiContext";
import { router } from "expo-router";
import Markdown from "react-native-markdown-display";
import MoreButton from "@/components/MoreButton";
import EmptyChatComponent from "@/components/EmptyChatComponent";
import SlideUpButton from "@/components/SlideUpButton";
import SlideDownButton from "@/components/SlideDownButton";
import ChatInput from "@/components/ChatInput";

const Chat = () => {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("Chat must be used within an ApiProvider");
  }
  const { chatUrl, authUrl, token, setToken, setIsLoggedIn, loading, setLoading, setStatus } =
    apiContext;

  interface Message {
    id: string | number;
    sender: string;
    text: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [isFreshChat, setIsFreshChat] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [failedToSend, setFailedToSend] = useState(false);
  const [isActionButtonVisible, setActionButtonVisible] = useState(false);
  const [allowInput, setAllowInput] = useState(true);
  const [actionsFlag, setActionsFlag] = useState("");
  const [focusChatInput, setFocusChatInput] = useState(false);
  const [allowSend, setAllowSend] = useState(true);
  const flatListRef = useRef<FlatList | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const handleLogout = async () => {
    const url = `${authUrl}logout/`;
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        setToken("");
        router.replace("/login");
      }
    } catch {
      Alert.alert("Error", "Error logging out.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {

      setRefreshing(true);
      setLoading(true);

      const response = await fetch(chatUrl, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();

        handleActionsFlag(data.session.init ? "init_session" : "")


        if (data.data.length === 0) {
          setMessages([]);
          setIsFreshChat(true);
          return;
        } else {
          setIsFreshChat(false);
        }

        const chatHistory = data.data.flatMap(
          (chat: { id: any; user_response: any; ai_response: any }) => [
            { id: `${chat.id}_user`, sender: "user", text: chat.user_response },
            { id: `${chat.id}_ai`, sender: "server", text: chat.ai_response },
          ]
        );
        setMessages(chatHistory);
      } else if (response.status >= 400 && response.status <= 403) {
        const data = await response.json();
        Alert.alert("Error", data.detail);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("isLoggedIn");
        router.replace("/login");
      } else {
        Alert.alert("Error", "Failed to fetch chat history.");
      }
    } catch {
      Alert.alert("Error", "Error fetching chat history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (flatListRef.current){
      flatListRef.current.scrollToEnd({ animated: true });
      }
  }, [messages]);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }


  const handleActionsFlag = (flag: string) => {
    if (flag === "end_session") {
      // setActionButtonVisible(true);
      // disable input
      // setAllowInput(false);
      setStatus('assessment');
      router.replace("/assessment");
    }
    if (flag === "init_session") {
      // setActionButtonVisible(false);
      // enable input
      setAllowInput(true);
    }
  }


  const sendMessage = async (resendLastMsg = false) => {
    // if resendLastMsg is true, resend the last message in the chat. extract the last user message from the chat history

    if (!allowSend) return;

    if (resendLastMsg) {
      const lastUserMessage = messages
        .filter((msg) => msg.sender === "user")
        .pop();
      if (lastUserMessage) {
        setInputText(lastUserMessage.text);
      }
    } else if (!inputText.trim()) return;

    setIsFreshChat(false);

    setIsWaitingForResponse(true);

    if (!resendLastMsg) {
      const newMessage = { id: Date.now(), sender: "user", text: inputText };
      setMessages((prev) => [...prev, newMessage]);
    }
    setInputText("");

    // Add temporary server typing indicator
    const typingIndicator = { id: "typing", sender: "server", text: "..." };
    setMessages((prev) => [...prev, typingIndicator]);

    try {
      setLoading(true);
      const response = await fetch(chatUrl, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: inputText }),
      });
      if (response.ok) {
        const data = await response.json();
        // Replace typing indicator with the actual response
        setMessages((prev) =>
          prev
            .filter((msg) => msg.id !== "typing")
            .concat({
              id: Date.now(),
              sender: "server",
              text: data.ai_response,
            })
        );
        setFailedToSend(false);
        setAllowSend(true);

        handleActionsFlag(data.action_flag)

      } else {
        // Alert.alert("Error", "Failed to send message.");
        setFailedToSend(true);
        setAllowSend(false);
        // Remove typing indicator
        setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
      }
    } catch {
      // Alert.alert("Error", "Error sending message.");
      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
      setFailedToSend(true);
      setAllowSend(false);
    } finally {
      setLoading(false);
      setIsWaitingForResponse(false);
      setIsFreshChat(false);
      // scroll to the end of the list
      if (flatListRef.current) {
        console.log(184)
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }
  };

  const editLastUserMessage = () => {
    setAllowSend(true);
    const lastUserMessage = messages
      .filter((msg) => msg.sender === "user")
      .pop();
    if (lastUserMessage) {
      setInputText(lastUserMessage.text);
      setFailedToSend(false);

      // focus on the input field
      setFocusChatInput(true);

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== lastUserMessage.id)
      );

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleProfileBtnClick = () => {
    router.push("/profile");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>

        {/* <SlideDownButton isVisible={isActionButtonVisible} onPress={() => handleActionsFlag("")} /> */}

        <ImageBackground
          source={require("@/assets/images/chat/bg-light.jpg")}
          style={styles.bgImage}
        />
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/chat/profile.png")}
            style={styles.profilePic}
          />
          <Text style={styles.headerTitle}>BeaconMind</Text>
          <TouchableOpacity style={styles.moreBtn}>
            <MoreButton
              options={[
                {
                  label: "Profile",
                  icon: "account",
                  onPress: () => handleProfileBtnClick(),
                },
                {
                  label: "Settings",
                  icon: "cog",
                  onPress: () => Alert.alert("Go to Settings"),
                },
                {
                  label: "Logout",
                  icon: "logout",
                  onPress: () => handleLogout(),
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        {isFreshChat && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <EmptyChatComponent />
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchChatHistory}
              tintColor="#000"
            />
          }
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.chatContainer}
          renderItem={({ item, index }) => {
            const isLastUserMessage =
              item.sender === "user" && index === messages.length - 1;

            return (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent:
                    item.sender === "user" ? "flex-end" : "flex-start",
                  alignItems: "center",
                }}
              >
                {isLastUserMessage && failedToSend && (
                  // resend button
                  <TouchableOpacity
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 15,
                      backgroundColor: "white",
                      borderRadius: 50,
                      padding: 5,
                    }}
                    onPress={() => {
                      editLastUserMessage();
                    }}
                  >
                    <MaterialIcons name="edit" size={20} color="black" />
                  </TouchableOpacity>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "user"
                      ? styles.userMessage
                      : styles.serverMessage,
                  ]}
                >
                  {item.sender === "server" && item.text === "..." ? (
                    <TypingAnimation />
                  ) : item.sender === "user" ? (
                    <Text style={styles.userMsgText}>{item.text}</Text>
                  ) : (
                    <Markdown style={markdownStyles}>{item.text}</Markdown>
                  )}
                  {isLastUserMessage && failedToSend && (
                    // resend button
                    <TouchableOpacity
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 5,
                        justifyContent: "flex-end",
                      }}
                      onPress={() => sendMessage(true)}
                    >
                      <Text style={{ color: "#FE5E41", fontSize: 12 }}>
                        Failed to send
                      </Text>
                      <MaterialIcons name="refresh" size={20} color="#FE5E41" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />

        <View 
          style={{
            ...styles.inputContainer,
            opacity: allowInput ? 1 : 0,
          }}
          >
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
          {!isWaitingForResponse && (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => sendMessage()}
            >
              <MaterialIcons name="arrow-upward" size={20} color="#eee" />
            </TouchableOpacity>
          )}
          {isWaitingForResponse && (
            <TouchableOpacity style={styles.sendButton} onPress={() => {}}>
              <MaterialIcons name="stop" size={20} color="#eee" />
            </TouchableOpacity>
          )}
        </View>

        {/* <ChatInput
          allowInput={allowInput}
          focusInput={focusChatInput}
          inputText={inputText}
          setInputText={setInputText}
          onPress={sendMessage}
          isWaitingForResponse={isWaitingForResponse}
        /> */}
        
      </View>
    </SafeAreaView>
  );
};

export default Chat;
