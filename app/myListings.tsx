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

type Listing = {
  id: string;
  title: string;
  condition: string;
  details: string;
  imageUrl: string;
  views: number;
  inquiries: number;
};

const MY_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Wooden Chess Board",
    condition: "Excellent – barely used",
    details: "Includes carved wooden pieces and magnetic board; portable design",
    imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=60",
    views: 45,
    inquiries: 3,
  },
  {
    id: "2",
    title: "Catan Board Game",
    condition: "Like new – all pieces intact",
    details: "Complete with all resources, development cards, and rulebook",
    imageUrl: "https://images.unsplash.com/photo-1563941433-b6b9b3c3e5b8?auto=format&fit=crop&w=600&q=60",
    views: 32,
    inquiries: 5,
  },
  {
    id: "3",
    title: "1000 Piece Jigsaw Puzzle",
    condition: "New in box",
    details: "Beautiful landscape puzzle, sealed and never opened",
    imageUrl: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=600&q=60",
    views: 18,
    inquiries: 1,
  },
  {
    id: "4",
    title: "UNO Card Game",
    condition: "Good",
    details: "All cards included, box slightly worn",
    imageUrl: "https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&w=600&q=60",
    views: 27,
    inquiries: 2,
  },
];

export default function MyListings() {
  const [listings, setListings] = useState(MY_LISTINGS);

  const handleDelete = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const renderListing = ({ item }: { item: Listing }) => (
    <View style={styles.listingCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.listingImage} />
      <View style={styles.listingContent}>
        <Text style={styles.listingTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.listingCondition}>
          <Text style={styles.label}>Condition:</Text> {item.condition}
        </Text>
        <Text style={styles.listingDetails} numberOfLines={2}>
          {item.details}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="eye-outline" size={14} color="#666" />
            <Text style={styles.statText}>{item.views} views</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble-outline" size={14} color="#666" />
            <Text style={styles.statText}>{item.inquiries} inquiries</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={styles.actionBtn}
          onPress={() =>
            router.push({
              pathname: "/details",
              params: { id: item.id },
            })
          }
        >
          <Ionicons name="eye-outline" size={20} color="#111" />
        </Pressable>
        <Pressable
          style={styles.actionBtn}
          onPress={() => console.log("Edit", item.id)}
        >
          <Ionicons name="create-outline" size={20} color="#111" />
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#E53935" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
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
            <Ionicons name="cube-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No listings yet</Text>
            <Pressable
              style={styles.createBtn}
              onPress={() => router.push("/createListing")}
            >
              <Text style={styles.createBtnText}>Create Your First Listing</Text>
            </Pressable>
          </View>
        }
      />

      {/* Add Listing FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/createListing")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
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
    paddingBottom: 80,
  },
  listingCard: {
    flexDirection: "row",
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
  listingTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
  },
  listingCondition: {
    marginTop: 2,
    fontSize: 12.5,
    color: "#333",
  },
  listingDetails: {
    marginTop: 2,
    fontSize: 12,
    color: "#666",
  },
  label: {
    fontWeight: "700",
    color: "#111",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: "#666",
  },
  actions: {
    justifyContent: "center",
    gap: 6,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: "#FFEBEE",
  },
  empty: {
    padding: 60,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  createBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  createBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
