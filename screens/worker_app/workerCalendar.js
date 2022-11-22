import { StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { useState } from "react";
import { Calendar } from "react-native-calendars";
import * as config from "../ChainBytesConfig";
import { ethers } from "ethers";
import {
  Text,
  View,
  backgroundColor,
  textColor,
} from "../../components/Themed";
import * as query from "../../query";
import { useQuery } from "@apollo/client";
import { useWalletConnect } from "@walletconnect/react-native-dapp";


// Contract declaration
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
        [formattedDate]: { selectedColor: "#8F8F8F", selected: true },
        prevCheckIns,
      };
    });
    // console.log(date.year + "-" + date.month + "-" + date.day);
  }
}

export default function WorkCalendar(props) {
  const connector = useWalletConnect();
  const [checkIns, setCheckIns] = useState({});
  let bg = backgroundColor();
  let tc = textColor();

  const handleRefresh = () => {
    // manually refetch data
    refetch();
  };

  const { loading, error, data, refetch } = useQuery(
    query.GET_WORKER_CHECKINS(connector.accounts[0]),
    {
      onCompleted: () => {
        if (data.worker != null) {
          formatDates(data.worker.checkIns, setCheckIns);
        }
      },
      notifyOnNetworkStatusChange: true,
    }
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
      <SafeAreaView style={[styles.screen, { backgroundColor: bg }]}>
        <Calendar
          minDate={"2022-05-01"}
          hideExtraDays={true}
          // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          //maxDate={}
          // // Handler which gets executed on day press.
          // onDayPress={(day) => {
          //   console.log("selected day", day);
          // }}
          enableSwipeMonths={true}
          // markedDates={{ checkIns }}
          markedDates={checkIns}
          style={{
            height: "100%",
            justifyContent: "center",
            backgroundColor: bg,
          }}
          theme={{
            calendarBackground: bg,
            textSectionTitleColor: tc,
            todayTextColor: tc,
            dayTextColor: "gray",
            monthTextColor: tc,
            arrowColor: tc,
            textDayFontFamily: "HelveticaNeue-Bold",
            textMonthFontFamily: "HelveticaNeue-Bold",
            textDayHeaderFontFamily: "HelveticaNeue-Bold",
            textDayFontSize: 18,
            textMonthFontSize: 25,
            textDayHeaderFontSize: 14,
          }}
        />
        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => handleRefresh()}
          >
            <Text style={styles.buttonTextStyle}> Refresh Calendar </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 100,
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
});
