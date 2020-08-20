import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import {
  GET_TASKS,
  GET_ASSIGNEES,
  USER,
  WAITING_FOR_ACCEPT,
  DECLINED,
  NOT_STARTED_YET,
  ON_GOING,
  OVERDUE,
  COMMITED,
  FINISHED_CONFIRMED,
  CANNOT_FINISH_CONFIRMED
} from "../../../../config/constants";
import { SafeAreaView, ScrollView } from "react-navigation";
import { StyleSheet } from "react-native";
import { PaperTopNavigation } from "../../../../navigations/top.navigator";
import {
  Icon,
  Input,
  Spinner,
  Layout,
  Select,
  Datepicker,
  Autocomplete
} from "@ui-kitten/components";
import { PaperListStatus } from "../../../../components/list-task.component";

export default class ListScreen extends Component {
  constructor(props) {
    let statusSource = [
      { text: "Waiting for Approval", value: WAITING_FOR_ACCEPT },
      { text: "Declined", value: DECLINED },
      { text: "Not Started", value: NOT_STARTED_YET },
      { text: "On-going", value: ON_GOING },
      { text: "Committed", value: COMMITED },
      { text: "Finished", value: FINISHED_CONFIRMED },
      { text: "Cannot Finish", value: CANNOT_FINISH_CONFIRMED },
      { text: "Overdue", value: OVERDUE }
    ];

    super(props);
    this.state = {
      loading: true,
      assignee: { title: "" },
      terms: "",
      terms_assignee: "",
      status: statusSource,
      start_date: null,
      end_date: null
    };
    this.statusSource = statusSource;
    this.dataSource = [];
    this.assigneesSource = [];
  }

  componentDidMount = () => {
    this.FetchData();
    this.props.navigation.addListener('focus', () => {
      this.FetchData();
    });
  };

  FetchData = async () => {
    const userId = await AsyncStorage.getItem("id");
    const name = await AsyncStorage.getItem("name");
    const role = await AsyncStorage.getItem("role");
    fetch(GET_TASKS + userId, {
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

    this.setState({ userName: name, role: role });

    if (role != USER) {
      var data = {};
      data.role = role;
      data.name = name;
      data.id = userId;

      // Get users for autocomplete
      fetch(GET_ASSIGNEES, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(responseData => {
          var users = [];
          if (responseData.result.length > 0) {
            responseData.result.forEach(user => {
              users.push({ title: user.name });
            });
          }
          this.setState({ assigneesFiltered: users }, () => {
            this.assigneesSource = users;
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  SearchIcon = () => <Icon name="search-outline" />;

  CalendarIcon = () => <Icon name="calendar" />;

  filtered = (assignee, terms, status, start_date, end_date) => {
    const dataFiltered = this.dataSource.filter(item => {

      const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
      const assigneeData = item.assignee
        ? item.assignee.toUpperCase()
        : "".toUpperCase();

      let assignee_bool =
        assigneeData.indexOf(assignee.title.toUpperCase()) > -1;
      let terms_bool = itemData.indexOf(terms.toUpperCase()) > -1;

      let status_bool = status.findIndex(i => i.value == item.status) > -1;
      let start_date_bool = start_date ? (item.startAt > Date.parse(start_date)) : true;
      let end_date_bool = end_date ? (item.endAt < (Date.parse(end_date) + 86400000)) : true;

      return (
        assignee_bool &&
        terms_bool &&
        status_bool &&
        start_date_bool &&
        end_date_bool
      );
    });

    this.setState({
      terms_assignee: assignee.title,
      assignee: assignee,
      terms: terms,
      status: status,
      start_date: start_date,
      end_date: end_date,
      dataFiltered: dataFiltered
    });
  };

  filteredAssignee = terms => {
    const dataFiltered = this.assigneesSource.filter(item => {
      const itemData = item.title ? item.title.toUpperCase() : "".toUpperCase();
      return itemData.indexOf(terms.toUpperCase()) > -1;
    });

    this.setState({
      terms_assignee: terms,
      assigneesFiltered: dataFiltered
    });

    if (terms == "") {
      this.filtered(
        { title: "" },
        this.state.terms,
        this.state.status,
        this.state.start_date,
        this.state.end_date
      );
    }
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
          title="List Task"
          leftIcon="list-outline"
          leftScreen="Drawer"
          rightIcon="plus"
          rightScreen="Create"
          {...this.props}
        />

        <Layout style={styles.mainContainer}>
          <Select
            placeholder="Select Status"
            data={this.statusSource}
            multiSelect={true}
            size="medium"
            selectedOption={this.state.status}
            onSelect={status =>
              this.filtered(
                this.state.assignee,
                this.state.terms,
                status,
                this.state.start_date,
                this.state.end_date
              )
            }
            style={styles.inputFiltered}
          />
          <Layout
            style={{
              flexDirection: "row",
              marginTop: "1%",
              justifyContent: "space-between"
            }}
          >
            <Datepicker
              placeholder="From Date"
              size="medium"
              style={[
                styles.inputFiltered,
                { width: "45%", marginRight: "0%", paddingRight: "1%" }
              ]}
              date={this.state.start_date}
              onSelect={start_date =>
                this.filtered(
                  this.state.assignee,
                  this.state.terms,
                  this.state.status,
                  start_date,
                  this.state.end_date
                )
              }
              icon={this.CalendarIcon}
            />
            <Datepicker
              placeholder="To Date"
              size="medium"
              style={[
                styles.inputFiltered,
                { width: "45%", marginLeft: "0%", paddingLeft: "1%" }
              ]}
              date={this.state.end_date}
              onSelect={end_date =>
                this.filtered(
                  this.state.assignee,
                  this.state.terms,
                  this.state.status,
                  this.state.start_date,
                  end_date
                )
              }
              icon={this.CalendarIcon}
            />
          </Layout>
          {this.state.role != USER ? (
            <Autocomplete
              placeholder="Assignee"
              value={this.state.terms_assignee}
              size="medium"
              style={styles.inputFiltered}
              data={this.state.assigneesFiltered}
              onSelect={assignee =>
                this.filtered(
                  assignee,
                  this.state.terms,
                  this.state.status,
                  this.state.start_date,
                  this.state.end_date
                )
              }
              onChangeText={terms_assignee =>
                this.filteredAssignee(terms_assignee)
              }
            />
          ) : (
            <></>
          )}
          <Input
            value={this.state.terms}
            size="medium"
            placeholder="Search..."
            icon={this.SearchIcon}
            autoCapitalize="none"
            onChangeText={terms =>
              this.filtered(
                this.state.assignee,
                terms,
                this.state.status,
                this.state.start_date,
                this.state.end_date
              )
            }
            style={styles.inputFiltered}
          />
          <PaperListStatus
            data={this.state.dataFiltered}
            navigation={this.props.navigation}
            userName={this.state.userName}
          />
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
  inputFiltered: {
    marginHorizontal: "5%",
    marginVertical: "0.5%"
  }
});
