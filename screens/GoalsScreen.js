import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DAILY_GOALS = [
  {
    id: "walk",
    emoji: "🚶",
    title: "Go for a 30 minute walk",
    description: "Get moving and fresh air",
  },
  {
    id: "veggies",
    emoji: "🥗",
    title: "Eat your veggies and protein",
    description: "Nourish your body with nutrients",
  },
  {
    id: "water",
    emoji: "💧",
    title: "Drink 2 liters of water",
    description: "Stay hydrated throughout the day",
  },
];

export default function GoalsScreen({ navigation }) {
  const [completedGoals, setCompletedGoals] = useState({});

  useEffect(() => {
    loadGoals();
    checkIfNewDay();
  }, []);

  async function loadGoals() {
    try {
      const stored = await AsyncStorage.getItem("dailyGoals");
      if (stored) {
        setCompletedGoals(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load goals:", error);
    }
  }

  async function checkIfNewDay() {
    try {
      const lastDate = await AsyncStorage.getItem("lastGoalDate");
      const today = new Date().toDateString();

      if (lastDate !== today) {
        // New day - reset goals
        setCompletedGoals({});
        await AsyncStorage.setItem("dailyGoals", JSON.stringify({}));
        await AsyncStorage.setItem("lastGoalDate", today);
      }
    } catch (error) {
      console.error("Failed to check date:", error);
    }
  }

  async function toggleGoal(goalId) {
    const newCompleted = {
      ...completedGoals,
      [goalId]: !completedGoals[goalId],
    };

    setCompletedGoals(newCompleted);

    try {
      await AsyncStorage.setItem("dailyGoals", JSON.stringify(newCompleted));
    } catch (error) {
      console.error("Failed to save goal:", error);
    }
  }

  const completedCount = Object.values(completedGoals).filter(Boolean).length;
  const totalGoals = DAILY_GOALS.length;
  const allComplete = completedCount === totalGoals;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Daily Goals</Text>
          <Text style={styles.subtitle}>
            Track your healthy habits for today
          </Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressEmoji}>
            {allComplete ? "🎉" : "💪"}
          </Text>
          <Text style={styles.progressText}>
            {completedCount} of {totalGoals} completed
          </Text>
          
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(completedCount / totalGoals) * 100}%` },
              ]}
            />
          </View>

          {allComplete && (
            <Text style={styles.celebrationText}>
              Amazing! You completed all your goals today! 🌟
            </Text>
          )}
        </View>

        {/* Goals List */}
        <View style={styles.goalsContainer}>
          {DAILY_GOALS.map((goal) => {
            const isCompleted = completedGoals[goal.id];

            return (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalCard,
                  isCompleted && styles.goalCardCompleted,
                ]}
                onPress={() => toggleGoal(goal.id)}
                activeOpacity={0.7}
              >
                <View style={styles.goalContent}>
                  <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                  
                  <View style={styles.goalText}>
                    <Text
                      style={[
                        styles.goalTitle,
                        isCompleted && styles.goalTitleCompleted,
                      ]}
                    >
                      {goal.title}
                    </Text>
                    <Text style={styles.goalDescription}>
                      {goal.description}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkbox,
                      isCompleted && styles.checkboxCompleted,
                    ]}
                  >
                    {isCompleted && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "Small daily improvements are the key to staggering long-term results."
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.navButtonText}>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonActive]}
          onPress={() => {}}
        >
          <Text style={[styles.navButtonText, styles.navButtonTextActive]}>
            🎯 Goals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Camera")}
        >
          <Text style={styles.navButtonText}>📷 Scan</Text>
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
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },

  // Progress Card
  progressCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 16,
  },
  progressBarContainer: {
    width: "100%",
    height: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 6,
  },
  celebrationText: {
    marginTop: 16,
    fontSize: 16,
    color: "#16a34a",
    fontWeight: "600",
    textAlign: "center",
  },

  // Goals
  goalsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  goalCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  goalCardCompleted: {
    backgroundColor: "#f0fdf4",
    borderColor: "#22c55e",
  },
  goalContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  goalEmoji: {
    fontSize: 36,
  },
  goalText: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  goalTitleCompleted: {
    color: "#16a34a",
    textDecorationLine: "line-through",
  },
  goalDescription: {
    fontSize: 14,
    color: "#64748b",
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  checkmark: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  // Quote Card
  quoteCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  quoteText: {
    fontSize: 15,
    color: "#1e40af",
    fontStyle: "italic",
    lineHeight: 22,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  navButtonActive: {
    backgroundColor: "#eff6ff",
  },
  navButtonText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  navButtonTextActive: {
    color: "#3b82f6",
  },
});