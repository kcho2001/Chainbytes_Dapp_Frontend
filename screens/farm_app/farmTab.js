import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CreateForeman from "./createForeman";
import PayWorker from "./payWorker";

const Tab = createBottomTabNavigator();

export default function FarmTab({ route }) {
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
        children={() => <CreateForeman address={route.params.address} />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"wallet"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Pay Worker"
        children={() => <PayWorker address={route.params.address} />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name={"home"} color={color} size={size} />
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
