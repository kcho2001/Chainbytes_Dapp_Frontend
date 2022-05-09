import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { ethers } from "ethers";
import { SafeAreaView } from "react-native-safe-area-context";
import HighlightText from "@sanar/react-native-highlight-text";
import * as config from "../ChainBytesConfig.js";

import WalletConnectProvider from "@walletconnect/web3-provider";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

export default function WorkerHomeScreen(props) {
  const connector = useWalletConnect();
  const [lastCheckedIn, setCheckedIn] = React.useState("N/A");
  // getLastCheckedIn(address, contract);
  let address = props.address;
  // Function to get the balance of a user
  // const getBalance = React.useCallback(async () => {
  //   try {
  //     const provider = new WalletConnectProvider({
  //       rpc: {
  //         4: config.providerUrl,
  //       },
  //       connector: connector,
  //       qrcode: false,
  //     });
  //     await provider.enable();
  //     const ethers_provider = new ethers.providers.Web3Provider(provider);
  //     return await connector.accounts[0];
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, [connector]);
  // const balance = getBalance();
  const getLastCheckedIn = React.useCallback(async () => {
    try {
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
      await contract.getDaysCheckedIn(address).then((result) => {
        setCheckedIn(result[0]);
      });
    } catch (e) {
      console.error(e);
    }
  }, [connector]);

  getLastCheckedIn();
  return (
    <NavigationContainer independent={true}>
      <SafeAreaView style={styles.screen}>
        <Text style={styles.mainText}> Hello Worker </Text>
        <Text style={styles.checkInText}>
          {" "}
          Last checked in: {lastCheckedIn}{" "}
        </Text>
        <Text style={styles.mainText}>
          Balance:{" "}
          <HighlightText
            highlightStyle={{ backgroundColor: "#d3d3d3" }}
            searchWords={["balance.toString()"]}
            textToHighlight="balance.toString()"
          />
        </Text>
        <TouchableOpacity onPress={() => getLastCheckedIn}>
          <Text style={styles.checkInText}>
            Last checked in: {lastCheckedIn}{" "}
          </Text>{" "}
        </TouchableOpacity>
        <Image
          style={styles.image}
          source={{
            uri: "https://image.shutterstock.com/image-photo/fresh-roasted-coffee-beans-leaves-260nw-1659538030.jpg",
          }}
        />
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
  checkInText: {
    fontSize: 15,
    color: "black",
    paddingBottom: 15,
  },
  mainText: {
    fontSize: 20,
    color: "black",
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
  },
  image: {
    height: 350,
    width: 350,
  },
});
