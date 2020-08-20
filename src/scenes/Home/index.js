import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { AdminDrawerNavigator } from '../../navigations/drawer/admin.navigator';
import { ManagerDrawerNavigator } from '../../navigations/drawer/manager.navigator';
import { MemberDrawerNavigator } from '../../navigations/drawer/member.navigator';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-navigation';
import { Spinner } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { ADMIN, MANAGER } from '../../config/constants'

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      role: '',
    };
  }

  componentDidMount = () => AsyncStorage.getItem('role').then((role) => {
    this.setState({
      role: role,
      loading: false,
    });
  });

  render() {
    if (this.state.loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <Spinner size='giant' style={{borderColor: 'black', backgroundColor: 'black'}}/>
        </SafeAreaView>
      );
    }
    if (this.state.role == ADMIN) {
      return (
        <NavigationContainer>
          <AdminDrawerNavigator navigation={this.props.navigation} />
        </NavigationContainer>
      );
    } else if (this.state.role == MANAGER) {
      return (
        <NavigationContainer>
          <ManagerDrawerNavigator navigation={this.props.navigation} />
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <MemberDrawerNavigator navigation={this.props.navigation} />
        </NavigationContainer>
      );
    }
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});