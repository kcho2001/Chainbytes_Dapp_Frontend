import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import * as config from "../ChainBytesConfig";
import WorkerItem, {
  WorkerCheckinItem,
} from "../foreman_app/screens/Extra/workerItem";
import { useQuery } from "@apollo/client";
import * as query from "../../query";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import { View, Text, backgroundColor } from '../../components/Themed'

export default function BatchPay() {
  //Rate is bound to change depending on how much the workers should be paid (amount in Wei)
  const rate = 10000;
  const [workers, setWorkers] = useState([]);

  const handleRefresh = () => {
    // manually refetch data
    refetch();
  };

  const { loading, error, data, refetch } = useQuery(query.GET_CHECKINS, {
    onCompleted: () => {
      setWorkers(data.checkIns);
    },
    notifyOnNetworkStatusChange: true,
  });

  const removeWorker = (key) => {
    setWorkers((prevWorkers) => {
      return prevWorkers.filter(
        (worker) => worker.workerCheckedIn.id != key.id
      );
    });
    // setBalance((prevBalance) => {
    //   return prevBalance - key.daysUnpaid * rate;
    // });
  };

  const connector = useWalletConnect();

  const batchPay = React.useCallback(async () => {
    try {
      var date = moment().utcOffset("-04:00").format("YYYY-MM-DD hh:mm:ss a");
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
      let addresses = [];
      let balances = [];
      let balance = 0;

      for (let i = 0; i < workers.length; i++) {
        addresses.push(workers[i].workerCheckedIn.id);
        balances.push(workers[i].workerCheckedIn.daysUnpaid * rate);
        balance += workers[i].workerCheckedIn.id * rate;
      }

      // Override to allow a value to be added when calling contract
      let overrides = {
        // To convert Ether to Wei:
        value: balance, // ether in this case MUST be a string
      };
      await contract
        .payWorkers(addresses, balances, date, overrides)
        .then((result) => console.log(result));
    } catch (e) {
      console.error(e);
    }
  }, [connector]);

  return (
    <>
      {loading && (
        <View style={styles.container}>
          <Spinner
            visible={loading}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyle}
          />
        </View>
      )}
      {error && <Text>Error: {error.message}</Text>}
      {!loading && !error && workers.length === 0 && (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.list}>
              <WorkerItem
                item={{ text: "No workers to pay yet!" }}
                pressHandler={() => { }}
              ></WorkerItem>
            </View>
          </View>
          <View style={styles.bottom}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => handleRefresh()}
            >
              <Text style={styles.buttonTextStyle}> Refresh List </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!loading && !error && workers.length != 0 && (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.list}>
              <FlatList
                data={workers}
                keyExtractor={worker => worker.workerCheckedIn.id}
                renderItem={({ item }) => (
                  <WorkerCheckinItem
                    item={{
                      id: item.workerCheckedIn.id,
                      daysUnpaid: item.workerCheckedIn.daysUnpaid,
                    }}
                    pressHandler={removeWorker}
                    keyExtractor={(item, index) => index.toString()}
                  ></WorkerCheckinItem>
                )}
              ></FlatList>
            </View>
          </View>
          <View style={styles.flex}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => handleRefresh()}
            >
              <Text style={styles.buttonTextStyle}> Refresh List </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => batchPay()}
            >
              <Text style={styles.buttonTextStyle}> Pay workers </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 5
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
