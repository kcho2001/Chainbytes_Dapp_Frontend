import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { View, Text, TextInput, textColor } from "../../components/Themed";
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

export default function BatchPay() {
  //Rate is bound to change depending on how much the workers should be paid (amount in Wei)
  const [rate, setRate] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(10000);
  const [workers, setWorkers] = useState([]);
  const [balance, setBalance] = useState(0);
  const tc = textColor();

  // This is to update the balance anytime the workers or rate is changed
  useEffect(() => {
    let _balance = 0;
    for (let worker of workers) {
      if (worker.workerCheckedIn.daysUnpaid != 0) {
        _balance += worker.workerCheckedIn.daysUnpaid * rate;
      }
    }
    setBalance(_balance);
  }, [rate, workers]);

  // Function to get current rate of ETH for USD
  async function getPrice(setExchangeRate) {
    await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
    )
      .then((response) => response.json())
      .then((data) => {
        // Change ETH per USD to WEI per USD
        var WEIPerETH = ethers.BigNumber.from("10").pow(18);
        var USDperETH = ethers.BigNumber.from(Math.ceil(data["USD"]));
        var exchangeRate = ethers.BigNumber.from(WEIPerETH).div(USDperETH);
        setExchangeRate(exchangeRate);
      });
  }
  getPrice(setExchangeRate);

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
  };

  const connector = useWalletConnect();

  const batchPay = React.useCallback(
    async (rate, workers) => {
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
          if (workers[i].workerCheckedIn.daysUnpaid != 0) {
            addresses.push(workers[i].workerCheckedIn.id);
            balances.push(
              ethers.BigNumber.from(exchangeRate)
                .mul(workers[i].workerCheckedIn.daysUnpaid)
                .mul(rate)
            );
            balance = ethers.BigNumber.from(balance).add(
              ethers.BigNumber.from(exchangeRate)
                .mul(workers[i].workerCheckedIn.daysUnpaid)
                .mul(rate)
            );
          }
          console.log(rate);
        }
        // Override to allow a value to be added when calling contract
        let overrides = {
          // To convert Ether to Wei:
          value: balance.toString(), // ether in this case MUST be a string
        };
        await contract
          .payWorkers(addresses, balances, date, overrides)
          .then((result) => console.log(result));
      } catch (e) {
        console.error(e);
      }
    },
    [connector]
  );

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
                pressHandler={() => {}}
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
          <View style={styles.bottom}>
            <View
              style={{
                flexDirection: "row",
                textAlignVertical: "center",
              }}
            >
              <Text>Total balance:{"     "}</Text>
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={{
                    alignSelf: "flex-start",
                    textAlignVertical: "top",
                    position: "relative",
                  }}
                >
                  ~${balance.toString()}
                </Text>
                <Text
                  style={{
                    textAlignVertical: "bottom",
                    position: "relative",
                    alignSelf: "flex-start",
                  }}
                >
                  {ethers.utils
                    .formatEther(
                      ethers.BigNumber.from(balance)
                        .mul(exchangeRate)
                        .toString()
                    )
                    .slice(0, 7)}{" "}
                  ETH
                </Text>
              </View>
            </View>

            <View>
              <Text style={{ padding: 15, paddingBottom: 5 }}>
                Rate to pay workers (USD per day)
              </Text>
              <TextInput
                style={[styles.input, { borderColor: tc }, { color: tc }]}
                onChangeText={setRate}
                placeholder="Rate"
                value={rate != 0 ? rate : 0}
                placeholderTextColor="grey"
              />
            </View>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => handleRefresh()}
            >
              <Text style={styles.buttonTextStyle}> Refresh List </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => batchPay(rate, workers)}
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
    backgroundColor: "#fff",
  },
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
  content: {
    padding: 30,
  },
  list: {
    marginTop: 0,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
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
    marginTop: 10,
    marginBottom: 10,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    height: 40,
    margin: 12,
    marginVertical: 0,
    borderWidth: 1,
    padding: 10,
    paddingVertical: 0,
  },
});
