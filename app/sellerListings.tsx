import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
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
  imageUrl: string;
};

// Sample listings data - in production this would come from API/params
const ALL_LISTINGS: Record<string, Listing[]> = {
  "alex-1": [
    {
      id: "l1",
      title: "Wooden Chess Board",
      condition: "Excellent – barely used",
      details: "Includes carved wooden pieces and magnetic board; portable design",
      imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: "l2",
      title: "Catan Board Game",
      condition: "Like new – all pieces intact",
      details: "Complete with all resources, development cards, and rulebook",
      imageUrl: "https://images.unsplash.com/photo-1563941433-b6b9b3c3e5b8?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: "l3",
      title: "1000 Piece Jigsaw Puzzle",
      condition: "New in box",
      details: "Beautiful landscape puzzle, sealed and never opened",
      imageUrl: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: "l4",
      title: "Scrabble Classic",
      condition: "Good",
      details: "All tiles included, board in great condition",
      imageUrl: "https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: "l5",
      title: "Playing Cards Set",
      condition: "Like new",
      details: "Premium poker cards with elegant case",
      imageUrl: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=60",
    },
  ],
  "sarah-1": [
    {
      id: "l1",
      title: "UNO Card Game",
      condition: "Like new",
      details: "Classic UNO with all 108 cards, played a few times only",
      imageUrl: "https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: "l2",
      title: "Chess Set",
      condition: "Good",
      details: "Standard plastic chess set, great for beginners",
      imageUrl: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: "l3",
      title: "Scrabble Classic",
      condition: "Excellent",
      details: "All 100 tiles included, board in great condition",
      imageUrl: "https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=600&q=60",
    },
  ],
  "mike-1": [
    {
      id: "l1",
      title: "Monopoly Classic",
      condition: "Good",
      details: "Complete set with all money, properties, and pieces",
      imageUrl: "https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: "l2",
      title: "Playing Cards Premium",
      condition: "New",
      details: "Poker-quality cards with elegant design, sealed pack",
      imageUrl: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: "l3",
      title: "Scrabble Deluxe",
      condition: "Excellent",
      details: "Rotating board with raised grid, all tiles included",
      imageUrl: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: "l4",
      title: "Monopoly Deal Card Game",
      condition: "New",
      details: "Quick version of Monopoly, perfect for travel",
      imageUrl: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=600&q=60",
    },
  ],
};

export default function SellerListings() {
  const params = useLocalSearchParams();
  const sellerId = typeof params.sellerId === "string" ? params.sellerId : "alex-1";
  const sellerName = typeof params.sellerName === "string" ? params.sellerName : "Seller";

  const listings = ALL_LISTINGS[sellerId] || ALL_LISTINGS["alex-1"] || [];

  const renderListing = ({ item }: { item: Listing }) => (
    <Pressable
      style={styles.listingCard}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: { id: item.id },
        })
      }
    >
      <Image source={{ uri: item.imageUrl }} style={styles.listingImage} />
      <View style={styles.listingContent}>
        <View style={styles.titleRow}>
          <Text style={styles.listingTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Ionicons name="volume-medium-outline" size={16} color="#666" />
        </View>
        <Text style={styles.listingCondition}>
          <Text style={styles.label}>Condition:</Text> {item.condition}
        </Text>
        <Text style={styles.listingDetails} numberOfLines={2}>
          <Text style={styles.label}>Details:</Text> {item.details}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{sellerName}'s Listings</Text>
        <Text style={styles.headerSub}>{listings.length} active listings</Text>
      </View>

      {/* Listings List */}
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={renderListing}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#eee" }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No listings available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },
  headerSub: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
  },
  listContent: {
    padding: 16,
  },
  listingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  listingImage: {
    width: 80,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  listingContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
    flex: 1,
  },
  listingCondition: {
    marginTop: 4,
    fontSize: 13,
    color: "#333",
  },
  listingDetails: {
    marginTop: 2,
    fontSize: 12.5,
    color: "#666",
  },
  label: {
    fontWeight: "700",
    color: "#111",
  },
  empty: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
  },
});
