import React, { Component } from 'react';
import { ADMIN } from '../config/constants'
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from '../scenes/Home/SystemManagement/Group/list';
import ListUserScreen from '../scenes/Home/SystemManagement/Group/user-list';
import DetailScreen from '../scenes/Home/SystemManagement/Group/user-detail';
import EditScreen from '../scenes/Home/SystemManagement/Group/edit';
import CreateScreen from '../scenes/Home/SystemManagement/Group/create';
import { AsyncStorage } from 'react-native';

const Stack = createStackNavigator();

const Navigator = ({ role }) => (
  <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={role == ADMIN ? 'List' : 'ListUser'}>
    <Stack.Screen name='List' component={ListScreen} />
    <Stack.Screen name='ListUser' component={ListUserScreen} />
    <Stack.Screen name='Detail' component={DetailScreen} />
    <Stack.Screen name='Edit' component={EditScreen} />
    <Stack.Screen name='Create' component={CreateScreen} />
  </Stack.Navigator>
)

export default class GroupNavigator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  componentDidMount = () => AsyncStorage.getItem('role').then((role) => {
    this.setState({
      role: role,
      loading: false
    })
  });

  render() {
    if (this.state.loading) {
      return (
        <></>
      );
    }
    return (
      <Navigator navigation={this.props.navigation} role={this.state.role}/>
    );
  }
};