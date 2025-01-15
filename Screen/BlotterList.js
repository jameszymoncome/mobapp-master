import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

const BlotterList = ({ navigation }) => {
  const [blotterData, setBlotterData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Fetch blotter data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://brgyapp.lesterintheclouds.com/fetch_blotter_list.php"
        );
        setBlotterData(response.data);
      } catch (error) {
        if (error.response) {
          console.error("Error response:", error.response);
          setError(`Error: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
          console.error("Error request:", error.request);
          setError("Network Error: No response received.");
        } else {
          console.error("Error message:", error.message);
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToAnotherScreen = () => {
    navigation.navigate("BlotterForm");
  };

  // Handle visibility click for individual blotter items
  const handleVisibilityClick = (caseID) => {
    navigation.navigate("CaseReport", { caseID });
  };

  // Function to handle dropdown selection
  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setDropdownVisible(false);
  };

  const renderBlotterItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.caseID}</Text>
      <Text style={styles.cell}>{item.dateOccured}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <Text style={styles.cell}>{item.proccess}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity onPress={() => handleVisibilityClick(item.caseID)}>
          <Icon name="visibility" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredData = blotterData.filter((item) => {
    const matchesSearch = item.proccess?.toLowerCase().includes(searchText.toLowerCase());
    if (selectedFilter === "All") return matchesSearch;
    return item.status === selectedFilter;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading data, please wait...</Text>
      </View>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="menu" size={30} color="#fff" />
        <Text style={styles.headerTitle}>BLOTTER LIST</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={styles.dropdownText}>{selectedFilter}</Text>
          <Icon name="arrow-drop-down" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <ScrollView>
          {["All", "Pending", "Under Investigation", "Mediation", "Re- evaluate", "1st Hearing", "2nd Hearing", "3rd Hearing", "Resolved", "Referred to Higher Authority"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={styles.dropdownItem}
              onPress={() => handleFilterSelect(filter)}
            >
              <Text style={styles.dropdownItemText}>{filter}</Text>
            </TouchableOpacity>
          ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.tableHeader}>
        {["Incident ID", "Date", "Status", "Reported By", "Action"].map((header) => (
          <Text key={header} style={styles.headerCell}>
            {header}
          </Text>
        ))}
      </View>

      {filteredData.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No results found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderBlotterItem}
          keyExtractor={(item) => String(item.caseID)}
          style={styles.tableBody}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={goToAnotherScreen}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#800000",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#800000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownText: {
    marginRight: 5,
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 5,
    maxHeight: 100
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#800000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#800000",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCell: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  tableBody: {
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
  actionCell: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#800000",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BlotterList;
