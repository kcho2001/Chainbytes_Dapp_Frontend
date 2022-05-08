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
import { useState } from "react";
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
  const [_workerAddress, onChangeText] = useState(null);
  const [_paymentAmount, changePaymentAmount] = useState(0);
  const sendPayment = React.useCallback(async () => {
    try {
      const connector = useWalletConnect();
      await connector.signTransaction({
        data: "0x",
        from: "0xbc28Ea04101F03aA7a94C1379bc3AB32E65e62d3",
        gas: "0x9c40",
        gasPrice: "0x02540be400",
        nonce: "0x0114",
        to: "0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359",
        value: "0x00",
      });
    } catch (e) {
      console.error(e);
    }
  }, [connector]);
  let address = props.address;
  return (
    <NavigationContainer independent={true}>
      <SafeAreaView style={styles.screen}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Address of new Foreman"
        />
        <TextInput
          style={styles.input}
          onChangeText={changePaymentAmount}
          placeholder="Address of new Foreman"
        />
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => payWorker(_workerAddress, _paymentAmount)}
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
