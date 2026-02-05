import { Ionicons } from "@expo/vector-icons";
import { Stack, router, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AppHeader() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // Home route is usually "/" (sometimes "/index" depending on tooling)
  const isHome = pathname === "/" || pathname === "/index";

  return (
    <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        {/* LEFT */}
        {isHome ? (
          <Pressable
            style={styles.iconCircle}
            onPress={() => router.push("/createListing")}
            accessibilityLabel="Create listing"
          >
            <Ionicons name="add" size={22} color="#111" />
          </Pressable>
        ) : (
          <Pressable
            style={styles.iconCircle}
            onPress={() => router.back()}
            accessibilityLabel="Back"
          >
            <Ionicons name="arrow-back" size={22} color="#111" />
          </Pressable>
        )}

        {/* RIGHT (always profile) */}
        <Pressable
          style={styles.iconCircle}
          onPress={() => router.push("/account")}
          accessibilityLabel="Profile"
        >
          <Ionicons name="person-outline" size={20} color="#111" />
        </Pressable>
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <>
      {/* Status bar icons BLACK on white */}
      <StatusBar style="dark" backgroundColor="#fff" />

      <Stack
        screenOptions={{
          headerShown: true,
          header: () => <AppHeader />,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  headerRow: {
    height: 56,
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
  },
});
