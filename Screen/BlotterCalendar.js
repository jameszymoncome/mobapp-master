import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import uuid from "react-native-uuid";

const BlotterCalendar = () => {
  const [markedDates, setMarkedDates] = React.useState({});
  const [sessions, setSessions] = React.useState([]);
  const [allSessions, setAllSessions] = React.useState([]); // Store all data
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today's date

  React.useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await axios.get(
          "https://brgyapp.lesterintheclouds.com/fetch_blotter_calendar.php"
        );

        const data = response.data;

        const marked = {};
        const sessionList = [];

        data.forEach((item) => {
          const date = item.dateHearing || item.approvedDatetime.split(" ")[0];
          marked[date] = { marked: true, dotColor: "#800000" };

          sessionList.push({
            id: uuid.v4(), // Generate unique ID
            date,
            time: item.timeHearing || "N/A",
            type: item.status || "N/A", // Use `status` as "Type of Session"
            officers: item.position || "N/A", // Use `position` for officers
          });
        });

        setMarkedDates(marked);
        setAllSessions(sessionList); // Store all data
        filterSessions(sessionList, selectedDate); // Filter sessions for today's date initially
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchCalendarData();
  }, []);

  const filterSessions = (sessionList, date) => {
    const filtered = sessionList.filter((session) => session.date === date);
    setSessions(filtered);
  };

  const handleDayPress = (day) => {
    const selected = day.dateString;
    setSelectedDate(selected);
    filterSessions(allSessions, selected); // Update the sessions for the selected date
  };

  const renderSessionItem = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{item.date.split("-")[2]}</Text>
        <Text style={styles.monthText}>
          {new Date(item.date).toLocaleString("default", { month: "long" })}
        </Text>
      </View>
      <View style={styles.sessionDetails}>
        <Text style={styles.sessionText}>
          <Text style={styles.label}>Time: </Text>
          {item.time}
        </Text>
        <Text style={styles.sessionText}>
          <Text style={styles.label}>Type of Session: </Text>
          {item.type}
        </Text>
        <Text style={styles.sessionText}>
          <Text style={styles.label}>Dispute Resolution Officers: </Text>
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
        <Calendar
          current={new Date().toISOString().split("T")[0]}
          monthFormat={"MMMM yyyy"}
          onDayPress={handleDayPress}
          markingType={"dot"}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              selected: true,
              marked: true,
              selectedColor: "#800000",
              dotColor: "#800000",
            },
          }}
          theme={{
            selectedDayBackgroundColor: "#800000",
            todayTextColor: "#800000",
            arrowColor: "#800000",
            dotColor: "#800000",
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "500",
          }}
        />
      </View>

      {/* Selected Date's Sessions */}
      <Text style={styles.todayTitle}>
        {selectedDate === new Date().toISOString().split("T")[0]
          ? "TODAY"
          : `SESSIONS ON ${new Date(selectedDate).toLocaleDateString()}`}
      </Text>
      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id} // Use the unique `id` as the key
        contentContainerStyle={styles.sessionsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
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
    fontSize: 20,
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
    elevation: 3,
    overflow: "hidden",
  },
  todayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
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
    marginRight: 15,
  },
  dateText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  monthText: {
    color: "#fff",
    fontSize: 14,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
  detailsLink: {
    color: "#800000",
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default BlotterCalendar;
