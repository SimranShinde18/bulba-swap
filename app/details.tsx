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

const LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Wooden Chess board",
    condition: "Excellent - barely used",
    details:
      "Beautifully crafted wooden chess board with polished finish and full set of sturdy pieces. Used only a few times and kept in great condition.",
    distanceKm: 1.2,
    rating: 4.93,
    reviewCount: 31,
    ownerName: "Alex Mille",
    ownerAvatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=60",
    images: [
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1542728928-1411f9c6f1b7?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=300&q=60",
    ],
  },
  // You can add more mock items later
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
  // Simple “visual” grid placeholder like your mock
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
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location-sharp" size={18} color="#111" />
              <Text style={{ color: "#111", fontWeight: "700" }}>Clayton</Text>
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
          onPress={() => console.log("Open chat later")}
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
