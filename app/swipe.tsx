import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

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
  tags: string[];
  mode: "swap" | "donate";
};

const AVATARS = {
  alex: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=60",
  sarah: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=60",
  mike: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=60",
  emma: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=60",
  james: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=60",
};

const SWAP_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Wooden Chess Board",
    condition: "Excellent",
    details: "Beautiful crafted set with carved pieces",
    distanceKm: 1.2,
    rating: 4.93,
    imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
    sellerName: "Alex Miller",
    sellerAvatar: AVATARS.alex,
    tags: ["Complete Set", "Swap"],
    mode: "swap",
  },
  {
    id: "2",
    title: "Monopoly Classic Edition",
    condition: "Like New",
    details: "All pieces included, box in great condition",
    distanceKm: 2.1,
    rating: 4.78,
    imageUrl: "https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=800&q=80",
    sellerName: "Mike Johnson",
    sellerAvatar: AVATARS.mike,
    tags: ["Complete", "Family Game", "Swap"],
    mode: "swap",
  },
  {
    id: "3",
    title: "Catan Board Game",
    condition: "Like New",
    details: "All resources and development cards included",
    distanceKm: 2.4,
    rating: 4.85,
    imageUrl: "https://images.unsplash.com/photo-1563941433-b6b9b3c3e5b8?auto=format&fit=crop&w=800&q=80",
    sellerName: "Sarah Chen",
    sellerAvatar: AVATARS.sarah,
    tags: ["Strategy", "3-4 Players", "Swap"],
    mode: "swap",
  },
  {
    id: "4",
    title: "UNO Card Game",
    condition: "New",
    details: "Sealed pack, classic edition with 108 cards",
    distanceKm: 0.8,
    rating: 4.91,
    imageUrl: "https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&w=800&q=80",
    sellerName: "Emma Wilson",
    sellerAvatar: AVATARS.emma,
    tags: ["New", "Quick Game", "Swap"],
    mode: "swap",
  },
  {
    id: "5",
    title: "Scrabble Deluxe",
    condition: "Excellent",
    details: "Rotating board with raised grid, all tiles included",
    distanceKm: 1.5,
    rating: 4.89,
    imageUrl: "https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=800&q=80",
    sellerName: "James Taylor",
    sellerAvatar: AVATARS.james,
    tags: ["Word Game", "Complete", "Swap"],
    mode: "swap",
  },
];

export default function Swipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedListings, setLikedListings] = useState<Set<string>>(new Set());
  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const passOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH * 1.5, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => handleSwipeComplete("pass"));
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH * 1.5, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => handleSwipeComplete("like"));
  };

  const handleSwipeComplete = (direction: "like" | "pass") => {
    const listing = SWAP_LISTINGS[currentIndex];
    if (direction === "like" && listing) {
      setLikedListings((prev) => new Set([...prev, listing.id]));
    }
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePass = () => swipeLeft();
  const handleLike = () => swipeRight();
  const handleSuperlike = () => {
    // Superlike animation (scale up then swipe)
    Animated.sequence([
      Animated.timing(position, {
        toValue: { x: 0, y: -50 },
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(position, {
        toValue: { x: SCREEN_WIDTH * 1.5, y: 0 },
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => handleSwipeComplete("like"));
  };

  const openDetails = (listing: Listing) => {
    router.push({
      pathname: "/details",
      params: { id: listing.id },
    });
  };

  const currentListing = SWAP_LISTINGS[currentIndex];
  const nextListing = SWAP_LISTINGS[currentIndex + 1];

  if (!currentListing) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          <Text style={styles.emptyTitle}>You've seen them all!</Text>
          <Text style={styles.emptySub}>
            Check back later for new listings or explore donations.
          </Text>
          <Pressable
            style={styles.refreshBtn}
            onPress={() => setCurrentIndex(0)}
          >
            <Text style={styles.refreshBtnText}>Start Over</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Swap</Text>
        <Pressable
          onPress={() => router.push("/matches")}
          style={styles.matchesBtn}
        >
          <Ionicons name="heart" size={24} color="#E53935" />
          {likedListings.size > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{likedListings.size}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {/* Next Card (behind) */}
        {nextListing && (
          <Animated.View
            style={[
              styles.card,
              styles.nextCard,
              { transform: [{ scale: nextCardScale }] },
            ]}
          >
            <Image
              source={{ uri: nextListing.imageUrl }}
              style={styles.cardImage}
            />
          </Animated.View>
        )}

        {/* Current Card */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate },
              ],
            },
          ]}
        >
          <Pressable
            style={styles.cardPressable}
            onPress={() => openDetails(currentListing)}
          >
            <Image
              source={{ uri: currentListing.imageUrl }}
              style={styles.cardImage}
            />

            {/* Swipe Labels */}
            <Animated.View
              style={[styles.labelContainer, styles.likeLabel, { opacity: likeOpacity }]}
            >
              <Text style={styles.labelText}>LIKE</Text>
            </Animated.View>
            <Animated.View
              style={[styles.labelContainer, styles.passLabel, { opacity: passOpacity }]}
            >
              <Text style={[styles.labelText, { color: "#FF6B6B" }]}>PASS</Text>
            </Animated.View>

            {/* Gradient Overlay */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.gradient}
            >
              <Text style={styles.cardTitle}>{currentListing.title}</Text>
              <View style={styles.distanceRow}>
                <Ionicons name="location" size={16} color="#fff" />
                <Text style={styles.distanceText}>
                  {currentListing.distanceKm.toFixed(1)} km away
                </Text>
              </View>

              {/* Tags */}
              <View style={styles.tagsRow}>
                <View style={styles.conditionChip}>
                  <Text style={styles.chipText}>{currentListing.condition}</Text>
                </View>
                {currentListing.tags.slice(0, 2).map((tag) => (
                  <View key={tag} style={styles.tagChip}>
                    <Text style={styles.chipText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Seller Row */}
              <View style={styles.sellerRow}>
                <Image
                  source={{ uri: currentListing.sellerAvatar }}
                  style={styles.sellerAvatar}
                />
                <Text style={styles.sellerName}>{currentListing.sellerName}</Text>
                <Ionicons name="star" size={14} color="#FFB300" />
                <Text style={styles.sellerRating}>
                  {currentListing.rating.toFixed(2)}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable style={[styles.actionBtn, styles.passBtn]} onPress={handlePass}>
          <Ionicons name="close" size={32} color="#FF6B6B" />
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.superlikeBtn]} onPress={handleSuperlike}>
          <Ionicons name="star" size={28} color="#00BFFF" />
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.likeBtn]} onPress={handleLike}>
          <Ionicons name="heart" size={32} color="#4CAF50" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
  },
  matchesBtn: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#111",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    position: "absolute",
    width: SCREEN_WIDTH - 32,
    height: SCREEN_HEIGHT * 0.58,
    borderRadius: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
  },
  nextCard: {
    top: 10,
  },
  cardPressable: {
    flex: 1,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 60,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 6,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  distanceText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  conditionChip: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagChip: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sellerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#fff",
  },
  sellerName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  sellerRating: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  labelContainer: {
    position: "absolute",
    top: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderRadius: 8,
  },
  likeLabel: {
    right: 20,
    borderColor: "#4CAF50",
    transform: [{ rotate: "15deg" }],
  },
  passLabel: {
    left: 20,
    borderColor: "#FF6B6B",
    transform: [{ rotate: "-15deg" }],
  },
  labelText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#4CAF50",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  actionBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  passBtn: {
    width: 64,
    height: 64,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FF6B6B",
  },
  superlikeBtn: {
    width: 52,
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#00BFFF",
  },
  likeBtn: {
    width: 64,
    height: 64,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyTitle: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
  },
  emptySub: {
    marginTop: 8,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  refreshBtn: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: "#111",
    borderRadius: 14,
  },
  refreshBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
