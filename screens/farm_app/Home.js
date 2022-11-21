import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Image } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HighlightText from "@sanar/react-native-highlight-text";
import { ethers } from "ethers";
import * as config from "../ChainBytesConfig";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import Spinner from "react-native-loading-spinner-overlay";

import { Text, View, backgroundColor } from '../../components/Themed';
import { homeStyles } from "../../style";


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
  const [Farm, setFarm] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [balance, setBalance] = useState("");
  //const image = { uri: "https://c4.wallpaperflare.com/wallpaper/525/880/875/logo-programming-java-cup-of-coffee-wallpaper-preview.jpg" };
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
      await contract.isFarm(my_address).then((result) => {
        setFarm(result);
        setLoading(false);
      });
    }
    getData();
  });

  if (loading || loading2) {
    return (
      <View style={homeStyles.mainContainer}>
        <Spinner
          visible={loading || loading2}
          textContent={"Loading..."}
          textStyle={homeStyles.spinnerTextStyle}
        />
      </View>
    );
  } else {
    return (
      <NavigationContainer
        independent={true}
      >
        {/* <ImageBackground source={image} resizeMode="cover" style={homeStyles.screen}> */}
        <SafeAreaView style={[homeStyles.screen, { backgroundColor: bg }]}>
          <View style={homeStyles.mainContainer}>
            {Farm && (
              <Text style={[homeStyles.mainText]}>
                Hello, {shortenAddress(my_address)}{" "}
              </Text>
            )}
            {!Farm && (
              <Text style={homeStyles.mainText}>
                Hello, you are not a Farm! You shouldn't be here
              </Text>
            )}
          </View>
          {/**This will display the active workers of the farm*/}
          <View style={homeStyles.subContainer}>
            {/* <Text style={homeStyles.subText}>
              {" "}
              Active Workers:{" "}
              <HighlightText
                highlightStyle={{ backgroundColor: "#d3d3d3" }}
                searchWords={["1000"]}
                textToHighlight="1000"
              />
            </Text> */}
            <Text style={homeStyles.subText}>
              Balance: {balance.slice(0, 7) + " GoerliETH"}
            </Text>
          </View>
          {/**This will display the amount of active workers under the farm */}
          <View style={homeStyles.subContainer}>
            <Text style={homeStyles.subText}>
              You have no/# unpaid Workers
            </Text>
          </View>
          {/* <View style={homeStyles.imageView}>
          <Image
            style={homeStyles.image}
            source={{
              uri: "https://ictcoffee.com/wp-content/uploads/2018/12/coffee-orgin-el-salvador-farm.jpg",
            }}
          />
        </View> */}
        </SafeAreaView>
        {/* </ImageBackground> */}
      </NavigationContainer>
    );
  }
}