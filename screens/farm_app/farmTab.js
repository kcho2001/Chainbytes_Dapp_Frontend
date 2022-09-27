import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { StyleSheet } from "react-native";
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
