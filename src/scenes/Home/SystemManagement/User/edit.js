import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { GET_USER, UPDATE_USER, NO_ERROR } from "../../../../config/constants";
import { SafeAreaView } from "react-navigation";
import { StyleSheet } from "react-native";
import { Spinner, Layout, Button, Icon } from "@ui-kitten/components";
import { PaperTopNavigation } from "../../../../navigations/top.navigator";
import { PaperInput } from "../../../../components/input.component";
import { PaperModal } from "../../../../components/modal.component";

export default class UserEditScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      visible: false
    };
  }

  componentDidMount = () => {
    fetch(GET_USER + "/" + this.props.route.params.userId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          loading: false,
          name: responseData.result.name,
          email: responseData.result.email
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  submitEditing = () => {
    var flag = true;
    if (this.state.password) {
      if (this.state.password.length < 6 || this.state.password.length > 18) {
        flag = false;
        this.setState({
          messagePassword: "Password must have 6 - 18 characters"
        });
      }
      if (this.state.password !== this.state.password_confirmation) {
        flag = false;
        this.setState({
          messageConfirmPassword: "Password and Confirm Password must match"
        });
      } 
    }
    

    if (flag) {
      var data = {};
      data.name = this.state.name;
      if (this.state.password) {
        data.password = this.state.password;
      }
      fetch(UPDATE_USER + "/" + this.props.route.params.userId, {
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
              message: "Updated Successfully",
              visible: !this.state.visible,
              messageName: "",
              messageEmail: "",
              messagePassword: "",
              messageConfirmPassword: ""
            });
            this.setState({ validation: true });
          } else {
            this.setState({ message: responseData.message, validation: true });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  EditIcon = style => <Icon {...style} name="edit-2" />;

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
          title="Edit User"
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
          <PaperInput
            disabled
            lable="Email"
            placeholder="Email"
            message={this.state.messageEmail}
            value={this.state.email}
            onChangeText={text => this.setState({ email: text })}
          />
          <PaperInput
            lable="New Password"
            placeholder="New Password"
            message={this.state.messagePassword}
            parentSecureTextEntry={true}
            onChangeText={text => this.setState({ password: text })}
          />
          <PaperInput
            lable="Confirm Password"
            placeholder="Confirm Password"
            message={this.state.messageConfirmPassword}
            parentSecureTextEntry={true}
            onChangeText={text =>
              this.setState({ password_confirmation: text })
            }
          />
          <Button
            style={styles.btnEdit}
            size="large"
            status="info"
            icon={this.EditIcon}
            onPress={this.submitEditing}
          >
            Update
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
  btnEdit: {
    backgroundColor: "black",
    borderColor: "black",
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginTop: 20,
    flexDirection: "row-reverse"
  }
});
