import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

const BlotterCalendar = () => {
  // Dummy data for today's sessions
  const sessions = [
    {
      id: "1",
      date: "26 June",
      time: "9:00 - 11:00 AM",
      type: "Mediation/Hearing/Lupon",
      officers: "Barangay Captain/Councilor/Appointed Community Member",
    },
    {
      id: "2",
      date: "26 June",
      time: "9:00 - 11:00 AM",
      type: "Mediation/Hearing/Lupon",
      officers: "Barangay Captain/Councilor/Appointed Community Member",
    },
  ];

  const renderSessionItem = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{item.date.split(" ")[0]}</Text>
        <Text style={styles.monthText}>{item.date.split(" ")[1]}</Text>
      </View>
      <View style={styles.sessionDetails}>
        <Text style={styles.sessionText}>
          <Text style={styles.label}>Time:</Text> {item.time}
        </Text>
        <Text style={styles.sessionText}>
          <Text style={styles.label}>Type of Session:</Text> {item.type}
        </Text>
        <Text style={styles.sessionText}>
          <Text style={styles.label}>Dispute Resolution Officers:</Text>{" "}
          {item.officers}
        </Text>
        <TouchableOpacity>
          <Text style={styles.detailsLink}>See Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.navigationText}>PREVIOUS</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BLOTTER CALENDAR</Text>
        <TouchableOpacity>
          <Text style={styles.navigationText}>NEXT</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={styles.calendar}>
        <Text style={styles.calendarMonth}>JUNE 2024</Text>
        {/* You can use a calendar library like `react-native-calendars` for this */}
      </View>

      {/* Today's Sessions */}
      <Text style={styles.todayTitle}>TODAY</Text>
      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.sessionsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#800000",
    padding: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  navigationText: {
    color: "#fff",
    fontSize: 16,
  },
  calendar: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  calendarMonth: {
    color: "#800000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
    color: "#000",
  },
  sessionsList: {
    paddingHorizontal: 10,
  },
  sessionCard: {
    flexDirection: "row",
    backgroundColor: "#ffe4e1",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#800000",
    borderRadius: 10,
    width: 60,
    height: 60,
    marginRight: 10,
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  monthText: {
    color: "#fff",
    fontSize: 12,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
  detailsLink: {
    color: "#800000",
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default BlotterCalendar;
