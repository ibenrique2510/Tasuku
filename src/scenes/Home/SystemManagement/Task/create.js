import React, { Component } from "react";
import { AsyncStorage, Image } from "react-native";
import {
  NO_ERROR,
  USER,
  MANAGER,
  ADMIN,
  GET_OLD_TASKS,
  GET_ALL_USERS_BUT_SELF,
  GET_USERS_BY_GROUP_ID_AS_MANAGER,
  ADD_TASK
} from "../../../../config/constants";
import { SafeAreaView } from "react-navigation";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Spinner, Layout, Button, Icon, Select } from "@ui-kitten/components";
import { PaperTopNavigation } from "../../../../navigations/top.navigator";
import { PaperInput } from "../../../../components/input.component";
import { PaperModal } from "../../../../components/modal.component";
import { PaperTimePicker } from "../../../../components/timepicker.component";

export default class CreateScreen extends Component {
  constructor(props) {
    let current_datetime = new Date();
    let formatted_date =
      ("0" + current_datetime.getHours()).slice(-2) +
      ":" +
      ("0" + current_datetime.getMinutes()).slice(-2) +
      "  |  " +
      ("0" + current_datetime.getDate()).slice(-2) +
      "/" +
      ("0" + (current_datetime.getMonth() + 1)).slice(-2) +
      "/" +
      current_datetime.getFullYear();

    super(props);
    this.state = {
      loading: true,
      visible: false,
      start_at: current_datetime,
      end_at: current_datetime,
      formatted_date: formatted_date,
      selected_assignee: { value: "" },
      selected_old_task: { value: "" }
    };
  }

  componentDidMount = () => {
    this.FetchData();
  };

  FetchData = async () => {
    const userId = await AsyncStorage.getItem("id");
    const name = await AsyncStorage.getItem("name");
    const role = await AsyncStorage.getItem("role");
    if (role != USER) {
      if (role === ADMIN) {
        // Get info of Groups
        fetch(GET_ALL_USERS_BUT_SELF + userId, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(responseData => {
            var assignees = [];
            // Push members to select
            if (responseData.result.length > 0) {
              responseData.result.forEach(assignee => {
                assignees.push({
                  value: assignee.id,
                  text: assignee.name
                });
              });
            }
            this.setState({
              assignees: assignees,
              selected_assignee: assignees[0]
            });
          })
          .catch(error => {
            console.error(error);
          });
      }
      if (role === MANAGER) {
        // Get info of Groups
        fetch(GET_USERS_BY_GROUP_ID_AS_MANAGER + userId, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(responseData => {
            var assignees = [];
            // Push members to select
            if (responseData.result.length > 0) {
              responseData.result.forEach(assignee => {
                assignees.push({
                  value: assignee.id,
                  text: assignee.name
                });
              });
            }
            this.setState({
              assignees: assignees,
              selected_assignee: assignees[0]
            });
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
    // fetch old tasks
    fetch(GET_OLD_TASKS + userId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseData => {
        var old_tasks = [];
        // Push members to select
        if (responseData.result) {
          if (responseData.result.length > 0) {
            responseData.result.forEach(task => {
              old_tasks.push({
                value: task.id,
                text: task.name
              });
            });
          }
        }
        this.setState({
          loading: false,
          old_tasks: old_tasks,
          role: role
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  setSelectedAssignee = id => {
    this.state.assignees.forEach((assignee, index) => {
      if (assignee.value == id) {
        this.setState({ selected_assignee: this.state.assignees[index] });
      }
    });
  };

  scanQR = () => {
    this.props.navigation.navigate("Scan", {
      callback: this.setSelectedAssignee.bind(this),
      screen: "Create"
    });
  };

  submitCreating = () =>
    AsyncStorage.getItem("id").then(userId => {
      var data = {};
      var start = new Date(this.state.start_at).getTime();
      var end = new Date(this.state.end_at).getTime();
      var flag = true;
      if (start <= new Date().getTime()) {
        this.setState({
          messageStartAt: "Start Date must be after current date"
        });
        flag = false;
      }
      if (end <= start) {
        this.setState({
          messageEndAt: "End Date must be after start date"
        });
        flag = false;
      }

      if (flag) {
        data.name = this.state.name;
        data.assignedContent = this.state.description;
        data.assigneeId = this.state.selected_assignee.value;
        if (this.state.selected_old_task.value) {
          data.oldTask = this.state.selected_old_task.value;
        }
        data.startAt = start;
        data.endAt = end;

        fetch(ADD_TASK + userId, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(responseData => {
            if (
              responseData.error === NO_ERROR &&
              responseData.result != null &&
              responseData.success
            ) {
              this.setState({
                validation: true,
                message: "Added Successfully",
                visible: !this.state.visible,
                messageName: ""
              });
            } else {
              this.setState({
                visible: true,
                validation: false,
                message: responseData.message
              });
            }
            // if (responseData.hasOwnProperty("message")) {
            //   this.setState({
            //     message: responseData.message,
            //     visible: !this.state.visible
            //   });
            //   if (responseData.hasOwnProperty("errors")) {
            //     console.log(responseData.errors);
            //     this.setState({ validation: false });
            //     responseData.errors.hasOwnProperty("name")
            //       ? this.setState({ messageName: responseData.errors.name })
            //       : this.setState({ messageName: "" });
            //     responseData.errors.hasOwnProperty("description")
            //       ? this.setState({
            //           messageDescription: responseData.errors.description
            //         })
            //       : this.setState({ messageDescription: "" });
            //   } else {
            //     this.setState({
            //       validation: true
            //     });
            //   }
            // }
          })
          .catch(error => {
            console.error(error);
          });
      }
    });

  PlusIcon = style => <Icon {...style} name="plus" />;

  CalendarIcon = style => <Icon {...style} name="calendar" />;

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
          title="Create Task"
          leftIcon="arrow-back"
          leftScreen="Back"
          {...this.props}
        />
        <PaperModal
          onPress={() => this.setState({ visible: !this.state.visible })}
          visible={this.state.visible}
          message={this.state.message}
          validation={this.state.validation}
          navigation={this.props.navigation}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Layout style={styles.mainContainer}>
            <PaperInput
              lable="Name"
              placeholder="Name"
              message={this.state.messageName}
              value={this.state.name}
              onChangeText={text => this.setState({ name: text })}
            />
            <PaperInput
              lable="Assigned Content"
              placeholder="Assigned Content"
              message={this.state.messageDescription}
              multiline={true}
              value={this.state.description}
              onChangeText={text => this.setState({ description: text })}
            />
            <PaperTimePicker
              label="Start At"
              date={this.state.start_at}
              message={this.state.messageStartAt}
              value={this.state.formatted_date}
              onChange={datetime => this.setState({ start_at: datetime })}
            />
            <PaperTimePicker
              label="End At"
              date={this.state.end_at}
              message={this.state.messageEndAt}
              value={this.state.formatted_date}
              onChange={datetime => this.setState({ end_at: datetime })}
            />
            <Select
              label="Old Task"
              placeholder="Select Old Task"
              data={this.state.old_tasks}
              selectedOption={this.state.selected_old_task}
              onSelect={task => this.setState({ selected_old_task: task })}
              style={{ marginBottom: 15 }}
            />
            {this.state.role != USER ? (
              <Layout style={{ flexDirection: "row" }}>
                <Select
                  label="Assignee"
                  placeholder="Select Assignee"
                  data={this.state.assignees}
                  selectedOption={this.state.selected_assignee}
                  onSelect={user => this.setState({ selected_assignee: user })}
                  style={{ marginRight: 20, flexDirection: "column", flex: 1 }}
                />
                <TouchableOpacity
                  onPress={this.scanQR}
                  style={{ marginTop: 15 }}
                >
                  <Image
                    source={require("../../../../assets/qrcodescan.png")}
                    style={{ width: 35, height: 35, marginTop: 6 }}
                  />
                </TouchableOpacity>
              </Layout>
            ) : (
              <></>
            )}
            <Button
              style={styles.button}
              size="large"
              status="success"
              icon={this.PlusIcon}
              onPress={this.submitCreating}
            >
              Create
            </Button>
          </Layout>
        </ScrollView>
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
    margin: 40
  },
  button: {
    backgroundColor: "black",
    borderColor: "black",
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginTop: 20,
    flexDirection: "row-reverse"
  }
});
