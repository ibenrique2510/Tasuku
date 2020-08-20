import React, { useState} from 'react';
import { Input, Icon } from '@ui-kitten/components';

export const PaperInput = ({ placeholder, lable, value, onChangeText, message, parentSecureTextEntry, multiline, disabled, onPress }) => {

  const [secureTextEntry, setSecureTextEntry] = useState(parentSecureTextEntry);

  const EyeIcon = () => {
    return (
      <Icon name={secureTextEntry ? 'eye-off' : 'eye'}/>
    )
  }

  const onIconPress = () => {
    const secure = !secureTextEntry;
    setSecureTextEntry(secure);
  }

  return (
    parentSecureTextEntry
    ? <Input
      label={lable}
      placeholder={placeholder}
      status={message ? 'danger' : ''}
      caption={message ?? ''}
      value={value}
      onChangeText={onChangeText}
      icon={EyeIcon}
      secureTextEntry={secureTextEntry}
      onIconPress={onIconPress}
      style={{marginBottom: 10}}
    />
    : <Input
      label={lable}
      placeholder={placeholder}
      status={message ? 'danger' : ''}
      caption={message ?? ''}
      value={value}
      multiline={multiline}
      disabled={disabled}
      onTouchStart={onPress}
      onChangeText={onChangeText}
      style={{marginBottom: 10}}
    />
  );
};