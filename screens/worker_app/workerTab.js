import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import QRWallet from "./qrWallet";
import WorkerHomeScreen from "./workerHome";
import WorkCalendar from "./workerCalendar";
import { ethers } from "ethers";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { textColor, backgroundColor, View } from "../../components/Themed";
import { tabBarStyles } from "../../style";

const Tab = createBottomTabNavigator();

export default function WorkerTab({ route }) {
  const connector = useWalletConnect();
  const color = textColor();
  const bg = backgroundColor();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        gestureEnabled: false,
        headerBackVisible: false,
        headerTransparent: true,
        detachInactiveScreens: true,
        headerRight: () => (
          <Pressable
            onPress={() => navigation.navigate("Modal")}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, })}>
            <FontAwesome
              name="info-circle"
              size={25}
              style={{ marginRight: 15 }}
              color={color}
            />
          </Pressable>
        ),
        headerTitleStyle: [tabBarStyles.headerTitleStyle, { color: color }],
        tabBarShowLabel: false,
        tabBarStyle: [tabBarStyles.bottomTabs, { backgroundColor: bg, borderTopColor: bg, }],
        tabBarActiveTintColor: color,
      })}
    >
      <Tab.Screen
        name="QR Wallet"
        children={() => <QRWallet />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"wallet"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        children={() => <WorkerHomeScreen />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"home"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        children={() => <WorkCalendar />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"calendar"} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
