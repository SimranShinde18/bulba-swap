import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  Keyboard,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Use your platform-safe map component (map.native.tsx + map.web.tsx)
import BulbaMap from "../components/map";

const SUGGESTIONS = [
  "Chess",
  "Chess board",
  "Uno",
  "Catan",
  "Ludo",
  "Monopoly",
  "Scrabble",
  "Carrom",
  "Jenga",
  "Poker set",
  "Pokemon cards",
  "Board games",
  "PS5 game",
];

export default function Index() {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Animated "top" position of the floating search UI
  const animatedTop = useRef(new Animated.Value(0)).current;

  const SEARCH_HEIGHT = 48;
  const SIDE = 12;

  // Where the search bar should sit at the top (below notch/status bar)
  const TOP_Y = insets.top + 10;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Where the search bar sits initially at the bottom
  const BOTTOM_Y =
    screenHeight - SEARCH_HEIGHT - insets.bottom - 14 - keyboardHeight;

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const normalize = (s: string) => s.toLowerCase().trim();

    const startsWith = SUGGESTIONS.filter((item) =>
      normalize(item).startsWith(q),
    );

    const wordStartsWith = SUGGESTIONS.filter((item) => {
      const text = normalize(item);
      if (text.startsWith(q)) return false; // avoid duplicates
      // split into words and check each word start
      return text.split(/\s+/).some((word) => word.startsWith(q));
    });

    return [...startsWith, ...wordStartsWith].slice(0, 7);
  }, [query]);

  // Animate up/down when entering/exiting search mode
  useEffect(() => {
    Animated.timing(animatedTop, {
      toValue: isSearching ? TOP_Y : BOTTOM_Y,
      duration: 220,
      useNativeDriver: false, // we animate layout "top"
    }).start();
  }, [isSearching, TOP_Y, BOTTOM_Y, animatedTop]);

  const closeSearch = () => {
    setIsSearching(false);
    Keyboard.dismiss();
  };

  const openSearch = () => {
    setIsSearching(true);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.safe}>
        {/* TOP HEADER */}
        <View style={[styles.topHeader, { paddingTop: insets.top + 8 }]}>
          <View style={styles.topHeaderRow}>
            <Pressable
              style={styles.iconCircle}
              onPress={() => console.log("Profile")}
              accessibilityLabel="Profile"
            >
              <Ionicons name="person-outline" size={20} color="#111" />
            </Pressable>

            <Pressable
              style={styles.iconCircle}
              onPress={() => console.log("Create")}
              accessibilityLabel="Create listing"
            >
              <Ionicons name="add" size={22} color="#111" />
            </Pressable>
          </View>
        </View>

        {/* MAP */}
        <View style={styles.mapArea}>
          <BulbaMap />
        </View>

        {/* DIM OVERLAY when searching (tap outside to close) */}
        {isSearching && (
          <Pressable style={styles.overlay} onPress={closeSearch} />
        )}

        {/* FLOATING SEARCH (moves from bottom to top) */}
        <Animated.View
          style={[
            styles.floatingWrap,
            {
              top: animatedTop,
              left: SIDE,
              right: SIDE,
            },
          ]}
        >
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color="#666" />

            <TextInput
              style={styles.input}
              placeholder="Search items (e.g., chess, uno)"
              placeholderTextColor="#777"
              value={query}
              onFocus={openSearch}
              onChangeText={(t) => {
                setQuery(t);
                if (!isSearching) setIsSearching(true);
              }}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />

            {query.length > 0 ? (
              <Pressable
                style={styles.iconBtn}
                onPress={() => setQuery("")}
                accessibilityRole="button"
                accessibilityLabel="Clear"
              >
                <Ionicons name="close-circle" size={18} color="#666" />
              </Pressable>
            ) : (
              <Pressable
                style={styles.iconBtn}
                onPress={() => console.log("Voice")}
                accessibilityRole="button"
                accessibilityLabel="Voice search"
              >
                <Ionicons name="mic-outline" size={18} color="#666" />
              </Pressable>
            )}
          </View>

          {/* SUGGESTION DROPDOWN */}
          {isSearching && query.trim().length > 0 && (
            <View style={styles.dropdown}>
              {filteredSuggestions.length === 0 ? (
                <View style={styles.hintRow}>
                  <Text style={styles.hintText}>No suggestions found.</Text>
                </View>
              ) : (
                filteredSuggestions.map((item) => (
                  <Pressable
                    key={item}
                    style={styles.suggestionRow}
                    onPress={() => {
                      setQuery(item); // optional (keeps value)
                      closeSearch(); // closes dropdown + keyboard
                      router.push({
                        pathname: "/listings",
                        params: { q: item },
                      });
                    }}
                  >
                    <Ionicons name="search-outline" size={16} color="#666" />
                    <Text style={styles.suggestionText}>{item}</Text>
                  </Pressable>
                ))
              )}
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },

  mapArea: { flex: 1, backgroundColor: "#F5F5F5" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.12)",
    zIndex: 5,
  },

  floatingWrap: {
    position: "absolute",
    zIndex: 50, // IMPORTANT: keep above map
    elevation: 50, // IMPORTANT for Android touches
  },

  searchRow: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    elevation: 3,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    height: "100%",
  },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  dropdown: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E6E6",
    overflow: "hidden",
    elevation: 3,
  },

  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },
  topHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,

    backgroundColor: "#fff", // ✅ white bar behind icons
    zIndex: 80,
    elevation: 80,

    // optional polish:
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  topHeaderRow: {
    paddingHorizontal: 12,
    paddingBottom: 8, // space below icons inside the white bar
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
  },

  suggestionText: { fontSize: 14, color: "#111" },

  hintRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  hintText: { fontSize: 14, color: "#666" },
});
