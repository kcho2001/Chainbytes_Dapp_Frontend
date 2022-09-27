import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import BatchPay from "./batchPay";
import CreateForeman from "./createForeman";
import PayWorker from "./payWorker";
import HomeTab from "./Home"

const Tab = createBottomTabNavigator();

export default function FarmTab({ route }) {
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
        name="Create Foreman"
        children={() => <CreateForeman address={connector.accounts[0]} />}
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
        initialParams={{ address: connector.accounts[0] }}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"home"} color={color} size={size} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Pay Worker"
        children={() => <PayWorker address={connector.accounts[0]} />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"checkmark-sharp"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Batch Pay"
        children={() => <BatchPay address={connector.accounts[0]} />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"checkmark-done-sharp"} color={color} size={size}></Ionicons>
          ),
        }}
        >
      </Tab.Screen>
      
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
