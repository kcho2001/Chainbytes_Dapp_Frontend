import { StyleSheet, SafeAreaView, Button } from "react-native";
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
        [formattedDate]: { selectedColor: "#90EE90", selected: true },
        prevCheckIns,
      };
    });
  }
  console.log(checkIns);
}

export default function WorkCalendar(props) {
  const connector = useWalletConnect();
  const [checkIns, setCheckIns] = useState({});
  let bg = backgroundColor();
  let tc = textColor();

  const { loading, error, data } = useQuery(
    query.GET_WORKER_CHECKINS(connector.accounts[0]),
    {
      onCompleted: () => {
        // console.log(data.worker.checkIns[0].day);
        formatDates(data.worker.checkIns, setCheckIns);
      },
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
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
  },
});
