import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  RefreshControl,
} from "react-native";
import WorkerTab from "./worker_app/workerTab.js";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "@ethersproject/shims";
import { ethers, getDefaultProvider } from "ethers";
import Tabs from "./foreman_app/navigation/tabs";
import FarmTab from "./farm_app/farmTab";
import * as config from "./ChainBytesConfig.js";
import { Text, View } from "../components/Themed";

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
const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

export default function App({ navigation }) {
  const connector = useWalletConnect();
  // async function getBalance() {
  //   await provider.getBalance(connector.accounts[0]).then((result) => {
  //     console.log(ethers.utils.formatEther(result));
  //   });
  // }
  // getBalance();

  const killSession = React.useCallback(() => {
    connector.killSession();
    navigation.navigate("Root");
  }, [connector]);

  const my_address = connector.accounts[0];
  const [Farm, setFarm] = useState(false);
  const [Foreman, setForeman] = useState(false);
  const [Loading1, setLoading1] = useState(true);
  const [Loading2, setLoading2] = useState(true);
  try {
    useEffect(() => {
      async function getData() {
        await contract.isFarm(my_address).then((result) => {
          setFarm(result);
          setLoading1(false);
        });
      }
      getData();
    }, []);
    useEffect(() => {
      async function getData() {
        await contract.isForeman(my_address).then((result) => {
          setForeman(result);
          setLoading2(false);
        });
      }
      getData();
    }, []);
  } catch (e) {
    console.log(e);
  }

  if (Loading1 || Loading2) {
    return <Text> Loading </Text>;
  } else {
    // Stack Navigator is created using a protected routes framework
    // Protected routes flow is defined here: https://reactnavigation.org/docs/auth-flow/
    return (
      <Stack.Navigator
        screenOptions={{
          animation: "none",
        }}
      >
        {Farm == true && (
          <>
            <Stack.Screen
              name="farmHome"
              component={FarmTab}
              options={{
                headerBackVisible: false,
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </>
        )}
        {Foreman == true && (
          <>
            <Stack.Screen
              name="adminHome"
              component={Tabs}
              options={{
                headerBackVisible: false,
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </>
        )}
        {!Farm && !Foreman && (
          <>
            <Stack.Screen
              name="workerHome"
              component={WorkerTab}
              options={{
                headerBackVisible: false,
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    );
  }
}

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
