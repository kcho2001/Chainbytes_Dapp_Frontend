import { StyleSheet, Pressable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";

import Home from "../screens/Home";
import Scanner from "../screens/Scanner";
import BatchCheckIn from "../screens/Batch_Check_in"
import { useWalletConnect } from "@walletconnect/react-native-dapp";

// creates the tab navigator
const Tab = createBottomTabNavigator();
import { textColor, backgroundColor, View } from '../../../components/Themed'


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
        // headerStyle: {
        //   backgroundColor: ,
        // },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "800",
          fontFamily: "HelveticaNeue-Bold",
          color: color
        },
        tabBarShowLabel: false,

        // Different tab bar style (uncomment to see)
        tabBarStyle: {
          position: 'absolute',
          flex: 1,
          alignItems: 'center',
          justifyContent: "center",
          bottom: '2%',
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: bg,
          borderRadius: 20,
          height: 50,
          ...stlyes.shadow
        },
        tabBarActiveTintColor: color
      })}
    >
      <Tab.Screen
        //Scanner tab
        name="Scanner"
        component={Scanner}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"camera"} color={color} size={size} style={{ textAlignVertical: 'center' }} />
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

// style sheet
const stlyes = StyleSheet.create({
  shadow: {
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4.5,
    elevation: 5,
  },
});

export default Tabs;
