import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Button, View } from 'react-native';

import ExampleHomeScreen from './Screen/ExampleHomeScreen';
import CaseListScreen from './Screen/CaseListScreen';
import CaseReportDetails from './Screen/CaseReportDetails';
import BlotterList from './Screen/BlotterList';
import Notification from './Screen/Notification';
import Login from './Screen/Login';
import Blotter from './Screen/Blotter';
import BlotterCalendar from './Screen/BlotterCalendar';
import IncidentReport from './Screen/IncidentReport';
import Transactions from './Screen/transact';

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ExampleHome">
        <Stack.Screen name="ExampleHome" component={ExampleHomeScreen} />
        <Stack.Screen name="CaseList" component={CaseListScreen} />
        <Stack.Screen name="CaseReport" component={CaseReportDetails} />
        <Stack.Screen name="BlotterList" component={BlotterList} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Blotter" component={Blotter} />
        <Stack.Screen name="BlotterCalendar" component={BlotterCalendar} />
        <Stack.Screen name="IncidentReport" component={IncidentReport} />
        <Stack.Screen name="Transactions" component={Transactions} />
      </Stack.Navigator>

  </NavigationContainer>
  );
}
