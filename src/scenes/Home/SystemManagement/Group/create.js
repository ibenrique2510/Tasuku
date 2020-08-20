import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import {
  NO_ERROR,
  ADD_GROUP,
  GET_NO_GROUP_MANAGERS,
  GET_NO_GROUP_USERS
} from "../../../../config/constants";
import { SafeAreaView } from "react-navigation";
import { StyleSheet } from "react-native";
import { Spinner, Layout, Button, Icon } from "@ui-kitten/components";
import { PaperTopNavigation } from "../../../../navigations/top.navigator";
import { PaperInput } from "../../../../components/input.component";
import { PaperSelect } from "../../../../components/select.component";
import { PaperModal } from "../../../../components/modal.component";

export default class CreateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      name: "",
      selected_members: []
    };
  }

  componentDidMount = () => {
    this.FetchData();
  };

  FetchData = async () => {
    var list_managers = [];
    var list_members = [];

    // Get list of manager not manage any group
    fetch(GET_NO_GROUP_MANAGERS, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseData => {
        // Push manager not manage any group to select
        if (responseData.result.length > 0) {
          responseData.result.forEach(manager => {
            list_managers.push({
              value: manager.id,
              text: manager.name
            });
          });
        }
        this.setState({
          list_managers: list_managers,
          selected_manager: list_managers[0]
        });
      })
      .catch(error => {
        console.error(error);
      });

    // Get list of member not belong to any group
    fetch(GET_NO_GROUP_USERS, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseData => {
        // Push member not belong to any group to select
        var members_availabled = [];
        if (responseData.result.length > 0) {
          responseData.result.forEach(member => {
            members_availabled.push({
              value: member.id,
              text: member.name
            });
          });
        }
        this.setState({
          list_members: list_members.concat(members_availabled),
          loading: false
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  submitCreating = () =>
    AsyncStorage.getItem("id").then(userId => {
      if (this.state.name.length <= 0) {
        this.setState({
          messageName: "Name cannot be empty"
        });
      } else {
        var data = {};
        data.name = this.state.name;
        data.managerId = this.state.selected_manager.value;
        data.users = [];
        if (this.state.selected_members.length > 0) {
          this.state.selected_members.forEach(member => {
            data.users.push(member.value);
          });
        }
        console.log(data);
        fetch(ADD_GROUP + "/" + userId, {
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
            // if (responseData.hasOwnProperty('message')) {
            //   this.setState({
            //     message: responseData.message,
            //     visible: !this.state.visible,
            //     messageName: '',
            //   });
            //   if (responseData.hasOwnProperty('errors')) {
            //     this.setState({validation: false});
            //     responseData.errors.hasOwnProperty('name')
            //       ? this.setState({messageName: responseData.errors.name})
            //       : this.setState({messageName: ''})
            //   } else {
            //     this.setState({validation: true})
            //   }
            // }
          })
          .catch(error => {
            console.error(error);
          });
      }
    });

  PlusIcon = style => <Icon {...style} name="plus" />;

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
          title="Create Group"
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
          title="Back to List"
        />
        <Layout style={styles.mainContainer}>
          <PaperInput
            lable="Name"
            placeholder="Name"
            message={this.state.messageName}
            value={this.state.name}
            onChangeText={text => this.setState({ name: text })}
          />
          <PaperSelect
            label="Managed by"
            placeholder="Select Manager"
            data={this.state.list_managers}
            selectedOption={this.state.selected_manager}
            onSelect={selected_manager =>
              this.setState({ selected_manager: selected_manager })
            }
          />
          <PaperSelect
            label="Member in group"
            placeholder="Select Member"
            data={this.state.list_members}
            multiSelect={true}
            selectedOption={this.state.selected_members}
            onSelect={selected_members =>
              this.setState({ selected_members: selected_members })
            }
          />
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
