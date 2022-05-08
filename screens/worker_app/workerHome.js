import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { ethers } from "ethers";
import { SafeAreaView } from "react-native-safe-area-context";
import HighlightText from "@sanar/react-native-highlight-text";
import * as config from "../ChainBytesConfig.js";

// Contract declaration
const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

export default function WorkerHomeScreen(props) {
  const [lastCheckedIn, setCheckedIn] = useState("N/A");
  // getLastCheckedIn(address, contract);
  let address = props.address;
  getData(address);
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
            searchWords={["1000 ETH"]}
            textToHighlight="1000 ETH"
          />
        </Text>
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

// Function to return the last checked in date given an address
getData = async (address) => {
  await contract.isAddressFarm(address).then((result) => console.log(result));
};

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
