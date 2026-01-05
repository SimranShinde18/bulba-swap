import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import BulbaMap from "../../components/map";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <SafeAreaView style={styles.safe}>
        {/* Header: profile + add listing (matches your Figma top icons) */}
        <View style={styles.header}>
          <Pressable
            style={styles.iconButton}
            onPress={() => console.log("Profile pressed")}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <Ionicons name="person-circle-outline" size={28} />
          </Pressable>

          <Text style={styles.headerTitle}>Bulba Swap</Text>

          <Pressable
            style={styles.iconButton}
            onPress={() => console.log("Add listing pressed")}
            accessibilityRole="button"
            accessibilityLabel="Create a listing"
          >
            <Ionicons name="add-circle-outline" size={28} />
          </Pressable>
        </View>

        {/* Map area placeholder (we’ll replace this with a real map later) */}
        <View style={styles.mapArea}>
          {Platform.OS === "web" ? (
            <Text style={styles.mapPlaceholderText}>
              Map is available on the mobile app (Expo Go).
            </Text>
          ) : (
            <BulbaMap />
          )}
        </View>

        {/* Bottom search bar area (matches your Figma bottom search + filter) */}
        <View style={styles.bottomBar}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items (e.g., ludo, chess)"
              placeholderTextColor="#777"
            />
            <Pressable
              onPress={() => console.log("Voice pressed")}
              accessibilityRole="button"
              accessibilityLabel="Voice search"
              style={styles.smallIconButton}
            >
              <Ionicons name="mic-outline" size={18} />
            </Pressable>
          </View>

          <Pressable
            style={styles.filterButton}
            onPress={() => console.log("Filter pressed")}
            accessibilityRole="button"
            accessibilityLabel="Open filters"
          >
            <Ionicons name="options-outline" size={20} />
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E6E6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  iconButton: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },

  mapArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholderText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  },
  pin: {
    position: "absolute",
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    // slight shadow feel (simple + cross-platform friendly)
    elevation: 2,
  },

  bottomBar: {
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E6E6E6",
    backgroundColor: "#FFFFFF",
  },
  searchBox: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F2F2F2",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#111",
  },
  smallIconButton: {
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  filterButton: {
    height: 44,
    width: 44,
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
});
