import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconButton } from 'react-native-paper';

const IncidentReport = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const data = [
    { crime: 'THEFT', count: 2 },
    { crime: 'RAPED', count: 9 },
    { crime: 'MURDER', count: 3 },
    { crime: 'ABUSE', count: 5 },
  ];

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>INCIDENT REPORT</Text>
      </View>

      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.datePickerButton}>
          <Text>{startDate.toDateString()}</Text>
        </TouchableOpacity>

        <Text style={styles.toText}> - </Text>

        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.datePickerButton}>
          <Text>{endDate.toDateString()}</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      <Text style={styles.chartTitle}>Crime Incidents in Brgy. III Daet, Camarines Norte</Text>

      <View style={styles.chartContainer}>
        <VictoryChart>
          <VictoryAxis
            label="Crime Type"
            tickFormat={data.map(item => item.crime)}
            style={{
              axisLabel: { padding: 30 },
              ticks: { stroke: "grey" },
              tickLabels: { angle: -30, fontSize: 10 }
            }}
          />
          <VictoryAxis dependentAxis label="Number of Incidents" />
          <VictoryBar
            data={data}
            x="crime"
            y="count"
            style={{
              data: {
                fill: ({ datum }) => {
                  switch (datum.crime) {
                    case 'THEFT': return '#C084FC';
                    case 'RAPED': return '#3B82F6';
                    case 'MURDER': return '#F97316';
                    case 'ABUSE': return '#22C55E';
                    default: return '#ddd';
                  }
                },
              },
            }}
          />
        </VictoryChart>
      </View>

      <TouchableOpacity style={styles.printButton}>
        <IconButton icon="printer" color="#fff" size={24} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  header: {
    backgroundColor: '#7f1d1d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  toText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  chartTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chartContainer: {
    height: 300,
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default IncidentReport;
