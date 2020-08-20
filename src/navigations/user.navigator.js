import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from '../scenes/Home/SystemManagement/User/list';
import DetailScreen from '../scenes/Home/SystemManagement/User/detail';
import EditScreen from '../scenes/Home/SystemManagement/User/edit';
import CreateScreen from '../scenes/Home/SystemManagement/User/create';
import ScanScreen from '../scenes/Home/SystemManagement/User/scan';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Edit" component={EditScreen} />
      <Stack.Screen name="Create" component={CreateScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
    </Stack.Navigator>
  );
}

export default class UserNavigator extends Component {

  render() {
    return (
      <Navigator navigation={this.props.navigation} />
    );
  }
};