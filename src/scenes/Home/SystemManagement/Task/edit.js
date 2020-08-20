import React, { Component } from "react";
import { AsyncStorage, Image } from "react-native";
import {
  GET_TASK,
  GET_ALL_USERS_BUT_SELF,
  GET_USERS_BY_GROUP_ID_AS_MANAGER,
  MANAGER,
  URL_TASK,
  USER,
  GET_OLD_TASKS,
  ADMIN,
  NO_ERROR,
  UPDATE_TASK
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
    super(props);
    this.state = {
      loading: true,
      visible: false,
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
    // Get Task
    fetch(GET_TASK + this.props.route.params.taskId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseData => {

        this.setState({
          name: responseData.result.name,
          description: responseData.result.assignedContent,
          start_at: new Date(responseData.result.startAt),
          end_at: new Date(responseData.result.endAt),
          formatted_start: this.formatTime(responseData.result.startAt),
          formatted_end: this.formatTime(responseData.result.endAt),
          assignee: responseData.result.assignee
        });
      })
      .catch(error => {
        console.error(error);
      });

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
        if (responseData.result != null) {
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

  formatTime = (input) => {
    var date = new Date(input);
    return (
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2) + "  |  " +
      ("0" + date.getDate()).slice(-2) +
      "/" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      (date.getFullYear()));
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
      screen: "Edit"
    });
  };

  submitEditing = () =>
    AsyncStorage.getItem("id").then(userId => {
      var data = {};
      data.id = this.props.route.params.taskId;
      data.name = this.state.name;
      data.assignedContent = this.state.description;
      data.assigneeId = this.state.selected_assignee.value;
      if (this.state.selected_old_task.value) {
        data.oldTask = this.state.selected_old_task.value;
      }

      data.start_at = new Date(this.state.start_at).getTime();
      data.end_at = new Date(this.state.end_at).getTime();

      var flag = true;
      
      if (data.start_at < new Date().getTime()) {
        this.setState({
          messageStartAt: "Start Date must be after current date"
        });
        flag = false;
      }
      if (data.end_at <= data.start_at) {
        this.setState({
          messageEndAt: "End Date must be after start date"
        });
        flag = false;
      }

      if (flag) {
        fetch(UPDATE_TASK + userId, {
          method: "PUT",
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
                message: "Updated Successfully",
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

  EditIcon = style => <Icon {...style} name="edit-2" />;

  CalendarIcon = style => <Icon {...style} name="calendar" />;

  render() {
    if (this.state.loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <Spinner size="giant" />
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <PaperTopNavigation
          title="Edit Task"
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
              lable="Description"
              placeholder="Description"
              message={this.state.messageDescription}
              multiline={true}
              value={this.state.description}
              onChangeText={text => this.setState({ description: text })}
            />
            <PaperTimePicker
              label="Start At"
              date={this.state.start_at}
              message={this.state.messageStartAt}
              value={this.state.formatted_start}
              onChange={datetime => this.setState({ start_at: datetime })}
            />
            <PaperTimePicker
              label="End At"
              date={this.state.end_at}
              message={this.state.messageEndAt}
              value={this.state.formatted_end}
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
                    style={{ width: 50, height: 50 }}
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
              icon={this.EditIcon}
              onPress={this.submitEditing}
            >
              Edit
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
    backgroundColor: 'black',
    borderColor: 'black',
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginTop: 20,
    flexDirection: "row-reverse"
  }
});
