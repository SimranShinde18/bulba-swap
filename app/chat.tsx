import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    Image,
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
  
  // Product and seller images
  const productImage = "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=300&q=60";
  const sellerAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=60";

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      from: "me",
      text: "Hi! I'm interested in your chess board. Would you be open to exchanging it for my Monopoly set?",
    },
    { id: "m2", from: "them", text: "Hi there! Yes, I'd be interested in that trade. Is your Monopoly set complete with all pieces?" },
    {
      id: "m3",
      from: "me",
      text: "Yes! It's complete with all money, property cards, houses, hotels, and game pieces. Only used a few times.",
    },
    { id: "m4", from: "them", text: "Sounds great! When would you be available to meet for the swap?" },
  ]);

  const canSend = input.trim().length > 0;

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
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: sellerAvatar }} style={styles.headerAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{sellerName}</Text>
          <Text style={styles.headerSub}>Distance: {distance}</Text>
        </View>
      </View>

      {/* Listing summary card */}
      <View style={styles.summary}>
        <Image source={{ uri: productImage }} style={styles.thumb} />
        <View style={{ flex: 1 }}>
          <Text style={styles.summaryTitle}>{listingTitle}</Text>
          <Text style={styles.summaryMeta}>Condition: {condition}</Text>
        </View>
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
          <Text style={styles.linkText}>Report "{sellerName}"</Text>
        </Pressable>

        <Pressable style={styles.linkRow} onPress={() => console.log("Block")}>
          <Ionicons name="ban-outline" size={18} color="#111" />
          <Text style={styles.linkText}>Block "{sellerName}"</Text>
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
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 12,
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
