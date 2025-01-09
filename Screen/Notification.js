import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://brgyapp.lesterintheclouds.com'; // Base URL for the backend

const Notification = () => {
  const [filter, setFilter] = useState('Latest');
  const [userid, setUserID] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch UserID from SecureStore
  const fetchUserID = async () => {
    try {
      const storedUserID = await SecureStore.getItemAsync('userid');
      if (storedUserID) {
        setUserID(storedUserID);
        fetchNotifications(storedUserID);
      } else {
        Alert.alert('Error', 'UserID not found.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching UserID:', error);
      setLoading(false);
    }
  };

  // Fetch notifications for the given userid
  const fetchNotifications = async (userID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_notifications.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: userID }),
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
      } else {
        Alert.alert('Error', 'No notifications found.');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Unable to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserID();
  }, []);

  // Apply filtering logic (currently supports 'Latest' and 'Oldest')
  const applyFilter = (criteria) => {
    setFilter(criteria);
    if (criteria === 'Latest') {
      setNotifications((prev) =>
        [...prev].sort((a, b) => new Date(b.dateOccured) - new Date(a.dateOccured))
      );
    } else if (criteria === 'Oldest') {
      setNotifications((prev) =>
        [...prev].sort((a, b) => new Date(a.dateOccured) - new Date(b.dateOccured))
      );
    }
  };

  // Render each notification item
  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Image
        source={item.avatar ? { uri: item.avatar } : require('../assets/avatar.png')}
        style={styles.avatar}
      />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>
          <Text style={styles.notificationType}>Incidents: </Text>
          {item.incidentNames && item.incidentNames.length > 0
            ? item.incidentNames.join(', ')
            : 'Unknown'}
        </Text>
        <Text style={styles.notificationDetails}>
          Case ID: {item.caseID} - Status: {item.status}
        </Text>
        <Text style={styles.notificationDate}>
          Date Occurred: {item.dateOccured}
        </Text>
        <Text style={styles.notificationProcessed}>
          Processed By: {item.processedBy}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="menu" size={30} color="#fff" />
        <Text style={styles.headerTitle}>NOTIFICATION</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#800000" style={styles.loader} />
      ) : (
        <>
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>Filter by:</Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() =>
                applyFilter(filter === 'Latest' ? 'Oldest' : 'Latest')
              }
            >
              <Text style={styles.filterButtonText}>{filter}</Text>
              <Icon name="arrow-drop-down" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.caseID}
            style={styles.notificationList}
            ListEmptyComponent={() => (
              <Text style={styles.noDataText}>No notifications available.</Text>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#800000',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
  },
  filterText: {
    fontSize: 16,
    color: '#000',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#800000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
    marginRight: 5,
  },
  notificationList: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#000',
  },
  notificationType: {
    fontWeight: 'bold',
    color: '#800000',
  },
  notificationDetails: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  notificationDate: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
  notificationProcessed: {
    marginTop: 2,
    fontSize: 12,
    color: '#555',
  },
  noDataText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
});

export default Notification;
