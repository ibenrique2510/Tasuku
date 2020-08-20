import React, { Component } from 'react';
import { AsyncStorage, Alert } from 'react-native';
import { URL_TASK, URL_TASK_REJECT, URL_TASK_APPROVE,
  WAITING_FOR_ACCEPT,
  NO_ERROR,
  ACCEPTED,
  DECLINED,
  NOT_STARTED_YET,
  ON_GOING,
  OVERDUE,
  COMMITED,
  FINISHED_CONFIRMED,
  CANNOT_FINISH_CONFIRMED,
  GET_TASK,
  DELETE_TASK,
  ACCEPT_OR_DECLINE_TASK } from '../../../../config/constants';
import { SafeAreaView, ScrollView } from 'react-navigation';
import { StyleSheet, Image } from 'react-native';
import { Card, Text, Spinner, Layout, Button } from '@ui-kitten/components';
import { PaperTopNavigation } from '../../../../navigations/top.navigator';
import { PaperModal } from '../../../../components/modal.component';

const StatusText = ({ item }) => {
  switch (item.status) {
    case WAITING_FOR_ACCEPT:
      return (
        <Text category='p1' style={{color: '#B7771A'}}>{'• Waiting for Approval'}</Text>
      );
    case DECLINED:
      return (
        <Text category='p1' style={{color: '#FF4830'}}>{'• Declined'}</Text>
      );
    case NOT_STARTED_YET:
      return (
        <Text category='p1' style={{color: '#8F9BB3'}}>{'• Not Started Yet'}</Text>
      );
    case ON_GOING:
      return (
        <Text category='p1' style={{color: '#3366FF'}}>{'• On-going'}</Text>
      );
    case COMMITED:
      return (
        <Text category='p1' style={{color: '#FFBB35'}}>{'• Committed'}</Text>
      );
    case FINISHED_CONFIRMED:
      return (
        <Text category='p1' style={{color: '#7DC914'}}>{'• Finished'}</Text>
      );
    case CANNOT_FINISH_CONFIRMED:
      return (
        <Text category='p1' style={{color: '#FFAB88'}}>{'• Cannot Finish'}</Text>
      );
    case OVERDUE:
      return (
        <Text category='p1' style={{color: '#B7181F'}}>{'• Overdue'}</Text>
      );
  }
}

const StatusFooter = ({ item, userName, onReject, onApprove, onDelete, onEdit, onCommit, onEvaluate }) => {
  switch (item.status) {
    case WAITING_FOR_ACCEPT:
      return (
        <Layout style={styles.cardFooter}>
          <Button style={{marginHorizontal: 10}} size='medium' appearance='outline' status='danger' onPress={onReject}>Decline</Button>
          <Button size='medium' appearance='outline' status='success' onPress={onApprove}>Accept</Button>
        </Layout>
      );
    case DECLINED:
      let rejected_date = new Date(item.updatedAt);
      let rejected_at = 
      ("0" + rejected_date.getHours()).slice(-2) +
      ":" +
      ("0" + rejected_date.getMinutes()).slice(-2) +
      "  |  " +
      ("0" + rejected_date.getDate()).slice(-2) +
      "/" +
      ("0" + (rejected_date.getMonth() + 1)).slice(-2) +
      "/" +
      rejected_date.getFullYear();
      return (
        <>
          <Layout style={[styles.textRow, {marginHorizontal: 20, marginTop: 20}]}>
            <Text style={[styles.label, {color: '#FF4830'}]}>Declined By:</Text>
            <Text style={[styles.text, {color: '#FF4830'}]}>{item.approver}</Text>
          </Layout>
          <Layout style={[styles.textRow, {marginHorizontal: 20, marginBottom: 20}]}>
            <Text style={[styles.label, {color: '#FF4830'}]}>Declined At:</Text>
            <Text style={[styles.text, {color: '#FF4830'}]}>{rejected_at}</Text>
          </Layout>
        </>
      );
    case NOT_STARTED_YET:
      // if (item.assigner == userName ) {
        return (
          <Layout style={styles.cardFooter}>
            <Button style={{marginHorizontal: 10}} size='medium' appearance='outline' status='danger' onPress={onDelete}>Delete</Button>
            <Button size='medium' appearance='outline' status='info' onPress={onEdit}>Edit</Button>
          </Layout>
        )
      // } else {
      //   return (
      //     <></>
      //   )
      // }
      
    case ON_GOING:
      if (item.assignee == userName) {
        return (
        <Layout style={styles.cardFooter}>
          <Button style={{marginHorizontal: 10}} size='medium' appearance='outline' status='warning' onPress={onCommit}>Commit</Button>
        </Layout>
        )
      } else {
        return (
          <></>
        )
      }
    case COMMITED:
      let committed_date = new Date(item.committedAt);
      let committed_at = 
      ("0" + committed_date.getHours()).slice(-2) +
      ":" +
      ("0" + committed_date.getMinutes()).slice(-2) +
      "  |  " +
      ("0" + committed_date.getDate()).slice(-2) +
      "/" +
      ("0" + (committed_date.getMonth() + 1)).slice(-2) +
      "/" +
      committed_date.getFullYear();
      return (
        <>
          <Layout style={[styles.textRow, {marginHorizontal: 20, marginTop: 20}]}>
            <Text style={[styles.label, {color: '#FFBB35'}]}>Handling:</Text>
            <Text style={[styles.text, {color: '#FFBB35'}]}>{item.handlingContent}</Text>
          </Layout>
          <Layout style={[styles.textRow, {marginHorizontal: 20}]}>
            <Text style={[styles.label, {color: '#FFBB35'}]}>Committed At:</Text>
            <Text style={[styles.text, {color: '#FFBB35'}]}>{committed_at}</Text>
          </Layout>
          <Layout style={[styles.textRow, {marginHorizontal: 20, marginBottom: 10}]}>
            <Text style={[styles.label, {color: '#FFBB35'}]}>Attach</Text>
          </Layout>
          <Layout style={[styles.textRow, {alignSelf: 'center', marginBottom: 10}]}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
          </Layout>
          {item.assignee != userName
          ?
            <Layout style={styles.cardFooter}>
              <Button size='medium' appearance='outline' status='primary' onPress={onEvaluate}>Evaluate</Button>
            </Layout>
          : <></>
          }
        </>
      );
    case FINISHED_CONFIRMED:
      let completed_date = new Date(item.updatedAt);
      let completed_at = 
      ("0" + completed_date.getHours()).slice(-2) +
      ":" +
      ("0" + completed_date.getMinutes()).slice(-2) +
      "  |  " +
      ("0" + completed_date.getDate()).slice(-2) +
      "/" +
      ("0" + (completed_date.getMonth() + 1)).slice(-2) +
      "/" +
      completed_date.getFullYear();
      return (
        <>
          <Layout style={[styles.textRow, {marginHorizontal: 20, marginTop: 20}]}>
            <Text style={[styles.label, {color: '#7DC914'}]}>Comment:</Text>
            <Text style={[styles.text, {color: '#7DC914'}]}>{item.comment}</Text>
          </Layout>
          <Layout style={[styles.textRow, {marginHorizontal: 20}]}>
            <Text style={[styles.label, {color: '#7DC914'}]}>Commenter:</Text>
            <Text style={[styles.text, {color: '#7DC914'}]}>{item.commenter}</Text>
          </Layout>
          <Layout style={[styles.textRow, {marginHorizontal: 20}]}>
            <Text style={[styles.label, {color: '#7DC914'}]}>Finish At:</Text>
            <Text style={[styles.text, {color: '#7DC914'}]}>{completed_at}</Text>
          </Layout>
          <Layout style={[styles.textRow, {marginHorizontal: 20, marginBottom: 10}]}>
            <Text style={[styles.label, {color: '#7DC914'}]}>Attach</Text>
          </Layout>
          <Layout style={[styles.textRow, {alignSelf: 'center', marginBottom: 10}]}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
          </Layout>
        </>
      );
      
    case CANNOT_FINISH_CONFIRMED:
      let incompleted_date = new Date(item.updatedAt);
      let incompleted_at =       
      ("0" + incompleted_date.getHours()).slice(-2) +
      ":" +
      ("0" + incompleted_date.getMinutes()).slice(-2) +
      "  |  " +
      ("0" + incompleted_date.getDate()).slice(-2) +
      "/" +
      ("0" + (incompleted_date.getMonth() + 1)).slice(-2) +
      "/" +
      incompleted_date.getFullYear();
      return (
        <>
          <Layout style={[styles.textRow, {marginHorizontal: 20, marginTop: 20}]}>
            <Text style={[styles.label, {color: '#FFAB88'}]}>Comment:</Text>
            <Text style={[styles.text, {color: '#FFAB88'}]}>{item.comment}</Text>
          </Layout>
          <Layout style={[styles.textRow, {marginHorizontal: 20}]}>
            <Text style={[styles.label, {color: '#FFAB88'}]}>Commenter:</Text>
            <Text style={[styles.text, {color: '#FFAB88'}]}>{item.commenter}</Text>
          </Layout>
          <Layout style={[styles.textRow, {marginHorizontal: 20}]}>
            <Text style={[styles.label, {color: '#FFAB88'}]}>Finish At:</Text>
            <Text style={[styles.text, {color: '#FFAB88'}]}>{incompleted_at}</Text>
          </Layout>
          <Layout style={[styles.textRow, {marginHorizontal: 20, marginBottom: 20}]}>
            <Text style={[styles.label, {color: '#FFAB88'}]}>Attach</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
          </Layout>
        </>
      );
    default:
      return (
        <></>
      );
  }
}

export default class DetailScreen extends Component {  

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      data: {},
      userName: this.props.route.params.userName,
    };
  }

  componentDidMount = () => AsyncStorage.getItem('id').then(async (userId) => {
    await fetch(GET_TASK + this.props.route.params.taskId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        loading: false,
        data: responseData.result,
      });
      let updated_date = new Date(responseData.result.updatedAt);
      this.setState({
        updated_at: 
        ("0" + updated_date.getHours()).slice(-2) + ":" +
        ("0" + updated_date.getMinutes()).slice(-2) + "  |  " +
        ("0" + updated_date.getDate()).slice(-2) + "/" +
        ("0" + (updated_date.getMonth() + 1)).slice(-2) + "/" +
        updated_date.getFullYear()
      });
    }).catch((error) => {
      console.error(error);
    });
  });

  onReject = () => AsyncStorage.getItem('id').then((userId) => {
    // var confirm = false;
    // Alert.alert(
    //   'Tasuku', 
    //   'Are you sure?', 
    //   [
    //     {text: 'Yes', onPress: () => confirm = true}, 
    //     {text: 'No', onPress: () => confirm = false}
    //   ]
    // );
    // if (confirm) {
    //   console.log('ok');
    // } else {
    //   console.log('not ok')
    // }
    var data = {};
    data.id = this.props.route.params.taskId
    data.status = DECLINED;

    fetch(ACCEPT_OR_DECLINE_TASK + userId, {
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
      //   });
      //   if (!responseData.hasOwnProperty('errors')) {
      //     this.setState({
      //       validation : true,
      //     })
      //   }
      // }
    }).catch((error) => {
      console.error(error);
    });
  })

  onApprove = () => AsyncStorage.getItem('id').then((userId) => {
    var data = {};
    data.id = this.props.route.params.taskId
    data.status = ACCEPTED;

    console.log(ACCEPT_OR_DECLINE_TASK + userId);
    console.log(data);

    fetch(ACCEPT_OR_DECLINE_TASK + userId, {
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
      //   });
      //   if (!responseData.hasOwnProperty('errors')) {
      //     this.setState({
      //       validation : true,
      //     })
      //   }
      // }
    }).catch((error) => {
      console.error(error);
    });
  })

  onDelete = () => AsyncStorage.getItem('id').then((userId) => {
    var data = {};
    data.id = this.props.route.params.taskId
    
    fetch(DELETE_TASK + userId, {
      method: 'DELETE',
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
          message: "Deleted Successfully",
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
      //   });
      //   if (!responseData.hasOwnProperty('errors')) {
      //     this.setState({
      //       validation : true,
      //     })
      //   }
      // }
    }).catch((error) => {
      console.error(error);
    });
  })

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

  onEdit = () => {
    this.props.navigation.navigate('Edit', {taskId: this.props.route.params.taskId})
  }

  onCommit = () => {
    this.props.navigation.navigate('Commit', {taskId: this.props.route.params.taskId})
  }

  onEvaluate = () => {
    this.props.navigation.navigate('Evaluate', {taskId: this.props.route.params.taskId})
  }

  Header = () => (
    <Layout style={{margin: 20, alignItems: 'center', justifyContent: 'center'}}>
      <Text category='h4'>{this.state.data.name}</Text>
      {this.state.data.oldTaskName
        ? <Text category='s2' status='danger'>{'Continue from ' + this.state.data.oldTaskName}</Text>
        : <></>
      }
      <StatusText item={this.state.data}/>
    </Layout>
  );

  Footer = () => (
    <StatusFooter 
      item={this.state.data} 
      userName={this.state.userName}
      navigation={this.props.navigation} 
      onApprove={this.onApprove}
      onReject={this.onReject}
      onDelete={this.onDelete}
      onEdit={this.onEdit}
      onCommit={this.onCommit}
      onEvaluate={this.onEvaluate}
    />
  )

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
      <SafeAreaView style={styles.safeArea}>
        <PaperTopNavigation
          title='Task Detail'
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
            <Card header={this.Header} footer={this.Footer} style={{marginVertical: 20}}>
              <Layout style={styles.cardBody}>
                <Layout style={styles.textRow}>
                  <Text style={styles.label}>Title:</Text>
                  <Text style={styles.text}>{this.state.data.name}</Text>
                </Layout>
                <Layout style={styles.textRow}>
                  <Text style={styles.label}>Assigned Content:</Text>
                  <Text style={styles.text}>{this.state.data.assignedContent}</Text>
                </Layout>
                <Layout style={styles.textRow}>
                  <Text style={styles.label}>Assignee:</Text>
                  <Text style={styles.text}>{this.state.data.assignee}</Text>
                </Layout>
                <Layout style={styles.textRow}>
                  <Text style={styles.label}>Assigner:</Text>
                  <Text style={styles.text}>{this.state.data.assigner}</Text>
                </Layout>
                <Layout style={styles.textRow}>
                  <Text style={styles.label}>Start At:</Text>
                  <Text style={styles.text}>{this.formatTime(this.state.data.startAt)}</Text>
                </Layout>
                <Layout style={styles.textRow}>
                  <Text style={styles.label}>End At:</Text>
                  <Text style={styles.text}>{this.formatTime(this.state.data.endAt)}</Text>
                </Layout>
                <Layout style={styles.textRow}>
                  <Text style={styles.label}>Last modified:</Text>
                  <Text style={styles.text}>{this.formatTime(this.state.data.updatedAt)}</Text>
                </Layout>
              </Layout>
            </Card>
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
  safeArea: {
    flex: 1, 
    backgroundColor: '#FFFFFF'
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    // minHeight: '40%', 
    justifyContent: 'center'
  },
  cardFooter: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    margin: 20
  },
  textRow: {
    flexDirection: 'row', 
    marginVertical: 5
  },
  label: {
    width: '40%', 
    fontSize: 15, 
    fontWeight: '800'
  },
  text: {
    width: '52%', 
    fontSize: 15
  },
  image: {
    width: 200, 
    height: 160,
    borderRadius: 10
  }
});