// hooks/useGooglePlaces.ts
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useCallback, useRef, useState } from "react";

export type PlaceSuggestion = {
    placeId: string;
    mainText: string;
    secondaryText: string;
    distanceMeters?: number;
    distanceText?: string;
    lat?: number;
    lng?: number;
};

// Get API key from app.json extra config
const API_KEY =
    (Constants.expoConfig?.extra?.googlePlacesApiKey as string) ||
    "YOUR_API_KEY_HERE";

function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
}

function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    // Haversine formula
    const R = 6371000; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function useGooglePlaces() {
    const [userLocation, setUserLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasRequestedLocation = useRef(false);

    // Request location permission lazily (only when needed)
    const requestLocationIfNeeded = useCallback(async () => {
        if (hasRequestedLocation.current || userLocation) return;
        hasRequestedLocation.current = true;

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Location permission denied");
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setUserLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            });
        } catch (err) {
            console.log("Could not get location:", err);
        }
    }, [userLocation]);

    const searchPlaces = useCallback(
        async (query: string) => {
            if (!query.trim()) {
                setSuggestions([]);
                return;
            }

            // Request location permission when user first types
            requestLocationIfNeeded();

            // Debounce
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(async () => {
                setIsLoading(true);
                setError(null);

                try {
                    // Use the NEW Places API endpoint
                    const url = "https://places.googleapis.com/v1/places:autocomplete";

                    // Build request body for new API
                    const requestBody: any = {
                        input: query,
                        includedRegionCodes: ["AU"], // Australia only
                    };

                    // Add location bias if we have user location
                    if (userLocation) {
                        requestBody.locationBias = {
                            circle: {
                                center: {
                                    latitude: userLocation.lat,
                                    longitude: userLocation.lng,
                                },
                                radius: 50000.0, // 50km radius
                            },
                        };
                    }

                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Goog-Api-Key": API_KEY,
                        },
                        body: JSON.stringify(requestBody),
                    });

                    const data = await response.json();

                    console.log("Places API (New) response:", JSON.stringify(data, null, 2));

                    if (data.error) {
                        console.error("Places API error:", data.error.message);
                        setError(data.error.message);
                        setSuggestions([]);
                        return;
                    }

                    if (data.suggestions && data.suggestions.length > 0) {
                        // Process suggestions from new API format
                        const suggestionsWithDetails: PlaceSuggestion[] = await Promise.all(
                            data.suggestions.slice(0, 6).map(async (item: any) => {
                                const prediction = item.placePrediction;
                                if (!prediction) return null;

                                const suggestion: PlaceSuggestion = {
                                    placeId: prediction.placeId,
                                    mainText: prediction.structuredFormat?.mainText?.text || prediction.text?.text || "",
                                    secondaryText: prediction.structuredFormat?.secondaryText?.text || "",
                                };

                                // Get place details for coordinates using new API
                                try {
                                    const detailsUrl = `https://places.googleapis.com/v1/places/${prediction.placeId}?fields=location`;
                                    const detailsResponse = await fetch(detailsUrl, {
                                        headers: {
                                            "X-Goog-Api-Key": API_KEY,
                                        },
                                    });
                                    const detailsData = await detailsResponse.json();

                                    if (detailsData.location) {
                                        const { latitude: lat, longitude: lng } = detailsData.location;
                                        suggestion.lat = lat;
                                        suggestion.lng = lng;

                                        // Calculate distance if we have user location
                                        if (userLocation) {
                                            const distance = calculateDistance(
                                                userLocation.lat,
                                                userLocation.lng,
                                                lat,
                                                lng
                                            );
                                            suggestion.distanceMeters = distance;
                                            suggestion.distanceText = formatDistance(distance);
                                        }
                                    }
                                } catch (detailsErr) {
                                    console.log("Could not fetch place details:", detailsErr);
                                }

                                return suggestion;
                            })
                        );

                        // Filter out nulls and sort by distance
                        const validSuggestions = suggestionsWithDetails.filter(Boolean) as PlaceSuggestion[];
                        validSuggestions.sort((a, b) => {
                            if (a.distanceMeters && b.distanceMeters) {
                                return a.distanceMeters - b.distanceMeters;
                            }
                            return 0;
                        });

                        setSuggestions(validSuggestions);
                    } else {
                        setSuggestions([]);
                    }
                } catch (err) {
                    console.error("Places API error:", err);
                    setError("Network error - could not search for places");
                    setSuggestions([]);
                } finally {
                    setIsLoading(false);
                }
            }, 300);
        },
        [userLocation, requestLocationIfNeeded]
    );

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
    }, []);

    return {
        suggestions,
        isLoading,
        error,
        searchPlaces,
        clearSuggestions,
        userLocation,
    };
}
