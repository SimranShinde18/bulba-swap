// app/createListing.tsx
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlaceSuggestion, useGooglePlaces } from "../hooks/useGooglePlaces";

/**
 * If you haven't installed the picker yet:
 *   npx expo install expo-image-picker
 */

type PickedImage = {
  uri: string;
  mimeType?: string;
  fileName?: string;
};

type SelectedLocation = {
  placeId: string;
  title: string;
  subtitle?: string;
  lat?: number;
  lng?: number;
};

type ListingMode = "swap" | "donate";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const TIMES = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"] as const;

// Tags for what user is looking to swap for
const SWAP_TAGS = [
  "Chess", "UNO", "Monopoly", "Catan", "Scrabble", 
  "Puzzle", "Card Games", "Strategy", "Family Games", "Party Games",
  "Kids Games", "Classic Games", "Other"
] as const;

// Helper to generate a key for each cell
const cellKey = (day: string, time: string) => `${day}__${time}`;

export default function CreateListing() {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const locationSectionY = React.useRef<number>(0);
  
  const [listingMode, setListingMode] = useState<ListingMode | null>(null);
  const [selectedSwapTags, setSelectedSwapTags] = useState<Set<string>>(new Set());
  const [pickupNotes, setPickupNotes] = useState("");
  
  const [images, setImages] = useState<PickedImage[]>([]);
  const [itemName, setItemName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");

  // availability selected cells
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  // location - using Google Places
  const {
    suggestions: locationSuggestions,
    isLoading: isLoadingPlaces,
    error: placesError,
    searchPlaces,
    clearSuggestions,
  } = useGooglePlaces();

  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // required-field error state
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const itemNameTrim = itemName.trim();
  const shortDescTrim = shortDesc.trim();
  const longDescTrim = longDesc.trim(); // optional, we still keep length guard
  const locationQueryTrim = locationQuery.trim();

  const itemNameError =
    submittedOnce && (itemNameTrim.length < 2 || itemNameTrim.length > 200)
      ? "Item name must be 2–200 characters."
      : "";

  const shortDescError =
    submittedOnce && (shortDescTrim.length < 2 || shortDescTrim.length > 2000)
      ? "Short description must be 2–2000 characters."
      : "";

  // ✅ long description optional: only validate if user typed something
  const longDescError =
    submittedOnce && longDescTrim.length > 0 && longDescTrim.length > 20000
      ? "Long description must be at most 20,000 characters."
      : "";

  const imagesError =
    submittedOnce && images.length === 0
      ? "Please add at least one image."
      : "";

  const availabilityError =
    submittedOnce && selectedSlots.size === 0
      ? "Please select at least one availability slot."
      : "";

  const locationError =
    submittedOnce && !selectedLocation
      ? "Please select a location from suggestions."
      : "";

  const canSubmit = useMemo(() => {
    return (
      images.length > 0 &&
      itemNameTrim.length >= 2 &&
      itemNameTrim.length <= 200 &&
      shortDescTrim.length >= 2 &&
      shortDescTrim.length <= 2000 &&
      // ✅ long desc optional: only enforce max if provided
      (longDescTrim.length === 0 || longDescTrim.length <= 20000) &&
      selectedSlots.size > 0 &&
      !!selectedLocation
    );
  }, [
    images.length,
    itemNameTrim,
    shortDescTrim,
    longDescTrim,
    selectedSlots.size,
    selectedLocation,
  ]);

  const isAllowedImage = (img: PickedImage) => {
    const mime = (img.mimeType || "").toLowerCase();
    const name = (img.fileName || "").toLowerCase();
    const uri = (img.uri || "").toLowerCase();

    const byMime =
      mime === "image/png" || mime === "image/jpg" || mime === "image/jpeg";
    const byExt =
      name.endsWith(".png") ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg") ||
      uri.endsWith(".png") ||
      uri.endsWith(".jpg") ||
      uri.endsWith(".jpeg");

    return byMime || byExt;
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow photo access to add images.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.9,
      selectionLimit: 5,
    });

    if (result.canceled) return;

    const picked: PickedImage[] = (result.assets || []).map((a) => ({
      uri: a.uri,
      mimeType: (a as any).mimeType,
      fileName: (a as any).fileName,
    }));

    const allowed = picked.filter(isAllowedImage);
    const blockedCount = picked.length - allowed.length;

    if (blockedCount > 0) {
      Alert.alert(
        "Unsupported file",
        "Only .png, .jpg, .jpeg files are allowed.",
      );
    }

    if (allowed.length === 0) return;

    setImages((prev) => {
      const map = new Map<string, PickedImage>();
      [...prev, ...allowed].forEach((p) => map.set(p.uri, p));
      return Array.from(map.values()).slice(0, 5);
    });
  };

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((img) => img.uri !== uri));
  };

  const toggleSlot = (
    day: (typeof DAYS)[number],
    time: (typeof TIMES)[number],
  ) => {
    const key = cellKey(day, time);
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectLocation = (s: PlaceSuggestion) => {
    setSelectedLocation({
      placeId: s.placeId,
      title: s.mainText,
      subtitle: s.secondaryText,
      lat: s.lat,
      lng: s.lng,
    });
    setLocationQuery(`${s.mainText}${s.secondaryText ? `, ${s.secondaryText}` : ""}`);
    setShowLocationDropdown(false);
    clearSuggestions();
    Keyboard.dismiss();
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setLocationQuery("");
    setShowLocationDropdown(false);
    clearSuggestions();
  };

  const submit = () => {
    setSubmittedOnce(true);

    if (!canSubmit) {
      Alert.alert(
        "Please fix the errors",
        "Fill required fields, select availability, and pick a location from suggestions.",
      );
      return;
    }

    // for now: mock success
    Alert.alert("Listing created!", "Your listing has been saved (mock).", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          <Text style={styles.requiredNote}>Fields marked * are required</Text>

          {/* LISTING MODE SELECTION */}
          <View style={styles.section}>
            <Text style={styles.label}>
              What do you want to do? <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.modeOptions}>
              <Pressable
                style={[
                  styles.modeCard,
                  listingMode === "swap" && styles.modeCardActive,
                ]}
                onPress={() => setListingMode("swap")}
              >
                <Ionicons
                  name="swap-horizontal"
                  size={32}
                  color={listingMode === "swap" ? "#4CAF50" : "#888"}
                />
                <Text
                  style={[
                    styles.modeTitle,
                    listingMode === "swap" && styles.modeTitleActive,
                  ]}
                >
                  Swap
                </Text>
                <Text style={styles.modeSub}>Exchange for another game</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modeCard,
                  listingMode === "donate" && styles.modeCardActive,
                ]}
                onPress={() => setListingMode("donate")}
              >
                <Ionicons
                  name="gift"
                  size={32}
                  color={listingMode === "donate" ? "#4CAF50" : "#888"}
                />
                <Text
                  style={[
                    styles.modeTitle,
                    listingMode === "donate" && styles.modeTitleActive,
                  ]}
                >
                  Donate
                </Text>
                <Text style={styles.modeSub}>Give away for free</Text>
              </Pressable>
            </View>
            {submittedOnce && !listingMode && (
              <Text style={styles.errorText}>Please select Swap or Donate</Text>
            )}
          </View>

          {/* SWAP TAGS (only if swap mode) */}
          {listingMode === "swap" && (
            <View style={styles.section}>
              <Text style={styles.label}>Looking to swap for:</Text>
              <Text style={styles.helperTop}>Select what games you'd accept</Text>
              <View style={styles.tagGrid}>
                {SWAP_TAGS.map((tag) => (
                  <Pressable
                    key={tag}
                    style={[
                      styles.tagChip,
                      selectedSwapTags.has(tag) && styles.tagChipActive,
                    ]}
                    onPress={() =>
                      setSelectedSwapTags((prev) => {
                        const next = new Set(prev);
                        if (next.has(tag)) {
                          next.delete(tag);
                        } else {
                          next.add(tag);
                        }
                        return next;
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.tagText,
                        selectedSwapTags.has(tag) && styles.tagTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* PICKUP NOTES (only if donate mode) */}
          {listingMode === "donate" && (
            <View style={styles.section}>
              <Text style={styles.label}>Pickup Details:</Text>
              <Text style={styles.helperTop}>How should recipients collect?</Text>
              <TextInput
                style={[styles.input, styles.textAreaSm]}
                placeholder="e.g., Front porch pickup, weekends only..."
                value={pickupNotes}
                onChangeText={setPickupNotes}
                multiline
              />
            </View>
          )}

          {/* IMAGE PICKER */}
          <View style={styles.section}>
            <View style={styles.imageCard}>
              {images.length === 0 ? (
                <Pressable style={styles.imagePickerEmpty} onPress={pickImages}>
                  <Ionicons name="add" size={44} color="#111" />
                  <Text style={styles.imagePickerTitle}>
                    Click to add pictures
                  </Text>
                  <Text style={styles.imagePickerSub}>(.png, .jpg, .jpeg)</Text>
                </Pressable>
              ) : (
                <>
                  <View style={styles.imageGrid}>
                    {images.map((img) => (
                      <View key={img.uri} style={styles.thumbWrap}>
                        <Image source={{ uri: img.uri }} style={styles.thumb} />
                        <Pressable
                          style={styles.thumbRemove}
                          onPress={() => removeImage(img.uri)}
                          accessibilityLabel="Remove image"
                        >
                          <Ionicons name="close" size={16} color="#111" />
                        </Pressable>
                      </View>
                    ))}

                    {images.length < 5 && (
                      <Pressable style={styles.thumbAdd} onPress={pickImages}>
                        <Ionicons name="add" size={26} color="#111" />
                        <Text style={styles.thumbAddText}>Add</Text>
                      </Pressable>
                    )}
                  </View>

                  <Text style={styles.helper}>You can add up to 5 images.</Text>
                </>
              )}
            </View>

            {!!imagesError && (
              <Text style={styles.errorText}>{imagesError}</Text>
            )}
          </View>

          {/* ITEM NAME */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Item Name: <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.helperTop}>(2–200 characters)</Text>

            <TextInput
              style={[styles.input, !!itemNameError && styles.inputError]}
              placeholder="eg. Wooden Chessboard"
              value={itemName}
              onChangeText={(t) => {
                if (t.length <= 200) setItemName(t);
              }}
              maxLength={200}
              returnKeyType="next"
            />
            <Text style={styles.helper}>{itemNameTrim.length}/200</Text>
            {!!itemNameError && (
              <Text style={styles.errorText}>{itemNameError}</Text>
            )}
          </View>

          {/* SHORT DESCRIPTION */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Short Description: <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.helperTop}>(max 2,000 characters)</Text>

            <TextInput
              style={[
                styles.input,
                styles.textAreaSm,
                !!shortDescError && styles.inputError,
              ]}
              placeholder="Give a brief summary..."
              value={shortDesc}
              onChangeText={(t) => {
                if (t.length <= 2000) setShortDesc(t);
              }}
              maxLength={2000}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.helper}>{shortDescTrim.length}/2000</Text>
            {!!shortDescError && (
              <Text style={styles.errorText}>{shortDescError}</Text>
            )}
          </View>

          {/* LONG DESCRIPTION (OPTIONAL) */}
          <View style={styles.section}>
            <Text style={styles.label}>Long Description:</Text>
            <Text style={styles.helperTop}>
              (optional, max 20,000 characters)
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.textAreaLg,
                !!longDescError && styles.inputError,
              ]}
              placeholder="Add more details (condition, what’s included, swap preferences, etc.)"
              value={longDesc}
              onChangeText={(t) => {
                if (t.length <= 20000) setLongDesc(t);
              }}
              maxLength={20000}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.helper}>{longDescTrim.length}/20000</Text>
            {!!longDescError && (
              <Text style={styles.errorText}>{longDescError}</Text>
            )}
          </View>

          {/* AVAILABILITY (SELECTABLE GRID) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Availability <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.grid}>
              {/* header row */}
              <View style={styles.gridRow}>
                <View style={styles.gridCellHeaderTime} />
                {DAYS.map((d) => (
                  <View key={d} style={styles.gridCellHeader}>
                    <Text style={styles.gridHeaderText}>{d}</Text>
                  </View>
                ))}
              </View>

              {/* rows */}
              {TIMES.map((t) => (
                <View key={t} style={styles.gridRow}>
                  <View style={styles.gridCellTime}>
                    <Text style={styles.gridTimeText}>{t}</Text>
                  </View>

                  {DAYS.map((d) => {
                    const key = cellKey(d, t);
                    const selected = selectedSlots.has(key);

                    return (
                      <Pressable
                        key={key}
                        onPress={() => toggleSlot(d, t)}
                        style={[
                          styles.gridCell,
                          selected && styles.gridCellSelected,
                        ]}
                        accessibilityLabel={`${d} ${t} ${selected ? "selected" : "not selected"}`}
                      >
                        {selected ? (
                          <Ionicons name="checkmark" size={14} color="#111" />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            <Text style={styles.helper}>
              Tap to select time slots. Selected: {selectedSlots.size}
            </Text>
            {!!availabilityError && (
              <Text style={styles.errorText}>{availabilityError}</Text>
            )}
          </View>

          {/* LOCATION (INPUT + SUGGESTIONS) */}
          <View 
            style={styles.section}
            onLayout={(e) => {
              locationSectionY.current = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.sectionTitle}>
              Location <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.locationInputWrap}>
              <Ionicons name="location-outline" size={18} color="#666" />

              <TextInput
                style={styles.locationInput}
                placeholder="Start typing your address..."
                placeholderTextColor="#777"
                value={locationQuery}
                onChangeText={(t) => {
                  setLocationQuery(t);
                  setSelectedLocation(null);
                  setShowLocationDropdown(true);
                  searchPlaces(t); // Call Google Places API
                }}
                onFocus={() => {
                  setShowLocationDropdown(true);
                  // Scroll to show location field above keyboard
                  setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                      y: Math.max(locationSectionY.current - 24, 0),
                      animated: true,
                    });
                  }, 120);
                }}
                autoCorrect={false}
                autoCapitalize="none"
              />

              {locationQueryTrim.length > 0 ? (
                <Pressable
                  onPress={clearLocation}
                  style={styles.locationClearBtn}
                  accessibilityLabel="Clear location"
                >
                  <Ionicons name="close-circle" size={18} color="#666" />
                </Pressable>
              ) : null}
            </View>

            {showLocationDropdown && locationQueryTrim.length > 0 && (
              <View style={styles.dropdown}>
                {isLoadingPlaces ? (
                  <View style={styles.hintRow}>
                    <ActivityIndicator size="small" color="#666" />
                    <Text style={[styles.hintText, { marginLeft: 8 }]}>Searching...</Text>
                  </View>
                ) : placesError ? (
                  <View style={styles.hintRow}>
                    <Text style={styles.hintText}>{placesError}</Text>
                  </View>
                ) : locationSuggestions.length === 0 ? (
                  <View style={styles.hintRow}>
                    <Text style={styles.hintText}>No places found.</Text>
                  </View>
                ) : (
                  locationSuggestions.map((s) => (
                    <Pressable
                      key={s.placeId}
                      style={styles.suggestionRow}
                      onPress={() => selectLocation(s)}
                    >
                      {/* Distance column */}
                      <View style={styles.distanceCol}>
                        <Ionicons name="location" size={16} color="#666" />
                        {s.distanceText && (
                          <Text style={styles.distanceText}>{s.distanceText}</Text>
                        )}
                      </View>
                      {/* Address column */}
                      <View style={styles.addressCol}>
                        <Text style={styles.suggestionText}>{s.mainText}</Text>
                        {!!s.secondaryText && (
                          <Text style={styles.suggestionSub}>{s.secondaryText}</Text>
                        )}
                      </View>
                      {/* Arrow */}
                      <Ionicons name="arrow-forward" size={16} color="#999" />
                    </Pressable>
                  ))
                )}
              </View>
            )}

            {!!locationError && (
              <Text style={styles.errorText}>{locationError}</Text>
            )}

            {/* Real Map with Pin AFTER selection */}
            {selectedLocation && selectedLocation.lat && selectedLocation.lng && (
              <View style={styles.locationCard}>
                <MapView
                  style={styles.locationMap}
                  initialRegion={{
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  region={{
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng,
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
                      latitude: selectedLocation.lat,
                      longitude: selectedLocation.lng,
                    }}
                    title={selectedLocation.title}
                    description={selectedLocation.subtitle}
                  />
                </MapView>
                <View style={styles.locationInfo}>
                  <Ionicons name="location-sharp" size={16} color="#111" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {selectedLocation.title}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={{ height: 18 }} />
        </ScrollView>

        {/* CTA */}
        <View style={styles.bottomCta}>
          <Pressable
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={submit}
          >
            <Text style={styles.submitText}>Create Listing</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 110,
  },

  requiredNote: {
    fontSize: 12.5,
    color: "#666",
    marginBottom: 12,
  },

  section: { marginBottom: 18 },

  /* Image area */
  imageCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  imagePickerEmpty: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  imagePickerTitle: { fontSize: 13.5, fontWeight: "800", color: "#111" },
  imagePickerSub: { fontSize: 12.5, color: "#666" },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    padding: 12,
  },
  thumbWrap: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f2f2f2",
  },
  thumb: { width: "100%", height: "100%" },
  thumbRemove: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
  },
  thumbAdd: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  thumbAddText: { fontSize: 12, color: "#111", fontWeight: "800" },

  /* Inputs */
  label: { fontSize: 13.5, fontWeight: "900", color: "#111" },
  required: { color: "#c81e1e" },

  helperTop: { marginTop: 4, fontSize: 12, color: "#666" },
  helper: { marginTop: 6, fontSize: 12, color: "#666" },

  input: {
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#d8d8d8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111",
    backgroundColor: "#fff",
  },

  textAreaSm: { minHeight: 90, textAlignVertical: "top" },
  textAreaLg: { minHeight: 160, textAlignVertical: "top" },

  inputError: { borderColor: "#c81e1e" },
  errorText: {
    marginTop: 6,
    color: "#c81e1e",
    fontSize: 12.5,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 13.5,
    fontWeight: "900",
    color: "#111",
    marginBottom: 10,
  },

  /* Availability grid */
  grid: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e6e6e6",
  },
  gridRow: { flexDirection: "row" },
  gridCellHeaderTime: {
    width: 54,
    paddingVertical: 10,
    backgroundColor: "#fafafa",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#eee",
  },
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
    width: 54,
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
    alignItems: "center",
    justifyContent: "center",
  },
  gridCellSelected: {
    backgroundColor: "#EDEDED",
  },

  /* Location input + dropdown */
  locationInputWrap: {
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#d8d8d8",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
  },
  locationInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },
  locationClearBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  dropdown: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E6E6",
    overflow: "hidden",
    zIndex: 50,
    elevation: 50,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },
  distanceCol: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  distanceText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
  },
  addressCol: {
    flex: 1,
  },
  suggestionText: { fontSize: 14, color: "#111", fontWeight: "800" },
  suggestionSub: { marginTop: 2, fontSize: 12, color: "#666" },
  hintRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 12 },
  hintText: { fontSize: 14, color: "#666" },

  /* Location map */
  locationCard: {
    marginTop: 12,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e6e6e6",
    backgroundColor: "#fff",
  },
  locationMap: {
    height: 160,
    width: "100%",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  locationText: { color: "#111", fontWeight: "600", flex: 1 },
  locationSubText: { color: "#666", fontSize: 12.5 },

  /* Mode selection */
  modeOptions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  modeCard: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#f8f8f8",
    borderWidth: 2,
    borderColor: "#e6e6e6",
    alignItems: "center",
    gap: 8,
  },
  modeCardActive: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#666",
  },
  modeTitleActive: {
    color: "#111",
  },
  modeSub: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },

  /* Swap tags */
  tagGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tagChipActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  tagTextActive: {
    color: "#fff",
  },

  /* Bottom CTA */
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
  submitBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitText: { color: "#fff", fontSize: 14, fontWeight: "900" },
});
