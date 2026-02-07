import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

type Review = {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  timeAgo: string;
  text: string;
};

type ListingMini = {
  id: string;
  title: string;
  condition: string;
  details: string;
  imageUrl: string;
};

type Seller = {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  swappingSince: string;
  about: string;
  lookingFor: string;
  speaks: string;
  livesIn: string;
  reviews: Review[];
  activeListings: ListingMini[];
};

const SELLERS: Seller[] = [
  {
    id: "alex-1",
    name: "Alex Miller",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=60",
    rating: 4.93,
    reviewCount: 31,
    swappingSince: "2022",
    about:
      "Hey, I'm Alex Miller. I've been part of the swapping community since 2022 and have completed more than 30 swaps. I love strategy games—especially chess, puzzles, and Catan. Outside of gaming, I enjoy weekend markets and coffee with friends.",
    lookingFor: "Board games, Card sets",
    speaks: "English",
    livesIn: "Melbourne, Australia",
    reviews: [
      {
        id: "r1",
        name: "Joshua",
        avatarUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=60",
        rating: 5,
        timeAgo: "1 month ago",
        text: "Alex kept me updated from start to finish and even offered to meet halfway. Really trustworthy. 10/10 experience.",
      },
      {
        id: "r2",
        name: "Emily W.",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60",
        rating: 5,
        timeAgo: "2 months ago",
        text: "Quick replies and very polite. The chess board was exactly as described. Would definitely swap again!",
      },
      {
        id: "r3",
        name: "Chris D.",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=60",
        rating: 5,
        timeAgo: "3 months ago",
        text: "Alex is organized, punctual, and genuinely cares about fair trading. Highly recommend!",
      },
    ],
    activeListings: [
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
    ],
  },
  {
    id: "sarah-1",
    name: "Sarah Chen",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=60",
    rating: 4.87,
    reviewCount: 24,
    swappingSince: "2021",
    about:
      "Hi! I'm Sarah. I love card games and puzzles—anything that brings people together for a fun evening. I take great care of my games and expect the same from swap partners.",
    lookingFor: "Card games, Puzzles, Word games",
    speaks: "English, Mandarin",
    livesIn: "Sydney, Australia",
    reviews: [
      {
        id: "r1",
        name: "Michael",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=60",
        rating: 5,
        timeAgo: "2 weeks ago",
        text: "Sarah was super friendly and the UNO cards were in perfect condition!",
      },
      {
        id: "r2",
        name: "Amanda",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=60",
        rating: 5,
        timeAgo: "1 month ago",
        text: "Great communication and the puzzle had all pieces. Very happy!",
      },
    ],
    activeListings: [
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
  },
  {
    id: "mike-1",
    name: "Mike Johnson",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=60",
    rating: 4.78,
    reviewCount: 19,
    swappingSince: "2023",
    about:
      "G'day! I'm Mike. Big fan of classic board games like Monopoly and Scrabble. Always looking to trade for new games to play with the family on weekends.",
    lookingFor: "Family games, Strategy games",
    speaks: "English",
    livesIn: "Brisbane, Australia",
    reviews: [
      {
        id: "r1",
        name: "Tom",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=60",
        rating: 5,
        timeAgo: "3 weeks ago",
        text: "Mike is a legend! Monopoly was complete and in great shape.",
      },
    ],
    activeListings: [
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
    ],
  },
  {
    id: "emma-1",
    name: "Emma Wilson",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=60",
    rating: 4.65,
    reviewCount: 15,
    swappingSince: "2023",
    about:
      "Hey there! I'm Emma. I collect puzzles and brain teasers. Love finding unique games that challenge the mind. Open to fair trades!",
    lookingFor: "Puzzles, Brain teasers, Logic games",
    speaks: "English",
    livesIn: "Perth, Australia",
    reviews: [
      {
        id: "r1",
        name: "David",
        avatarUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=60",
        rating: 4,
        timeAgo: "1 month ago",
        text: "Good swap, puzzle was as described. Emma was easy to work with.",
      },
    ],
    activeListings: [
      {
        id: "l1",
        title: "3D Wooden Puzzle",
        condition: "Like new",
        details: "Challenging mechanical puzzle, great brain teaser",
        imageUrl: "https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?auto=format&fit=crop&w=600&q=60",
      },
      {
        id: "l2",
        title: "Chess Board Travel Set",
        condition: "Good",
        details: "Compact travel chess with magnetic pieces",
        imageUrl: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&w=600&q=60",
      },
      {
        id: "l3",
        title: "Jigsaw Puzzle 500pc",
        condition: "Excellent",
        details: "Nature scene puzzle, all pieces complete",
        imageUrl: "https://images.unsplash.com/photo-1494059980473-813e73ee784b?auto=format&fit=crop&w=600&q=60",
      },
    ],
  },
  {
    id: "james-1",
    name: "James Taylor",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=60",
    rating: 4.92,
    reviewCount: 28,
    swappingSince: "2021",
    about:
      "I'm James, a board game enthusiast. Particularly love Catan and strategy games. I have a growing collection and always keen to swap duplicates for new experiences.",
    lookingFor: "Strategy games, Expansion packs",
    speaks: "English",
    livesIn: "Adelaide, Australia",
    reviews: [
      {
        id: "r1",
        name: "Rachel",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60",
        rating: 5,
        timeAgo: "2 weeks ago",
        text: "James is fantastic! The Catan expansion was perfect. Highly recommend!",
      },
      {
        id: "r2",
        name: "Ben",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=60",
        rating: 5,
        timeAgo: "1 month ago",
        text: "Super smooth swap, great communication throughout.",
      },
    ],
    activeListings: [
      {
        id: "l1",
        title: "Catan Expansion Pack",
        condition: "Excellent",
        details: "Cities & Knights expansion, adds depth to base game",
        imageUrl: "https://images.unsplash.com/photo-1566694271355-c9a556a5c6e0?auto=format&fit=crop&w=600&q=60",
      },
      {
        id: "l2",
        title: "Monopoly Deluxe Edition",
        condition: "Like new",
        details: "Special edition with wooden hotels and metal tokens",
        imageUrl: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=600&q=60",
      },
      {
        id: "l3",
        title: "Scrabble Travel",
        condition: "New",
        details: "Compact travel size, magnetic tiles stay in place",
        imageUrl: "https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&w=600&q=60",
      },
    ],
  },
  {
    id: "lisa-1",
    name: "Lisa Park",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60",
    rating: 4.45,
    reviewCount: 12,
    swappingSince: "2024",
    about:
      "Hi, I'm Lisa! New to the swapping community but excited to trade. I have some games my kids have outgrown and looking for new ones to enjoy together.",
    lookingFor: "Family games, Kids games",
    speaks: "English, Korean",
    livesIn: "Melbourne, Australia",
    reviews: [
      {
        id: "r1",
        name: "Karen",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=60",
        rating: 4,
        timeAgo: "3 weeks ago",
        text: "Nice swap with Lisa. Monopoly was in good condition as described.",
      },
    ],
    activeListings: [
      {
        id: "l1",
        title: "UNO Flip",
        condition: "Excellent",
        details: "Double-sided cards for extra fun, complete set",
        imageUrl: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=600&q=60",
      },
      {
        id: "l2",
        title: "Monopoly Junior",
        condition: "Good",
        details: "Kid-friendly version, all pieces included",
        imageUrl: "https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=600&q=60",
      },
      {
        id: "l3",
        title: "Puzzle Set for Kids",
        condition: "Like new",
        details: "3 colorful puzzles (24, 48, 100 pieces)",
        imageUrl: "https://images.unsplash.com/photo-1494059980473-813e73ee784b?auto=format&fit=crop&w=600&q=60",
      },
    ],
  },
];

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

export default function Seller() {
  const params = useLocalSearchParams();
  const sellerIdRaw = params.sellerId;
  const sellerId = typeof sellerIdRaw === "string" ? sellerIdRaw : "alex-1";

  const seller = useMemo(
    () => SELLERS.find((s) => s.id === sellerId) ?? SELLERS[0],
    [sellerId],
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Back */}
      {/* <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable>
      </View> */}

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: seller.avatarUrl }} style={styles.bigAvatar} />
          <Text style={styles.name}>{seller.name}</Text>

          <View style={styles.ratingLine}>
            <Text style={styles.ratingNumber}>{seller.rating.toFixed(2)}</Text>
            <Stars rating={seller.rating} />
            <Text style={styles.reviewCount}>
              ({seller.reviewCount} Reviews)
            </Text>
          </View>

          <Text style={styles.since}>
            Swapping since {seller.swappingSince}
          </Text>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Swapper</Text>
          <View style={styles.card}>
            <Text style={styles.aboutText}>{seller.about}</Text>

            <View style={styles.aboutMeta}>
              <View style={styles.metaRow}>
                <Ionicons
                  name="swap-horizontal-outline"
                  size={18}
                  color="#111"
                />
                <Text style={styles.metaText}>
                  <Text style={styles.metaBold}>Looking to swap for:</Text>{" "}
                  {seller.lookingFor}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color="#111"
                />
                <Text style={styles.metaText}>
                  <Text style={styles.metaBold}>Speaks:</Text> {seller.speaks}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={18} color="#111" />
                <Text style={styles.metaText}>
                  <Text style={styles.metaBold}>Lives in:</Text>{" "}
                  {seller.livesIn}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.card}>
            {seller.reviews.slice(0, 3).map((r) => (
              <View key={r.id} style={styles.reviewRow}>
                <Image
                  source={{ uri: r.avatarUrl }}
                  style={styles.reviewAvatar}
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.reviewTop}>
                    <Text style={styles.reviewName}>{r.name}</Text>
                    <Text style={styles.reviewTime}>{r.timeAgo}</Text>
                  </View>
                  <Stars rating={r.rating} />
                  <Text style={styles.reviewText}>{r.text}</Text>
                </View>

                <Pressable onPress={() => console.log("TTS review later")}>
                  <Ionicons
                    name="volume-medium-outline"
                    size={18}
                    color="#111"
                  />
                </Pressable>
              </View>
            ))}

            <Pressable
              style={styles.grayBtn}
              onPress={() =>
                router.push({
                  pathname: "/reviews",
                  params: {
                    sellerId: seller.id,
                    sellerName: seller.name,
                  },
                })
              }
            >
              <Text style={styles.grayBtnText}>Show All Reviews</Text>
            </Pressable>
          </View>
        </View>

        {/* Active listings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Listings</Text>
          <View style={styles.card}>
            {seller.activeListings.map((l) => (
              <View key={l.id} style={styles.listingRow}>
                <Image source={{ uri: l.imageUrl }} style={styles.listingImg} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.listingTitle}>{l.title}</Text>
                  <Text style={styles.listingMeta}>
                    <Text style={styles.metaBold}>Condition:</Text>{" "}
                    {l.condition}
                  </Text>
                  <Text style={styles.listingMeta} numberOfLines={2}>
                    <Text style={styles.metaBold}>Details:</Text> {l.details}
                  </Text>
                </View>

                <View style={styles.listingIcons}>
                  <Pressable onPress={() => console.log("Share")}>
                    <Ionicons
                      name="share-social-outline"
                      size={18}
                      color="#111"
                    />
                  </Pressable>
                  <Pressable onPress={() => console.log("Like")}>
                    <Ionicons name="heart-outline" size={20} color="#111" />
                  </Pressable>
                </View>
              </View>
            ))}

            <Pressable
              style={styles.grayBtn}
              onPress={() =>
                router.push({
                  pathname: "/sellerListings",
                  params: {
                    sellerId: seller.id,
                    sellerName: seller.name,
                  },
                })
              }
            >
              <Text style={styles.grayBtnText}>Show All Listings</Text>
            </Pressable>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
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
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <AvailabilityGrid />
        </View>

        {/* Report / Block (like your screenshot) */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Pressable
            style={styles.linkRow}
            onPress={() => console.log("Report")}
          >
            <Ionicons name="flag-outline" size={18} color="#111" />
            <Text style={styles.linkText}>
              Report {seller.name.split(" ")[0]}
            </Text>
          </Pressable>

          <Pressable
            style={styles.linkRow}
            onPress={() => console.log("Block")}
          >
            <Ionicons name="ban-outline" size={18} color="#111" />
            <Text style={styles.linkText}>
              Block {seller.name.split(" ")[0]}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        {/* <Pressable
          style={styles.messageBtn}
          onPress={() =>
            router.push({
              pathname: "/chat",
              params: {
                sellerName: seller.name,
                distance: "1.2 km",
                listingTitle: "Chess Board",
                condition: "Excellent",
              },
            })
          }
        >
          <Text style={styles.messageBtnText}>Send A Message</Text>
        </Pressable> */}
        <Pressable
          style={styles.messageBtn}
          onPress={() => {
            router.push({
              pathname: "/chat",
              params: {
                sellerName: seller.name,
                distance: "1.2 km",
                listingTitle: seller.activeListings[0]?.title || "Item",
                condition: seller.activeListings[0]?.condition || "Good",
              },
            });
          }}
        >
          <Text style={styles.messageBtnText}>Send A Message</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  topBar: { height: 44, justifyContent: "center", paddingHorizontal: 12 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  profileHeader: {
    paddingTop: 10,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  bigAvatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#eee",
  },
  name: { marginTop: 10, fontSize: 18, fontWeight: "900", color: "#111" },

  ratingLine: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingNumber: { fontSize: 13, fontWeight: "800", color: "#111" },
  reviewCount: { fontSize: 12, color: "#666" },
  since: { marginTop: 6, fontSize: 12, color: "#666" },

  section: { paddingHorizontal: 16, paddingTop: 18 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111",
    marginBottom: 10,
  },

  card: {
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e6e6e6",
    padding: 12,
  },

  aboutText: { fontSize: 13.5, lineHeight: 18, color: "#333" },
  aboutMeta: { marginTop: 12, gap: 10 },
  metaRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  metaText: { flex: 1, fontSize: 13, color: "#333" },
  metaBold: { fontWeight: "900", color: "#111" },

  reviewRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#eee",
  },
  reviewTop: { flexDirection: "row", justifyContent: "space-between" },
  reviewName: { fontSize: 13, fontWeight: "900", color: "#111" },
  reviewTime: { fontSize: 11.5, color: "#666" },
  reviewText: { marginTop: 6, fontSize: 12.8, color: "#333", lineHeight: 17 },

  grayBtn: {
    marginTop: 12,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  grayBtnText: { fontSize: 13, fontWeight: "800", color: "#111" },

  listingRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  listingImg: {
    width: 82,
    height: 58,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  listingTitle: { fontSize: 13.5, fontWeight: "900", color: "#111" },
  listingMeta: { marginTop: 4, fontSize: 12.5, color: "#333" },
  listingIcons: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 6,
  },

  mapCard: {
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
  gridHeaderText: { fontSize: 11, fontWeight: "900", color: "#111" },
  gridCellTime: {
    width: 52,
    paddingVertical: 10,
    backgroundColor: "#fafafa",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  gridTimeText: { fontSize: 11, color: "#111", fontWeight: "900" },
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

  linkRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  linkText: { fontSize: 13.5, color: "#111", fontWeight: "700" },

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
  messageBtnText: { color: "#fff", fontSize: 14, fontWeight: "900" },
});
