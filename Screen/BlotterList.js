import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

const BlotterList = () => {
  const [blotterData, setBlotterData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blotter data from PHP API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://brgyapp.lesterintheclouds.com/fetch_blotter_list.php"); // Update with your actual domain
        setBlotterData(response.data);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Error response:', error.response);
          setError(`Error: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          setError("Network Error: No response received.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle visibility icon click
  const handleVisibilityClick = (id) => {
    Alert.alert("Incident ID:", id);
  };

  const renderBlotterItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.type}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <Text style={styles.cell}>{item.reported_by}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity onPress={() => handleVisibilityClick(item.id)}>
          <Icon name="visibility" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <Icon name="print" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredData = blotterData.filter((item) =>
    item.reported_by?.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <Text>Loading...</Text>;
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
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>All</Text>
          <Icon name="arrow-drop-down" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        {["Incident ID", "Date", "Type", "Status", "Reported By", "Action"].map((header) => (
          <Text key={header} style={styles.headerCell}>{header}</Text>
        ))}
      </View>

      {filteredData.length === 0 ? (
        <Text>No results found.</Text>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderBlotterItem}
          keyExtractor={(item) => String(item.id)}
          style={styles.tableBody}
        />
      )}

      <TouchableOpacity style={styles.addButton}>
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
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#800000",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
   headerCell:{
     flex :1 ,
     color:"#fff" ,
     fontWeight:"bold" ,
     textAlign:"center" ,
     fontSize :12
   },
   tableBody:{
     flexGrow :1 ,
   },
   row:{
     flexDirection :"row" ,
     backgroundColor:"#fff",
     paddingVertical :10 ,
     paddingHorizontal :5 ,
     borderBottomWidth :1 ,
     borderBottomColor:"#ddd"
   },
   cell:{
     flex :1 ,
     textAlign:"center",
     fontSize :12
   },
   actionCell:{
     flex :1 ,
     flexDirection:"row" ,
     justifyContent:"center"
   },
   addButton:{
     position:"absolute" ,
     bottom :20 ,
     right :20 ,
     backgroundColor:"#800000" ,
     width :50 ,
     height :50 ,
     borderRadius :25 ,
     justifyContent :"center" ,
     alignItems :"center"
   }
});

export default BlotterList;
