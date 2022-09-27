/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ConnectorEvents,
  useWalletConnect,
} from "@walletconnect/react-native-dapp";
import * as React from "react";
import {
  ColorSchemeName,
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import roleNavigation from "../screens/roleNavigation";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import Spinner from "react-native-loading-spinner-overlay";
import Tabs from "../screens/foreman_app/navigation/tabs";
import FarmTab from "../screens/farm_app/farmTab";
import WorkerTab from "../screens/worker_app/workerTab.js";
import * as config from "../screens/ChainBytesConfig";

global.myAddress = "";

const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

export default function Navigation({ colorScheme } = ColorSchemeName) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      // theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={LogInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Screen
        name="Main Menu"
        component={roleNavigation}
        options={({ navigation }) => ({
          headerShown: false,
          gestureEnabled: false,
          headerBackVisible: false,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
      <Stack.Screen
        name="adminHome"
        component={Tabs}
        options={({ navigation }) => ({
          headerBackVisible: false,
          headerShown: true,
          gestureEnabled: false,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
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
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
function LogInScreen({ navigation }) {
  const [spinnerState, setSpinnerState] = React.useState(false);

  const connector = useWalletConnect();

  const [foremanStatus, setForeman] = React.useState(true);
  React.useEffect(() => {
    async function getData() {
      await contract
        .isForeman(connector.accounts[0])
        .then((result) => setForeman(result))
        .then((result) => console.log(result));
    }
    getData();
  }, [connector]);

  const [farmStatus, setFarm] = React.useState(true);
  React.useEffect(() => {
    async function getData() {
      await contract
        .isFarm(connector.accounts[0])
        .then((result) => setFarm(result))
        .then((result) => console.log(result));
    }
    getData();
  }, [connector]);

  const connectWallet = React.useCallback(async () => {
    const connected = await connector
      .connect()
      .then(() => setSpinnerState(!spinnerState));
    return connected;
  }, [connector]);

  return (
    <NavigationContainer independent={true}>
      <View style={styles.container}>
        <Spinner
          visible={spinnerState}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
        <Text style={styles.title}>ChainBytes Coffee Project</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        {!connector.connected && (
          <TouchableOpacity onPress={connectWallet} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
          </TouchableOpacity>
        )}
        {!!connector.connected &&
          farmStatus &&
          // setSpinnerState(!spinnerState) &&
          navigation.navigate("farmHome", {
            navigation: { navigation },
          })}
        {!!connector.connected &&
          // foremanStatus &&
          navigation.navigate("adminHome", {
            navigation: { navigation },
          })}
        {/* {!!connector.connected &&
          // this.setState({
          //   spinner: !state.spinner,
          // }) &&
          navigation.navigate("workerHome", {
            navigation: { navigation },
          })} */}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
