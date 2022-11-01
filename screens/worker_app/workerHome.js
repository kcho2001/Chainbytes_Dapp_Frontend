import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { SafeAreaView } from "react-native-safe-area-context";
import HighlightText from "@sanar/react-native-highlight-text";
import * as config from "../ChainBytesConfig.js";

import WalletConnectProvider from "@walletconnect/web3-provider";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { Text, View, backgroundColor } from '../../components/Themed';
import Spinner from "react-native-loading-spinner-overlay";


const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

export default function WorkerHomeScreen(props) {
  const connector = useWalletConnect();
  const my_address = connector.accounts[0]
  const [lastCheckedIn, setCheckedIn] = React.useState("N/A");
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState('');

  const bg = backgroundColor()

  useEffect(() => {
    async function getBalance() {
      await provider.getBalance(connector.accounts[0]).then((result) => {
        setBalance(ethers.utils.formatEther(result))
        setLoading(false)
      });
    }
    getBalance();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
    );
  } else {
    return (
      <NavigationContainer independent={true}>
        {/* <ImageBackground source={image} resizeMode="cover" style={styles.screen}> */}
        <SafeAreaView style={[styles.screen, { backgroundColor: bg }]}>
          <View style={styles.mainContainer}>
            <Text style={styles.mainText}> Hello Worker </Text>
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.subText}>Last checked in: {lastCheckedIn}</Text>
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.subText}>
              Balance: {" "}
              <HighlightText
                highlightStyle={{ backgroundColor: "#d3d3d3" }}
                searchWords={["1000 ETH"]}
                textToHighlight={balance.slice(0, 7) + ' GoerliETH'}
              />
            </Text>
          </View>
          {/* <View style={styles.imageView}>
              <Image
                style={styles.image}
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

const styles = StyleSheet.create({
  screen: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%"
  },
  mainContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: 5,
    paddingTop: 100,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  subContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: 35,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  mainText: {
    fontSize: 50,
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
    fontFamily: "HelveticaNeue-Bold"
  },
  subText: {
    fontSize: 25,
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
    fontFamily: "HelveticaNeue-Bold",
  },
  smolText: {
    fontSize: 10,
    color: "black",
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
  },
  image: {
    height: 350,
    width: 350,
    borderRadius: 40,
  },
  imageView: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: 'red',
    paddingTop: 20,
  },
});