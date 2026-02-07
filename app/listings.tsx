import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Listing = {
  id: string;
  title: string;
  condition: string;
  details: string;
  distanceKm: number;
  rating: number;
  imageUrl: string;
  sellerName: string;
  sellerAvatar: string;
  isFavorite?: boolean;
};

// Sample seller avatars
const AVATARS = {
  alex: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=60",
  sarah: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=60",
  mike: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=60",
  emma: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=60",
  james: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=60",
  lisa: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=60",
};

export const LISTINGS: Listing[] = [
  // ============ CHESS (3 listings) ============
  {
    id: "chess-1",
    title: "Wooden Chess Board",
    condition: "Excellent",
    details: "Includes carved wooden pieces and magnetic board; portable design",
    distanceKm: 1.2,
    rating: 4.93,
    imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=300&q=60",
    sellerName: "Alex Miller",
    sellerAvatar: AVATARS.alex,
    isFavorite: true,
  },
  {
    id: "chess-2",
    title: "Chess Board",
    condition: "New",
    details: "The product is in good condition, message me",
    distanceKm: 3.6,
    rating: 4.37,
    imageUrl: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=300&q=60",
    sellerName: "Sarah Chen",
    sellerAvatar: AVATARS.sarah,
    isFavorite: false,
  },
  {
    id: "chess-3",
    title: "Chess Board",
    condition: "Good",
    details: "Message if interested, don't waste time",
    distanceKm: 6.3,
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&w=300&q=60",
    sellerName: "Emma Wilson",
    sellerAvatar: AVATARS.emma,
    isFavorite: false,
  },

  // ============ MONOPOLY (3 listings) ============
  {
    id: "monopoly-1",
    title: "Monopoly Classic Edition",
    condition: "Like New",
    details: "Complete set with all money, cards and pieces. Played only a few times",
    distanceKm: 2.1,
    rating: 4.78,
    imageUrl: "https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=300&q=60",
    sellerName: "Mike Johnson",
    sellerAvatar: AVATARS.mike,
    isFavorite: true,
  },
  {
    id: "monopoly-2",
    title: "Monopoly Game",
    condition: "Good",
    details: "All pieces included, box has minor wear",
    distanceKm: 4.5,
    rating: 4.12,
    imageUrl: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=300&q=60",
    sellerName: "Lisa Park",
    sellerAvatar: AVATARS.lisa,
    isFavorite: false,
  },
  {
    id: "monopoly-3",
    title: "Monopoly Deluxe",
    condition: "Excellent",
    details: "Special edition with wooden hotels and metal tokens",
    distanceKm: 7.8,
    rating: 4.95,
    imageUrl: "https://images.unsplash.com/photo-1566694271355-c9a556a5c6e0?auto=format&fit=crop&w=300&q=60",
    sellerName: "James Taylor",
    sellerAvatar: AVATARS.james,
    isFavorite: false,
  },

  // ============ PUZZLES (3 listings) ============
  {
    id: "puzzle-1",
    title: "1000 Piece Puzzle",
    condition: "New",
    details: "Beautiful landscape puzzle, sealed in box, never opened",
    distanceKm: 1.8,
    rating: 4.88,
    imageUrl: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=300&q=60",
    sellerName: "Sarah Chen",
    sellerAvatar: AVATARS.sarah,
    isFavorite: false,
  },
  {
    id: "puzzle-2",
    title: "Jigsaw Puzzle Set",
    condition: "Excellent",
    details: "Contains 3 puzzles (500, 1000, 1500 pieces). All complete",
    distanceKm: 3.2,
    rating: 4.65,
    imageUrl: "https://images.unsplash.com/photo-1494059980473-813e73ee784b?auto=format&fit=crop&w=300&q=60",
    sellerName: "Alex Miller",
    sellerAvatar: AVATARS.alex,
    isFavorite: true,
  },
  {
    id: "puzzle-3",
    title: "3D Wooden Puzzle",
    condition: "Like New",
    details: "Challenging mechanical puzzle, great brain teaser",
    distanceKm: 5.4,
    rating: 4.42,
    imageUrl: "https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?auto=format&fit=crop&w=300&q=60",
    sellerName: "Emma Wilson",
    sellerAvatar: AVATARS.emma,
    isFavorite: false,
  },

  // ============ UNO / CARD GAMES (3 listings) ============
  {
    id: "uno-1",
    title: "UNO Card Game",
    condition: "New",
    details: "Brand new, sealed pack. Perfect for family game nights",
    distanceKm: 0.8,
    rating: 4.91,
    imageUrl: "https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&w=300&q=60",
    sellerName: "Mike Johnson",
    sellerAvatar: AVATARS.mike,
    isFavorite: false,
  },
  {
    id: "uno-2",
    title: "UNO Flip",
    condition: "Excellent",
    details: "Double-sided cards for extra fun, complete set",
    distanceKm: 2.9,
    rating: 4.56,
    imageUrl: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=300&q=60",
    sellerName: "Lisa Park",
    sellerAvatar: AVATARS.lisa,
    isFavorite: false,
  },
  {
    id: "cards-3",
    title: "Playing Cards Set",
    condition: "Good",
    details: "Premium poker cards with case, great for card games",
    distanceKm: 4.1,
    rating: 4.28,
    imageUrl: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=300&q=60",
    sellerName: "James Taylor",
    sellerAvatar: AVATARS.james,
    isFavorite: false,
  },

  // ============ CATAN (3 listings) ============
  {
    id: "catan-1",
    title: "Catan Board Game",
    condition: "Like New",
    details: "All pieces included, played twice only. Great strategy game",
    distanceKm: 2.4,
    rating: 4.85,
    imageUrl: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=300&q=60",
    sellerName: "Alex Miller",
    sellerAvatar: AVATARS.alex,
    isFavorite: true,
  },
  {
    id: "catan-2",
    title: "Settlers of Catan",
    condition: "Good",
    details: "Classic edition, all resources and development cards included",
    distanceKm: 5.1,
    rating: 4.33,
    imageUrl: "https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=300&q=60",
    sellerName: "Sarah Chen",
    sellerAvatar: AVATARS.sarah,
    isFavorite: false,
  },
  {
    id: "catan-3",
    title: "Catan Expansion Pack",
    condition: "Excellent",
    details: "Cities & Knights expansion, adds depth to base game",
    distanceKm: 8.2,
    rating: 4.72,
    imageUrl: "https://images.unsplash.com/photo-1566694271355-c9a556a5c6e0?auto=format&fit=crop&w=300&q=60",
    sellerName: "Emma Wilson",
    sellerAvatar: AVATARS.emma,
    isFavorite: false,
  },

  // ============ SCRABBLE (3 listings) ============
  {
    id: "scrabble-1",
    title: "Scrabble Deluxe",
    condition: "Excellent",
    details: "Rotating board with raised grid, all tiles included",
    distanceKm: 1.5,
    rating: 4.89,
    imageUrl: "https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=300&q=60",
    sellerName: "Lisa Park",
    sellerAvatar: AVATARS.lisa,
    isFavorite: false,
  },
  {
    id: "scrabble-2",
    title: "Scrabble Classic",
    condition: "Good",
    details: "Traditional word game, perfect for vocabulary lovers",
    distanceKm: 3.7,
    rating: 4.45,
    imageUrl: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=300&q=60",
    sellerName: "Mike Johnson",
    sellerAvatar: AVATARS.mike,
    isFavorite: false,
  },
  {
    id: "scrabble-3",
    title: "Scrabble Travel Edition",
    condition: "New",
    details: "Compact travel size, magnetic tiles stay in place",
    distanceKm: 6.9,
    rating: 4.61,
    imageUrl: "https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&w=300&q=60",
    sellerName: "James Taylor",
    sellerAvatar: AVATARS.james,
    isFavorite: true,
  },
];

function formatDistance(km: number) {
  return `${km.toFixed(1)} km`;
}

export default function Listings() {
  const params = useLocalSearchParams();
  const qRaw = params.q;
  const q = typeof qRaw === "string" ? qRaw : "";

  // Track favorites state
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(LISTINGS.filter((l) => l.isFavorite).map((l) => l.id))
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return LISTINGS;
    return LISTINGS.filter((l) => l.title.toLowerCase().includes(needle));
  }, [q]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>
            {q ? `Results for "${q}"` : "Listings"}
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
            {/* Thumbnail */}
            <Image source={{ uri: item.imageUrl }} style={styles.thumb} />

            {/* Content */}
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Ionicons name="volume-medium-outline" size={16} color="#666" />
              </View>
              <Text style={styles.meta}>
                <Text style={styles.metaLabel}>Condition:</Text> {item.condition}
              </Text>
              <Text style={styles.meta} numberOfLines={2}>
                <Text style={styles.metaLabel}>Details:</Text> {item.details}
              </Text>
              <Text style={styles.meta}>
                <Text style={styles.metaLabel}>Distance:</Text>{" "}
                {formatDistance(item.distanceKm)}
              </Text>
            </View>

            {/* Right column */}
            <View style={styles.rightCol}>
              <Pressable 
                style={styles.heart}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
                hitSlop={8}
              >
                <Ionicons
                  name={favorites.has(item.id) ? "heart" : "heart-outline"}
                  size={22}
                  color={favorites.has(item.id) ? "#E53935" : "#999"}
                />
              </Pressable>
              <Image
                source={{ uri: item.sellerAvatar }}
                style={styles.avatar}
              />
              <View style={styles.rating}>
                <Ionicons name="star" size={12} color="#FFB300" />
                <Text style={styles.ratingText}>{item.rating.toFixed(2)}</Text>
              </View>
            </View>
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
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: { fontSize: 16, fontWeight: "800", color: "#111", flex: 1 },

  meta: { fontSize: 12.5, color: "#333", marginTop: 4 },
  metaLabel: { fontWeight: "700", color: "#111" },

  rightCol: {
    alignItems: "center",
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
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eee",
  },
  rating: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 12.5, fontWeight: "700", color: "#111" },

  empty: { padding: 20, alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  emptySub: { marginTop: 6, fontSize: 13, color: "#666", textAlign: "center" },
});
