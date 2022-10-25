import { NavigationContainer, useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  View,
  Pressable,
  Modal,
} from "react-native";
import React from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { SafeAreaView } from "react-native-safe-area-context";
import ethereum_address from "ethereum-address";

import * as config from "../ChainBytesConfig.js";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CreateForeman({ navigation }) {
  const [newForemanAddress, onChangeText] = React.useState(null);
  const route = useRoute();

  // This is to handle returning from qrModal and retrieving scanned data
  React.useEffect(() => {
    if (route.params?.data) {
      onChangeText(route.params.data);
      route.params.data = null;
      console.log("route: " + route.params.data);
    }
  }, [route.params?.data]);

  const connector = useWalletConnect();
  // Function to create the foreman
  // NB: Handle result in a better way. Check for errors
  const createForeman = React.useCallback(
    async (_newForemanAddress) => {
      try {
        const provider = new WalletConnectProvider({
          rpc: {
            5: config.providerUrl,
          },
          chainId: 5,
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
          .createForeman(_newForemanAddress)
          .then((result) => console.log(result));
      } catch (e) {
        console.log("Error: function call not good: ", e);
      }
    },
    [connector]
  );

  // Alert when a QR code is scanned and it is not an address
  const notAddress = (address) => {
    alert(address + " is not an ethereum address", [
      {
        text: "Dismiss",
        style: "cancel",
      },
      "",
      { cancelable: true },
    ]);
  };

  const checkAddress = (address) => {
    if (ethereum_address.isAddress(address)) {
      createForeman(address);
    } else {
      notAddress(address);
    }
  };

  return (
    <NavigationContainer independent={true}>
      <SafeAreaView style={styles.screen}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Address of new Foreman"
          value={newForemanAddress != null ? newForemanAddress : ""}
          placeholderTextColor="grey"
        />
        <View style={{ paddingVertical: 20 }}>
          <Pressable
            onPress={() => navigation.navigate("qrModal")}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Ionicons name={"qr-code"} size={40} />
          </Pressable>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              onChangeText("");
              checkAddress(newForemanAddress);
            }}
          >
            <Text style={styles.buttonTextStyle}>Create Foreman</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
}

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
    marginVertical: 0,
    borderWidth: 1,
    padding: 10,
    paddingVertical: 0,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
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
    marginTop: 10,
    marginBottom: 10,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
