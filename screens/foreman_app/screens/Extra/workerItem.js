import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function WorkerItem({ item, pressHandler }) {
  return (
    <TouchableOpacity onPress={() => pressHandler(item.text)}>
      <Text style={styles.item}>{item.text}</Text>
    </TouchableOpacity>
  );
}

export function WorkerCheckinItem({ item, pressHandler }) {
  return (
    <TouchableOpacity onPress={() => pressHandler(item)}>
      <Text style={styles.item}>
        {shortenAddress(item.id)}: {item.daysUnpaid}
      </Text>
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

const styles = StyleSheet.create({
  item: {
    padding: 16,
    marginTop: 16,
    borderColor: "#bbb",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
  },
  checkInItem: {
    padding: 16,
    marginTop: 16,
    borderColor: "#bbb",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    fontSize: 8,
  },
});
