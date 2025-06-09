import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { StyleSheet, Image } from 'react-native'
import { ApiContext } from '@/context/ApiContext'


export default function EmptyChatComponent() {

  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("Login must be used within an ApiProvider");
  }
  const { user } = apiContext;

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={{ width: 125, height: 125, borderRadius: 50 }}
        />
        <Text style={{ fontSize: 20, color: '#000', textAlign: 'center', fontFamily: 'Roboto', marginTop: 10
        }}>
            {/* Start a conversation */}
            Hi {user?.username}, start a conversation.
        </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        display: 'flex',
    },
})
