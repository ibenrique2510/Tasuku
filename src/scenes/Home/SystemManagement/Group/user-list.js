import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { GET_USERS_BY_GROUP_ID_ADMIN, GET_USERS_BY_GROUP_ID_MANAGER, ADMIN, URL_USER, MANAGER } from '../../../../config/constants';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { PaperTopNavigation } from '../../../../navigations/top.navigator';
import { Icon, Input, List, ListItem, Spinner, Layout } from '@ui-kitten/components';

export default class ListScreen extends Component {  

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      terms: '',
    };
    this.dataSource = [];
  }

  componentDidMount = () => {
    this.FetchData();
  };

  FetchData = async () => {
    const userId = await AsyncStorage.getItem('id');
    const role = await AsyncStorage.getItem('role');
    if (role == MANAGER) {
      fetch(GET_USERS_BY_GROUP_ID_MANAGER + '/' + userId, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState(
          {
            dataFiltered: responseData.result,
            loading: false,
            role: role,
          },() => {
            this.dataSource = responseData.result;
          }
        );
      }).catch((error) => {
        console.error(error);
      })
    } else if (role == ADMIN) {
      fetch(GET_USERS_BY_GROUP_ID_ADMIN + '/' + this.props.route.params.groupId, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState(
          {
            dataFiltered: responseData.result,
            loading: false,
            role: role,
          },() => {
            this.dataSource = responseData.result;
          }
        );
      }).catch((error) => {
        console.error(error);
      })
    }
  }

  ForwardIcon = () => (
    <Icon name='arrow-ios-forward' width={20} height={20} fill='#8F9BB3'/>
  );

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      description={item.email}
      onPress={() => this.props.navigation.navigate('Detail', { userId: item.id})}
      accessory={this.ForwardIcon}
    />
  );

  SearchIcon = () => (
    <Icon name='search-outline'/>
  )

  search = (terms) => {
    const dataFiltered = this.dataSource.filter(function(item) {
      const itemData = item.name ? item.name.toUpperCase() : '' . toUpperCase();
      const textData = terms.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      terms: terms,
      dataFiltered: dataFiltered,
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <Spinner size='giant'
          style={{ borderColor: "black", backgroundColor: "black" }}/>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        {this.state.role == ADMIN
          ?
          <PaperTopNavigation
            title='List User'
            leftIcon='arrow-back'
            leftScreen='Back'
            rightIcon='edit-2'
            rightScreen='Edit'
            params={{ groupId: this.props.route.params.groupId }}
            {...this.props}/>
          :
          <PaperTopNavigation
            title='List User'
            leftIcon='list-outline'
            leftScreen='Drawer'
            {...this.props}/>
        }
        <Layout style={styles.mainContainer}>
          <Input
            value={this.state.terms}
            placeholder='Search...'
            icon={this.SearchIcon}
            size='large'
            onChangeText={terms => this.search(terms)}
            style={styles.inputSearch}
          />
          <List data={this.state.dataFiltered} renderItem={this.renderItem} />
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
  inputSearch: {
    marginHorizontal: '5%',
    marginTop: '2%',
  },
});