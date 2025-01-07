import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Dropdown picker
import { Ionicons } from "@expo/vector-icons"; // For icons

export default function CaseReportDetails() {
  const [incidentType, setIncidentType] = useState("");
  const [proceedTo, setProceedTo] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

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
          Incident No.: <Text style={styles.boldText}>INC - 2024001</Text>
        </Text>
      </View>

      {/* Incident Date and Time */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Incident Date:</Text>
          <TextInput style={styles.input} placeholder="MM/DD/YYYY" />
        </View>
        <View style={styles.timeInput}>
          <Text style={styles.label}>Incident Time:</Text>
          <TextInput style={styles.input} placeholder="00:00" />
        </View>
      </View>

      {/* Place of Incident */}
      <View style={styles.section}>
        <Text style={styles.label}>Place of Incident: *</Text>
        <TextInput style={styles.input} placeholder="Enter place of incident" />
      </View>

      {/* Type of Incident */}
      <View style={styles.section}>
        <Text style={styles.label}>Type of Incident: *</Text>
        <Picker
          selectedValue={incidentType}
          onValueChange={(itemValue) => setIncidentType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Type" value="" />
          <Picker.Item label="Theft" value="theft" />
          <Picker.Item label="Assault" value="assault" />
          <Picker.Item label="Accident" value="accident" />
        </Picker>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.input, styles.description]}
          multiline
          placeholder="Enter details here..."
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Complainant Information */}
      <Text style={styles.sectionTitle}>Complainant Information</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Name of Complainant: *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Phone Number: *</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="Enter phone number"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Address: *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
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

      {/* Proceed To */}
      <View style={styles.section}>
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

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.buttonText}>Save</Text>
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
});
