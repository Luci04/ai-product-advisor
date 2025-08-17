import React from "react";
import { Text, View, StyleSheet } from "react-native";

export const ProductCard = ({ item }) => {
  const { product, score, reason } = item;

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.productName}>{product.product_name}</Text>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Bottom Row with price and score */}
        <View style={styles.bottomRow}>
          <Text style={styles.price}>₹ {product.price.toLocaleString()}</Text>

          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{Math.round(score * 100)}%</Text>
          </View>
        </View>

        {/* Optional AI reason */}
        {reason && <Text style={styles.reason}>{reason}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  info: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  brand: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  scoreBadge: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 14,
  },
  reason: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    fontStyle: "italic",
  },
});
