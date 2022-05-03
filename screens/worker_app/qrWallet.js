import { Text, View, StyleSheet, Button } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QRWallet(props) {
  const address = props.address; //Address to use for querying the balance, once we get the address
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.walletText}> My Wallet</Text>
      <Text style={styles.addressText}> {address}</Text>
      <QRCode size={250} value={address} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: 0,
  },
  walletText: {
    fontSize: 50,
    marginTop: 40,
    marginBottom: 50,
  },
  addressText: {
    fontSize: 15,
    color: "black",
    paddingBottom: 50,
  },
});
