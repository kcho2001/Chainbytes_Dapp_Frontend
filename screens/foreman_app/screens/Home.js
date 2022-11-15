import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, ImageBackground } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HighlightText from "@sanar/react-native-highlight-text";
import { ethers } from "ethers";
import * as config from "../../ChainBytesConfig";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { checkedIn } from "./Batch_Check_in";
import Spinner from "react-native-loading-spinner-overlay";

import { Text, View, backgroundColor } from "../../../components/Themed";
import { homeStyles } from "../../../style";

const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

const shortenAddress = (address) => {
  global.myAddress = address;
  let ret = `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
  return ret;
};

// Returns the home screen, displaying informaiton
export default function Home({ route }) {
  const connector = useWalletConnect();
  const my_address = connector.accounts[0];
  const [foreman, setForeman] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [balance, setBalance] = useState("");
  const image = {
    uri: "https://c4.wallpaperflare.com/wallpaper/525/880/875/logo-programming-java-cup-of-coffee-wallpaper-preview.jpg",
  };
  const bg = backgroundColor();

  useEffect(() => {
    async function getBalance() {
      await provider.getBalance(connector.accounts[0]).then((result) => {
        setBalance(ethers.utils.formatEther(result));
        setLoading2(false);
      });
    }
    getBalance();

    async function getData() {
      await contract.isForeman(my_address).then((result) => {
        setForeman(result);
        setLoading(false);
      });
    }
    getData();
  }, []);

  if (loading || loading2) {
    return (
      <View style={homeStyles.mainContainer}>
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
            {foreman && (
              <Text style={homeStyles.mainText}>
                Hello, {shortenAddress(my_address)}{" "}
              </Text>
            )}
            {!foreman && (
              <Text style={homeStyles.mainText}>
                {" "}
                Hello, Not Foreman! You shouldn't be here
              </Text>
            )}
          </View>
          <View style={homeStyles.subContainer}>
            <Text style={homeStyles.subText}>
              Balance:{" "}
              <HighlightText
                highlightStyle={{ backgroundColor: "#d3d3d3" }}
                searchWords={["1000 ETH"]}
                textToHighlight={balance.slice(0, 7) + ' GoerliETH'}
              />
            </Text>
          </View>
          <View style={homeStyles.subContainer}>
            <Text style={homeStyles.subText}>
              You have checked in {(checkedIn() != 0 && checkedIn()) || "no"}{" "}
              {(checkedIn() != 1 && "workers") || "worker"} today
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

const styles = StyleSheet.create({
  screen: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
  },
  mainContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: 5,
    paddingTop: 100,
    backgroundColor: "rgba(0,0,0,0)",
  },
  subContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: 35,
    backgroundColor: "rgba(0,0,0,0)",
  },
  mainText: {
    fontSize: 50,
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
    fontFamily: "HelveticaNeue-Bold",
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
    backgroundColor: "red",
    paddingTop: 20,
  },
});
