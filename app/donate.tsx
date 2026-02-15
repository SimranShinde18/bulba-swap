import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DonationListing = {
  id: string;
  title: string;
  condition: string;
  details: string;
  distanceKm: number;
  imageUrl: string;
  donorName: string;
  donorAvatar: string;
  pickupDetails: string;
};

const DONATIONS: DonationListing[] = [
  {
    id: "d1",
    title: "Risk Board Game",
    condition: "Good",
    details: "Missing a few pieces but still playable. Free to a good home!",
    distanceKm: 0.5,
    imageUrl: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=400&q=60",
    donorName: "Lisa Park",
    donorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=60",
    pickupDetails: "Pickup from lobby, flexible times",
  },
  {
    id: "d2",
    title: "Kids Puzzle Collection",
    condition: "Fair",
    details: "5 puzzles, some pieces missing. Great for learning!",
    distanceKm: 1.8,
    imageUrl: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=400&q=60",
    donorName: "Tom Harper",
    donorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=60",
    pickupDetails: "Weekends only, front porch pickup",
  },
  {
    id: "d3",
    title: "Playing Cards Set",
    condition: "Good",
    details: "Multiple decks, slightly worn but fully usable",
    distanceKm: 3.2,
    imageUrl: "https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&w=400&q=60",
    donorName: "Maya Chen",
    donorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=60",
    pickupDetails: "Evenings after 6pm",
  },
  {
    id: "d4",
    title: "Jenga Tower",
    condition: "Fair",
    details: "All 54 blocks included. Fun for parties!",
    distanceKm: 2.1,
    imageUrl: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=400&q=60",
    donorName: "Jake Wilson",
    donorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=60",
    pickupDetails: "Flexible, just message me",
  },
];

export default function Donate() {
  const [claimedItems, setClaimedItems] = useState<Set<string>>(new Set());

  const handleClaim = (item: DonationListing) => {
    setClaimedItems((prev) => new Set([...prev, item.id]));
    // Navigate to chat with donor
    router.push({
      pathname: "/chat",
      params: {
        sellerName: item.donorName,
        distance: `${item.distanceKm} km`,
        listingTitle: item.title,
        condition: "Donation",
      },
    });
  };

  const renderItem = ({ item }: { item: DonationListing }) => {
    const isClaimed = claimedItems.has(item.id);

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/details",
            params: { id: item.id },
          })
        }
      >
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        <View style={styles.donationBadge}>
          <Ionicons name="gift" size={14} color="#fff" />
          <Text style={styles.donationBadgeText}>Free</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.distanceRow}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.distanceText}>
              {item.distanceKm.toFixed(1)} km away
            </Text>
          </View>
          <Text style={styles.condition}>
            <Text style={styles.conditionLabel}>Condition:</Text> {item.condition}
          </Text>
          <View style={styles.donorRow}>
            <Image source={{ uri: item.donorAvatar }} style={styles.donorAvatar} />
            <Text style={styles.donorName}>{item.donorName}</Text>
          </View>
          <Pressable
            style={[styles.claimBtn, isClaimed && styles.claimBtnClaimed]}
            onPress={() => handleClaim(item)}
            disabled={isClaimed}
          >
            <Text style={[styles.claimBtnText, isClaimed && styles.claimBtnTextClaimed]}>
              {isClaimed ? "Claimed!" : "Claim"}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Donations</Text>
          <Text style={styles.headerSub}>Free games looking for new homes</Text>
        </View>
        <View style={styles.freeChip}>
          <Ionicons name="gift" size={16} color="#4CAF50" />
          <Text style={styles.freeChipText}>All Free</Text>
        </View>
      </View>

      {/* Grid */}
      <FlatList
        data={DONATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="gift-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No donations yet</Text>
            <Text style={styles.emptySub}>Be the first to donate a game!</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
  },
  headerSub: {
    marginTop: 2,
    fontSize: 13,
    color: "#666",
  },
  freeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
  },
  freeChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4CAF50",
  },
  grid: {
    padding: 12,
  },
  row: {
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#f0f0f0",
  },
  donationBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  donationBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 12,
    color: "#666",
  },
  condition: {
    fontSize: 12,
    color: "#333",
    marginBottom: 8,
  },
  conditionLabel: {
    fontWeight: "700",
  },
  donorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  donorAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#eee",
  },
  donorName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
  },
  claimBtn: {
    backgroundColor: "#111",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  claimBtnClaimed: {
    backgroundColor: "#E8F5E9",
  },
  claimBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  claimBtnTextClaimed: {
    color: "#4CAF50",
  },
  empty: {
    padding: 60,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  emptySub: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
});
