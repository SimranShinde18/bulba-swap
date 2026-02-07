// app/account.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: string;
  onPress?: () => void;
};

const MENU_ITEMS: MenuItem[] = [
  { icon: "person-outline", label: "Edit Profile", onPress: () => router.push("/profile") },
  { icon: "list-outline", label: "My Listings", onPress: () => router.push("/myListings") },
  { icon: "swap-horizontal-outline", label: "My Deals" },
  { icon: "git-pull-request-outline", label: "My Requests", badge: "1" },
  { icon: "heart-outline", label: "My Wishlist" },
  { icon: "chatbubbles-outline", label: "My Chats" },
  { icon: "shield-checkmark-outline", label: "Verification" },
  { icon: "hand-left-outline", label: "Privacy" },
  { icon: "help-circle-outline", label: "Get Help" },
  { icon: "accessibility-outline", label: "Accessibility", onPress: () => router.push("/accessibility") },
];

export default function Account() {
  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => router.replace("/") },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Menu Items */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <Pressable
              key={item.label}
              style={[
                styles.menuRow,
                index < MENU_ITEMS.length - 1 && styles.menuRowBorder,
              ]}
              onPress={item.onPress || (() => console.log(item.label))}
            >
              <Ionicons name={item.icon} size={22} color="#111" />
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Language */}
        <View style={styles.languageRow}>
          <Ionicons name="language-outline" size={20} color="#666" />
          <Text style={styles.languageText}>English</Text>
        </View>

        {/* Sign Out Button */}
        <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e8e8e8",
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  badge: {
    backgroundColor: "#E53935",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 12,
  },
  languageText: {
    fontSize: 14,
    color: "#666",
  },
  signOutBtn: {
    marginTop: 12,
    backgroundColor: "#E53935",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
