import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from "react-native-qrcode-svg";
import { Text, textColor, View } from '../components/Themed';
import { SafeAreaView } from "react-native-safe-area-context";

const shortenAddress = (address: string) => {
  global.myAddress = address;
  let ret = `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
  return ret;
}

export default function ModalScreen({ navigation }) {
  const connector = useWalletConnect();
  const tc = textColor();

  const killSession = React.useCallback(() => {
    connector.killSession();
    navigation.navigate("Root");
  }, [connector]);

  return (
    <View style={[styles.screen, { borderColor: tc, paddingTop: 20, borderRadius: 10, borderWidth: 2, borderBottomWidth: 0 }]}>
      <Text style={styles.title}>Currently logged in as:</Text>
      <Text style={styles.addressText}>{shortenAddress(connector.accounts[0])}</Text>
      <View style={styles.screen}>
        <View style={[styles.signInBackground, { borderColor: tc }]}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate("farmHome")}
          >
            <Text style={styles.signInText}>Sign in to Farm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate("adminHome")}
          >
            <Text style={styles.signInText}>Sign in to Foreman</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate("workerHome")}
          >
            <Text style={styles.signInText}>Sign in to Worker</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Log out</Text>
          </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.container2}>
          <QRCode size={200} value={connector.accounts[0]} />
        </SafeAreaView>
        <StatusBar style="auto" />
      </View>
      <View>
      </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: "HelveticaNeue-Bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    backgroundColor: "#272727",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  signInBackground: {
    width: "80%",
    height: "50%",
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButton: {
    width: 200,
    height: 60,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    padding: 1,
    backgroundColor: "#272727",
    opacity: 0.8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    color: "white",
    fontFamily: "Helvetica Neue"
  },
  addressText: {
    fontSize: 16,
    padding: 10
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    fontFamily: "Helvetica Neue"
  },
});
