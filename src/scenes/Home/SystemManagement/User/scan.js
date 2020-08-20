import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class ScanScreen extends Component {  
  
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: false,
    }
  }

  componentDidMount = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({hasPermission: (status === 'granted')});
  };

  handleBarCodeScanned = ({ data }) => {
    this.props.navigation.navigate('List');
    this.props.route.params.callback(data);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />  
      </View>
    )
  }
}