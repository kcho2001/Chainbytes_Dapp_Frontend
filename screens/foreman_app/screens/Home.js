import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, Image, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HighlightText from "@sanar/react-native-highlight-text";
import { ethers } from "ethers";
import * as config from "../../ChainBytesConfig";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { checkedIn } from "./Batch_Check_in";

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
}

// Returns the home screen, displaying informaiton
export default function Home({ route }) {
  const connector = useWalletConnect();
  const my_address = connector.accounts[0];
  const [foreman, setForeman] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      await contract.isForeman(my_address).then((result) => {
        setForeman(result);
        setLoading(false);
      });
    }
    getData();
  }, []);

  if (loading) {
    return <Text> Loading </Text>;
  } else {
    return (
      <NavigationContainer independent={true} style={{ backgroundColor: 'white' }}>
        <SafeAreaView style={styles.screen}>
          <View style={styles.mainContainer}>
            {foreman && <Text style={styles.mainText}>Hello, {shortenAddress(my_address)} </Text>}
            {!foreman && (
              <Text style={styles.mainText}> Hello, Not Foreman! You shouldn't be here</Text>
            )}
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.subText}>
              Balance:{" "}
              <HighlightText
                highlightStyle={{ backgroundColor: "#d3d3d3" }}
                searchWords={["1000 ETH"]}
                textToHighlight="1000 ETH"
              />
            </Text>
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.subText}>
              You have checked in {checkedIn() != 0 && checkedIn() || 'no'} {checkedIn() != 1 && 'workers' || 'worker'} today
            </Text>
          </View>
        </SafeAreaView>
        <View style={styles.imageView}>
          <Image
            style={styles.image}
            source={{
              uri: "https://www.mcall.com/resizer/Yaa9q9hboZ0NjcEmlq4SfPDBoFU=/1200x795/top/cloudfront-us-east-1.images.arcpublishing.com/tronc/JUW4JCLFKBGRND33USOZQ4IUF4.jpg",
            }}
          />
        </View>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: '100%',
    //backgroundColor: 'green',
  },
  mainContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 5,
  },
  subContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 15
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
    borderRadius: 40
  },
  imageView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    //backgroundColor: 'red',
    paddingTop: 20
  }
});
