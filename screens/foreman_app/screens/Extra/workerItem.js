import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, textColor, View } from "../../../../components/Themed";
import { isAddress } from "ethers/lib/utils";

export default function WorkerItem({ item, pressHandler }) {
  return (
    <TouchableOpacity onPress={() => pressHandler(item.text)}>
      <Text style={styles.item}>
        {isAddress(item.text) ? shortenAddress2(item.text) : item.text}
      </Text>
    </TouchableOpacity>
  );
}

export function WorkerCheckinItem({ item, pressHandler }) {
  const tc = textColor();
  return (
    <TouchableOpacity onPress={() => pressHandler(item)}>
      <View style={[styles.checkInItem, (item.selected ? {backgroundColor: 'yellow'} : {})]}>
        <Text style={[styles.checkInText, (item.selected ? {color: 'black'} : {})]}>{shortenAddress(item.id)}:</Text>
        <Text style={[styles.days, (item.selected ? {color: 'black'} : {})]}>{item.daysUnpaid}</Text>
      </View>
    </TouchableOpacity>
  );
}

const shortenAddress = (address) => {
  global.myAddress = address;
  let ret = `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
  return ret;
};

const shortenAddress2 = (address) => {
  global.myAddress = address;
  let ret = `${address.slice(0, 10)}.........................${address.slice(
    address.length - 6,
    address.length
  )}`;
  return ret;
};

const styles = StyleSheet.create({
  days: {
    alignSelf: "flex-end",
    fontFamily: "HelveticaNeue-Bold",
  },

  item: {
    padding: 16,
    marginTop: 16,
    borderColor: "#bbb",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 20,
    alignSelf: "center",
    width: "100%",
    fontFamily: "HelveticaNeue-Bold",
  },
  checkInItem: {
    padding: 16,
    marginTop: 16,
    borderColor: "#bbb",
    borderWidth: 2,
    borderRadius: 20,
    width: "100%",
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
  },
  checkInText: {
    fontFamily: "HelveticaNeue-Bold",
  },
});
