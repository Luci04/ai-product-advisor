import { ProductCard } from "@/components/ui/ProductCard";
import { ProductProvider, useProducts } from "@/context/ProductContext";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function App() {
  return (
    <ProductProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <MainScreen />
      </SafeAreaView>
    </ProductProvider>
  );
}

function MainScreen() {
  const { askAI } = useProducts();
  const [query, setQuery] = useState("I need a ");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function onSubmit() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await askAI(query.trim());
      console.log(res);
      setResult(res);
    } catch (e) {
      setResult({
        explanation: "Something went wrong. Please try again.",
        recommendations: [],
      });
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={result?.recommendations || []}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        renderItem={({ item }) => <ProductCard item={item} />}
        ListEmptyComponent={
          !loading && (
            <View style={styles.noResultContainer}>
              <Text style={styles.noResultText}>
                No recommendations yet — try typing your query above.
              </Text>
            </View>
          )
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <Text style={styles.header}>AI Product Advisor</Text>
            <Text style={styles.subHeader}>
              Describe your needs in plain English and get smart product
              recommendations.
            </Text>

            {/* Input Box */}
            <View style={styles.inputContainer}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="I need a lightweight laptop for travel with long battery life"
                style={styles.textInput}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={onSubmit}
                  style={[
                    styles.primaryButton,
                    loading && styles.disabledButton,
                  ]}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Find Matches</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={loading}
                  onPress={() => {
                    setQuery("");
                    setResult(null);
                  }}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>

              {/* AI Explanation */}
              {result && (
                <View style={styles.explanationBox}>
                  <Text style={styles.explanationLabel}>AI Explanation</Text>
                  <Text style={styles.explanationText}>
                    {result.explanation}
                  </Text>
                </View>
              )}
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    paddingVertical: 10,
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  textInput: {
    height: 60,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "500",
    fontSize: 16,
  },
  explanationBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  explanationLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: "#111827",
  },
  recommendationContainer: {
    marginTop: 24,
    flex: 1,
  },
  noResultContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  noResultText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
