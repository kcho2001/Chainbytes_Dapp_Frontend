import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import WorkerItem from "./Extra/workerItem";
import "../../ChainBytesConfig.js";
import { ethers } from "ethers";
import moment from "moment";
import "../../global";

// For connecting to the contract
const provider = new ethers.providers.JsonRpcProvider(url);
let contract = new ethers.Contract(contractAddress, contractAbi, provider);

export default function Checked_in({ route }) {
  const [workers, setWorkers] = useState([]);

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
    checkIn(data);
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

  // If there are no workers signed in, display that no workers have signed in
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
      </View>
    );
  }
}

// async function to connect to contract
checkIn = async (address) => {
  var date = moment().utcOffset("-04:00").format("YYYY-MM-DD hh:mm:ss a");
  console.log("Checked in worker on Date Time: " + date);
  //contract.checkIn(address, date);
};

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
});
