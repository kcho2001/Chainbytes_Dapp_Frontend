import { NavigationContainer } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { SafeAreaView } from "react-native-safe-area-context";

import * as config from "../ChainBytesConfig.js";

const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

export default function CreateForeman(props) {
  const [newForemanAddress, onChangeText] = React.useState(null);
  let address = props.address;
  const connector = useWalletConnect();
  // Function to create the foreman
  // NB: Handle result in a better way. Check for errors
  const createForeman = React.useCallback(
    async (_newForemanAddress) => {
      const provider = new WalletConnectProvider({
        rpc: {
          4: config.providerUrl,
        },
        connector: connector,
        qrcode: false,
      });

      await provider.enable();
      const ethers_provider = new ethers.providers.Web3Provider(provider);
      const signer = ethers_provider.getSigner();
      let contract = new ethers.Contract(
        config.contractAddress,
        config.contractAbi,
        signer
      );
      try {
        await contract
          .createForeman(_newForemanAddress)
          .then((result) => console.log(result));
      } catch (e) {
        console.error(e);
      }
    },
    [connector]
  );
  return (
    <NavigationContainer independent={true}>
      <SafeAreaView style={styles.screen}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Address of new Foreman"
        />
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => createForeman(newForemanAddress)}
        >
          <Text style={styles.signInText}>Create Foreman</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </NavigationContainer>
  );
}

// Alert when a QR code is scanned and it is not an address
const notAddress = () => {
  Alert.alert(
    "QR READ ERROR",
    "This is not an ethereum address",
    [
      {
        text: "Dismiss",
        style: "cancel",
      },
    ],
    { cancelable: true }
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  mainText: {
    fontSize: 20,
    color: "black",
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  signInButton: {
    width: 200,
    height: 60,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    padding: 15,
    backgroundColor: "#1e140a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    color: "white",
  },
});
