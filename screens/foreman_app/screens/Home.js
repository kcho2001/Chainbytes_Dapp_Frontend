import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HighlightText from "@sanar/react-native-highlight-text";
import { ethers } from "ethers";
import "../../ChainBytesConfig.js";
import "../../global";

const provider = new ethers.providers.JsonRpcProvider(url);
let contract = new ethers.Contract(contractAddress, contractAbi, provider);

// Returns the home screen, displaying informaiton
export default function Home({ route }) {
  const my_address = route.params.address;
  return (
    <NavigationContainer independent={true}>
      <SafeAreaView style={styles.screen}>
        <Text style={styles.mainText}>
          {" "}
          Hello {getData(my_address) ? "" : "not a "}Foreman{" "}
        </Text>
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

// Checks to see if the address is a foreman (just to show we can access contract functions)
getData = async (address) => {
  if (await contract.isAddressForeman(address)) {
    return true;
  } else {
    return false;
  }
};

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
