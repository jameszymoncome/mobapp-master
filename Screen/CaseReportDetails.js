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
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

export default function CaseReportDetails({ route }) {
  const navigation = useNavigation(); 
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
  const [evidence, setEvidence] = useState([]);
  const [status, setStatus] = useState("");
  const [proceedTo, setProceedTo] = useState("");
  const [updateProceedTo , setUpdateProceedTo] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [hideButton, setHideButton] = useState(true);
  const { caseID } = route.params;
  const [newdate, dateSelected] = useState('MM/DD/YYYY')
  const [newhour, hourSelected] = useState('HH')
  const [newminute, minuteSelected] = useState('MM')
  const [newPeriod, periodSelected] = useState('AM')
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [date, setDate] = useState(new Date());
  const [barangayOfficial, setBarangayOfficial] = useState([]);
  const [selectedBarangayOfficial, setSelectedBarangayOfficial] = useState("");
  // const [respondentName, setRespondentName] = useState([
  //   { id: '1', name: 'John Doe' },
  //   { id: '2', name: 'Jane Smith' },
  //   { id: '3', name: 'Michael Johnson' },
  // ]);

  useEffect(() => {
    getOfficial();
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
          setProceedTo(response.data.data.status);
          console.log(response.data.data.status);
          setUpdateProceedTo(response.data.data.status);
          const respondents = response.data.data.respondents;
          const parsedRespondents = respondents ? respondents.split(', ').map(item => {
            const [id, name] = item.split(':');
            return { respondentID: id, name: name };
          }) : [];
          setRespondentData(parsedRespondents);
          const transformedEvidence = response.data.data.evidenceIDs.split(',').map((id) => ({
            evidenceUrl: `Evidence ${id}`,
          }));
          setEvidence(transformedEvidence);
          if(response.data.data.status == 'Pending'){
            setIsVisible(!isVisible);
          }
          else if(response.data.data.status == 'Close Case'){
            setIsVisible(!isVisible);
            setHideButton(!hideButton);
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

  const renderItem = (item) =>{
    return(
      <View style={styles.itemDropdown}>
        <Text style={styles.textItems}>{item.position}</Text>
      </View>
    )
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }

  const onChanges = (event, selectedDate) => {
    if(event.type === 'set'){
      setDate(selectedDate || date);
        if(mode == 'date'){
            const currentDate = selectedDate || date;
            let tempDate = new Date(currentDate);
            let fDate = (tempDate.getMonth() + 1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear();
            dateSelected(fDate);
        }
        else{
            const currentDate = selectedDate || date;
            let tempDate = new Date(currentDate);
            let sHour = tempDate.getHours();
            sHour = sHour % 12;
            sHour = sHour ? sHour : 12;
            hourSelected(sHour); 

            let sMinute = tempDate.getMinutes();
            let formattedMinute = sMinute.toString().padStart(2, '0');
            minuteSelected(formattedMinute);

            let period = tempDate.getHours() >= 12 ? 'PM' : 'AM';
            periodSelected(period);
        }
    }
    setShow(false);
  };


  const handleAccept = async () => {
    if(status != 'Pending'){
      if(newDescription === ''){
        Alert.alert("Error", "Please insert Description field.");
        return;
      }
      if(proceedTo === updateProceedTo){
        Alert.alert("Error", "Please Update the 'Procced to' fields.");
        return;
      }
      if(newdate === 'MM/DD/YYYY'){
        Alert.alert("Error", "Please select Date!");
        return;
      }
      if(newhour === 'HH' && newminute === 'MM'){
        Alert.alert("Error", "Please select Time!");
        return;
      }
      if(selectedBarangayOfficial === ''){
        Alert.alert("Error", "Please select Dispute resolution officer!");
        return;
      }
    }
    else{
      if(newDescription === ''){
        Alert.alert("Error", "Please insert Description field.");
        return;
      }
    }
    console.log(status);

    Alert.alert(
        "Confirmation",
        status === "Pending" ? "Are you sure you want to accept this report?" : `Are you sure you want to put this in ${updateProceedTo} `,
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancelled"),
                style: "cancel",
            },
            {
                text: "OK",
                onPress: async () => {
                  console.log('submitted');
                    try {
                        const response = await axios.post("http://brgyapp.lesterintheclouds.com/insertBlotter.php", {
                            caseID: caseID,
                            status: status,
                            new_description: newDescription,
                            proceed: updateProceedTo,
                            dates: newdate,
                            newhour: newhour,
                            newminute: newminute,
                            newPeriod: newPeriod,
                            selectedBarangayOfficial: selectedBarangayOfficial
                        });
                        if (response.data.status === "success") {
                          Alert.alert(
                            "Report Accepted",
                            response.data.message,
                            [
                              {
                                text: "OK",
                                onPress: () => navigation.replace('BlotterList'),
                              },
                            ]
                          );

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

  const getOfficial = () => {
    axios.get('http://brgyapp.lesterintheclouds.com/getOfficials.php')
    .then(response => {
      setBarangayOfficial(response.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    })
  }

  const renderPickerItems = () => {
    let items = [];
    switch (proceedTo) {
      case 'Approved':
        items = [
          { label: 'Select an option', value: proceedTo },
          { label: 'Under Investigation', value: 'Under Investigation' },
          { label: 'Mediation', value: 'Mediation' },
          { label: '1st Hearing', value: '1st Hearing' }
        ];
      case 'Under Investigation':
        items = [
          { label: 'Select an option', value: proceedTo },
          { label: 'Re- evaluate', value: 'Re- evaluate' },
          { label: 'Mediation', value: 'Mediation' },
          { label: '1st Hearing', value: '1st Hearing' },
          { label: 'Resolved', value: 'Resolved' },
          { label: 'Referred to Higher Authority', value: 'Referred to Higher Authority' }
        ];
      case 'Re- evaluate':
        items = [
          { label: 'Select an option', value: proceedTo },
          { label: 'Under Investigation', value: 'Under Investigation' },
          { label: 'Resolved', value: 'Resolved' },
          { label: 'Close case', value: 'Close case' }
        ];
      case 'Mediation':
        items = [
          { label: 'Select an option', value: proceedTo },
          { label: 'Resolved', value: 'Resolved' },
          { label: '1st Hearing', value: '1st Hearing' },
          { label: 'Referred to Higher Authority', value: 'Referred to Higher Authority' }
        ];
        break;
      case '1st Hearing':
        items = [
          { label: 'Select an option', value: proceedTo },
          { label: 'Resolved', value: 'Resolved' },
          { label: '2nd Hearing', value: '2nd Hearing' },
          { label: 'Referred to Higher Authority', value: 'Referred to Higher Authority' }
        ];
        break;
      case '2nd Hearing':
        items = [
          { label: 'Select an option', value: proceedTo },
          { label: 'Resolved', value: 'Resolved' },
          { label: '3rd Hearing', value: '3rds Hearing' },
          { label: 'Referred to Higher Authority', value: 'Referred to Higher Authority' }
        ];
        break;
      case '3rd Hearing':
        items = [
          { label: 'Select an option', value: proceedTo },
          { label: 'Resolved', value: 'Resolved' },
          { label: 'Referred to Higher Authority', value: 'Referred to Higher Authority' }
        ];
        break;
      case 'Resolved':
        items = [
          { label: 'Select an option', value: proceedTo },
          { label: 'Close Case', value: 'Close Case' }
        ];
        break;
      case 'Referred to Higher Authority':
        items = [
          { label: 'Select an option', value: proceedTo },
          { label: 'Under Investigation(by higher authority)', value: 'Under Investigation(by higher authority)' },
          { label: 'Resolved', value: 'Resolved' },
          { label: 'Close Case', value: 'Close Case' }
        ];
        break;
      default:
        return <Picker.Item label="Select an option" value="" />;
    }
    return items.map((item, index) => (
      <Picker.Item key={index} label={item.label} value={item.value} />
    ));
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
        {respondentData && respondentData.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={respondentData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <Text style={{ padding: 10, textAlign: 'center' }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={{ padding: 10, textAlign: 'center', color: 'gray' }}>
            No respondents available.
          </Text>
        )}
      </View>

      {evidence.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Photos/Videos (Optional)</Text>
          <FlatList
            scrollEnabled={false}
            data={evidence}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <Text style={[styles.uploadButton, {textAlign: 'center'}]}>{item.evidenceUrl}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Photos/Videos (Optional)</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="cloud-upload-outline" size={24} color="#750000" />
            <Text style={styles.uploadText}>No Image of Evidence</Text>
          </TouchableOpacity>
        </View>
      )}

      
      {isVisible && (
        <View style={styles.section} >
          <Text style={styles.label}>Proceed to: *</Text>
          <Picker
            selectedValue={proceedTo}
            onValueChange={(itemValue) => {
              console.log('Selected Value:', itemValue);
              setUpdateProceedTo(itemValue);
            }}
            style={styles.picker}
          >
            {renderPickerItems()}
          </Picker>
        </View>
      )}

      {isVisible && (
        <View style={{marginTop: 10, marginHorizontal: 30,}}>
          <Text>Resolution Schedule</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 5, marginLeft: 15 }}>
            <Text style={{ marginRight: 5 }}>Date:</Text>
            <TouchableOpacity onPress={() => showMode('date')}>
              <View style={styles.datetimeContainer}>
                <Text>{newdate}</Text>
                <Ionicons name="calendar-outline" style={{ color: '#710808', marginLeft: 5 }} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 5, marginLeft: 15}}>
            <Text style={{ marginRight: 5 }}>Time:</Text>
            <TouchableOpacity onPress={() => showMode('time')}>
              <View style={{flexDirection:'row'}}>
                <Text style={styles.timeDesign}>{newhour}</Text>
                <Text>:</Text>
                <Text style={styles.timeDesign}>{newminute}</Text>
                <View style={styles.timeContainer}>
                  <Text>{newPeriod}</Text>
                </View>
                <Ionicons name='time-outline' size={15} style={styles.iconsStyle}/>
              </View>
            </TouchableOpacity>
          </View>
          {show && (
            <DateTimePicker
                testID='dateTimePicker'
                value={date}
                mode={mode}
                is24Hour={false}
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                    const currentDate = new Date();
                    if (mode === 'time' && selectedDate) {
                    // Check if the selected date is today
                    const isToday =
                        date.getDate() === currentDate.getDate() &&
                        date.getMonth() === currentDate.getMonth() &&
                        date.getFullYear() === currentDate.getFullYear();

                        if(isToday && selectedDate.toLocaleTimeString() > currentDate.toLocaleTimeString()){
                        console.log("hiii");
                        Alert.alert("Invalid Time",
                            "You can't select a future time!",
                            [
                            {
                                text: "OK",
                                onPress: () => {
                                hourSelected('HH');
                                minuteSelected('MM');
                                periodSelected('AM');
                                }
                            }
                            ],
                            { cancelable: false });
                        }
                    }
                    onChanges(event, selectedDate);
                }}
            />
          )}
          <View>
            <Text>Dispute Resolution Officer:</Text>
            <Picker
              selectedValue={selectedBarangayOfficial}
              onValueChange={(itemValue) => {
                console.log('Selected ID:', itemValue);
                setSelectedBarangayOfficial(itemValue);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select" value="" />
              {barangayOfficial.map((item) => (
                <Picker.Item key={item.id} label={item.position} value={item.id.toString()} />
              ))}
            </Picker>
          </View>
          
          
        </View>
      )}

      {!hideButton ? (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Text style={{ textAlign: 'center', color: '#750000', fontSize: 18 }}>{status}</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleAccept}>
            <Text style={styles.buttonText}>{status === "Pending" ? "Accept" : "Save"}</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontStyle: 'italic'
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

  dropdown: {
    width: '100%',
    height: 30,
    backgroundColor: '#FFFFFF',
    borderWidth:1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 8
  },
  dropdownContainer: {
    borderColor: '#888', // Border for the options container
    borderWidth: 1,
    borderRadius: 10, // Rounded edges
    backgroundColor: '#ffffff', // Light background for better contrast
    shadowColor: '#000', // Add shadow to give a floating effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // For Android shadow
    marginTop: 5, // Add spacing between dropdown and options container
  },
  placeholderStyle: {  
    fontSize: 13,
    color: 'gray'
  },
  selectedTextStyle: {
    fontSize: 13,
    color: 'black'
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 13,
    color: 'black',
  },
  datetimeContainer: {
    borderWidth: 1,
    borderColor: 'CAD3DF',
    borderRadius: 5,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    padding: 2,
    alignItems: 'center',
    marginHorizontal: 5
  },
  timeDesign: {
    borderWidth: 1,
    borderColor: 'CAD3DF',
    borderRadius: 5,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    padding: 2,
    alignItems: 'center',
    marginHorizontal: 5,
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'gray'
  },
  dropdown: {
    width: '100%',
    height: 30,
    backgroundColor: '#FFFFFF',
    borderWidth:1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 8
  },
  dropdownContainer: {
    borderColor: '#888', // Border for the options container
    borderWidth: 1,
    borderRadius: 10, // Rounded edges
    backgroundColor: '#ffffff', // Light background for better contrast
    shadowColor: '#000', // Add shadow to give a floating effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // For Android shadow
    marginTop: 5, // Add spacing between dropdown and options container
  },
  placeholderStyle: {  
    fontSize: 13,
    color: 'gray'
  },
  selectedTextStyle: {
    fontSize: 13,
    color: 'black'
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 13,
    color: 'black',
  },
});
