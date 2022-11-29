import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ethers } from "ethers";
import * as config from "../ChainBytesConfig";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import Spinner from "react-native-loading-spinner-overlay";
import { Text, View, backgroundColor } from '../../components/Themed';
import { homeStyles } from "../../style";


const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
let contract = new ethers.Contract(
  config.contractAddress,
  config.contractAbi,
  provider
);

// This function will turn an address into an abbreviated version
const shortenAddress = (address) => {
  global.myAddress = address;
  let ret = `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
  return ret;
};

// Returns the home screen, displaying informaiton
export default function Home({ route }) {
  const connector = useWalletConnect();
  const my_address = connector.accounts[0];
  const [Farm, setFarm] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [balance, setBalance] = useState("");
  const bg = backgroundColor();
  const [chainId, setChainId] = useState()

  // Queries the provider for: chainID, current user's balance, and current user's role according to the contract
  useEffect(() => {
    async function getBalance() {
      await provider.getNetwork().then((result) => {
        setChainId(result.name)
      })
      await provider.getBalance(connector.accounts[0]).then((result) => {
        setBalance(ethers.utils.formatEther(result));
        setLoading2(false);
      });
    }
    getBalance();

    async function getData() {
      await contract.isFarm(my_address).then((result) => {
        setFarm(result);
        setLoading(false);
      });
    }
    getData();
  });

  if (loading || loading2) {
    return (
      <View style={homeStyles.mainContainer}>
        <Spinner
          visible={loading || loading2}
          textContent={"Loading..."}
          textStyle={homeStyles.spinnerTextStyle}
        />
      </View>
    );
  } else {
    return (
      <NavigationContainer
        independent={true}
      >
        <SafeAreaView style={[homeStyles.screen, { backgroundColor: bg }]}>
          <View style={homeStyles.mainContainer}>
            {Farm && (
              <Text style={[homeStyles.mainText]}>
                Hello, {shortenAddress(my_address)}{" "}
              </Text>
            )}
            {!Farm && (
              <Text style={homeStyles.mainText}>
                Hello, you are not a Farm! You shouldn't be here
              </Text>
            )}
          </View>
          {/**This will display the active workers of the farm*/}
          <View style={homeStyles.subContainer}>
            <Text style={homeStyles.subText}>
              Balance: {balance.slice(0, 7) + " ETH on " + chainId.charAt(0).toUpperCase() + chainId.slice(1)}
            </Text>
          </View>
          {/**This will display the amount of active workers under the farm */}
          <View style={homeStyles.subContainer}>
            {/* TODO: make a query to get total number of workers with daysUnpaid > 0, and display it here */}
            <Text style={homeStyles.subText}>
              You have no/# unpaid Workers
            </Text>
          </View>
        </SafeAreaView>
      </NavigationContainer>
    );
  }
}