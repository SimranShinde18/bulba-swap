import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

type Match = {
  id: string;
  userName: string;
  userAvatar: string;
  listingTitle: string;
  listingImage: string;
  matchedAt: string;
  isNew: boolean;
};

// Simulated matches for demo
const MATCHES: Match[] = [
  {
    id: "m1",
    userName: "Sarah Chen",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=60",
    listingTitle: "Catan Board Game",
    listingImage: "https://images.unsplash.com/photo-1563941433-b6b9b3c3e5b8?auto=format&fit=crop&w=300&q=60",
    matchedAt: "Just now",
    isNew: true,
  },
  {
    id: "m2",
    userName: "Mike Johnson",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=60",
    listingTitle: "Monopoly Classic",
    listingImage: "https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=300&q=60",
    matchedAt: "2 hours ago",
    isNew: true,
  },
  {
    id: "m3",
    userName: "Emma Wilson",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=60",
    listingTitle: "UNO Card Game",
    listingImage: "https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&w=300&q=60",
    matchedAt: "Yesterday",
    isNew: false,
  },
];

export default function Matches() {
  const openChat = (match: Match) => {
    router.push({
      pathname: "/chat",
      params: {
        sellerName: match.userName,
        distance: "nearby",
        listingTitle: match.listingTitle,
        condition: "Matched",
      },
    });
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <Pressable style={styles.matchCard} onPress={() => openChat(item)}>
      {/* Match visual */}
      <View style={styles.matchVisual}>
        <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
        <View style={styles.heartBadge}>
          <Ionicons name="heart" size={12} color="#fff" />
        </View>
        <Image source={{ uri: item.listingImage }} style={styles.listingThumb} />
      </View>

      {/* Match info */}
      <View style={styles.matchInfo}>
        <View style={styles.matchTitleRow}>
          <Text style={styles.matchName}>{item.userName}</Text>
          {item.isNew && <View style={styles.newDot} />}
        </View>
        <Text style={styles.matchListing} numberOfLines={1}>
          Interested in your {item.listingTitle}
        </Text>
        <Text style={styles.matchTime}>{item.matchedAt}</Text>
      </View>

      {/* Chat arrow */}
      <View style={styles.chatArrow}>
        <Ionicons name="chatbubble-ellipses" size={24} color="#4CAF50" />
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <Text style={styles.headerSub}>
          {MATCHES.length} mutual interest{MATCHES.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Match Banner */}
      <View style={styles.banner}>
        <Ionicons name="sparkles" size={24} color="#FFB300" />
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>It's a Match!</Text>
          <Text style={styles.bannerSub}>
            You both liked each other's games. Start chatting to swap!
          </Text>
        </View>
      </View>

      {/* Matches List */}
      <FlatList
        data={MATCHES}
        keyExtractor={(item) => item.id}
        renderItem={renderMatch}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={64} color="#ddd" />
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptySub}>
              Keep swiping to find games you'd like to swap!
            </Text>
            <Pressable
              style={styles.swipeBtn}
              onPress={() => router.push("/swipe")}
            >
              <Text style={styles.swipeBtnText}>Start Swiping</Text>
            </Pressable>
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111",
  },
  headerSub: {
    marginTop: 2,
    fontSize: 14,
    color: "#666",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: "#FFF8E1",
    borderRadius: 16,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },
  bannerSub: {
    marginTop: 2,
    fontSize: 13,
    color: "#666",
  },
  list: {
    padding: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 4,
  },
  matchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  matchVisual: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: "#4CAF50",
    backgroundColor: "#eee",
  },
  heartBadge: {
    position: "absolute",
    left: 36,
    top: 18,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 1,
  },
  listingThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  matchInfo: {
    flex: 1,
  },
  matchTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  matchName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  matchListing: {
    marginTop: 2,
    fontSize: 13,
    color: "#666",
  },
  matchTime: {
    marginTop: 4,
    fontSize: 12,
    color: "#999",
  },
  chatArrow: {
    padding: 8,
  },
  empty: {
    padding: 60,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
  },
  emptySub: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  swipeBtn: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: "#111",
    borderRadius: 14,
  },
  swipeBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
