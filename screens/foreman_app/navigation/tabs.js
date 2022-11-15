import { StyleSheet, Pressable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";

import Home from "../screens/Home";
import Scanner from "../screens/Scanner";
import BatchCheckIn from "../screens/Batch_Check_in"
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { textColor, backgroundColor, View } from '../../../components/Themed'
import { tabBarStyles } from "../../../style";

// creates the tab navigator
const Tab = createBottomTabNavigator();

// creates the tabs
const Tabs = ({ route }) => {
  const connector = useWalletConnect();
  const color = textColor()
  const bg = backgroundColor();
  return (
    <Tab.Navigator
      // Starts on Home screen, plus screen options
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
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}
          >
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
        //tabBarItemStyle: tabBarStyles.tabBarItemStyle,
        tabBarIconStyle: {
          flex: 1
        },
      })}
    >
      <Tab.Screen
        //Scanner tab
        name="Scanner"
        component={Scanner}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"camera"} color={color} size={size} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        //Home tab
        name="Home"
        component={Home}
        initialParams={{ address: connector.accounts[0] }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={"home"} color={color} size={size} />
          ),
        }}
      ></Tab.Screen>
      {/* <Tab.Screen
        //Checked in tab, pass null values initially to screen
        name="Checked In"
        component={Checked_in}
        initialParams={{ type: null, data: null, new: false }}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"checkbox"} color={color} size={size} />
          ),
        }}
      ></Tab.Screen> */}
      <Tab.Screen
        //Checked in tab, pass null values initially to screen
        name="Batch Check In"
        component={BatchCheckIn}
        initialParams={{ type: null, data: null, new: false }}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"checkbox"} color={color} size={size} />
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default Tabs;
