import { NavigationContainer } from "@react-navigation/native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { SafeAreaView } from "react-native-safe-area-context";
import * as config from "../ChainBytesConfig";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import {
  WorkerItem,
  WorkerCheckinItem,
} from "../foreman_app/screens/Extra/workerItem";
import { useQuery } from "@apollo/client";
import * as query from "../../query";

export default function BatchPay() {
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([{ id: "0x", daysUnpaid: 0 }]);

  //   Removes worker from worker array to display
  // const removeWorker = (key) => {
  //   setWorkers((prevWorkers) => {
  //     return prevWorkers.filter((worker) => worker.id != key.id);
  //   });
  // };
  // const removeWorker = React.useCallback(
  //   (key) => {
  //     setWorkers((prevWorkers) => {
  //       return prevWorkers.filter((worker) => worker.id != key.id);
  //     });
  //   },
  //   [workers]
  // );

  // // Adds worker to worker array
  // const addWorker = (type, data) => {
  //   setWorkers((prevWorkers) => {
  //     return [
  //       { type: type, text: data, key: Math.random().toString() },
  //       ...prevWorkers,
  //     ];
  //   });
  // };

  useEffect(function get_checkins() {
    const { loading2, error, data } = useQuery(query.GET_CHECKINS);
    if (loading2) return "Loading...";
    if (error) return `Error! ${error.message}`;
    const workers2 = [];
    for (let i = 0; i < data.checkIns.length; i++) {
      workers2.push({
        id: data.checkIns[i].workerCheckedIn.id,
        daysUnpaid: data.checkIns[i].workerCheckedIn.daysUnpaid,
      });
    }
    // return workers;
    setWorkers(workers2);
    setLoading(false);
  });

  if (loading) {
    return <Text>loading...</Text>;
  } else {
    if (workers.length === 0) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.list}>
              <WorkerItem
                item={{ text: "All caught up! No workers need to be paid" }}
                pressHandler={() => {}}
              ></WorkerItem>
            </View>
          </View>
          <View style={styles.bottom}>
            <Text style={styles.mainText}>Balance: (balance.Total)</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => get_checkins()}
            >
              <Text style={styles.signInText}> Refresh List </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => console.log("Emit batch payment function")}
            >
              <Text style={styles.signInText}> Pay workers </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.list}>
              <FlatList
                data={workers}
                renderItem={({ item }) => (
                  <WorkerCheckinItem
                    item={item}
                    //   pressHandler={removeWorker(item.id.toString)}
                  ></WorkerCheckinItem>
                )}
              ></FlatList>
            </View>
          </View>
          <View style={styles.bottom}>
            <Text style={styles.mainText}>Balance: (balance.Total)</Text>
            {/* <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => get_checkins()}
          >
            <Text style={styles.signInText}> Refresh List </Text>
          </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => console.log("Emit batch payment function")}
            >
              <Text style={styles.signInText}> Pay workers </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  mainText: {
    fontSize: 20,
    color: "black",
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  signInButton: {
    width: 200,
    height: 60,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    padding: 15,
    backgroundColor: "#1e140a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 30,
  },
  list: {
    marginTop: 0,
  },
  bottom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  refreshButton: {
    width: 200,
    height: 60,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    padding: 15,
    backgroundColor: "#48b01c",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
