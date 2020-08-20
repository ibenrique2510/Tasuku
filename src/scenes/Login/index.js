import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import {
  LOGIN,
  NO_VALUE_PRESENT,
  WRONG_EMAIL_PASSWORD,
  NO_ERROR
} from "../../config/constants";
import { SafeAreaView } from "react-navigation";
import { StyleSheet, Dimensions } from "react-native";
import {
  Layout,
  Text,
  Modal,
  Icon,
  Input,
  Button
} from "@ui-kitten/components";
import { Actions } from "react-native-router-flux";

import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "admin@mail.com",
      password: "123456",
      message: "",
      secureTextEntry: true,
      visible: false,
      propsInputEmail: {},
      propsInputPassword: {},
      pushToken: {},
      notification: {}
    };
  }

  EyeIcon = () => {
    return <Icon name={this.state.secureTextEntry ? "eye-off" : "eye"} />;
  };

  LoginIcon = () => <Icon name="arrow-circle-right" fill="#FFFFFF" />;

  storeId = async id => {
    try {
      await AsyncStorage.setItem("id", id);
    } catch (error) {
      console.error(error);
    }
  };

  storeName = async name => {
    try {
      await AsyncStorage.setItem("name", name);
    } catch (error) {
      console.error(error);
    }
  };

  storeRole = async role => {
    try {
      await AsyncStorage.setItem("role", role);
    } catch (error) {
      console.error(error);
    }
  };

  registerForPushToken = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      alert('You need to grant permission to receive Notifications!');
      return;
    }
    // Get the token that identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    this.setState({ pushToken: token });
  }

  // componentDidMount() {
  //   // Handle notifications that are received or selected while the app
  //   // is open. If the app was closed and then opened by tapping the
  //   // notification (rather than just tapping the app icon to open it),
  //   // this function will fire on the next tick after the app starts
  //   // with the notification data.
  //   this._notificationSubscription = Notifications.addListener(this._handleNotification);
  // }

  // _handleNotification = notification => {
  //   // do whatever you want to do with the notification
  //   this.setState({ notification: notification });
  //   console.log(this.state.notification);
  // };

  onLogin = async () => {
    var flag = true;
    if (!this.state.email.includes("@")) {
      flag = false;
      this.setState({
        propsInputEmail: {
          status: "danger",
          caption: "Email must contain @"
        }
      });
    }
    if (this.state.password.length < 6 || this.state.password.length > 18) {
      flag = false;
      this.setState({
        propsInputPassword: {
          status: "danger",
          caption: "Password must have 6 - 18 characters"
        }
      });
    }

    if (flag) {
      await this.registerForPushToken();
      var data = {};
      data.email = this.state.email;
      data.password = this.state.password;
      data.pushToken = this.state.pushToken;

      fetch(LOGIN, {
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
            responseData.message === NO_VALUE_PRESENT &&
            responseData.error === WRONG_EMAIL_PASSWORD
          ) {
            this.setState({
              propsInputEmail: {
                status: "danger"
              },
              propsInputPassword: {
                status: "danger",
                caption: WRONG_EMAIL_PASSWORD
              }
            });
          } else if (
            responseData.error == NO_ERROR &&
            responseData.result != null
          ) {
            var user = responseData.result;
            this.storeId(user.id + '');
            this.storeName(user.name + '');
            this.storeRole(user.role + '');
            
            Actions.home();
          }
          //   this.setState({
          //     message: responseData.message,
          //     visible: !this.state.visible
          //   });
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  onChangeTextEmail = email => {
    this.setState({ email: email });
  };

  onChangeTextPassword = password => {
    this.setState({ password: password });
  };

  onFocusTextEmail = () => {
    this.setState({ propsInputEmail: {} });
  };

  onFocusTextPassword = () => {
    this.setState({ propsInputPassword: {} });
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Modal
          onBackdropPress={() =>
            this.setState({ visible: !this.state.visible })
          }
          visible={this.state.visible}
        >
          <Layout style={styles.modalContainer}>
            <Icon name={"heart"}></Icon>
            <Text category="s1" style={{ color: "#FFFFFF" }}>
              {this.state.message}
            </Text>
          </Layout>
        </Modal>
        <Layout style={styles.container}>
          <Text category="h2" style={{ marginBottom: 10 }}>
            Welcome To
          </Text>
          <Text category="h1" style={{ fontSize: 55, marginBottom: 20 }}>
            タスク
          </Text>
          <Input
            label="Email"
            placeholder="Email"
            value={this.state.email}
            onChangeText={email => this.onChangeTextEmail(email)}
            onFocus={this.onFocusTextEmail}
            style={styles.input}
            autoCapitalize="none"
            {...this.state.propsInputEmail}
          />
          <Input
            label="Password"
            placeholder="Password"
            value={this.state.password}
            onChangeText={password => this.onChangeTextPassword(password)}
            onFocus={this.onFocusTextPassword}
            style={styles.input}
            icon={this.EyeIcon}
            secureTextEntry={this.state.secureTextEntry}
            onIconPress={() =>
              this.setState({ secureTextEntry: !this.state.secureTextEntry })
            }
            {...this.state.propsInputPassword}
          />
          <Button
            style={styles.button}
            size="large"
            status="primary"
            icon={this.LoginIcon}
            onPress={this.onLogin}
          >
            Sign In
          </Button>
        </Layout>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  container: {
    alignItems: "center",
    marginBottom: 30
  },
  input: {
    paddingHorizontal: 40,
    marginBottom: 10,
    width: width
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginTop: 20,
    backgroundColor: "black",
    borderColor: "black",
    flexDirection: "row-reverse"
  },
  modalContainer: {
    position: "relative",
    width: width,
    padding: 20,
    top: -height / 2 + 55,
    backgroundColor: "#DB282C"
  }
});
