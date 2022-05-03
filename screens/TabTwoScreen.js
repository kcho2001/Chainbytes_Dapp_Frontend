import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import WorkerTab from "./worker_app/workerTab.js";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "@ethersproject/shims";
import { ethers, getDefaultProvider } from "ethers";
import Tabs from "./foreman_app/navigation/tabs";
import FarmTab from "./farm_app/farmTab";
import "./ChainBytesConfig.js";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import { useWalletConnect } from "@walletconnect/react-native-dapp";
// import {
//   useWalletConnect,
//   withWalletConnect,
// } from "@walletconnect/react-native-dapp";
// import WalletConnectProvider from "@walletconnect/web3-provider";
import * as WalletConnect from "@walletconnect/react-native-dapp";

// Stack object to navigate between different app pages
const Stack = createNativeStackNavigator();

//let ownerAddress = "0x961bdA3F1b384f3c1F8DBE26B5eF46bd5a9A80c3";

//let myAddress = "0x2BF50D8B4BDeC5d918b92A9231Be2FE16A5F5891";
const provider = new ethers.providers.JsonRpcProvider(url);
let contract = new ethers.Contract(contractAddress, contractAbi, provider);

getData = async () => {
  await contract.isAddressFarm(myAddress).then((result) => console.log(result));
};
getData();

export default function App(props) {
  const isLoggedIn = false;
  const myAddress = props.address;
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        {/* {isLoggedIn ? (
          <Stack.Screen
            name="workerHome"
            component={WorkerHome}
            options={{ headerBackVisible: false, headerShown: false }}
          />
        ) : 
          <>
            <Stack.Screen
              name="Login"
              component={HomeScreen}
              options={{
                headerLeft: (props) => null,
                headerBackVisible: false,
              }}
            />
          </>
        )} */}
        <Stack.Screen
          name="Login"
          component={HomeScreen}
          options={{ headerBackVisible: false, headerShown: false }}
        />
        <Stack.Screen
          name="adminHome"
          component={Tabs}
          options={{ headerBackVisible: false, headerShown: false }}
        />
        <Stack.Screen
          name="workerHome"
          component={WorkerTab}
          options={{ headerBackVisible: false, headerShown: false }}
        />
        <Stack.Screen
          name="farmHome"
          component={FarmTab}
          options={{ headerBackVisible: false, headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <View style={styles.signInBackground}>
        <Text color="white">Connect with Wallet</Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() =>
            navigation.navigate("farmHome", {
              address: global.myAddress,
            })
          }
        >
          <Text style={styles.signInText}>Sign in to Farm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() =>
            navigation.navigate("workerHome", {
              address: global.myAddress,
            })
          }
        >
          <Text style={styles.signInText}>Sign in to Worker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={() =>
            navigation.navigate("adminHome", {
              address: global.myAddress,
            })
          }
        >
          <Text style={styles.signInText}>Sign in to Admin</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  signInBackground: {
    width: "80%",
    height: "50%",
    backgroundColor: "white",
    paddingTop: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1e140a",
    justifyContent: "center",
    alignItems: "center",
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

  logo: {
    height: 100,
    width: 100,
    marginVertical: 50,
  },

  signInText: {
    color: "white",
  },

  inputText: {
    opacity: 0.6,
    alignContent: "flex-start",
    padding: 10,
  },

  inputTextBox: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    width: "80%",
    height: "15%",
    justifyContent: "flex-end",
  },
});
