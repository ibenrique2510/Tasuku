import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { GET_GROUPS } from "../../../../config/constants";
import { SafeAreaView } from "react-navigation";
import { StyleSheet } from "react-native";
import { PaperTopNavigation } from "../../../../navigations/top.navigator";
import {
  Icon,
  Input,
  List,
  ListItem,
  Spinner,
  Layout
} from "@ui-kitten/components";

export default class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      terms: ""
    };
    this.dataSource = [];
  }

  componentDidMount = () => {
    this.FetchData();
    this.props.navigation.addListener('focus', () => {
      this.FetchData();
    });
  };

  FetchData = async () => {
    fetch(GET_GROUPS, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseData => {
        this.setState(
          {
            dataFiltered: responseData.result,
            loading: false
          },
          () => {
            this.dataSource = responseData.result;
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  ForwardIcon = () => (
    <Icon name="arrow-ios-forward" width={20} height={20} fill="#8F9BB3" />
  );

  formatTime = (createdAt) => {
    var date = new Date(createdAt);
    return date.getHours() + ":" + date.getMinutes() + "  |  " +  date.getDate() + "/" + (date.getMonth() + 1)  + "/" + date.getFullYear();
  }

  renderItem = ({ item }) => (
    <ListItem
      title={item.name + "  -  Managed by " + item.managerName}
      description={"Created At: " + this.formatTime(item.createdAt)}
      onPress={() =>
        this.props.navigation.navigate("ListUser", { groupId: item.id })
      }
      accessory={this.ForwardIcon}
    />
  );

  SearchIcon = () => <Icon name="search-outline" />;

  search = terms => {
    const dataFiltered = this.dataSource.filter(function(item) {
      const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
      const textData = terms.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      terms: terms,
      dataFiltered: dataFiltered
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <Spinner
            size="giant"
            style={{ borderColor: "black", backgroundColor: "black" }}
          />
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <PaperTopNavigation
          title="Groups"
          leftIcon="list-outline"
          leftScreen="Drawer"
          rightIcon="plus"
          rightScreen="Create"
          {...this.props}
        />
        <Layout style={styles.mainContainer}>
          <Input
            value={this.state.terms}
            placeholder="Search..."
            icon={this.SearchIcon}
            size="large"
            onChangeText={terms => this.search(terms)}
            style={styles.inputSearch}
          />
          <List data={this.state.dataFiltered} renderItem={this.renderItem} />
        </Layout>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white"
  },
  inputSearch: {
    marginHorizontal: "5%",
    marginTop: "2%"
  }
});
