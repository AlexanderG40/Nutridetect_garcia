import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🥜🥛🌾</Text>
          <Text style={styles.title}>Allergen Scanner</Text>
          <Text style={styles.subtitle}>
            Scan food labels to detect nuts, dairy, and wheat
          </Text>
        </View>

        <View style={styles.info}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Scanning for:</Text>

            <View style={styles.allergenBadges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🥜 Nuts</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🥛 Dairy</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🌾 Wheat</Text>
              </View>
            </View>
          </View>

          {/* Goals Card */}
          <TouchableOpacity
            style={styles.goalsCard}
            onPress={() => navigation.navigate("Goals")}
            activeOpacity={0.7}
          >
            <Text style={styles.goalsEmoji}>🎯</Text>
            <View style={styles.goalsText}>
              <Text style={styles.goalsTitle}>Daily Goals</Text>
              <Text style={styles.goalsSubtitle}>
                Track your healthy habits
              </Text>
            </View>
            <Text style={styles.goalsArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton
          title="Start Scanning"
          onPress={() => navigation.navigate("Camera")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  info: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 16,
  },
  allergenBadges: {
    gap: 12,
  },
  badge: {
    backgroundColor: "#f1f5f9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
  },

  // Goals Card
  goalsCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 2,
    borderColor: "#bfdbfe",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalsEmoji: {
    fontSize: 36,
  },
  goalsText: {
    flex: 1,
  },
  goalsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: 4,
  },
  goalsSubtitle: {
    fontSize: 14,
    color: "#3b82f6",
  },
  goalsArrow: {
    fontSize: 24,
    color: "#3b82f6",
    fontWeight: "600",
  },
});