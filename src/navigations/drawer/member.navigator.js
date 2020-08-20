import React from 'react';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { SafeAreaView } from 'react-navigation';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Drawer as UIKittenDrawer, DrawerHeaderFooter, Icon, Button, Layout } from '@ui-kitten/components';
import NotificationScreen from '../../scenes/Home/Home/Notification/list';
import ProfileScreen from '../../scenes/Home/Home/Profile/detail';
import TaskNavigator from '../task.navigator';

const Drawer = createDrawerNavigator();

const deleteToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
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

  const HeaderManagement = () => (
    <DrawerHeaderFooter
      title='MANAGING'
      titleStyle={{fontWeight: '800', fontSize: 18, marginTop: 20}}
    />
  );

  const drawerManagement = [
    { title: 'Task', icon: TasksIcon },
  ];

  const onSelectManagement = (index) => {
    navigation.navigate(state.routeNames[index + drawerHome.length]);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout>
        <UIKittenDrawer
          data={drawerHome}
          header={HeaderHome}
          onSelect={onSelectHome}
          appearance='noDivider'
        />
        <UIKittenDrawer
          data={drawerManagement}
          header={HeaderManagement}
          onSelect={onSelectManagement}
          appearance='noDivider'
        />
      </Layout>
      <Button 
        style={{flexDirection: 'row-reverse', margin: 20, backgroundColor: "black", borderColor: "black"}} 
        size='large'
        status='danger' 
        icon={LogoutIcon} 
        onPress={deleteToken}
      >Sign Out</Button>
    </SafeAreaView>
  );
};

export const MemberDrawerNavigator = () => (
  <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>} initialRouteName="Profile">
    <Drawer.Screen name='Profile' component={ProfileScreen}/>
    <Drawer.Screen name='Notification' component={NotificationScreen}/>
    <Drawer.Screen name='Task' component={TaskNavigator}/>
  </Drawer.Navigator>
);