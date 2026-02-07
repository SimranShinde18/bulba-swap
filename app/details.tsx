import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

type Listing = {
  id: string;
  title: string;
  condition: string;
  details: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  ownerName: string;
  ownerAvatarUrl: string;
  images: string[];
};

const AVATARS = {
  alex: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=60",
  sarah: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=60",
  mike: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=60",
  emma: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=60",
  james: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=60",
  lisa: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=60",
};

const LISTINGS: Listing[] = [
  // Chess Board
  {
    id: "chess-1",
    title: "Wooden Chess Board",
    condition: "Excellent - barely used",
    details:
      "Beautifully crafted wooden chess board with polished finish and full set of sturdy pieces. Includes carved wooden pieces and magnetic board with portable design. Used only a few times and kept in great condition.",
    distanceKm: 1.2,
    rating: 4.93,
    reviewCount: 31,
    ownerName: "Alex Miller",
    ownerAvatarUrl: AVATARS.alex,
    images: [
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=300&q=60",
    ],
  },
  // Monopoly
  {
    id: "monopoly-1",
    title: "Monopoly Classic Edition",
    condition: "Like New",
    details:
      "Complete Monopoly set with all money, property cards, houses, hotels, and game pieces. The box shows minimal wear and all components are in excellent condition. Perfect for family game nights!",
    distanceKm: 2.1,
    rating: 4.78,
    reviewCount: 24,
    ownerName: "Mike Johnson",
    ownerAvatarUrl: AVATARS.mike,
    images: [
      "https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1566694271355-c9a556a5c6e0?auto=format&fit=crop&w=300&q=60",
    ],
  },
  // Catan
  {
    id: "catan-1",
    title: "Catan Board Game",
    condition: "Like New - all pieces intact",
    details:
      "Complete Settlers of Catan game with all resource cards, development cards, hex tiles, and game pieces. Played only twice and stored carefully. Great strategy game for 3-4 players!",
    distanceKm: 2.4,
    rating: 4.85,
    reviewCount: 19,
    ownerName: "James Taylor",
    ownerAvatarUrl: AVATARS.james,
    images: [
      "https://images.unsplash.com/photo-1563941433-b6b9b3c3e5b8?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=300&q=60",
    ],
  },
  // UNO
  {
    id: "uno-1",
    title: "UNO Card Game",
    condition: "New",
    details:
      "Brand new sealed UNO card game pack. Classic version with all 108 cards. Perfect for family gatherings and parties. Easy to learn, fun for all ages!",
    distanceKm: 0.8,
    rating: 4.91,
    reviewCount: 15,
    ownerName: "Sarah Chen",
    ownerAvatarUrl: AVATARS.sarah,
    images: [
      "https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=300&q=60",
    ],
  },
  // Scrabble
  {
    id: "scrabble-1",
    title: "Scrabble Deluxe",
    condition: "Excellent",
    details:
      "Deluxe Scrabble with rotating board and raised grid to keep tiles in place. All 100 letter tiles included with tile bag. Perfect for word game lovers!",
    distanceKm: 1.5,
    rating: 4.89,
    reviewCount: 22,
    ownerName: "Lisa Park",
    ownerAvatarUrl: AVATARS.lisa,
    images: [
      "https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=300&q=60",
    ],
  },
  // Puzzle
  {
    id: "puzzle-1",
    title: "1000 Piece Jigsaw Puzzle",
    condition: "New in box",
    details:
      "Beautiful landscape jigsaw puzzle with 1000 pieces. Sealed in original box, never opened. High quality pieces with vibrant colors. Great for relaxing weekends!",
    distanceKm: 1.8,
    rating: 4.88,
    reviewCount: 12,
    ownerName: "Emma Wilson",
    ownerAvatarUrl: AVATARS.emma,
    images: [
      "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1494059980473-813e73ee784b?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?auto=format&fit=crop&w=300&q=60",
    ],
  },
];

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating); // simple for now
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

function AvailabilityGrid() {
  const cols = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const rows = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];
  
  // Sample availability: true = available (shaded green)
  const availability: Record<string, Record<string, boolean>> = {
    "9 AM": { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true },
    "10 AM": { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true },
    "11 AM": { Tue: true, Wed: true, Thu: true },
    "12 PM": { Wed: true },
    "1 PM": { Wed: true, Sat: true },
    "2 PM": { Sat: true, Sun: true },
    "3 PM": { Sat: true, Sun: true },
    "4 PM": { Fri: true, Sat: true },
    "5 PM": { Fri: true },
  };

  return (
    <View style={styles.grid}>
      <View style={styles.gridRow}>
        <View style={styles.gridCellHeader} />
        {cols.map((c) => (
          <View key={c} style={styles.gridCellHeader}>
            <Text style={styles.gridHeaderText}>{c}</Text>
          </View>
        ))}
      </View>

      {rows.map((r) => (
        <View key={r} style={styles.gridRow}>
          <View style={styles.gridCellTime}>
            <Text style={styles.gridTimeText}>{r}</Text>
          </View>
          {cols.map((c) => (
            <View 
              key={c} 
              style={[
                styles.gridCell,
                availability[r]?.[c] && styles.gridCellAvailable,
              ]} 
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function Details() {
  const params = useLocalSearchParams();
  const idRaw = params.id;
  const id = typeof idRaw === "string" ? idRaw : "";

  const item = useMemo(
    () => LISTINGS.find((x) => x.id === id) ?? LISTINGS[0],
    [id],
  );

  const [activeImage, setActiveImage] = useState(item.images[0]);

  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header (Back) */}
      {/* <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable>
      </View> */}

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Main image */}
        <Image
          source={{ uri: activeImage }}
          style={[
            styles.hero,
            { width: screenWidth, height: screenWidth * 0.62 },
          ]}
        />

        {/* Thumbnails */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbRow}
        >
          {item.images.map((uri) => {
            const selected = uri === activeImage;
            return (
              <Pressable
                key={uri}
                onPress={() => setActiveImage(uri)}
                style={[styles.thumbWrap, selected && styles.thumbSelected]}
              >
                <Image source={{ uri }} style={styles.thumb} />
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.content}>
          {/* Title + speaker */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <Pressable
              onPress={() => console.log("Text-to-speech later")}
              style={styles.speakerBtn}
              accessibilityRole="button"
              accessibilityLabel="Read aloud"
            >
              <Ionicons name="volume-medium-outline" size={20} color="#111" />
            </Pressable>
          </View>

          <Text style={styles.bodyText}>{item.details}</Text>

          <Text style={styles.swapText}>
            Looking to swap for:{" "}
            <Text style={{ fontWeight: "800" }}>Board games</Text>,{" "}
            <Text style={{ fontWeight: "800" }}>Card sets</Text>
          </Text>

          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>Condition:</Text> {item.condition}
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>Includes:</Text> Full set of chess
            pieces + storage box
          </Text>

          {/* Owner + rating */}
          <Pressable
            style={styles.ownerRow}
            onPress={() =>
              router.push({
                pathname: "/seller",
                params: { sellerId: "alex-1" },
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Open seller profile"
          >
            <Image
              source={{ uri: item.ownerAvatarUrl }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerName}>{item.ownerName}</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text style={styles.ratingText}>{item.rating.toFixed(2)}</Text>
                <Stars rating={item.rating} />
                <Text style={styles.reviewText}>
                  ({item.reviewCount} reviews)
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#666" />
          </Pressable>

          {/* Location */}
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapCard}>
            <MapView
              style={styles.locationMap}
              initialRegion={{
                latitude: -37.9152,
                longitude: 145.1300,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={true}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: -37.9152,
                  longitude: 145.1300,
                }}
                title="Clayton"
                description="Pickup location"
              />
            </MapView>
            <View style={styles.locationInfo}>
              <Ionicons name="location-sharp" size={16} color="#111" />
              <Text style={styles.locationText}>Clayton, VIC</Text>
            </View>
          </View>

          {/* Availability */}
          <Text style={styles.sectionTitle}>Availability</Text>
          <AvailabilityGrid />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <Pressable
          style={styles.messageBtn}
          onPress={() =>
            router.push({
              pathname: "/chat",
              params: {
                sellerName: item.ownerName,
                distance: `${item.distanceKm} km`,
                listingTitle: item.title,
                condition: item.condition,
              },
            })
          }
          accessibilityRole="button"
          accessibilityLabel="Send a message"
        >
          <Text style={styles.messageBtnText}>Send A Message</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  hero: { backgroundColor: "#f2f2f2" },

  thumbRow: { paddingHorizontal: 12, paddingTop: 10, gap: 10 },
  thumbWrap: {
    width: 78,
    height: 56,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
  },
  thumbSelected: {
    borderColor: "#111",
    borderWidth: 2,
  },
  thumb: { width: "100%", height: "100%" },

  content: { paddingHorizontal: 16, paddingTop: 14 },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  title: { fontSize: 18, fontWeight: "900", color: "#111", flex: 1 },
  speakerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  bodyText: { marginTop: 10, fontSize: 13.5, color: "#333", lineHeight: 18 },
  swapText: { marginTop: 10, fontSize: 13.5, color: "#111" },

  meta: { marginTop: 10, fontSize: 13, color: "#333" },
  metaLabel: { fontWeight: "800", color: "#111" },

  ownerRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#eee" },
  ownerName: { fontSize: 14, fontWeight: "800", color: "#111" },
  ratingText: { fontSize: 12.5, fontWeight: "800", color: "#111" },
  reviewText: { fontSize: 12, color: "#666" },

  sectionTitle: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "900",
    color: "#111",
  },

  mapCard: {
    marginTop: 10,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e6e6e6",
    backgroundColor: "#fff",
  },
  mapPlaceholder: {
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#f4f4f4",
  },
  locationMap: {
    width: "100%",
    height: 150,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  locationText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  grid: {
    marginTop: 10,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e6e6e6",
  },
  gridRow: { flexDirection: "row" },
  gridCellHeader: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#fafafa",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  gridHeaderText: { fontSize: 11, fontWeight: "800", color: "#111" },
  gridCellTime: {
    width: 52,
    paddingVertical: 10,
    backgroundColor: "#fafafa",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  gridTimeText: { fontSize: 11, color: "#111", fontWeight: "800" },
  gridCell: {
    flex: 1,
    height: 38,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  gridCellAvailable: {
    backgroundColor: "#C8E6C9",
  },

  bottomCta: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  messageBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  messageBtnText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});
