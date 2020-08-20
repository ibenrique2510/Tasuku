import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import {
  ADD_USER,
  ADMIN,
  MANAGER,
  USER,
  EMAIL_ALREADY_EXISTED,
  NO_ERROR
} from "../../../../config/constants";
import { SafeAreaView } from "react-navigation";
import { StyleSheet } from "react-native";
import { Spinner, Layout, Button, Icon } from "@ui-kitten/components";
import { PaperTopNavigation } from "../../../../navigations/top.navigator";
import { PaperInput } from "../../../../components/input.component";
import { PaperModal } from "../../../../components/modal.component";
import { PaperSelect } from "../../../../components/select.component";

export default class UserCreateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
      role: {
        text: USER + '',
        value: USER +'',
      }
    };
  }

  componentDidMount = () => {
    this.setState({ loading: false });
  };

  submitCreating = () => AsyncStorage.getItem('id').then(userId => {
      var flag = true;
      
      if (!this.state.email.includes("@")) {
        flag = false;
        this.setState({
          messageEmail: "Email must include @"
        });
      }
      if (this.state.name.length <= 0) {
        flag = false;
        this.setState({
          messageName: "Name cannot be empty"
        });
      }
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

      if (flag) {
        var data = {};
        data.role = this.state.role.value;
        data.name = this.state.name;
        data.email = this.state.email;
        data.password = this.state.password;
        
        console.log(data);
        fetch(ADD_USER + userId, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(responseData => {
            if (responseData.error === EMAIL_ALREADY_EXISTED) {
              this.setState({
                visible: true,
                validation: false,
                message: EMAIL_ALREADY_EXISTED
              });
            } else if (
              responseData.error === NO_ERROR &&
              responseData.result != null &&
              responseData.success
            ) {
              this.setState({
                validation: true,
                message: "Added Successfully",
                visible: !this.state.visible,
                messagePassword: "",
                messageConfirmPassword: ""
              });
            }
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
          title="Create User"
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
          <PaperSelect
            label="Role"
            placeholder="Select Role"
            message={this.state.messageRole}
            data={[
              { text: ADMIN, value: ADMIN },
              { text: MANAGER, value: MANAGER },
              { text: USER, value: USER }
            ]}
            selectedOption={this.state.role}
            onSelect={role => this.setState({ role: role })}
          />
          <PaperInput
            lable="Name"
            placeholder="Name"
            message={this.state.messageName}
            value={this.state.name}
            onChangeText={text => this.setState({ name: text })}
          />
          <PaperInput
            lable="Email"
            placeholder="Email"
            message={this.state.messageEmail}
            value={this.state.email}
            onChangeText={text => this.setState({ email: text })}
          />
          <PaperInput
            lable="Password"
            placeholder="Password"
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
            style={styles.btnCreate}
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
  btnCreate: {
    backgroundColor: "black",
    borderColor: "black",
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginTop: 20,
    flexDirection: "row-reverse"
  }
});
