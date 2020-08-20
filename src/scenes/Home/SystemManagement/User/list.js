import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { GET_ALL_USERS_BUT_SELF } from "../../../../config/constants";
import { SafeAreaView } from "react-navigation";
import { StyleSheet } from "react-native";
import { PaperTopNavigation } from "../../../../navigations/top.navigator";
import {
  Icon,
  Input,
  List,
  ListItem,
  Spinner,
  Layout,
  Button
} from "@ui-kitten/components";

export default class UserListScreen extends Component {
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
    const userId = await AsyncStorage.getItem("id");
    fetch(GET_ALL_USERS_BUT_SELF + userId, {
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

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      description={item.email}
      onPress={() =>
        this.props.navigation.navigate("Detail", {
          userId: item.id,
          userName: item.name
        })
      }
      accessory={this.ForwardIcon}
    />
  );

  ScanIcon = () => <Icon name="camera" />;

  SearchIcon = () => <Icon name="search" />;

  goToDetail = id => {
    this.props.navigation.navigate("Detail", { userId: id });
  };

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <PaperTopNavigation
          title="Users"
          leftIcon="list-outline"
          leftScreen="Drawer"
          rightIcon="plus"
          rightScreen="Create"
          {...this.props}
        />
        <Layout style={styles.mainContainer}>
          <Layout style={{ flexDirection: "row" }}>
            <Input
              value={this.state.terms}
              placeholder="Search..."
              icon={this.SearchIcon}
              size="large"
              onChangeText={terms => this.search(terms)}
              style={styles.inputSearch}
            />
            <Button
              style={{
                height: "90%",
                backgroundColor: "white",
                borderColor: "black"
              }}
              size="large"
              status="danger"
              icon={this.ScanIcon}
              onPress={() => {
                this.props.navigation.navigate("Scan", {
                  callback: this.goToDetail.bind(this)
                });
              }}
            />
          </Layout>
          <List data={this.state.dataFiltered} renderItem={this.renderItem} />
        </Layout>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
    width: "70%",
    marginHorizontal: "5%"
  },
  searchScan: {
    height: "90%",
    backgroundColor: "white",
    borderColor: "black"
  }
});
