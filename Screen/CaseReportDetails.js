import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Dropdown picker
import { Ionicons } from "@expo/vector-icons"; // For icons
import axios from "axios";

export default function CaseReportDetails({ route }) {
  const [inciDate, setInciDate] = useState("");
  const [inciTime, setInciTime] = useState("");
  const [placeInci, setPlaceInci] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [complainName, setComplainName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [respondentData, setRespondentData] = useState([]);
  const [status, setStatus] = useState("");
  const [proceedTo, setProceedTo] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const { caseID } = route.params;
  // const [respondentName, setRespondentName] = useState([
  //   { id: '1', name: 'John Doe' },
  //   { id: '2', name: 'Jane Smith' },
  //   { id: '3', name: 'Michael Johnson' },
  // ]);

  useEffect(() => {
    const fetchBloterData = async () => {
      try {
        const response = await axios.post("http://brgyapp.lesterintheclouds.com/getReportedCase.php", {caseID});
        if (response.data.status === "success") {
          setInciDate(response.data.data.dateOccured);
          setInciTime(response.data.data.timeOccured);
          setPlaceInci(response.data.data.place);
          setIncidentType(response.data.data.incidentNames);
          setDescription(response.data.data.description);
          setComplainName(response.data.data.complainantName);
          setPhone(response.data.data.contact);
          setAddress(response.data.data.addressCom);
          setStatus(response.data.data.status);
          const respondents = response.data.data.respondents;
          const parsedRespondents = respondents ? respondents.split(', ').map(item => {
            const [id, name] = item.split(':');
            return { respondentID: id, name: name };
          }) : [];
          setRespondentData(parsedRespondents);
          if(response.data.data.status == 'Pending'){
            setIsVisible(!isVisible);
          }
          
        } else {
          console.log('No data found for this user.');
        }
      } catch (error) {
        console.error('Error response:', error.response);
      }
    }

    fetchBloterData();
  }, [caseID]);

  const handleAccept = async () => {
    Alert.alert(
        "Confirmation",
        "Are you sure you want to accept this report?",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancelled"),
                style: "cancel",
            },
            {
                text: "OK",
                onPress: async () => {
                    try {
                        const response = await axios.post("http://brgyapp.lesterintheclouds.com/insertBlotter.php", {
                            caseID: caseID,
                            new_description: newDescription === "" ? description : newDescription,
                        });
                        if (response.data.status === "success") {
                            Alert.alert("Report Accepted", response.data.message);
                        } else {
                            Alert.alert("Error", response.data.message);
                        }
                    } catch (error) {
                        console.error('Error while accepting report:', error);
                    }
                },
            },
        ],
        { cancelable: false }
    );
};


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CASE REPORT</Text>
      </View>

      {/* Incident No */}
      <View style={styles.section}>
        <Text style={styles.label}>
          Incident No.: <Text style={styles.boldText}>{caseID}</Text>
        </Text>
      </View>

      {/* Incident Date and Time */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Incident Date:</Text>
          <TextInput style={styles.input} editable={false} value={inciDate} placeholder="MM/DD/YYYY" />
        </View>
        <View style={styles.timeInput}>
          <Text style={styles.label}>Incident Time:</Text>
          <TextInput style={styles.input} editable={false} value={inciTime} placeholder="00:00" />
        </View>
      </View>

      {/* Place of Incident */}
      <View style={styles.section}>
        <Text style={styles.label}>Place of Incident: *</Text>
        <TextInput style={styles.input} editable={false} value={placeInci} placeholder="Enter place of incident" />
      </View>

      {/* Type of Incident */}
      <View style={styles.section}>
        <Text style={styles.label}>Type of Incident: *</Text>
        <Text style={styles.textItem}>{incidentType}</Text>
        {/* <Picker
          selectedValue={incidentType}
          onValueChange={(itemValue) => setIncidentType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Type" value="" />
          <Picker.Item label="Theft" value="theft" />
          <Picker.Item label="Assault" value="assault" />
          <Picker.Item label="Accident" value="accident" />
        </Picker> */}
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Description:</Text>
        <Text style={{marginLeft: 5}}>
          Old Description: <Text style={{fontStyle: 'italic'}}>{description}</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.description]}
          multiline
          placeholder="Enter details here..."
          value={newDescription}
          onChangeText={setNewDescription}
        />
      </View>

      {/* Complainant Information */}
      <Text style={styles.sectionTitle}>Complainant Information</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Name of Complainant: *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={complainName}
          editable={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Phone Number: *</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="Enter phone number"
          value={phone}
          editable={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Address: *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={address}
          editable={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Respondent Information:</Text>
        <Text style={styles.tableDesign}>Name of Respondent</Text>
        <FlatList
          scrollEnabled = {false}
          data={respondentData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Text style={{ padding: 10 }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Upload Photos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Photos/Videos (Optional)</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="cloud-upload-outline" size={24} color="#750000" />
          <Text style={styles.uploadText}>Upload Photos/Video</Text>
        </TouchableOpacity>
      </View>
      
      {isVisible && (
        <View style={styles.section} >
          <Text style={styles.label}>Proceed to: *</Text>
          <Picker
            selectedValue={proceedTo}
            onValueChange={(itemValue) => setProceedTo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select an option" value="" />
            <Picker.Item label="Police Department" value="police" />
            <Picker.Item label="Court" value="court" />
          </Picker>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleAccept}>
          <Text style={styles.buttonText}>{status === "Pending" ? "Accept" : "Save"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#750000",
    padding: 15,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  description: {
    height: 80,
    textAlignVertical: "top",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#750000",
    marginVertical: 5,
    marginLeft: 15,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#750000",
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#f7f1f3",
  },
  uploadText: {
    marginLeft: 10,
    color: "#750000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginVertical: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#750000",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  halfInput: {
    width: "48%",
  },
  timeInput: {
    width: "48%",
  },
  tableDesign: {
    textAlign: 'center',
    width: '100%',
    backgroundColor: '#750000',
    color: 'white',
    fontSize: 18,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  rowDesign: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: "#fff",
    fontSize: 18,
    textAlign: 'center'
  },
  textItem : {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 8
  },
  itemsName: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
