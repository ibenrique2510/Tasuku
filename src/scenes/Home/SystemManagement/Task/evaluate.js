import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { EVALUATE_TASK, NO_ERROR } from '../../../../config/constants';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, ScrollView } from 'react-native';
import { Layout, Button, Icon, RadioGroup, Radio, Select } from '@ui-kitten/components';
import { PaperTopNavigation } from '../../../../navigations/top.navigator';
import { PaperInput } from '../../../../components/input.component';
import { PaperModal } from '../../../../components/modal.component';

export default class EvaluateScreen extends Component {  

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      mark: {text: 'Fully Covered', value: '4'},
      status: 0,
    };
    this.markSource = [
      {text: 'Horribly Done', value: '1'},
      {text: 'Decent', value: '2'},
      {text: 'Good', value: '3'},
      {text: 'Fully Covered', value: '4'},
    ];
    this.statusSource = ['7', '8']
  }

  submitEvaluating = () => AsyncStorage.getItem('id').then((userId) => {
    var data         = {};
        data.id = this.props.route.params.taskId;
        data.comment = this.state.comment;
        data.rating    = this.state.mark.value;
        data.status  = this.statusSource[this.state.status];
    
    fetch(EVALUATE_TASK + userId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (
        responseData.error === NO_ERROR &&
        responseData.result != null &&
        responseData.success
      ) {
        this.setState({
          validation: true,
          message: "Evaluated Successfully",
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
    }).catch((error) => {
      console.error(error);
    });
  });

  DoneIcon = (style) => (
    <Icon {...style} name='done-all'/>
  );

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <PaperTopNavigation
          title='Evaluate Task'
          leftIcon='arrow-back'
          leftScreen='Back'
          {...this.props}
        />
        <PaperModal 
          onPress={() => this.setState({visible: !this.state.visible})} 
          visible={this.state.visible}
          message={this.state.message}
          validation={this.state.validation}
          navigation={this.props.navigation}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Layout style={styles.mainContainer}>
            <PaperInput 
              lable='Comment' 
              placeholder='Comment' 
              message={this.state.messageComment} 
              multiline={true}
              value={this.state.comment} 
              onChangeText={(text) => this.setState({comment: text})}
            />
            <Select 
              label='Mark'
              data={this.markSource} 
              selectedOption={this.state.mark} 
              onSelect={(mark) => this.setState({mark: mark})}
              style={{marginBottom: 10}}/>
            <RadioGroup
              selectedIndex={this.state.status}
              onChange={status => this.setState({status: status})}>
              <Radio status='success' text='Finished' checked={true}/>
              <Radio status='danger' text='Cannot Finish'/>
            </RadioGroup>
            <Button 
              style={styles.button} 
              size='large'
              status='primary' 
              icon={this.DoneIcon} 
              onPress={this.submitEvaluating}
            >Evaluate</Button>
          </Layout>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 40,
  },
  button: {
    paddingHorizontal: 40, 
    paddingVertical: 10, 
    marginTop: 20, 
    flexDirection: 'row-reverse'
  },
});