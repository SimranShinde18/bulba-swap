import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Conditionally import speech recognition (only works in dev builds, not Expo Go)
let ExpoSpeechRecognitionModule: any = null;
let useSpeechRecognitionEvent: any = () => {};

try {
  const speechModule = require("expo-speech-recognition");
  ExpoSpeechRecognitionModule = speechModule.ExpoSpeechRecognitionModule;
  useSpeechRecognitionEvent = speechModule.useSpeechRecognitionEvent;
} catch (e) {
  console.log("Speech recognition not available (requires dev build)");
}

type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
};

export default function Chat() {
  const params = useLocalSearchParams();

  const sellerName =
    typeof params.sellerName === "string" ? params.sellerName : "Alex Miller";
  const distance =
    typeof params.distance === "string" ? params.distance : "1.2 km";
  const listingTitle =
    typeof params.listingTitle === "string"
      ? params.listingTitle
      : "Chess Board";
  const condition =
    typeof params.condition === "string" ? params.condition : "Excellent";

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m1", from: "them", text: "Sure" },
    {
      id: "m2",
      from: "me",
      text: "Hi! Can I exchange Monopoly for the chess board?",
    },
  ]);

  const canSend = input.trim().length > 0;

  // Speech recognition handlers (only if module is available)
  if (ExpoSpeechRecognitionModule) {
    useSpeechRecognitionEvent("result", (event: any) => {
      const text = event.results[0]?.transcript || "";
      setInput((prev) => prev + (prev ? " " : "") + text);
    });

    useSpeechRecognitionEvent("end", () => {
      setIsListening(false);
    });

    useSpeechRecognitionEvent("error", () => {
      setIsListening(false);
    });
  }

  const handleMicPress = useCallback(async () => {
    if (!ExpoSpeechRecognitionModule) {
      Alert.alert(
        "Not Available",
        "Voice input requires a development build. Run 'npx expo run:android' or 'npx expo run:ios'."
      );
      return;
    }

    if (isListening) {
      await ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
      return;
    }

    try {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert("Permission Required", "Please allow microphone access.");
        return;
      }
      setIsListening(true);
      await ExpoSpeechRecognitionModule.start({
        lang: "en-AU",
        interimResults: true,
        maxAlternatives: 1,
      });
    } catch (error) {
      setIsListening(false);
      Alert.alert("Error", "Voice input not available.");
    }
  }, [isListening]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, from: "me", text },
    ]);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        {/* <Pressable
        onPress={() => router.back()}
        style={styles.headerBtn}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={22} color="#111" />
      </Pressable> */}

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerTitle}>{sellerName}</Text>
          <Text style={styles.headerSub}>Distance: {distance}</Text>
        </View>

        {/* spacer so title stays centered */}
        <View style={{ width: 40 }} />
      </View>

      {/* Listing summary card */}
      <View style={styles.summary}>
        <View style={{ flex: 1 }}>
          <Text style={styles.summaryTitle}>{listingTitle}</Text>
          <Text style={styles.summaryMeta}>
            <Text style={{ fontWeight: "900" }}>Condition:</Text> {condition}
          </Text>
        </View>

        {/* small thumb placeholder like your mock */}
        <View style={styles.thumb} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* Messages */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 14, paddingBottom: 14 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubble,
                m.from === "me" ? styles.bubbleMe : styles.bubbleThem,
              ]}
            >
              <Text style={styles.bubbleText}>{m.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <Pressable
            style={styles.iconCircle}
            onPress={handleMicPress}
            accessibilityRole="button"
            accessibilityLabel={isListening ? "Stop listening" : "Voice message"}
          >
            <Ionicons
              name={isListening ? "mic" : "mic-outline"}
              size={18}
              color={isListening ? "#E53935" : "#111"}
            />
          </Pressable>

          <TextInput
            style={styles.textInput}
            placeholder="Send a message..."
            placeholderTextColor="#777"
            value={input}
            onChangeText={setInput}
            multiline
          />

          <Pressable
            style={[styles.sendBtn, !canSend && { opacity: 0.4 }]}
            onPress={send}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel="Send"
          >
            <Ionicons name="send" size={18} color="#111" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Report / Block */}
      <View style={styles.footerLinks}>
        <Pressable style={styles.linkRow} onPress={() => console.log("Report")}>
          <Ionicons name="flag-outline" size={18} color="#111" />
          <Text style={styles.linkText}>Report “{sellerName}”</Text>
        </Pressable>

        <Pressable style={styles.linkRow} onPress={() => console.log("Block")}>
          <Ionicons name="ban-outline" size={18} color="#111" />
          <Text style={styles.linkText}>Block “{sellerName}”</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "900", color: "#111" },
  headerSub: { marginTop: 2, fontSize: 12, color: "#666" },

  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  summaryTitle: { fontSize: 16, fontWeight: "900", color: "#111" },
  summaryMeta: { marginTop: 4, fontSize: 12.5, color: "#333" },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  bubbleMe: { alignSelf: "flex-end", backgroundColor: "#eee" },
  bubbleThem: { alignSelf: "flex-start", backgroundColor: "#ddd" },
  bubbleText: { fontSize: 13.5, color: "#111", lineHeight: 18 },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 110,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f6f6f6",
    fontSize: 13.5,
    color: "#111",
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },

  footerLinks: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 6,
    backgroundColor: "#fff",
  },
  linkRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 8,
  },
  linkText: { fontSize: 13, fontWeight: "700", color: "#111" },
});
