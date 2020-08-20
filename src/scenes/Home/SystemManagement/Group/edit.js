import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { UPDATE_GROUP, GET_GROUP, GET_NO_GROUP_USERS, NO_ERROR } from '../../../../config/constants';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Spinner, Layout, Button, Icon, Input } from '@ui-kitten/components';
import { PaperTopNavigation } from '../../../../navigations/top.navigator';
import { PaperInput } from '../../../../components/input.component';
import { PaperSelect } from '../../../../components/select.component';
import { PaperModal } from '../../../../components/modal.component';

export default class EditScreen extends Component {  

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
    };
  }

  componentDidMount = () => {
    this.FetchData();
  };

  FetchData = async () => {
    const userId = await AsyncStorage.getItem('id');
    var list_members  = [];

    // Get info of Group
    fetch(GET_GROUP + '/' + this.props.route.params.groupId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((responseData) => {
      // Push users to select
      if (responseData.result.usersInGroup.length > 0) {
        responseData.result.usersInGroup.forEach((member) => {
          list_members.push({
            value: member.id,
            text : member.name,
          })
        });
      }
      var selected_members = list_members;
      this.setState({
        name            : responseData.result.name,
        list_members    : list_members,
        manager         : responseData.result.managerName,
        selected_members: selected_members,
      });
    }).catch((error) => {
      console.error(error);
    });

    // Get list of users not belong to any group
    fetch(GET_NO_GROUP_USERS, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((responseData) => {
      // Push users not belong to any group to select
      var members_availabled = [];
      if (responseData.result.length > 0) {
        responseData.result.forEach((member) => {
          members_availabled.push({
            value: member.id,
            text : member.name,
          });
        });
      }
      this.setState({
        list_members: list_members.concat(members_availabled),
        loading: false,
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  submitEditing = () => AsyncStorage.getItem('id').then((userId) => {
    var data = {};
    data.id = this.props.route.params.groupId;
    data.name = this.state.name;
    // data.manager_id = this.state.selected_manager.value;
    // data.selected_members = [];
    // this.state.selected_members.forEach((member) => {
    //   data.selected_members.push(member.value);
    // });
    
    fetch(UPDATE_GROUP + '/' + userId, {
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
    }).catch((error) => {
      console.error(error);
    });
  });

  EditIcon = (style) => (
    <Icon {...style} name='edit-2'/>
  );

  render() {
    if (this.state.loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <Spinner size='giant'
          style={{ borderColor: "black", backgroundColor: "black" }}/>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <PaperTopNavigation
          title='Edit Group'
          leftIcon='arrow-back'
          leftScreen='Back'
          {...this.props}/>
        <PaperModal 
          onPress={() => this.setState({visible: !this.state.visible})} 
          visible={this.state.visible}
          message={this.state.message}
          validation={this.state.validation}
          navigation={this.props.navigation}
          title='Back to List'
        />
        <Layout style={styles.mainContainer}>
          <PaperInput 
            lable='Group Name' 
            placeholder='Name' 
            message={this.state.messageName} 
            value={this.state.name} 
            onChangeText={(text) => this.setState({name: text})}/>
          <Input 
            label='Manager'
            value={this.state.manager} 
            disabled={true}
            style={{marginBottom: 10}}/>
          <PaperSelect 
            label='Member(s) in group'
            placeholder='Select Member'
            data={this.state.list_members} 
            multiSelect={true}
            selectedOption={this.state.selected_members} 
            disabled={true}
            onSelect={(selected_members) => this.setState({selected_members: selected_members})}/>
          <Button 
            style={styles.button} 
            size='large'
            status='info' 
            icon={this.EditIcon} 
            onPress={this.submitEditing}
          >Update</Button>
        </Layout>
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
    backgroundColor: 'black',
    borderColor: 'black',
    paddingHorizontal: 40, 
    paddingVertical: 10, 
    marginTop: 20, 
    flexDirection: 'row-reverse'
  },
});