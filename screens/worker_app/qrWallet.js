import { StyleSheet, Button } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, backgroundColor } from "../../components/Themed";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

// Function to abbreviate address
const shortenAddress = (address) => {
  global.myAddress = address;
  let ret = `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
  return ret;
};

export default function QRWallet() {
  const connector = useWalletConnect();
  const address = connector.accounts[0]; //Address to use for querying the balance, once we get the address
  const bg = backgroundColor();
  return (
    // Returns abbreviated address with qrCode scannable version
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.mainContainer}>
        <Text style={styles.walletText}> My Wallet</Text>
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.addressText}> {shortenAddress(address)}</Text>
      </View>
      <View style={styles.QRContainer}>
        <QRCode size={300} value={address} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 50,
  },
  subContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
    width: "100%",
  },
  QRContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    paddingBottom: 250,
  },
  walletText: {
    fontSize: 50,
    fontFamily: "HelveticaNeue-Bold",
  },
  addressText: {
    fontSize: 25,
    paddingBottom: 50,
    fontFamily: "Helvetica Neue",
  },
});
