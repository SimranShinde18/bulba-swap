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
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60",
    rating: 4.93,
    reviewCount: 31,
    swappingSince: "2022",
    about:
      "Hey, I’m Alex Miller. I’ve been part of the swapping community since 2022 and have completed more than 30 swaps. I’ve always loved games that make you think—especially chess, puzzles, and strategy challenges. Outside of gaming, I enjoy weekend markets, coffee with friends, and finding creative ways to reuse and share things instead of buying new. I’m easy to reach, always on time, and believe good swaps come from clear communication and a bit of trust between people.",
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
        text: "Alex kept me updated from start to finish and even offered to meet halfway. Really trustworthy and respectful. 10/10 experience.",
      },
      {
        id: "r2",
        name: "Emily W.",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60",
        rating: 5,
        timeAgo: "2 months ago",
        text: "Quick replies and very polite. The chess board was exactly as described and in perfect condition. Would definitely swap again!",
      },
      {
        id: "r3",
        name: "Chris D.",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=60",
        rating: 5,
        timeAgo: "3 months ago",
        text: "Swap went perfectly. Alex is organized, punctual, and genuinely cares about fair trading. Highly recommend!",
      },
    ],
    activeListings: [
      {
        id: "l1",
        title: "Wooden Chess Board",
        condition: "Excellent – barely used",
        details:
          "Includes carved wooden pieces and magnetic board; portable design",
        imageUrl:
          "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=60",
      },
      {
        id: "l2",
        title: "Catan: Trade, Build, Settle",
        condition: "Like new – all pieces intact",
        details: "All pieces included, played twice only",
        imageUrl:
          "https://images.unsplash.com/photo-1612036781124-8472a73e94ea?auto=format&fit=crop&w=600&q=60",
      },
      {
        id: "l3",
        title: "Monopoly Deal (Card Game)",
        condition: "Used once",
        details: "Compact, fast-paced Monopoly version",
        imageUrl:
          "https://images.unsplash.com/photo-1615471618985-971989c08a0b?auto=format&fit=crop&w=600&q=60",
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
            <View key={c} style={styles.gridCell} />
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
              onPress={() => console.log("Show all reviews later")}
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
              onPress={() => console.log("Show all listings later")}
            >
              <Text style={styles.grayBtnText}>Show All Listings</Text>
            </Pressable>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapCard}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location-sharp" size={18} color="#111" />
              <Text style={{ color: "#111", fontWeight: "800" }}>Clayton</Text>
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
            console.log("Send message pressed");
            router.push("/chat");
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
