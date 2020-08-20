import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { GET_NOTI_BY_USER, READ_NOTI } from '../../../../config/constants';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { PaperTopNavigation } from '../../../../navigations/top.navigator';
import { List, ListItem, Spinner, Layout } from '@ui-kitten/components';

export default class NotificationScreen extends Component {  
  
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
    };
  }

  componentDidMount = () => {
    this.FetchData();
  };

  FetchData = async () => {
    const userId = await AsyncStorage.getItem('id');
    fetch(GET_NOTI_BY_USER + userId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        data: responseData.result,
        loading: false,
      });
      // console.log(responseData.result)
    }).catch((error) => {
      console.error(error);
    });
  }

  onClickNotification = (notiId) => {
    fetch(READ_NOTI + notiId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    this.FetchData();
  }

  formatTime = (createdAt) => {
    var date = new Date(createdAt);
    return date.getHours() + ":" + date.getMinutes() + "  |  " +  date.getDate() + "/" + (date.getMonth() + 1)  + "/" + date.getFullYear();
  }

  renderItem = ({ item }) => {
    return (
    <ListItem 
      title={'' + item.details}
      description={this.formatTime(item.createdAt)}
      onPress={() => this.onClickNotification(item.id)}
      titleStyle={(item.isRead) ? {color: 'gray'} : {color: 'black'}}
    />)
    ;
  }

  render() {
    if (this.state.loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <Spinner size='giant' style={{borderColor: 'black', backgroundColor: 'black'}}/>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <PaperTopNavigation
          title='Notifications'
          leftIcon='list-outline'
          leftScreen='Drawer'
          {...this.props}/>
        <Layout style={styles.mainContainer}>
          <List data={this.state.data} renderItem={this.renderItem} />
        </Layout>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
});