import { StyleSheet, SafeAreaView, Text, Button } from "react-native";
import { Calendar } from "react-native-calendars";
import "../ChainBytesConfig.js";
import { ethers } from "ethers";

// Contract declaration
const provider = new ethers.providers.JsonRpcProvider(url);
let contract = new ethers.Contract(contractAddress, contractAbi, provider);

export default function WorkCalendar(props) {
  const address = props.address; //Address to use for getting checked in dates
  return (
    <SafeAreaView style={styles.screen}>
      <Calendar
        minDate={"2022-05-01"}
        // Do not show days of other months in month page. Default = false
        hideExtraDays={true}
        // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        //maxDate={}
        // // Handler which gets executed on day press.
        // onDayPress={(day) => {
        //   console.log("selected day", day);
        // }}
        enableSwipeMonths={true}
        markedDates={{ getCheckedIn }}
      />
    </SafeAreaView>
  );
}

async function getCheckedIn(address) {
  const checkedIn = await contract
    .daysCheckedIn(address)
    .then((result) => console.log(result));
  let mark = {};
  checkedIn.forEach((day) => {
    mark[day] = { marked: true, dotColor: "#90EE90", activeOpacity: 0 };
  });
  return mark;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
  },
});
