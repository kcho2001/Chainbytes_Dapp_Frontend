import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import Home from "../screens/Home";
import Scanner from "../screens/Scanner";
import Checked_in from "../screens/Checked_in";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

// creates the tab navigator
const Tab = createBottomTabNavigator();

// creates the tabs
const Tabs = ({ route }) => {
  const connector = useWalletConnect();
  return (
    <Tab.Navigator
      // Starts on Home screen, plus screen options
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
      }}
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
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"home"} color={color} size={size} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        //Checked in tab, pass null values initially to screen
        name="Checked In"
        component={Checked_in}
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

// style sheet
const stlyes = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default Tabs;
