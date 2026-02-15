import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// Import the swipe and donate components
import Donate from "./donate";
import Swipe from "./swipe";

type TabMode = "swap" | "donate";

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabMode>("swap");
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" backgroundColor="#fff" translucent />

      {/* Top Header with Tabs */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          {/* Logo / App Name */}
          <Pressable style={styles.logoWrap} onPress={() => router.push("/account")}>
            <Text style={styles.logo}>🎮 BulbaSwap</Text>
          </Pressable>

          {/* Tab Switcher */}
          <View style={styles.tabWrap}>
            <Pressable
              style={[styles.tab, activeTab === "swap" && styles.tabActive]}
              onPress={() => setActiveTab("swap")}
            >
              <Text style={[styles.tabText, activeTab === "swap" && styles.tabTextActive]}>
                Swap
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === "donate" && styles.tabActive]}
              onPress={() => setActiveTab("donate")}
            >
              <Text style={[styles.tabText, activeTab === "donate" && styles.tabTextActive]}>
                Donate
              </Text>
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable style={styles.actionBtn} onPress={() => router.push("/search")}>
              <Ionicons name="search" size={22} color="#111" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* Content Area */}
      <View style={styles.content}>
        {activeTab === "swap" ? <SwipeTab /> : <DonateTab />}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable style={styles.navItem} onPress={() => setActiveTab("swap")}>
          <Ionicons
            name={activeTab === "swap" ? "swap-horizontal" : "swap-horizontal-outline"}
            size={26}
            color={activeTab === "swap" ? "#111" : "#888"}
          />
          <Text style={[styles.navLabel, activeTab === "swap" && styles.navLabelActive]}>
            Swap
          </Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => setActiveTab("donate")}>
          <Ionicons
            name={activeTab === "donate" ? "gift" : "gift-outline"}
            size={26}
            color={activeTab === "donate" ? "#111" : "#888"}
          />
          <Text style={[styles.navLabel, activeTab === "donate" && styles.navLabelActive]}>
            Donate
          </Text>
        </Pressable>

        <Pressable style={styles.navItemCenter} onPress={() => router.push("/createListing")}>
          <View style={styles.addBtn}>
            <Ionicons name="add" size={28} color="#fff" />
          </View>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/matches")}>
          <Ionicons name="heart-outline" size={26} color="#888" />
          <Text style={styles.navLabel}>Matches</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/account")}>
          <Ionicons name="person-outline" size={26} color="#888" />
          <Text style={styles.navLabel}>Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Inline Swipe Tab (wraps the swipe screen without its own SafeAreaView)
function SwipeTab() {
  return (
    <View style={{ flex: 1 }}>
      <Swipe />
    </View>
  );
}

// Inline Donate Tab
function DonateTab() {
  return (
    <View style={{ flex: 1 }}>
      <Donate />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerSafe: {
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
  },
  tabWrap: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    padding: 3,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 17,
  },
  tabActive: {
    backgroundColor: "#111",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
  },
  tabTextActive: {
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 10,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navItemCenter: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
  },
  addBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  navLabel: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
  },
  navLabelActive: {
    color: "#111",
    fontWeight: "700",
  },
});
