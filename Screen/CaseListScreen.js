import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 

function CaseListScreen(props) {

    const caseData = [
        {
          id: "INC-20240001",
          type: "Theft",
          status: "PENDING",
        },
      ];
    
      const renderCaseItem = ({ item }) => (
        <View style={styles.card}>
          <View style={styles.caseDetails}>
            <Text style={styles.caseText}>
              <Text style={styles.label}>Incident ID: </Text> {item.id}
            </Text>
            <Text style={styles.caseText}>
              <Text style={styles.label}>Case Type: </Text> {item.type}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>{item.status}</Text>
            <Text style={styles.dateLabel}>Date</Text>
          </View>
        </View>
      );

    return (
        <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CASE REPORTED</Text>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Filter by:</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Latest</Text>
          <Ionicons name="chevron-down" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* List of Cases */}
      <FlatList
        data={caseData}
        renderItem={renderCaseItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#750000",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  filterText: {
    fontSize: 14,
    marginRight: 10,
    color: "#555",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#750000",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "white",
    marginRight: 5,
  },
  card: {
    backgroundColor: "#f7f1f3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  caseDetails: {
    flex: 3,
  },
  caseText: {
    fontSize: 14,
    marginVertical: 3,
    color: "#333",
  },
  label: {
    color: "#c22533",
    fontWeight: "bold",
  },
  statusContainer: {
    alignItems: "flex-end",
    flex: 1,
  },
  status: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  dateLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
});

export default CaseListScreen;