import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

type Listing = {
  id: string;
  title: string;
  condition: string;
  details: string;
  distanceKm: number;
  rating: number;
  imageUrl: string;
};

const LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Wooden Chess Board",
    condition: "Excellent",
    details:
      "Includes carved wooden pieces and magnetic board; portable design",
    distanceKm: 1.2,
    rating: 4.93,
    imageUrl:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "2",
    title: "Chess Board",
    condition: "New",
    details: "The product is in good condition, message me",
    distanceKm: 3.6,
    rating: 4.37,
    imageUrl:
      "https://images.unsplash.com/photo-1542728928-1411f9c6f1b7?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "3",
    title: "Chess Board",
    condition: "Good",
    details: "Message if interested, don’t waste time",
    distanceKm: 6.3,
    rating: 4.2,
    imageUrl:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "4",
    title: "Catan Board Game",
    condition: "Like New",
    details: "All pieces included, played twice only",
    distanceKm: 2.4,
    rating: 4.85,
    imageUrl:
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=300&q=60",
  },
];

function formatDistance(km: number) {
  return `${km.toFixed(1)} km`;
}

export default function Listings() {
  const params = useLocalSearchParams();
  const qRaw = params.q;
  const q = typeof qRaw === "string" ? qRaw : "";

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return LISTINGS;
    return LISTINGS.filter((l) => l.title.toLowerCase().includes(needle));
  }, [q]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>
            {q ? `Results for “${q}”` : "Listings"}
          </Text>
          <Text style={styles.headerSub}>
            {filtered.length} listing{filtered.length === 1 ? "" : "s"}
          </Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/details",
                params: { id: item.id },
              })
            }
          >
            {/* existing card UI */}
          </Pressable>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No listings found</Text>
            <Text style={styles.emptySub}>Try a different search term.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
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
  headerTitleWrap: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  headerSub: { marginTop: 2, fontSize: 12, color: "#666" },

  card: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#eaeaea",
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "space-between",
  },
  title: { fontSize: 16, fontWeight: "800", color: "#111", flex: 1 },

  meta: { fontSize: 12.5, color: "#333", marginTop: 4 },
  metaLabel: { fontWeight: "700", color: "#111" },

  rightCol: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginLeft: 6,
  },
  heart: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  rating: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 12.5, fontWeight: "700", color: "#111" },

  empty: { padding: 20, alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  emptySub: { marginTop: 6, fontSize: 13, color: "#666", textAlign: "center" },
});
