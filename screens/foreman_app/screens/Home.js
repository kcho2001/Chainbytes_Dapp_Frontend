import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, Image, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HighlightText from "@sanar/react-native-highlight-text";
import { ethers } from "ethers";
import * as config from "../../ChainBytesConfig";
import "../../global";

const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

// Returns the home screen, displaying informaiton
export default function Home({ route }) {
  const my_address = route.params.address;
  const [foreman, setForeman] = useState(true);
  useEffect(() => {
    async function getData() {
      await contract
        .isAddressForeman(my_address)
        .then((result) => setForeman(result));
    }
    getData();
  }, []);
  return (
    <NavigationContainer independent={true}>
      <SafeAreaView style={styles.screen}>
        <View>
          {foreman && <Text style={styles.mainText}> Hello, Foreman! </Text>}
          {!foreman && (
            <Text style={styles.mainText}> Hello, Not Foreman!</Text>
          )}
        </View>
        <Text style={styles.smolText}>{my_address}</Text>
        <Text style={styles.mainText}>
          {" "}
          Balance:{" "}
          <HighlightText
            highlightStyle={{ backgroundColor: "#d3d3d3" }}
            searchWords={["1000 ETH"]}
            textToHighlight="1000 ETH"
          />
        </Text>
        <Image
          style={styles.image}
          source={{
            uri: "https://www.mcall.com/resizer/Yaa9q9hboZ0NjcEmlq4SfPDBoFU=/1200x795/top/cloudfront-us-east-1.images.arcpublishing.com/tronc/JUW4JCLFKBGRND33USOZQ4IUF4.jpg",
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
    fontSize: 10,
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
