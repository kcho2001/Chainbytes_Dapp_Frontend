import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import ethereum_address from "ethereum-address";

export default function Scanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");
  const [active, setActive] = useState(true);

  // useEffect(
  //   () =>
  //     navigation.addListener("state", (state) => {
  //       let x = state.data.state.history.length;
  //       if (x === 2) {
  //         setActive(false);
  //       } else if (x === 1) {
  //         setActive(true);
  //       } else {
  //         console.log(
  //           "error: state.data.state.history.length showed length greater != 1 or 2: " +
  //             x
  //         );
  //       }
  //     }),
  //   []
  // );
  // setActive(true);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    navigation.navigate("Create Foreman", {
      data: data,
    });
    console.log("Type: " + type + "\nData: " + data);
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false || active === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  // Return the View
  if (hasPermission === true && active === true) {
    return (
      <View style={styles.container}>
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }}
          />
        </View>
        <Button
          title={"Disable Camera"}
          onPress={() => setHasPermission(false)}
        />
        <Text style={styles.maintext}>{text}</Text>
        {scanned && (
          <Button
            title={"Scan again?"}
            onPress={() => {
              setScanned(false), setText("");
            }}
            color="tomato"
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  maintext: {
    fontSize: 16,
    margin: 10,
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
    bottom: 25,
  },
});