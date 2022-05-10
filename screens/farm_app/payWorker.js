import { NavigationContainer } from "@react-navigation/native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { ethers } from "ethers";
import { SafeAreaView } from "react-native-safe-area-context";
import * as config from "../ChainBytesConfig";

const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

export default function PayWorker(props) {
  const [_workerAddress, onChangeText] = React.useState(null);
  const [_paymentAmount, changePaymentAmount] = React.useState(0);
  const connector = useWalletConnect();
  const sendPayment = React.useCallback(
    async (payeeAddress) => {
      try {
        const paymentAmount = ethers.utils.parseEther(_paymentAmount);
        // Override to allow a value to be added when calling contract
        let overrides = {
          // To convert Ether to Wei:
          value: paymentAmount.toString(), // ether in this case MUST be a string
        };
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
        await contract
          .payWorker(payeeAddress, overrides)
          .then((result) => console.log(result));
      } catch (e) {
        console.error(e);
      }
    },
    [connector]
  );
  let address = props.address;
  return (
    <NavigationContainer independent={true}>
      <SafeAreaView style={styles.screen}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Address of Worker"
        />
        <TextInput
          style={styles.input}
          onChangeText={changePaymentAmount}
          placeholder="Payment amount ETH"
        />
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => sendPayment(_workerAddress)}
        ></TouchableOpacity>
      </SafeAreaView>
    </NavigationContainer>
  );
}

// Function to pay a worker based on their address
// NB: Handle result in a better way. Check for errors
payWorker = async (address, paymentAmt) => {
  await contract.payWorker(address).then((result) => console.log(result));
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
});
