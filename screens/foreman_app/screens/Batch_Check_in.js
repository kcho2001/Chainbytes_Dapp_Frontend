import React, { useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import WorkerItem from "./Extra/workerItem";
import * as config from "../../ChainBytesConfig.js";
import { ethers } from "ethers";
import moment from "moment";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";

// For connecting to the contract
const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

export default function Checked_in({ route }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const connector = useWalletConnect();
  // Function to check in a worker
  // NB: Handle result in a better way. Check for errors

  const check_in_workers = React.useCallback(
    async (_workerAddress) => {
      var date = moment().utcOffset("-04:00").format("YYYY-MM-DD hh:mm:ss a");
      var workers2 = []
      for(const worker of _workerAddress){
        workers2.push(worker.text)
      }
      const provider = new WalletConnectProvider({
        rpc: {
          4: config.providerUrl,
        },
        connector: connector,
        qrcode: false,
      });

      await provider.enable();
      const ethers_provider = new ethers.providers.Web3Provider(provider);
      const signer = ethers_provider.getSigner();
      let contract = new ethers.Contract(
        config.contractAddress,
        config.contractAbi,
        signer
      );
      try {
        setLoading(true)
        await contract
          .checkIn(workers2, date)
          .then((result) => {
            console.log(workers.length + " workers signed in at " + date)
            setWorkers([])
            setLoading(false)
          });
      } catch (e) {
        console.error(e);
      }
    },
    [connector]
  );

  // Removes worker from worker array to display
  const removeWorker = (key) => {
    setWorkers((prevWorkers) => {
      return prevWorkers.filter((worker) => worker.text != key);
    });
    route.params.new = false;
    route.params.data = null;
    route.params.type = null;
  };

  // Adds worker to worker array
  const addWorker = (type, data) => {
    setWorkers((prevWorkers) => {
      return [
        { type: type, text: data, key: Math.random().toString() },
        ...prevWorkers,
      ];
    });
    route.params.new = false;
    route.params.data = null;
    route.params.type = null;
  };

  // Kinda jerry rigged this solution to address parameters not resetting between tabs
  if (route.params.new) {
    if (workers.some((el) => el.text === route.params.data)) {
      removeWorker(route.params.data);
    } else {
      addWorker(route.params.type, route.params.data);
    }
  }
  // check_in_workers("0x6d957F99895211964670976F51420866D66614C3");
  // If there are no workers signed in, display that no workers have signed in
  if (loading) {
    return (
      <Text> Loading </Text>
    )
  } else {
    if (workers.length === 0) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.list}>
              <WorkerItem
                item={{ text: "No workers have signed in yet!" }}
                pressHandler={() => { }}
              ></WorkerItem>
            </View>
          </View>
          <View style={styles.flex}>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => console.log("No one has been checked in yet!")}>
              <Text style={styles.buttonTextStyle}> Check in </Text>
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
                  <WorkerItem
                    item={item}
                    pressHandler={removeWorker}
                  ></WorkerItem>
                )}
              ></FlatList>
            </View>
          </View>
          <View style={styles.flex}>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => check_in_workers(workers)}>
              <Text style={styles.buttonTextStyle}> Check in </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
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
  flex: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20
  },
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
