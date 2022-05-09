import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ethers from "ethers";

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import WalletConnectProvider from "@walletconnect/web3-provider";
import * as config from "./ChainBytesConfig";
import "./global";
import CreateForeman from './farm_app/createForeman';

const shortenAddress = (address: string) => {
  global.myAddress = address;
  let ret = `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
  return ret;
}

// const myContext = React.createContext({
//   address: "",
//   contract: {},
// });

export default function TabOneScreen(this: any, { navigation }: RootTabScreenProps<'TabOne'>) {

  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  // const configureContract = React.useCallback(async () => {
  //   // Setting up contract to be passed in to other components as a context
  //   const provider = new WalletConnectProvider({
  //     rpc: {
  //       4: config.providerUrl,
  //     },
  //     connector: connector,
  //     qrcode: false,
  //   });
  //   await provider.enable();
  //   const ethers_provider = new ethers.providers.Web3Provider(provider);
  //   const signer = ethers_provider.getSigner();
  //   let contract = new ethers.Contract(
  //     config.contractAddress,
  //     config.contractAbi,
  //     signer
  //   );
  //   return contract;
  // }, [connector]);

  // const configuredContract = configureContract;

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

// export function context () {React.useContext(myContext)};