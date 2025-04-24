import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu, IconButton } from 'react-native-paper';

const MoreButton = ({ options }) => {
  const [visible, setVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const openMenu = (event) => {
    setMenuPosition({ 
      x: event.nativeEvent.pageX, 
      y: event.nativeEvent.pageY + 20 // Adjusted to avoid status bar overlap
    });
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);

  return (
    <View style={{ position: 'relative' }}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={{ x: menuPosition.x, y: menuPosition.y }}
        contentStyle={{ borderRadius: 8 }}
      >
        {options.map((option, index) => (
          <Menu.Item
            key={index}
            onPress={() => {
              closeMenu();
              option.onPress();
            }}
            title={option.label}
            leadingIcon={option.icon}
          />
        ))}
      </Menu>

      <IconButton 
        icon="dots-vertical" 
        size={24} 
        onPress={openMenu} 
        iconColor="white"
      />
    </View>
  );
};

export default MoreButton;
