import { NavigationContainer } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState } from "react";
import { ethers } from "ethers";
import { SafeAreaView } from "react-native-safe-area-context";
import "../ChainBytesConfig.js";

const provider = new ethers.providers.JsonRpcProvider(url);
let contract = new ethers.Contract(contractAddress, contractAbi, provider);

export default function CreateForeman(props) {
  const [newForemanAddress, onChangeText] = useState(null);
  let address = props.address;
  getData(address);
  return (
    <NavigationContainer independent={true}>
      <SafeAreaView style={styles.screen}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Address of new Foreman"
        />
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => getData(address)}
        ></TouchableOpacity>
      </SafeAreaView>
    </NavigationContainer>
  );
}

// Function to return the last checked in date given an address
getData = async (address) => {
  await contract.isAddressFarm(address).then((result) => console.log(result));
};

// Function to create the foreman
// NB: Handle result in a better way. Check for errors
createForeman = async (address) => {
  await contract.createForeman(address).then((result) => console.log(result));
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  mainText: {
    fontSize: 20,
    color: "black",
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  signInButton: {
    width: 200,
    height: 60,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    padding: 15,
    backgroundColor: "#1e140a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
