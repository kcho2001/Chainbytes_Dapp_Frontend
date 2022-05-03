import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Text, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import QRWallet from "./qrWallet";
import WorkerHomeScreen from "./workerHome";
import WorkCalendar from "./workerCalendar";
import { ethers } from "ethers";

const Tab = createBottomTabNavigator();

export default function WorkerTab({ route }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#C4A484",
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "800",
          fontFamily: "Cochin",
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="QR Wallet"
        children={() => <QRWallet address={route.params.address} />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"wallet"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        children={() => <WorkerHomeScreen address={route.params.address} />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"home"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        children={() => <WorkCalendar address={route.params.address} />}
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
