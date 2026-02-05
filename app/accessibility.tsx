// app/accessibility.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AccessibilityOption = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
};

const OPTIONS: AccessibilityOption[] = [
  { icon: "volume-high-outline", label: "Select to Speak", description: "Tap items to hear them read aloud" },
  { icon: "text-outline", label: "Display Size and Text", description: "Adjust font size and display scaling" },
  { icon: "mic-outline", label: "Text to Speech Output", description: "Configure voice feedback settings" },
  { icon: "globe-outline", label: "Translation", description: "Translate content to your language" },
  { icon: "contrast-outline", label: "Color Correction", description: "Adjust colors for color blindness" },
];

export default function Accessibility() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    "Select to Speak": false,
    "Display Size and Text": false,
    "Text to Speech Output": false,
    "Translation": false,
    "Color Correction": false,
  });

  const toggleSetting = (label: string) => {
    setSettings((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Accessibility Settings</Text>
        <Text style={styles.subheader}>
          Customize your experience to improve usability
        </Text>

        <View style={styles.card}>
          {OPTIONS.map((option, index) => (
            <View
              key={option.label}
              style={[
                styles.row,
                index < OPTIONS.length - 1 && styles.rowBorder,
              ]}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={option.icon} size={22} color="#111" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.label}>{option.label}</Text>
                {option.description && (
                  <Text style={styles.description}>{option.description}</Text>
                )}
              </View>
              <Switch
                value={settings[option.label]}
                onValueChange={() => toggleSetting(option.label)}
                trackColor={{ false: "#ddd", true: "#4CAF50" }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        <Pressable style={styles.resetBtn}>
          <Text style={styles.resetText}>Reset to Defaults</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  subheader: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e8e8e8",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  description: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  resetBtn: {
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 12,
  },
  resetText: {
    fontSize: 14,
    color: "#E53935",
    fontWeight: "600",
  },
});
