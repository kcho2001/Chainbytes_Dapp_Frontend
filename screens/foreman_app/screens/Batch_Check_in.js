import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import WorkerItem from "./Extra/workerItem";
import * as config from "../../ChainBytesConfig.js";
import { ethers } from "ethers";
import moment from "moment";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Spinner from "react-native-loading-spinner-overlay";
import {View, Text} from '../../../components/Themed'

let checkIn = 0;

const setCheckIn = (num) => {
  checkIn += num;
};

export function checkedIn() {
  return checkIn;
}

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
      var workers2 = [];
      for (const worker of _workerAddress) {
        workers2.push(worker.text);
      }
      const provider = new WalletConnectProvider({
        rpc: {
          5: config.providerUrl,
        },
        chainId: 5,
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
        setLoading(true);
        await contract.checkIn(workers2, date).then((result) => {
          console.log(workers2.length + " workers signed in at " + date);
          setCheckIn(workers2.length);
          setWorkers((prevWorkers) => {
            return prevWorkers.filter((worker) => worker.text == worker.key);
          });
          setLoading(false);
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
      <View style={styles.container}>
        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
    );
  } else {
    if (workers.length === 0) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.list}>
              <WorkerItem
                item={{ text: "No workers have signed in yet!" }}
                pressHandler={() => {}}
              ></WorkerItem>
            </View>
          </View>
          <View style={styles.flex}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => console.log("No one has been checked in yet!")}
            >
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
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => check_in_workers(workers)}
            >
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
  },
  content: {
    padding: 5,
  },
  list: {
    marginTop: '25%'
  },
  flex: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: '100%',
    padding: 20,
    marginBottom: 20
  },
  buttonStyle: {
    backgroundColor: "#8B8B8B",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 20,
    bottom: '7%',
    width: '100%'
  },
  buttonTextStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Helvetica Neue"
  },
});
