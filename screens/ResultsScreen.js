import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import { detectAllergens } from "../utils/allergens";

export default function ResultScreen({ route, navigation }) {
  const { text, photoUri } = route.params || {};
  const result = detectAllergens(text || "");
  const hasAllergens = result.nuts || result.dairy || result.wheat;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Scan Results</Text>

        {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}

        {/* Alert Card */}
        <View
          style={[
            styles.alertCard,
            hasAllergens ? styles.alertDanger : styles.alertSafe,
          ]}
        >
          <Text style={styles.alertEmoji}>
            {hasAllergens ? "⚠️" : "✅"}
          </Text>

          <Text
            style={[
              styles.alertTitle,
              hasAllergens ? styles.alertTitleDanger : styles.alertTitleSafe,
            ]}
          >
            {hasAllergens ? "ALLERGENS DETECTED!" : "SAFE TO CONSUME"}
          </Text>

          <Text
            style={[
              styles.alertSubtitle,
              hasAllergens
                ? styles.alertSubtitleDanger
                : styles.alertSubtitleSafe,
            ]}
          >
            {hasAllergens
              ? "This product contains allergens you should avoid"
              : "No detected allergens found in this product"}
          </Text>
        </View>

        {/* Allergen Breakdown */}
        <View style={styles.allergenCheckCard}>
          <Text style={styles.sectionTitle}>Allergen Check</Text>

          <View
            style={[
              styles.allergenRow,
              result.nuts && styles.allergenRowDanger,
            ]}
          >
            <Text style={styles.allergenLabel}>🥜 Nuts</Text>
            <Text
              style={[
                styles.allergenStatus,
                result.nuts ? styles.statusDanger : styles.statusSafe,
              ]}
            >
              {result.nuts ? "⚠️ CONTAINS" : "✓ Safe"}
            </Text>
          </View>

          <View
            style={[
              styles.allergenRow,
              result.dairy && styles.allergenRowDanger,
            ]}
          >
            <Text style={styles.allergenLabel}>🥛 Dairy</Text>
            <Text
              style={[
                styles.allergenStatus,
                result.dairy ? styles.statusDanger : styles.statusSafe,
              ]}
            >
              {result.dairy ? "⚠️ CONTAINS" : "✓ Safe"}
            </Text>
          </View>

          <View
            style={[
              styles.allergenRow,
              result.wheat && styles.allergenRowDanger,
            ]}
          >
            <Text style={styles.allergenLabel}>🌾 Wheat</Text>
            <Text
              style={[
                styles.allergenStatus,
                result.wheat ? styles.statusDanger : styles.statusSafe,
              ]}
            >
              {result.wheat ? "⚠️ CONTAINS" : "✓ Safe"}
            </Text>
          </View>
        </View>

        {/* Details Section */}
        {result.details.length > 0 && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Details</Text>

            {result.details.map((detail, idx) => (
              <Text key={idx} style={styles.detailText}>
                • {detail}
              </Text>
            ))}
          </View>
        )}

        {/* Extracted Text */}
        <View style={styles.textCard}>
          <Text style={styles.sectionTitle}>Extracted Text</Text>
          <Text style={styles.extractedText}>{text}</Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Scan Another Item"
          onPress={() => navigation.navigate("Camera")}
        />

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 20,
    textAlign: "center",
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },

  // Alert Card if allergens found
  alertCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
  },
  alertDanger: {
    backgroundColor: "#fef2f2",
    borderWidth: 2,
    borderColor: "#ef4444",
  },
  alertSafe: {
    backgroundColor: "#f0fdf4",
    borderWidth: 2,
    borderColor: "#22c55e",
  },
  alertEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  alertTitleDanger: {
    color: "#991b1b",
  },
  alertTitleSafe: {
    color: "#166534",
  },
  alertSubtitle: {
    fontSize: 15,
    textAlign: "center",
  },
  alertSubtitleDanger: {
    color: "#dc2626",
  },
  alertSubtitleSafe: {
    color: "#16a34a",
  },

  // Allergen 
  allergenCheckCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  allergenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    marginBottom: 10,
  },
  allergenRowDanger: {
    backgroundColor: "#fef2f2",
  },
  allergenLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  allergenStatus: {
    fontSize: 15,
    fontWeight: "700",
  },
  statusDanger: {
    color: "#dc2626",
  },
  statusSafe: {
    color: "#16a34a",
  },

  // Details
  detailsCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  detailText: {
    fontSize: 14,
    color: "#9a3412",
    marginBottom: 4,
  },

  // Extracted Text
  textCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  extractedText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },

  // Bottom Buttons
  buttonContainer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  homeButton: {
    marginTop: 12,
    alignItems: "center",
    padding: 12,
  },
  homeButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
});