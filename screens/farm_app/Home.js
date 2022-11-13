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
  const [Loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [balance, setBalance] = useState('');
  //const image = { uri: "https://c4.wallpaperflare.com/wallpaper/525/880/875/logo-programming-java-cup-of-coffee-wallpaper-preview.jpg" };
  const bg = backgroundColor()
  useEffect(() => {
    async function getBalance() {
      await provider.getBalance(connector.accounts[0]).then((result) => {
        setBalance(ethers.utils.formatEther(result))
        setLoading2(false)
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
  }, []);

  if (Loading || loading2) {
    return (
      <View style={styles.mainContainer}>
        <Spinner
          visible={Loading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
    );
  } else {
    return (
      <NavigationContainer
        independent={true}
      >
        {/* <ImageBackground source={image} resizeMode="cover" style={styles.screen}> */}
        <SafeAreaView style={[styles.screen, { backgroundColor: bg }]}>
          <View style={styles.mainContainer}>
            {Farm && (
              <Text style={[styles.mainText]}>
                Hello, {shortenAddress(my_address)}{" "}
              </Text>
            )}
            {!Farm && (
              <Text style={styles.mainText}>
                Hello, you are not a Farm! You shouldn't be here
              </Text>
            )}
          </View>
          {/**This will display the balance of the farm*/}
          <View style={styles.subContainer}>
            <Text style={styles.subText}>
              Active Workers: 1000
            </Text>
            <Text style={styles.subText}>
              Balance: {balance.slice(0, 7) + ' GoerliETH'}
            </Text>
          </View>
          {/**This will display the amount of active workers under the farm */}
          <View style={styles.subContainer}>
            <Text style={styles.subText}>
              You have no/# unpaid Workers
            </Text>
          </View>
          {/* <View style={styles.imageView}>
          <Image
            style={styles.image}
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
