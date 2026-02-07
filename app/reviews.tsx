import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Review = {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  timeAgo: string;
  text: string;
};

// Sample reviews data - in production this would come from API/params
const ALL_REVIEWS: Record<string, Review[]> = {
  "alex-1": [
    {
      id: "r1",
      name: "Joshua",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=60",
      rating: 5,
      timeAgo: "1 month ago",
      text: "Alex kept me updated from start to finish and even offered to meet halfway. Really trustworthy. 10/10 experience.",
    },
    {
      id: "r2",
      name: "Emily W.",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60",
      rating: 5,
      timeAgo: "2 months ago",
      text: "Quick replies and very polite. The chess board was exactly as described. Would definitely swap again!",
    },
    {
      id: "r3",
      name: "Chris D.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=60",
      rating: 5,
      timeAgo: "3 months ago",
      text: "Alex is organized, punctual, and genuinely cares about fair trading. Highly recommend!",
    },
    {
      id: "r4",
      name: "Sarah M.",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=60",
      rating: 5,
      timeAgo: "4 months ago",
      text: "Had a great experience swapping with Alex. The Catan game was in perfect condition. Very friendly!",
    },
    {
      id: "r5",
      name: "David K.",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=60",
      rating: 4,
      timeAgo: "5 months ago",
      text: "Good communication and fair trade. Item was as described. Would trade again.",
    },
    {
      id: "r6",
      name: "Michelle T.",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=60",
      rating: 5,
      timeAgo: "6 months ago",
      text: "Super smooth swap! Alex was flexible with timing and the puzzle was brand new as promised.",
    },
  ],
  "sarah-1": [
    {
      id: "r1",
      name: "Michael",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=60",
      rating: 5,
      timeAgo: "2 weeks ago",
      text: "Sarah was super friendly and the UNO cards were in perfect condition!",
    },
    {
      id: "r2",
      name: "Amanda",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=60",
      rating: 5,
      timeAgo: "1 month ago",
      text: "Great communication and the puzzle had all pieces. Very happy!",
    },
    {
      id: "r3",
      name: "Tom H.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=60",
      rating: 5,
      timeAgo: "2 months ago",
      text: "Perfect swap experience. Sarah is prompt and the Scrabble set was complete.",
    },
  ],
};

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < full ? "star" : "star-outline"}
          size={14}
          color="#111"
        />
      ))}
    </View>
  );
}

export default function Reviews() {
  const params = useLocalSearchParams();
  const sellerId = typeof params.sellerId === "string" ? params.sellerId : "alex-1";
  const sellerName = typeof params.sellerName === "string" ? params.sellerName : "Seller";

  const reviews = ALL_REVIEWS[sellerId] || ALL_REVIEWS["alex-1"] || [];

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      <View style={styles.reviewContent}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewName}>{item.name}</Text>
          <Text style={styles.reviewTime}>{item.timeAgo}</Text>
        </View>
        <Stars rating={item.rating} />
        <Text style={styles.reviewText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reviews for {sellerName}</Text>
        <Text style={styles.headerSub}>{reviews.length} reviews</Text>
      </View>

      {/* Reviews List */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReview}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#eee" }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No reviews yet</Text>
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
  reviewCard: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eee",
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111",
  },
  reviewTime: {
    fontSize: 12,
    color: "#666",
  },
  reviewText: {
    marginTop: 8,
    fontSize: 13.5,
    color: "#333",
    lineHeight: 19,
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
