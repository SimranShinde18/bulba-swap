import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BulbaMap from "../components/map";

export default function Index() {
  const insets = useSafeAreaInsets();

  const handleMicPress = () => {
    // Navigate to search page where user can type
    router.push("/search");
  };

  return (
    <View style={styles.root}>
      {/* STATUS BAR */}
      <StatusBar style="dark" backgroundColor="#fff" translucent />

      {/* MAP (full screen) */}
      <View style={styles.map}>
        <BulbaMap />
      </View>

      {/* BOTTOM SEARCH (floating, no white strip) */}
      <View style={[styles.bottomWrap, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={styles.searchRow}
          onPress={() => router.push("/search")}
          accessibilityRole="button"
          accessibilityLabel="Open search"
        >
          <Ionicons name="search" size={18} color="#666" />

          <TextInput
            style={styles.input}
            placeholder="Search items (e.g., chess, uno)"
            placeholderTextColor="#777"
            editable={false}
            pointerEvents="none"
          />

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleMicPress();
            }}
            hitSlop={12}
            accessibilityLabel="Voice search"
          >
            <Ionicons name="mic-outline" size={18} color="#666" />
          </Pressable>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  bottomWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 100,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 28,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    gap: 10,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },
});
