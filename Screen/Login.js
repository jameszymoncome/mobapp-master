import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

export const saveAuthData = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
    console.log(`Data saved under key: ${key}`);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

const Login = () => {
  const [userid, setUserID] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (userid.trim()) {
      try {
        await saveAuthData('userid', userid);
        Alert.alert('Login Successful', `Welcome, ${userid}!`);
        navigation.replace('Notification'); // Navigate to Notification screen
      } catch (error) {
        console.error('Error during login:', error);
      }
    } else {
      Alert.alert('Error', 'Please enter a User ID.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter User ID:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="UserID"
        value={userid}
        onChangeText={setUserID}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default Login;
