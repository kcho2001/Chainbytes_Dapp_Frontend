import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

const shortenAddress = (address: string) => {
  global.myAddress = address;
  let ret = `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
  return ret;
}

export default function ModalScreen({navigation}) {
  const connector = useWalletConnect();
  
  const killSession = React.useCallback(() => {
    connector.killSession();
    navigation.navigate("Root");
  }, [connector]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Currently logged in as:</Text>
      <Text style={styles.buttonTextStyle}>{shortenAddress(connector.accounts[0])}</Text>

      <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>Log out</Text>
      </TouchableOpacity>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
