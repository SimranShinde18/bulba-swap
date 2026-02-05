import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

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

function matchesAtWordStart(item: string, q: string) {
  // item: "Chess board", q: "bo" -> true (board starts with bo)
  // item: "Chess", q: "s" -> false (chess doesn't have a word starting with s)
  const text = item.toLowerCase().trim();
  const query = q.toLowerCase().trim();
  if (!query) return false;

  const words = text.split(/\s+/);
  return words.some((w) => w.startsWith(query));
}

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const initialQ = typeof params.q === "string" ? params.q : "";

  const [query, setQuery] = useState(initialQ);
  const inputRef = useRef<TextInput>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return [];

    // 1) items whose FULL string starts with query
    const startsWith = SUGGESTIONS.filter((item) =>
      item.toLowerCase().trim().startsWith(q.toLowerCase()),
    );

    // 2) items where ANY WORD starts with query (excluding ones already included)
    const wordStarts = SUGGESTIONS.filter((item) => {
      const lower = item.toLowerCase().trim();
      if (lower.startsWith(q.toLowerCase())) return false;
      return matchesAtWordStart(item, q);
    });

    // Limit results so it looks like your mock
    return [...startsWith, ...wordStarts].slice(0, 10);
  }, [query]);

  const goListings = (q: string) => {
    Keyboard.dismiss();
    router.push({
      pathname: "/listings",
      params: { q },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar with back + search */}
      <View style={styles.header}>
        {/* <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable> */}

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#666" />

          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search items (e.g., chess, uno)"
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={() => {
              if (query.trim()) goListings(query.trim());
            }}
          />

          {query.trim().length > 0 ? (
            <Pressable
              style={styles.iconBtn}
              onPress={() => setQuery("")}
              accessibilityRole="button"
              accessibilityLabel="Clear"
            >
              <Ionicons name="close-circle" size={18} color="#666" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Examples / Suggestions list */}
      <FlatList
        data={query.trim() ? filtered : SUGGESTIONS.slice(0, 8)} // show examples when empty
        keyExtractor={(item) => item}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => goListings(item)}
            accessibilityRole="button"
            accessibilityLabel={`Search ${item}`}
          >
            <Ionicons name="search-outline" size={18} color="#666" />
            <Text style={styles.rowText}>{item}</Text>
          </Pressable>
        )}
        ListHeaderComponent={
          <Text style={styles.examplesTitle}>
            {query.trim() ? "Suggestions" : "Examples"}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  searchBar: {
    height: 50,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
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

  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },

  examplesTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#999",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
  },

  rowText: {
    fontSize: 15,
    color: "#111",
    fontWeight: "600",
  },

  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#eee",
    marginLeft: 44,
  },
});
