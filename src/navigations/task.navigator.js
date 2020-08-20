import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from '../scenes/Home/SystemManagement/Task/list';
import DetailScreen from '../scenes/Home/SystemManagement/Task/detail';
import EditScreen from '../scenes/Home/SystemManagement/Task/edit';
import CreateScreen from '../scenes/Home/SystemManagement/Task/create';
import ScanScreen from '../scenes/Home/SystemManagement/Task/scan';
import CommitScreen from '../scenes/Home/SystemManagement/Task/commit';
import EvaluateScreen from '../scenes/Home/SystemManagement/Task/evaluate';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Edit" component={EditScreen} />
      <Stack.Screen name="Create" component={CreateScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="Commit" component={CommitScreen} />
      <Stack.Screen name="Evaluate" component={EvaluateScreen} />
    </Stack.Navigator>
  );
}

export default class TaskNavigator extends Component {

  render() {
    return (
      <Navigator navigation={this.props.navigation} />
    );
  }
};