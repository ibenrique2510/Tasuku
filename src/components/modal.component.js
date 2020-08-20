import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon, Modal, Text } from '@ui-kitten/components';


export const PaperModal = ({ visible, onPress, message, validation, navigation }) => {

  const BackToList = () => {
    navigation.navigate('List');
  }

  return (
    validation
      ?
      <Modal
        backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        visible={visible}
        style={styles.modalContainer}>
          <Icon name='checkmark-circle-2-outline' width={100} height={100} fill='#72E296' style={{margin: 10}}/>
          <Text category='s1'>{message}</Text>
          <Button 
            style={styles.button} 
            size='medium'
            status='success' 
            appearance='outline'
            onPress={BackToList}
          >Back to List</Button>
      </Modal>
      :
      <Modal
        backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        visible={visible}
        style={styles.modalContainer}>
          <Icon name='close-circle-outline' width={100} height={100} fill='#FF3D71' style={{margin: 10}}/>
          <Text category='s1'>{message}</Text>
          <Button 
            style={styles.button} 
            size='medium'
            status='danger' 
            appearance='outline'
            onPress={onPress}
          >Dismiss</Button>
      </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderColor: '#8F9BB3',
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginTop: 30,
  },
});