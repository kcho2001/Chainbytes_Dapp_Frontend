import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Pressable, View, Text, Button } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import QRWallet from "./qrWallet";
import WorkerHomeScreen from "./workerHome";
import WorkCalendar from "./workerCalendar";
import { ethers } from "ethers";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

const Tab = createBottomTabNavigator();

export default function WorkerTab({ route }) {
  const connector = useWalletConnect();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        headerShown: true,
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
        headerStyle: {
          backgroundColor: "#C4A484",
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "800",
          fontFamily: "Cochin",
        },
        tabBarShowLabel: false,

        // Different tab bar style (uncomment to see)
        /*tabBarStyle: {
                    position: 'absolute',
                    bottom: 25,
                    left: 20,
                    right: 20,
                    elevation: 0,
                    backgroundColor: "#ffffff",
                    borderRadius: 100,
                    height: 90,
                    ... stlyes.shadow
                }*/
      })}
    >
      <Tab.Screen
        name="QR Wallet"
        children={() => <QRWallet address={connector.accounts[0]} />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"wallet"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        children={() => <WorkerHomeScreen address={connector.accounts[0]} />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"home"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        children={() => <WorkCalendar address={connector.accounts[0]} />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"calendar"} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: "#1e140a",
    alignContent: "flex-end",
    justifyContent: "flex-end",
  },

  mainText: {
    fontSize: 20,
    color: "white",
  },
});
