import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import App from "./App.js";
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import "./global";

const shortenAddress = (address: string) => {
  global.myAddress = address;
  let ret = `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
  return ret;
}

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  const signTransaction = React.useCallback(async () => {
    console.log(connector.chainId);
    console.log(connector.session);
    console.log(connector.clientMeta);
    var tx = {
      "id": 1,
      "jsonrpc": "2.0",
      "method": "eth_sign",
      "params": ["0x2BF50D8B4BDeC5d918b92A9231Be2FE16A5F5891", "0xdeadbeaf"],
    };
    try {
      // await connector.signTransaction({
      //   data: "hello",
      //   from: "0x2BF50D8B4BDeC5d918b92A9231Be2FE16A5F5891",
      //   to: "0x961bdA3F1b384f3c1F8DBE26B5eF46bd5a9A80c3",
      //   value: "0x00",
      // });
      await connector.sendCustomRequest(tx);
    } catch (e) {
      console.log(e);
    }
  }, [connector]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet} style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
        </TouchableOpacity>
      )}
      {!!connector.connected && (
        <>
          <Text>{shortenAddress(connector.accounts[0])}</Text>
          <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Log out</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signTransaction} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Sign transaction</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
