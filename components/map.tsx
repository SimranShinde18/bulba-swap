import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function BulbaMap() {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: -37.8136,
        longitude: 144.9631,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }}
    >
      <Marker
        coordinate={{ latitude: -37.8136, longitude: 144.9631 }}
        title="Wooden Chess Board"
        description="2.1 km away"
      />
      <Marker
        coordinate={{ latitude: -37.82, longitude: 144.97 }}
        title="Uno Cards"
        description="3.4 km away"
      />
      <Marker
        coordinate={{ latitude: -37.805, longitude: 144.955 }}
        title="Catan"
        description="1.5 km away"
      />
    </MapView>
  );
}
