import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, Image, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HighlightText from "@sanar/react-native-highlight-text";
import { ethers } from "ethers";
import * as config from "../ChainBytesConfig";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import Spinner from "react-native-loading-spinner-overlay";

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
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

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
      <View style={styles.container}>
        <Spinner
          visible={loading || loading2}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
    );
  } else {
    return (
      <NavigationContainer
        independent={true}
        style={{ backgroundColor: "white" }}
      >
        <SafeAreaView style={styles.screen}>
          <View style={styles.mainContainer}>
            {Farm && (
              <Text style={styles.mainText}>
                Hello, {shortenAddress(my_address)}{" "}
              </Text>
            )}
            {!Farm && (
              <Text style={styles.mainText}>
                Hello, you are not a Farm! You shouldn't be here
              </Text>
            )}
          </View>
          {/**This will display the active workers of the farm*/}
          <View style={styles.subContainer}>
            {/* <Text style={styles.subText}>
              {" "}
              Active Workers:{" "}
              <HighlightText
                highlightStyle={{ backgroundColor: "#d3d3d3" }}
                searchWords={["1000"]}
                textToHighlight="1000"
              />
            </Text> */}
            <Text style={styles.subText}>
              {" "}
              Balance:{" "}
              <HighlightText
                highlightStyle={{ backgroundColor: "#d3d3d3" }}
                searchWords={[balance.slice(0, 7)]}
                textToHighlight={balance.slice(0, 7) + " GoerliETH"}
              />
            </Text>
          </View>
          {/**This will display the amount of active workers under the farm */}
          <Text style={styles.subText}>
            {"    "}
            You have no/# unpaid Workers
          </Text>
        </SafeAreaView>
        <View style={styles.imageView}>
          <Image
            style={styles.image}
            source={{
              uri: "https://ictcoffee.com/wp-content/uploads/2018/12/coffee-orgin-el-salvador-farm.jpg",
            }}
          />
        </View>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  // screen: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "flex-start",
  //   paddingTop: 10,
  // },
  // mainText: {
  //   fontSize: 20,
  //   color: "black",
  //   paddingBottom: 5,
  //   paddingTop: 0,
  //   marginTop: 0,
  // },
  // smolText: {
  //   fontSize: 15,
  //   color: "black",
  //   paddingBottom: 5,
  //   paddingTop: 0,
  //   marginTop: 0,
  // },
  // image: {
  //   height: 350,
  //   width: 350,
  // },
  // imageView: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  screen: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    //backgroundColor: 'green',
  },
  mainContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: 5,
  },
  subContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: 15,
  },
  mainText: {
    fontSize: 30,
    color: "black",
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
    fontFamily: "HelveticaNeue-Bold",
  },
  subText: {
    fontSize: 18,
    color: "black",
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
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    //backgroundColor: 'red',
    paddingTop: 20,
  },
});
