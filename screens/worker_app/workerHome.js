import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { SafeAreaView } from "react-native-safe-area-context";
import HighlightText from "@sanar/react-native-highlight-text";
import * as config from "../ChainBytesConfig.js";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { Text, View, backgroundColor } from "../../components/Themed";
import Spinner from "react-native-loading-spinner-overlay";
import { homeStyles } from "../../style.js";

const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

export default function WorkerHomeScreen() {
  const connector = useWalletConnect();
  const my_address = connector.accounts[0];
  const [lastCheckedIn, setCheckedIn] = React.useState("N/A");
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState("");

  const bg = backgroundColor();

  useEffect(() => {
    async function getBalance() {
      await provider.getBalance(connector.accounts[0]).then((result) => {
        setBalance(ethers.utils.formatEther(result));
        setLoading(false);
      });
    }
    getBalance();
  }, []);

  if (loading) {
    return (
      <View style={homeStyles.container}>
        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={homeStyles.spinnerTextStyle}
        />
      </View>
    );
  } else {
    return (
      <NavigationContainer independent={true}>
        {/* <ImageBackground source={image} resizeMode="cover" style={homeStyles.screen}> */}
        <SafeAreaView style={[homeStyles.screen, { backgroundColor: bg }]}>
          <View style={homeStyles.mainContainer}>
            <Text style={homeStyles.mainText}> Hello Worker </Text>
          </View>
          <View style={homeStyles.subContainer}>
            <Text style={homeStyles.subText}>Last checked in: {lastCheckedIn}</Text>
          </View>
          <View style={homeStyles.subContainer}>
            <Text style={homeStyles.subText}>
              Balance: {balance.slice(0, 7) + " GoerliETH"}
            </Text>
          </View>
          {/* <View style={homeStyles.imageView}>
              <Image
                style={homeStyles.image}
                source={{
                  uri: "https://www.mcall.com/resizer/Yaa9q9hboZ0NjcEmlq4SfPDBoFU=/1200x795/top/cloudfront-us-east-1.images.arcpublishing.com/tronc/JUW4JCLFKBGRND33USOZQ4IUF4.jpg",
                }}
              />
            </View> */}
        </SafeAreaView>
        {/* </ImageBackground> */}
      </NavigationContainer>
    );
  }
}