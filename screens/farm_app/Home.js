import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, Image, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HighlightText from "@sanar/react-native-highlight-text";
import { ethers } from "ethers";
import * as config from "../ChainBytesConfig";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

// Returns the home screen, displaying informaiton
export default function Home({ route }) {
  const connector = useWalletConnect();
  const my_address = connector.accounts[0];
  const [Farm, setFarm] = useState(true);
  const [Loading, setLoading] = useState(true)
  useEffect(() => {
    async function getData() {
      await contract
        .isAddressFarm(my_address)
        .then((result) => {
          setFarm(result)
          setLoading(false)
        });
    }
    getData();
  }, []);

  if (Loading) {
    return (<Text> Loading </Text>)
  }
  else {
    return (
      <NavigationContainer independent={true}>
        <SafeAreaView style={styles.screen}>
          <View>
            {Farm && <Text style={styles.mainText}> Hello, Mr.Farm! </Text>}
            {!Farm && (
              <Text style={styles.mainText}> You're Not a Farm!</Text>
            )}
          </View>
          {/**This will display the amount of active workers under the farm */}
          <Text style={styles.smolText}>
            {" "}
            Active Workers:{" "}
            <HighlightText
              highlightStyle={{ backgroundColor: "#d3d3d3" }}
              searchWords={["1000"]}
              textToHighlight="1000"
            />
          </Text>
          {/**This will display the amount of active workers under the farm */}
          <Text style={styles.mainText}>
            {" "}
            You have no/# unpaid Workers{" "}
          </Text>
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              source={{
                uri: "https://ictcoffee.com/wp-content/uploads/2018/12/coffee-orgin-el-salvador-farm.jpg",
              }}
            />
          </View>

        </SafeAreaView>
      </NavigationContainer>
    );

  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  mainText: {
    fontSize: 20,
    color: "black",
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
  },
  smolText: {
    fontSize: 15,
    color: "black",
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
  },
  image: {
    height: 350,
    width: 350,
  },
  imageView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
