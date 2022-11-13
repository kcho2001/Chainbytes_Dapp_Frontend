// import React, { useState, useEffect } from "react";
// import { StyleSheet, Button, Alert } from "react-native";
// import { BarCodeScanner } from "expo-barcode-scanner";
// import ethereum_address from "ethereum-address";

// import { View, Text, textColor, backgroundColor } from "../../components/Themed"

// export default function Scanner({ navigation }) {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const [text, setText] = useState("Not yet scanned");
//   const [active, setActive] = useState(true);

//   // useEffect(
//   //   () =>
//   //     navigation.addListener("state", (state) => {
//   //       let x = state.data.state.history.length;
//   //       if (x === 2) {
//   //         setActive(false);
//   //       } else if (x === 1) {
//   //         setActive(true);
//   //       } else {
//   //         console.log(
//   //           "error: state.data.state.history.length showed length greater != 1 or 2: " +
//   //             x
//   //         );
//   //       }
//   //     }),
//   //   []
//   // );
//   // setActive(true);

//   const askForCameraPermission = () => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   };

//   // Request Camera Permission
//   useEffect(() => {
//     askForCameraPermission();
//   }, []);

//   // What happens when we scan the bar code
//   const handleBarCodeScanned = ({ type, data }) => {
//     navigation.navigate("Create Foreman", {
//       data: data,
//     });
//     console.log("Type: " + type + "\nData: " + data);
//   };

//   // Check permissions and return the screens
//   if (hasPermission === null) {
//     return (
//       <View style={styles.container}>
//         <Text>Requesting for camera permission</Text>
//       </View>
//     );
//   }

//   if (hasPermission === false || active === false) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ margin: 10 }}>No access to camera</Text>
//         <Button
//           title={"Allow Camera"}
//           onPress={() => askForCameraPermission()}
//         />
//       </View>
//     );
//   }

//   // Return the View
//   if (hasPermission === true && active === true) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.barcodebox}>
//           <BarCodeScanner
//             onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//             style={{ height: 400, width: 400 }}
//           />
//         </View>
//         <Button
//           title={"Disable Camera"}
//           onPress={() => setHasPermission(false)}
//         />
//         <Text style={styles.maintext}>{text}</Text>
//         {scanned && (
//           <Button
//             title={"Scan again?"}
//             onPress={() => {
//               setScanned(false), setText("");
//             }}
//             color="tomato"
//           />
//         )}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   maintext: {
//     fontSize: 16,
//     margin: 10,
//   },
//   barcodebox: {
//     alignItems: "center",
//     justifyContent: "center",
//     height: 300,
//     width: 300,
//     overflow: "hidden",
//     borderRadius: 30,
//     backgroundColor: "tomato",
//     bottom: 25,
//   },
// });


import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Button, Alert, Pressable } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import ethereum_address from "ethereum-address";

import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import { randomBytes } from "ethers/lib/utils";
import { View, Text, textColor } from "../../components/Themed"

const shortenAddress = (address) => {
  global.myAddress = address;
  let ret = `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
  return ret;
}

export default function Scanner({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [type, setType] = useState('');
  const [timeStamp, setTimeStamp] = useState(Date.now())
  const [text, setText] = useState("Not yet scanned");
  const [text2, setText2] = useState("Not yet scanned");
  const [active, setActive] = useState(true)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const intervalRef = useRef(null)
  const tc = textColor()

  // useEffect(() => navigation.addListener('state', (state) => {
  //   let x = state.data.state.history.length
  //   if (x === 2) {
  //     setActive(false)
  //     clearInterval(intervalRef.current)
  //     intervalRef.current = null
  //   } else if (x === 1) {
  //     setActive(true)
  //   } else {
  //     console.log("error: state.data.state.history.length showed length greater != 1 or 2: " + x)
  //   }
  // }), [])

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

  // Alert when a QR code is scanned and it is not an address
  const notAddress = () => {
    Alert.alert(
      "QR CHECK IN ERROR",
      "This is not an ethereum address",
      [
        {
          text: "Dismiss",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (timeStamp < Date.now() - 200) {
        setX(0)
        setY(0)
        setHeight(0)
        setWidth(0)
        setText2('')
      }
    }, 200)
    return () => clearInterval(intervalRef.current)
  }, [timeStamp])

  // What happens when we scan the bar code (only runs once per QR code)
  const handleBarCodeScanned = ({ type, data }) => {
    setTimeStamp(() => Date.now())
    setScanned(true);
    setType(type);
    if (ethereum_address.isAddress(data)) {
      setText(data);
      //navigation.navigate("Batch Check In", { type: type, data: data, new: true });
    } else {
      setText(data);
    }
    //console.log("Type: " + type + "\nData: " + data);
  };

  const handleCheckIn = () => {
    if (ethereum_address.isAddress(text)) {
      navigation.navigate("Create Foreman", {
        data: text,
      });
    } else {
      notAddress();
    }
    setText('')
    setType('')
    setScanned(false)
  }

  const handleBarCodeBoxScanned = ({ bounds, data }) => {
    const { origin, size } = bounds
    setTimeStamp(() => Date.now())
    setX(origin.x)
    setY(origin.y)
    setHeight(size.height)
    setWidth(size.width)
    if (ethereum_address.isAddress(data)) {
      setText2(shortenAddress(data))
    } else {
      if (data.length > 12) {
        setText2(data.slice(0, 12) + '...')
      } else {
        setText2(data)
      }
    }
    //console.log("Type: " + type + "\nData: " + data);
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
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ margin: 10 }}>Camera has been disabled</Text>
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
            onBarCodeScanned={scanned ? handleBarCodeBoxScanned : handleBarCodeScanned}
            style={{ height: '100%', width: '100%' }}>
          </BarCodeScanner>
        </View>
        <Pressable
          onPress={() => setHasPermission(false)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            position: "absolute",
            top: '5%', right: '0%'
          })}
        >
          <FontAwesome
            name="camera"
            size={20}
            style={{ marginRight: 15 }}
            color={tc}
          />
        </Pressable>
        {scanned &&
          <View style={styles.buttonBox}>
            <Text style={styles.maintext}>{ethereum_address.isAddress(text) ? shortenAddress(text) : text}</Text>
            {scanned && (
              <Button
                title={"Retry Scan"}
                onPress={() => {
                  setScanned(false)
                  setText('')
                }}
                color="red"
                style={{ fontFamily: "HelveticaNeue-Bold" }}
              />
            )}
            <Button
              title={"Create Foreman"}
              onPress={() => handleCheckIn()}
              style={{ fontFamily: "HelveticaNeue-Bold" }}
            />
          </View>
        }
        {scanned && (
          <View style={{ position: 'absolute', top: y, left: x + 0.5 * width, alignItems: 'center' }}>
            <View style={{ position: 'absolute', width: width, height: height, borderColor: 'red', borderWidth: 2, backgroundColor: 'rgba(0,0,0,0)', }}></View>
            <View style={{ position: 'absolute', top: height + 4 }}>
              <Text style={{ fontFamily: "HelveticaNeue-Bold" }}> {text2} </Text>
            </View>
          </View>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    // backgroundColor: 'tomato'
  },
  maintext: {
    fontSize: 16,
    margin: 10,
    fontFamily: "HelveticaNeue-Bold"
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: '100%',
    width: '100%',
    overflow: "hidden",
    backgroundColor: 'blue'
  },
  buttonBox: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '15%',
  }
});

