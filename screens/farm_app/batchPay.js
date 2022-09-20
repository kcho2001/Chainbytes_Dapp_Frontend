import { NavigationContainer } from "@react-navigation/native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import React, { useState } from "react";
import { ethers } from "ethers";
import { SafeAreaView } from "react-native-safe-area-context";
import * as config from "../ChainBytesConfig";
import WorkerItem from "../foreman_app/screens/Extra/workerItem";

export default function BatchPay(props) {
    const [payees, setPayees] = useState([])

    if (payees.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.list}>
                        <WorkerItem
                            item={{ text: "All caught up! No workers need to be paid" }}
                            pressHandler={() => { }}
                        ></WorkerItem>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <Text style={styles.mainText}>Balance: (balance.Total)</Text>
                    <TouchableOpacity style={styles.signInButton} onPress={() => console.log("Emit batch payment function")}>
                        <Text style={styles.signInText}> Pay workers </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.list}>
                        <FlatList
                            data={payees}
                            renderItem={({ item }) => (
                                <WorkerItem
                                    item={item}
                                    pressHandler={removeWorker}
                                ></WorkerItem>
                            )}
                        ></FlatList>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <Text style={styles.mainText}>Balance: (balance.Total)</Text>
                    <TouchableOpacity style={styles.signInButton} onPress={() => console.log("Emit batch payment function")}>
                        <Text style={styles.signInText}> Pay workers </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 80,
    },
    mainText: {
        fontSize: 20,
        color: "black",
        paddingBottom: 5,
        paddingTop: 0,
        marginTop: 0,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    signInButton: {
        width: 200,
        height: 60,
        marginRight: 40,
        marginLeft: 40,
        marginTop: 10,
        padding: 15,
        backgroundColor: "#1e140a",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },
    signInText: {
        color: "white",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 30,
    },
    list: {
        marginTop: 0,
    },
    bottom: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 40
    }
});