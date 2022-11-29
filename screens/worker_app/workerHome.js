import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import { SafeAreaView } from "react-native-safe-area-context";
import * as config from "../ChainBytesConfig.js";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { Text, View, backgroundColor } from "../../components/Themed";
import Spinner from "react-native-loading-spinner-overlay";
import { homeStyles } from "../../style.js";
import { useQuery } from "@apollo/client";
import * as query from "../../query";

const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);


// Function to format checkIns into marked dates format
function formatDates(checkIns, setCheckIns) {
  for (const date of checkIns) {
    setCheckIns((prevCheckIns) => {
      const formattedDate = date.year + "-" + date.month + "-" + date.day;
      return {
        [formattedDate]: { selectedColor: "#90EE90", selected: true },
        prevCheckIns,
      };
    });
    //console.log(date.year + "-" + date.month + "-" + date.day);
  }
}

function formatLastCheckin(lastCheckedIn, setCheckedIn) {
  setCheckedIn(lastCheckedIn.year + "-" + lastCheckedIn.month + "-" + lastCheckedIn.day)
}

export default function WorkerHomeScreen() {
  const connector = useWalletConnect();
  const my_address = connector.accounts[0];
  const [lastCheckedIn, setCheckedIn] = React.useState("N/A");
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState("");
  const [checkIns, setCheckIns] = useState({});
  const intervalRef = useRef(null)
  const [chainId, setChainId] = useState()


  const bg = backgroundColor();

  // Queries array of checkins for the current user
  const { loading2, error, data, refetch } = useQuery(
    query.GET_WORKER_CHECKINS(connector.accounts[0]),
    {
      onCompleted: () => {
        if (data.worker != null) {
          formatDates(data.worker.checkIns, setCheckIns);
          formatLastCheckin(data.worker.checkIns[data.worker.checkIns.length - 1], setCheckedIn)
        }
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  // Retrieves the current user's balance
  useEffect(() => {
    async function getBalance() {
      await provider.getNetwork().then((result) => {
        setChainId(result.name)
      })
      await provider.getBalance(connector.accounts[0]).then((result) => {
        setBalance(ethers.utils.formatEther(result));
        setLoading(false);
      });
    }
    getBalance();
  }, []);

  // Retrieves the current user's last checked in date
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      refetch();
      console.log("refetching last checked in")
    }, 120000)
    return () => clearInterval(intervalRef.current)
  }, [])

  if (loading || loading2) {
    return (
      <View style={homeStyles.container}>
        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={homeStyles.spinnerTextStyle}
        />
      </View>
    );
  } else {
    //console.log(checkIns)
    return (
      <NavigationContainer independent={true}>
        <SafeAreaView style={[homeStyles.screen, { backgroundColor: bg }]}>
          <View style={homeStyles.mainContainer}>
            <Text style={homeStyles.mainText}> Hello Worker </Text>
          </View>
          <View style={homeStyles.subContainer}>
            <Text style={homeStyles.subText}>Last checked in: {lastCheckedIn}</Text>
          </View>
          <View style={homeStyles.subContainer}>
            <Text style={homeStyles.subText}>
              Balance: {balance.slice(0, 7) + " ETH on " + chainId.charAt(0).toUpperCase() + chainId.slice(1)}
            </Text>
          </View>
        </SafeAreaView>
      </NavigationContainer>
    );
  }
}