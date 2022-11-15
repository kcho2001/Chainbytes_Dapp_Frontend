import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import BatchPay from "./batchPay";
import CreateForeman from "./createForeman";
import HomeTab from "./Home";
import { textColor, backgroundColor, View } from '../../components/Themed'

const Tab = createBottomTabNavigator();

export default function FarmTab({ navigation }) {
  const connector = useWalletConnect();
  const color = textColor()
  const bg = backgroundColor();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={() => ({
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
        //   backgroundColor: "#C4A484",
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
          left: 15,
          right: 15,
          backgroundColor: bg,
          borderRadius: 15,
          borderWeight: 2,
          borderTopColor: bg,
          height: 50,
          ...styles.shadow
        },
        tabBarActiveTintColor: color
      })}
    >
      <Tab.Screen
        name="Create Foreman"
        children={({ navigation }) => <CreateForeman navigation={navigation} />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"wallet"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        //Home tab
        name="Home"
        component={HomeTab}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"home"} color={color} size={size} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Batch Pay"
        children={() => <BatchPay />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons
              name={"checkmark-done-sharp"}
              color={color}
              size={size}
            ></Ionicons>
          ),
        }}
      ></Tab.Screen>
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

  shadow: {
    shadowColor: "lightgrey",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
});
