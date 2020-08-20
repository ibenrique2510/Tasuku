import React from 'react';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { SafeAreaView } from 'react-navigation';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Drawer as UIKittenDrawer, DrawerHeaderFooter, Icon, Button } from '@ui-kitten/components';
import NotificationScreen from '../../scenes/Home/Home/Notification/list';
import ProfileScreen from '../../scenes/Home/Home/Profile/detail';
import TaskNavigator from '../task.navigator';
import UserNavigator from '../user.navigator';
import GroupNavigator from '../group.navigator';

const Drawer = createDrawerNavigator();

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem('id');
    await AsyncStorage.removeItem('name');
    await AsyncStorage.removeItem('role');
    Actions.login();
  } catch (error) {
    console.error(error);
  }
};

const DrawerContent = ({ navigation, state }) => {

  const ProfileIcon = () => (
    <Icon name='file-text'/>
  );

  const NotificationIcon = () => (
    <Icon name='bell'/>
  );

  const TasksIcon = () => (
    <Icon name='clipboard'/>
  );

  const UsersIcon = () => (
    <Icon name='person'/>
  );

  const GroupsIcon = () => (
    <Icon name='people'/>
  );

  const LogoutIcon = () => (
    <Icon name='arrow-circle-left' fill='#FFFFFF'/>
  );

  const HeaderHome = () => (
    <DrawerHeaderFooter
      title='PROFILE'
      titleStyle={{fontWeight: '800', fontSize: 18, marginTop: 20}}
    />
  );

  const drawerHome = [
    { title: 'My Profile', icon: ProfileIcon },
    { title: 'Notifications', icon: NotificationIcon },
  ];

  const onSelectHome = (index) => {
    navigation.navigate(state.routeNames[index]);
  };

  const HeaderSystemManagement = () => (
    <DrawerHeaderFooter
      title='MANAGING'
      titleStyle={{fontWeight: '800', fontSize: 18, marginTop: 20}}
    />
  );

  const drawerSystemManagement = [
    { title: 'Tasks', icon: TasksIcon },
    { title: 'Users', icon: UsersIcon },
    { title: 'Groups', icon: GroupsIcon },
  ];

  const onSelectSystemManagement = (index) => {
    navigation.navigate(state.routeNames[index + drawerHome.length]);
  };

  return (
    <SafeAreaView>
      <UIKittenDrawer
        data={drawerHome}
        header={HeaderHome}
        onSelect={onSelectHome}
        appearance='noDivider'
      />
      <UIKittenDrawer
        data={drawerSystemManagement}
        header={HeaderSystemManagement}
        onSelect={onSelectSystemManagement}
        appearance='noDivider'
      />
      <Button 
        style={{flexDirection: 'row-reverse', margin: 20, backgroundColor: "black", borderColor: "black"}} 
        size='large'
        status='danger' 
        icon={LogoutIcon} 
        onPress={clearAsyncStorage}
      >Sign Out</Button>
    </SafeAreaView>
  );
};

export const AdminDrawerNavigator = () => (
  <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>} initialRouteName="Profile">
    <Drawer.Screen name='Profile' component={ProfileScreen}/>
    <Drawer.Screen name='Notification' component={NotificationScreen}/>
    <Drawer.Screen name='Task' component={TaskNavigator}/>
    <Drawer.Screen name='User' component={UserNavigator}/>
    <Drawer.Screen name='Group' component={GroupNavigator}/>
  </Drawer.Navigator>
);