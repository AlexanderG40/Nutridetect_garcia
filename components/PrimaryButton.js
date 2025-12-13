import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function PrimaryButton({ title, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#2f2929ff",
    // horzontal and vertical shadow offset
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // adds a shadow effect especially for android
    elevation: 3,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});