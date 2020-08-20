import React, { useState } from "react";
import { Input } from '@ui-kitten/components';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export const PaperTimePicker = ({ label, date, value, onChange, message }) => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [time, setTime] = useState(value);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);

  };

  const handleConfirm = (date) => {
    let formatted_date =
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2) + "  |  " +
      ("0" + date.getDate()).slice(-2) +
      "/" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      (date.getFullYear());

    setTime(formatted_date);
    hideDatePicker();
  };

  return (
    <>
      <Input
        label={label}
        status={message ? 'danger' : ''}
        caption={message ?? ''} 
        disabled={true}
        value={time}
        onChange={setTime}
        onTouchEnd={showDatePicker}
        style={{marginBottom: 10}}
        labelStyle={{color: '#8F9BB3'}}
        textStyle={{color: '#000000'}}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode='datetime'
        locale='en_GB'
        date={date}
        headerTextIOS='Pick a time'
        onChange={onChange}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};