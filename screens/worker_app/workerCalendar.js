import { StyleSheet, SafeAreaView, Button } from "react-native";
import { Calendar } from "react-native-calendars";
import * as config from "../ChainBytesConfig";
import { ethers } from "ethers";
import { Text, View, backgroundColor, textColor } from '../../components/Themed';

// Contract declaration
const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

export default function WorkCalendar(props) {
  const address = props.address; //Address to use for getting checked in dates
  let bg = backgroundColor()
  let tc = textColor()

  
  return (
    <SafeAreaView style={[styles.screen, {backgroundColor: bg}]}>
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
        markedDates={{ getCheckedIn }}
        style={{
          height: '100%',
          justifyContent: "center",
          backgroundColor: bg
        }}
        theme={{
          calendarBackground: bg,
          textSectionTitleColor: tc,
          todayTextColor: tc,
          dayTextColor: 'gray',
          monthTextColor: tc,
          arrowColor: tc,
          textDayFontFamily: 'HelveticaNeue-Bold',
          textMonthFontFamily: 'HelveticaNeue-Bold',
          textDayHeaderFontFamily: 'HelveticaNeue-Bold',
          textDayFontSize: 18,
          textMonthFontSize: 25,
          textDayHeaderFontSize: 14
        }}
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
