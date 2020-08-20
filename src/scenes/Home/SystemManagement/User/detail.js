import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { GET_USER } from '../../../../config/constants';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Card, Text, Spinner, Layout } from '@ui-kitten/components';
import { PaperTopNavigation } from '../../../../navigations/top.navigator';

export default class UserDetailScreen extends Component {  

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
    };
  }

  componentDidMount = () => AsyncStorage.getItem('id').then((id) => {
    fetch(GET_USER + '/' + this.props.route.params.userId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        loading: false,
        data: responseData.result,
      });
      if (responseData.inGroup) {
        this.setState({ inGroup: responseData.inGroup});
      }
      if (responseData.manageGroup) {
        this.setState({ manageGroup: responseData.manageGroup});
      }
    }).catch((error) => {
      console.error(error);
    });
  });

  Header = () => (
    <Layout style={styles.cardHeader}>
      <QRCode value={"" + this.state.data.id} size={250}/>
    </Layout>
  );

  GroupName = () => {
    if (this.state.inGroup) {
      return(
        <Layout style={styles.textRow}>
          <Text style={styles.label}>In Group:</Text>
          <Text style={styles.text}>{this.state.inGroup}</Text>
        </Layout>
      )
    } else if (this.state.manageGroup) {
      return(
        <Layout style={styles.textRow}>
          <Text style={styles.label}>Managing:</Text>
          <Text style={styles.text}>{this.state.manageGroup}</Text>
        </Layout>
      )
    }
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
          title='User Detail'
          leftIcon='arrow-back'
          leftScreen='Back'
          rightIcon='more-vertical'
          params={{ userId: this.props.route.params.userId }}
          menu={true}
          {...this.props}/>
        <Layout style={styles.mainContainer}>
          <Card header={this.Header} footer={this.Footer}>
            <Layout style={{justifyContent: 'center'}}>
              <Layout style={styles.textRow}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.text}>{this.state.data.name}</Text>
              </Layout>
              <Layout style={styles.textRow}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.text}>{this.state.data.email}</Text>
              </Layout>
              <Layout style={styles.textRow}>
                <Text style={styles.label}>Role:</Text>
                <Text style={styles.text}>{this.state.data.role}</Text>
              </Layout>
              {this.GroupName()}
            </Layout>
          </Card>
        </Layout>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    marginVertical: 30,
    alignItems: 'center',
  },
  textRow: {
    flexDirection: 'row', 
    marginVertical: 5
  },
  label: {
    width: '40%', 
    fontSize: 15, 
    fontWeight: '800'
  },
  text: {
    width: '55%', 
    fontSize: 15
  },
});