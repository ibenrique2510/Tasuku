import React from 'react';
import { Icon, TopNavigation, TopNavigationAction, OverflowMenu} from '@ui-kitten/components';

export const PaperTopNavigation = ({ navigation, menu, params, leftIcon, leftScreen, rightIcon, rightScreen, title }) => {

  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onMenuItemSelect = (index) => {
    if (index == 0) {
      // Edit
      navigation.navigate('Edit', params);
    } else {
      // Delete
    }

    setMenuVisible(false);
  };

  EditIcon = () => (
    <Icon name='edit-2'/>
  );

  TrashIcon = () => (
    <Icon name='trash-2'/>
  );

  const menuData = [
    { title: 'Edit', icon: EditIcon },
    { title: 'Delete', icon: TrashIcon }
  ];

  const onLeftAction = () => {
    switch(leftScreen) {
      case 'Drawer':
        navigation.openDrawer();
        break;
      case 'Back':
        navigation.goBack();
        break;
    }
  }
  
  const onRightAction = () => {
    navigation.navigate(rightScreen, params);
  }

  const LeftIcon = () => (
    <Icon name={leftIcon}/>
  );

  const RightIcon = () => (
    <Icon name={rightIcon}/>
  );

  const renderLeftAction = () => (
    <TopNavigationAction icon={LeftIcon} onPress={onLeftAction}/>
  );

  const renderRightAction = () => (
    menu
    ?  
      <OverflowMenu
        visible={menuVisible}
        data={menuData}
        onSelect={onMenuItemSelect}
        onBackdropPress={toggleMenu}>
        <TopNavigationAction
          icon={RightIcon}
          onPress={toggleMenu}/>
      </OverflowMenu>
    : <TopNavigationAction icon={RightIcon} onPress={onRightAction}/>
  )

  return rightScreen || menu
  ?
    <TopNavigation
      title={title}
      alignment='center'
      leftControl={renderLeftAction()}
      rightControls={renderRightAction()}/>
  :
    <TopNavigation
      title={title}
      alignment='center'
      leftControl={renderLeftAction()}/>
};